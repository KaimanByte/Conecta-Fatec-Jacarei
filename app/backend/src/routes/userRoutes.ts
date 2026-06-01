import { Router } from 'express';
import { auth, rbac } from '../middleware/auth.js';
import { validate, createUserSchema, updateUserSchema, } from '../middleware/validate.js';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Gestão de usuários administrativos
 */

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Lista usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca por e-mail
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get( '/admin/users', auth, rbac(['admin']), listUsers );

/**
 * @openapi
 * /api/admin/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - secretary
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post( '/admin/users', auth, rbac(['admin']), validate(createUserSchema), createUser );

/**
 * @openapi
 * /api/admin/users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - secretary
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.put( '/admin/users/:id', auth, rbac(['admin']), validate(updateUserSchema), updateUser );

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 */
router.delete( '/admin/users/:id', auth, rbac(['admin']), deleteUser );

export default router;