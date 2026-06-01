import { Op, WhereOptions } from 'sequelize';
import { AppError } from '../errors/AppError.js';
import { User } from '../models/index.js';

type UserPayload = {
  email?: string;
  password?: string;
  role?: 'admin' | 'secretary';
  name?: string;
};

export class UserService {
  async listAdminUsers(search?: string) {
    const where: WhereOptions = {};

    if (search) {
      Object.assign(where, { email: { [Op.iLike]: `%${search}%` } });
    }

    return User.findAll({
      where,
      attributes: ['id', 'email', 'role'],
      order: [['role', 'ASC']],
    });
  }

  async createUser(payload: UserPayload) {
    const existingUser = await User.findOne({ where: { email: payload.email } });
    if(existingUser){
        throw new AppError( 'Email atualmente já cadastrado', 400 )
    }
    if(!payload.email || !payload.password || !payload.role){
        throw new AppError('Email, senha e cargo são obrigatórios', 400);
    }
    return User.create({
        email: payload.email,
        password: payload.password,
        role: payload.role,
        // name: payload.name ?? null,
    });
  }

  async updateUser(id: number, payload: UserPayload) {
    if (
      payload.email === undefined &&
      payload.password === undefined &&
      payload.role === undefined
    ) {
      throw new AppError(
        'Nenhum campo informado para atualização',
        400
      );
    }

    if (payload.email) {
      const existingUser = await User.findOne({
        where: { email: payload.email }
      });

      if (existingUser && existingUser.id !== id) {
        throw new AppError(
          'Email atualmente já cadastrado',
          400
        );
      }
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError(
        'Usuario não encontrado',
        404
      );
    }

    await user.update({
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });

    return {
      message: 'Usuario atualizado'
    };
  }

  async deleteUser(id: number, loggedUserId: number) {
    if (id === loggedUserId) {
        throw new AppError(
        'Você não pode excluir sua própria conta',
        400
        );
    }

    const user = await User.findByPk(id);

    if (!user) {
        throw new AppError('Usuario não encontrado', 404);
    }

    if (user.role === 'admin') {
        const adminCount = await User.count({
        where: { role: 'admin' }
        });

        if (adminCount === 1) {
        throw new AppError(
            'Não é possível excluir o último administrador',
            400
        );
        }
    }

    await User.destroy({
        where: { id }
    });

    return { message: 'Usuario excluído' };
    }
}
