import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Inquiry, InteractionLog } from '../models/index.js';
import { auth, rbac } from '../middleware/auth.js';
import { Op } from 'sequelize';
import { sendAnswerEmail } from '../utils/mailer.js';
import { validate, inquirySchema, answerSchema } from '../middleware/validate.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * @openapi
 * tags:
 *   name: Inquiries
 *   description: Gestão de dúvidas enviadas pelos estudantes
 */

// ─── Public Routes ─────────

/**
 * @openapi
 * /api/inquiries:
 *   post:
 *     summary: Envia uma nova dúvida à secretaria (Nível Público)
 *     tags: [Inquiries]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [requesterName, requesterEmail, question]
 *             properties:
 *               requesterName: { type: string }
 *               requesterEmail: { type: string }
 *               question: { type: string }
 *               sessionId: { type: string }
 *               attachment: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Dúvida enviada com sucesso
 */
router.post('/inquiries', upload.single('attachment'), validate(inquirySchema), async (req: Request, res: Response) => {
  try {
    const { requesterName, requesterEmail, question, sessionId } = req.body;
    
    const inquiry = await Inquiry.create({
      requesterName,
      requesterEmail,
      question,
      attachmentName: (req as any).file?.originalname,
      attachmentMime: (req as any).file?.mimetype,
      attachmentData: (req as any).file?.buffer,
    } as any);

    // Registra no log de interação se houver sessão
    if (sessionId) {
      await InteractionLog.update(
        { inquiryId: (inquiry as any).id },
        { where: { sessionId } }
      );
    }

    res.status(201).json({ id: (inquiry as any).id, message: 'Dúvida enviada! Aguarde o retorno da secretaria.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ─── Admin Routes ─────────

/**
 * @openapi
 * /api/admin/inquiries:
 *   get:
 *     summary: Lista dúvidas recebidas (Painel Admin)
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ABERTA, RESPONDIDA] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por nome, email ou pergunta
 *     responses:
 *       200:
 *         description: Lista de dúvidas
 */
router.get('/admin/inquiries', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};
    if (status && status !== 'TODAS') where.status = status;
    if (search) {
      where[Op.or] = [
        { requesterName: { [Op.iLike]: `%${search}%` } },
        { requesterEmail: { [Op.iLike]: `%${search}%` } },
        { question: { [Op.iLike]: `%${search}%` } }
      ];
    }
    const inquiries = await Inquiry.findAll({
      where,
      attributes: { exclude: ['attachmentData'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/admin/inquiries/{id}/attachment:
 *   get:
 *     summary: Download do anexo de uma dúvida
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Arquivo para download
 *         content:
 *           application/octet-stream: { schema: { type: string, format: binary } }
 */
router.get('/admin/inquiries/:id/attachment', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry || !inquiry.attachmentData) {
      res.status(404).json({ error: 'Anexo não encontrado' });
      return;
    }
    res.setHeader('Content-Type', inquiry.attachmentMime || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${inquiry.attachmentName}"`);
    res.send(inquiry.attachmentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao baixar anexo' });
  }
});

/**
 * @openapi
 * /api/admin/inquiries/{id}:
 *   put:
 *     summary: Responde uma dúvida e notifica o aluno por e-mail
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answerText]
 *             properties:
 *               answerText: { type: string }
 *     responses:
 *       200:
 *         description: Resposta enviada
 */
router.put('/admin/inquiries/:id', auth, rbac(['admin', 'secretary']), validate(answerSchema), async (req: Request, res: Response) => {
  try {
    const { answerText } = req.body;
    
    // Atualizar no banco
    const [count] = await Inquiry.update(
      { answerText, status: 'RESPONDIDA', answeredBy: (req as any).user?.id },
      { where: { id: Number(req.params.id) } }
    );
    
    if (count === 0) {
      res.status(404).json({ error: 'Dúvida não encontrada' });
      return;
    }

    // Buscar dados atualizados para enviar e-mail
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (inquiry) {
      sendAnswerEmail(
        inquiry.requesterEmail,
        inquiry.requesterName,
        inquiry.question,
        answerText
      ).catch(err => {
        console.error('Falha não-crítica ao enviar email.', err);
      });
    }
    
    res.json({ message: 'Dúvida respondida e e-mail enviado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
