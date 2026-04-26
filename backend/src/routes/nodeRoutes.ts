import { Router, Request, Response } from 'express';
import { Node } from '../models/index.js';
import { auth, rbac } from '../middleware/auth.js';
import { Op } from 'sequelize';
import { validate, nodeSchema } from '../middleware/validate.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: ChatNodes
 *   description: Gestão de opções e respostas da árvore do chatbot
 */

// ─── Public Chat Routes ──────────────────────────────────────────────────────

/**
 * @openapi
 * /api/chat/nodes/{id}:
 *   get:
 *     summary: Lista filhos de um nó específico ou raiz (nível público)
 *     tags: [ChatNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         description: ID do nó pai (vazio para raiz)
 *     responses:
 *       200:
 *         description: Lista de nós filhos
 */
router.get('/chat/nodes/:id?', async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;
    if (paramId && isNaN(Number(paramId))) {
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
});

/**
 * @openapi
 * /api/chat/node/{id}:
 *   get:
 *     summary: Retorna um nó individual com todos os seus filhos
 *     tags: [ChatNodes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Nó detalhado
 */
router.get('/chat/node/:id', async (req: Request, res: Response) => {
  try {
    const paramId = req.params.id;
    if (isNaN(Number(paramId))) {
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
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

/**
 * @openapi
 * /api/admin/nodes:
 *   get:
 *     summary: Lista todos os nós (Painel Admin)
 *     tags: [ChatNodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por título
 *     responses:
 *       200:
 *         description: Lista total de nós
 */
router.get('/admin/nodes', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
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
});

/**
 * @openapi
 * /api/admin/nodes:
 *   post:
 *     summary: Cria um novo nó (Painel Admin)
 *     tags: [ChatNodes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               parentId: { type: integer, nullable: true }
 *     responses:
 *       201:
 *         description: Nó criado com sucesso
 */
router.post('/admin/nodes', auth, rbac(['admin', 'secretary']), validate(nodeSchema), async (req: Request, res: Response) => {
  try {
    const { title, content, parentId } = req.body;
    const node = await Node.create({ title, content, parentId: parentId || null } as any);
    res.status(201).json(node);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/admin/nodes/{id}:
 *   put:
 *     summary: Atualiza um nó existente (Painel Admin)
 *     tags: [ChatNodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               parentId: { type: integer, nullable: true }
 *     responses:
 *       200:
 *         description: Nó atualizado
 */
router.put('/admin/nodes/:id', auth, rbac(['admin', 'secretary']), validate(nodeSchema), async (req: Request, res: Response) => {
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
});

/**
 * @openapi
 * /api/admin/nodes/{id}:
 *   delete:
 *     summary: Exclui um nó (Painel Admin)
 *     tags: [ChatNodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Nó excluído
 */
router.delete('/admin/nodes/:id', auth, rbac(['admin', 'secretary']), async (req: Request, res: Response) => {
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
});

export default router;
