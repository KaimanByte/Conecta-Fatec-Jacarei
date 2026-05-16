import { Router } from 'express';
import { auth, rbac } from '../middleware/auth.js';
import { validate, nodeSchema } from '../middleware/validate.js';
import {
  createNode,
  deleteNode,
  getChatNode,
  listAdminNodes,
  listChatNodes,
  updateNode,
} from '../controllers/nodeController.js';

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
router.get('/chat/nodes/:id?', listChatNodes);

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
router.get('/chat/node/:id', getChatNode);

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
router.get('/admin/nodes', auth, rbac(['admin', 'secretary']), listAdminNodes);

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
router.post('/admin/nodes', auth, rbac(['admin', 'secretary']), validate(nodeSchema), createNode);

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
router.put('/admin/nodes/:id', auth, rbac(['admin', 'secretary']), validate(nodeSchema), updateNode);

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
router.delete('/admin/nodes/:id', auth, rbac(['admin', 'secretary']), deleteNode);

export default router;
