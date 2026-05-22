import { Router, Request, Response } from 'express';
import { validate, loginSchema } from '../middleware/validate.js';
import { auth, rbac } from '../middleware/auth.js';
import { AuthService } from '../services/AuthService.js';
import { AppError } from '../errors/AppError.js';

const router = Router();
const authService = new AuthService();

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
 * /api/auth/login:
 *   post:
 *     summary: Autenticação de administrador/secretário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@fatec.edu" }
 *               password: { type: string, example: "admin123" }
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 role: { type: string, enum: [admin, secretary] }
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
});

/**
 * Valida se o token pertence a um administrador.
 * Se não tiver token: 401.
 * Se o token for inválido/expirado: 401.
 * Se o usuário não for admin: 403.
 */
router.get('/validate-admin', auth, rbac(['admin']), (_req: Request, res: Response) => {
  res.json({ valid: true });
});

/**
 * Valida se o token pertence a uma secretária ou administrador.
 * Se não tiver token: 401.
 * Se o token for inválido/expirado: 401.
 * Se o usuário não for secretary/admin: 403.
 */
router.get(
  '/validate-secretary',
  auth,
  rbac(['secretary', 'admin']),
  (_req: Request, res: Response) => {
    res.json({ valid: true });
  }
);

export default router;
