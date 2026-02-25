import express from "express";
import AuthController from "../controllers/auth.controller.js";
import JWTController from "../controllers/jwt.controller.js";
import { authMiddleware, emailVerifiedMiddleware } from "../middleware/auth.middleware.js"

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
router.get("/refresh", authMiddleware, emailVerifiedMiddleware, JWTController.refresh);

/**
 * @openapi
 * /auth/verify-email:
 *   get:
 *     summary: Verificar e-mail do usuário
 *     description: >
 *       Valida o token de verificação enviado via query string e marca o e-mail do usuário como verificado.
 *       O token é gerado no momento do registro e enviado por e-mail ao usuário.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificação enviado por e-mail
 *     responses:
 *       200:
 *         description: E-mail verificado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "message": "Email verificado com sucesso"
 *               }
 *       400:
 *         description: Token não fornecido, inválido ou usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/verify-email', AuthController.verifyEmail);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     description: Invalida o token JWT do utilizador autenticado.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout realizado com sucesso
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/logout', authMiddleware, AuthController.logout);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Alterar senha do utilizador autenticado
 *     description: Permite que o utilizador autenticado altere a sua senha informando a senha atual.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 12345678
 *               newPassword:
 *                 type: string
 *                 example: NovaSenhaForte123
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado ou senha antiga incorreta
 *       403:
 *         description: E-mail não verificado
 *       404:
 *         description: Utilizador não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/change-password", authMiddleware, emailVerifiedMiddleware, AuthController.changePassword);

export default router;
