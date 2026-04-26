import { Router, Request, Response } from 'express';
import { InteractionLog } from '../models/index.js';
import { auth, rbac } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: InteractionLogs
 *   description: Logs de sessão e análise de satisfação
 */

// ─── Public Routes ─────────

/**
 * @openapi
 * /api/logs:
 *   post:
 *     summary: Registra ou atualiza o fluxo de navegação de uma sessão (Nível Público)
 *     tags: [InteractionLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId: { type: string }
 *               nodeId: { type: integer }
 *     responses:
 *       200:
 *         description: Log registrado
 */
router.post('/logs', async (req: Request, res: Response) => {
  try {
    const { sessionId, nodeId } = req.body;
    if (!sessionId) {
      res.status(400).json({ error: 'sessionId obrigatório' });
      return;
    }
    let log = await InteractionLog.findOne({ where: { sessionId } });
    if (!log) {
      log = await InteractionLog.create({ sessionId, navigationFlow: nodeId ? [nodeId] : [] } as any);
    } else if (nodeId) {
      const flow: number[] = (log as any).navigationFlow || [];
      // Evita duplicar o mesmo nó se for o último visitado (refresh ou re-click)
      if (flow[flow.length - 1] !== nodeId) {
        flow.push(nodeId);
        await InteractionLog.update({ navigationFlow: flow }, { where: { sessionId } });
      }
    }
    res.json({ sessionId, id: (log as any).id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/logs/{sessionId}/satisfaction:
 *   post:
 *     summary: Registra a avaliação de satisfação de um atendimento (Nível Público)
 *     tags: [InteractionLogs]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [satisfaction]
 *             properties:
 *               satisfaction: { type: string, enum: [ATENDEU, NAO_ATENDEU] }
 *     responses:
 *       200:
 *         description: Avaliação registrada
 */
router.post('/logs/:sessionId/satisfaction', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { satisfaction } = req.body;
    if (!['ATENDEU', 'NAO_ATENDEU'].includes(satisfaction)) {
      res.status(400).json({ error: 'satisfaction deve ser ATENDEU ou NAO_ATENDEU' });
      return;
    }
    const [count] = await InteractionLog.update({ satisfaction }, { where: { sessionId } });
    if (count === 0) {
      await InteractionLog.create({ sessionId, navigationFlow: [], satisfaction } as any);
    }
    res.json({ message: 'Avaliação registrada. Obrigado!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ─── Admin Routes ─────────

/**
 * @openapi
 * /api/admin/logs:
 *   get:
 *     summary: Lista relatórios de interações (Painel Admin)
 *     tags: [InteractionLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: satisfaction
 *         schema: { type: string, enum: [ATENDEU, NAO_ATENDEU] }
 *     responses:
 *       200:
 *         description: Lista de logs
 */
router.get('/admin/logs', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
  try {
    const { satisfaction } = req.query;
    const where: any = {};
    if (satisfaction && satisfaction !== 'TODAS') {
      where.satisfaction = satisfaction;
    }
    const logs = await InteractionLog.findAll({ 
      where,
      order: [['createdAt', 'DESC']], 
      limit: 100 
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
