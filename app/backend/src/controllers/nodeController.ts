import { Request, Response } from 'express';
import { NodeService } from '../services/NodeService.js';
import { isInvalidId, handleError } from '../utils/controllerHelpers.js';

const nodeService = new NodeService();

export const listChatNodes = async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const id = paramId ? Number(paramId) : undefined;
    const nodes = await nodeService.listChatNodes(id);

    res.json(nodes);
  } catch (err) {
    handleError(err, res);
  }
};

export const getChatNode = async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;

    if (isInvalidId(paramId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const node = await nodeService.getChatNode(Number(paramId));
    res.json(node);
  } catch (err) {
    handleError(err, res);
  }
};

export const listAdminNodes = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const nodes = await nodeService.listAdminNodes(search);

    res.json(nodes);
  } catch (err) {
    handleError(err, res);
  }
};

export const createNode = async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const node = await nodeService.createNode({ title, content, parentId });

    res.status(201).json(node);
  } catch (err) {
    handleError(err, res);
  }
};

export const updateNode = async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const result = await nodeService.updateNode(Number(req.params.id), { title, content, parentId });

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export const deleteNode = async (req: Request, res: Response) => {
  try {
    const result = await nodeService.deleteNode(Number(req.params.id));

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
};
