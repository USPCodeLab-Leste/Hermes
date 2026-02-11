import express from "express";
import AuthController from "../controllers/auth.controller.js";
import JWTController from "../controllers/jwt.controller.js";

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro de usuário
 *     description: Cria um novo usuário com email ainda não confirmado.
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
 *       409:
 *         description: Email já está em uso
 *       500:
 *         description: Falha ao criar usuario
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     description: Autentica o usuário e cria um cookie HttpOnly com JWT.
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
 *         headers:
 *           Set-Cookie:
 *             description: Cookie HttpOnly com o token JWT
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Dados inválidos ou falha no login
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /auth/refresh:
 *   get:
 *     summary: Renovar token JWT
 *     description: >
 *       Valida o refresh token enviado via cookie HttpOnly e gera um novo access token.
 *       O novo token é retornado em cookie HttpOnly.
 *     tags:
 *       - Auth
 *     security:
 *       - refreshCookie: []
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         headers:
 *           Set-Cookie:
 *             description: Novo cookie HttpOnly com o **access token**
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRefreshResponse'
 *       401:
 *         description: Refresh token não fornecido
 *       403:
 *         description: Refresh token inválido ou expirado
 *       500:
 *         description: Erro interno ao renovar token
 */
router.get("/refresh", JWTController.refresh);

export default router;
