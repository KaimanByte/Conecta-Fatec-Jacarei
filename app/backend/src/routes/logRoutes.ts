import { Router, Request, Response } from 'express';
import { auth, rbac } from '../middleware/auth.js';
import { InteractionLogService } from '../services/InteractionLogService.js';
import { AppError } from '../errors/AppError.js';

const router = Router();
const interactionLogService = new InteractionLogService();

const handleError = (err: unknown, res: Response) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
};

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
 */
router.post('/logs', async (req: Request, res: Response) => {
  try {
    const { sessionId, nodeId } = req.body;
    const result = await interactionLogService.registerNavigation(sessionId, nodeId);

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * @openapi
 * /api/logs/{sessionId}/satisfaction:
 *   post:
 *     summary: Registra a avaliação de satisfação de um atendimento (Nível Público)
 *     tags: [InteractionLogs]
 */
router.post('/logs/:sessionId/satisfaction', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { satisfaction } = req.body;
    const result = await interactionLogService.registerSatisfaction(sessionId, satisfaction);

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
});

// ─── Admin Routes ─────────

/**
 * @openapi
 * /api/admin/logs:
 *   get:
 *     summary: Lista relatórios de interações (Painel Admin)
 *     tags: [InteractionLogs]
 */
router.get('/admin/logs', auth, rbac(['admin']), async (req: Request, res: Response) => {
  try {
    const satisfaction = typeof req.query.satisfaction === 'string' ? req.query.satisfaction : undefined;
    const logs = await interactionLogService.listLogs({ satisfaction });

    res.json(logs);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
