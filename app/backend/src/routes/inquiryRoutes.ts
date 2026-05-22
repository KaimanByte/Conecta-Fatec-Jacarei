import { Router, Request, Response } from 'express';
import multer from 'multer';
import { auth, rbac } from '../middleware/auth.js';
import { validate, inquirySchema, answerSchema } from '../middleware/validate.js';
import { InquiryService } from '../services/InquiryService.js';
import { AppError } from '../errors/AppError.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const inquiryService = new InquiryService();

const handleError = (err: unknown, res: Response, fallbackMessage = 'Erro interno do servidor') => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: fallbackMessage });
};

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
 */
router.post('/inquiries', upload.single('attachment'), validate(inquirySchema), async (req: Request, res: Response) => {
  try {
    const { requesterName, requesterEmail, question, sessionId } = req.body;
    const result = await inquiryService.createInquiry({
      requesterName,
      requesterEmail,
      question,
      sessionId,
      attachment: req.file,
    });

    res.status(201).json(result);
  } catch (err) {
    handleError(err, res);
  }
});

// ─── Admin Routes ─────────

/**
 * @openapi
 * /api/admin/inquiries:
 *   get:
 *     summary: Lista dúvidas recebidas (Painel Admin)
 *     tags: [Inquiries]
 */
router.get('/admin/inquiries', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const inquiries = await inquiryService.listInquiries({ status, search });

    res.json(inquiries);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * @openapi
 * /api/admin/inquiries/{id}/attachment:
 *   get:
 *     summary: Download do anexo de uma dúvida
 *     tags: [Inquiries]
 */
router.get('/admin/inquiries/:id/attachment', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
  try {
    const attachment = await inquiryService.getAttachment(Number(req.params.id));

    res.setHeader('Content-Type', attachment.mime);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.name}"`);
    res.send(attachment.data);
  } catch (err) {
    handleError(err, res, 'Erro ao baixar anexo');
  }
});

/**
 * @openapi
 * /api/admin/inquiries/{id}:
 *   put:
 *     summary: Responde uma dúvida e notifica o aluno por e-mail
 *     tags: [Inquiries]
 */
router.put('/admin/inquiries/:id', auth, rbac(['admin', 'secretary']), validate(answerSchema), async (req: Request, res: Response) => {
  try {
    const { answerText } = req.body;
    const result = await inquiryService.answerInquiry({
      inquiryId: Number(req.params.id),
      answerText,
      answeredBy: req.user?.id,
    });

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
