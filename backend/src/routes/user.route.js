import express from "express";
import UserController from "../controllers/user.controller.js";
import { authMiddleware, emailVerifiedMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     description: Retorna as informações do usuário baseado no JWT armazenado em cookie HttpOnly
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Usuário não autenticado
 *       400:
 *         description: Erro ao pegar informações do usuario
 *       403:
 *         description: E-mail não verificado
 */
router.get("/users/me", authMiddleware, emailVerifiedMiddleware, UserController.getInfoMe);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Atualiza os dados do usuário autenticado
 *     description: Atualiza parcialmente os dados do usuário autenticado (atualmente apenas o nome)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       401:
 *         description: Usuário não autenticado
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: E-mail não verificado
 *       500:
 *         description: Erro ao atualizar informações do usuario
 */
router.patch("/users/me", authMiddleware, emailVerifiedMiddleware, UserController.patchInfoMe);

/**
 * @openapi
 * /users/me/tags:
 *   post:
 *     summary: Seguir uma tag
 *     description: Permite que o usuário autenticado siga uma tag específica.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowTagRequest'
 *     responses:
 *       200:
 *         description: Tag seguida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FollowTagResponse'
 *       401:
 *         description: Usuário não autenticado
 *       400:
 *         description: tagId é obrigatório
 *       403:
 *         description: E-mail não verificado
 *       500:
 *         description: Erro ao seguir tag
 */
router.post("/users/me/tags", authMiddleware, emailVerifiedMiddleware, UserController.followTag);

/**
 * @openapi
 * /users/me/tags/{tagId}:
 *   delete:
 *     summary: Deixar de seguir uma tag
 *     description: Remove uma tag da lista de favoritas do usuário autenticado.
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tag a ser removida
 *     responses:
 *       200:
 *         description: Tag removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnfollowTagResponse'
 *       401:
 *         description: Usuário não autenticado
 *       400:
 *         description: tagId é obrigatório
 *       403:
 *         description: E-mail não verificado
 *       500:
 *         description: Erro ao remover tag
 */
router.delete("/users/me/tags/:tagId", authMiddleware, emailVerifiedMiddleware, UserController.unfollowTag);

export default router;
