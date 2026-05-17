import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type UserRole = 'student' | 'secretary' | 'admin';

interface JWT_Payload {
  id: number;
  role: UserRole;
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

  const token = authHeader.slice(7);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: 'JWT_SECRET não configurado' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JWT_Payload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

const rbac = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};

export { auth, rbac };