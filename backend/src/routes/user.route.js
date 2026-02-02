import express from "express";
import UserController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

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
 */
router.get("/users/me", authMiddleware, UserController.getInfoMe);

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
 */
router.patch("/users/me", authMiddleware, UserController.patchInfoMe);

export default router;
