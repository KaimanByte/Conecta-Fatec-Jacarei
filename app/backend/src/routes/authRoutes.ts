import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { validate, loginSchema } from '../middleware/validate.js';

const router = Router();

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
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const passwordHash = (user as any).password;
    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'JWT_SECRET não configurado' });
      return;
    }

    const token = jwt.sign(
      { id: (user as any).id, role: (user as any).role },
      secret,
      { expiresIn: '8h' }
    );
    res.json({ token, role: (user as any).role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
