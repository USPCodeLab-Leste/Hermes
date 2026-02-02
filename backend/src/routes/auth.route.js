import express from "express";
import AuthController from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registro de usuário
 *     description: Cria um novo usuário com email ainda não confirmado
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         description: Dados inválidos
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login do usuário
 *     description: Autentica o usuário e cria um cookie HttpOnly com JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DefaultMessageResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", AuthController.login);

export default router;
