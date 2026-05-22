import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { AppError } from '../errors/AppError.js';

type AuthenticatedUser = {
  id: number;
  role: 'student' | 'secretary' | 'admin';
};

type LoginResult = {
  token: string;
  role: AuthenticatedUser['role'];
};

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('Credenciais inválidas', 401);
    }

    return {
      token: this.generateToken({ id: user.id, role: user.role }),
      role: user.role,
    };
  }

  private generateToken(user: AuthenticatedUser): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError('JWT_SECRET não configurado', 500);
    }

    return jwt.sign(user, secret, { expiresIn: '8h' });
  }
}
