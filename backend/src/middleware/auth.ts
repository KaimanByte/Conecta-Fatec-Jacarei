import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWT_Payload {
  id: number;
  role: 'student' | 'secretary' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JWT_Payload;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.slice(7); // Remove 'Bearer '

  const secret = process.env.JWT_SECRET || 'secret';
  // Note: Local tests might not have JWT_SECRET in env, so we fallback for safety
  
  try {
    const decoded = jwt.verify(token, secret) as JWT_Payload;
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

const rbac = (roles: ('student' | 'secretary' | 'admin')[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

export { auth, rbac };
