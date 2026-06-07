import { Op, WhereOptions } from 'sequelize';
import { Node } from '../models/index.js';
import { AppError } from '../errors/AppError.js';

type NodePayload = {
  title: string;
  content?: string | null;
  parentId?: number | null;
};

export class NodeService {
  async listChatNodes(parentId?: number) {
    return Node.findAll({
      where: parentId ? { parentId } : { parentId: null },
      attributes: ['id', 'title', 'content'],
    });
  }

  async getChatNode(id: number) {
    const node = await Node.findOne({
      where: { id },
      include: [{ model: Node, as: 'children' }],
    });

    if (!node) {
      throw new AppError('Nó não encontrado', 404);
    }

    return node;
  }

  async listAdminNodes(search?: string) {
    const where: WhereOptions = {};

    if (search) {
      Object.assign(where, { title: { [Op.iLike]: `%${search}%` } });
    }

    return Node.findAll({
      where,
      attributes: ['id', 'title', 'content', 'parentId'],
      order: [['id', 'ASC']],
    });
  }

  async createNode(payload: NodePayload) {
    return Node.create({
      title: payload.title,
      content: payload.content ?? '',
      parentId: payload.parentId ?? null,
    });
  }

  async updateNode(id: number, payload: NodePayload) {
    const [count] = await Node.update(
      {
        title: payload.title,
        content: payload.content ?? '',
        parentId: payload.parentId ?? null,
      },
      { where: { id } }
    );

    if (count === 0) {
      throw new AppError('Nó não encontrado', 404);
    }

    return { message: 'Nó atualizado' };
  }

  async deleteNode(id: number): Promise<{ message: string }> {
    const children = await Node.findAll({ where: { parentId: id } });
    if (children.length > 0) {
      for (const child of children) {
        await this.deleteNode(child.id);
      }
    }
    const count = await Node.destroy({ where: { id } });
    if (count === 0) {
      throw new AppError('Nó não encontrado', 404);
    }
    return { message: 'Nó e seus sub-nós excluídos com sucesso' };
  }
}
