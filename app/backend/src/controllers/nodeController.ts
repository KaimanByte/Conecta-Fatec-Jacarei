import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Node } from '../models/index.js';

const isInvalidId = (value: string | undefined): boolean => {
  return value !== undefined && isNaN(Number(value));
};

export const listChatNodes = async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const id = paramId ? Number(paramId) : null;
    const nodes = await Node.findAll({
      where: id ? { parentId: id } : { parentId: null },
      attributes: ['id', 'title', 'content'],
    });

    res.json(nodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getChatNode = async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const node = await Node.findOne({
      where: { id: Number(paramId) },
      include: [{ model: Node, as: 'children' }],
    });

    if (!node) {
      res.status(404).json({ error: 'Nó não encontrado' });
      return;
    }

    res.json(node);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listAdminNodes = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const where: any = {};

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    const nodes = await Node.findAll({
      where,
      attributes: ['id', 'title', 'content', 'parentId'],
      order: [['id', 'ASC']],
    });

    res.json(nodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createNode = async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const node = await Node.create({ title, content, parentId: parentId || null } as any);

    res.status(201).json(node);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateNode = async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const [count] = await Node.update(
      { title, content, parentId: parentId ?? null },
      { where: { id: Number(req.params.id) } }
    );

    if (count === 0) {
      res.status(404).json({ error: 'Nó não encontrado' });
      return;
    }

    res.json({ message: 'Nó atualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteNode = async (req: Request, res: Response) => {
  try {
    const count = await Node.destroy({ where: { id: Number(req.params.id) } });

    if (count === 0) {
      res.status(404).json({ error: 'Nó não encontrado' });
      return;
    }

    res.json({ message: 'Nó excluído' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
