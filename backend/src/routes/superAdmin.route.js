import express from "express";
import SuperAdminController from "../controllers/superAdmin.controller.js";
import { authMiddleware, superAdminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const enable = process.env.ENABLE_SUPERADMIN_ROUTES;

/**
 * @openapi
 * /super/getUsersOverview:
 *   get:
 *     tags:
 *       - SuperAdmin
 *     summary: Obter overview de usuários
 *     description: Retorna usuários verificados, usuários não verificados e administradores com suas quantidades
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Overview retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           is_verified:
 *                             type: boolean
 *                     total:
 *                       type: integer
 *                 unverified:
 *                   type: object
 *                   properties:
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: string
 *                     total:
 *                       type: integer
 *                 admins:
 *                   type: object
 *                   properties:
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: string
 *                     total:
 *                       type: integer
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a super administradores
 *       500:
 *         description: Erro interno
 *       503:
 *         description: Endpoint desabilitado 
 */

router.get("/getUsersOverview",
  authMiddleware,
  superAdminMiddleware, 
  SuperAdminController.getUsersOverview
);

/**
 * @openapi
 * /super/createAdmin:
 *   post:
 *     tags:
 *       - SuperAdmin
 *     summary: Criar novo administrador
 *     description: Permite que um super administrador crie um novo usuário com role ADMIN
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@email.com
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               name:
 *                 type: string
 *                 example: "Admin User"
 *     responses:
 *       201:
 *         description: Admin criado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: Admin criado com sucesso
 *               user:
 *                 id: "uuid"
 *                 name: "Admin User"
 *                 email: "admin@email.com"
 *                 role: "ADMIN"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a super administradores
 *       409:
 *         description: Usuário já existe
 *       500:
 *         description: Erro interno
 *       503:
 *         description: Endpoint desabilitado 
 */
router.post("/createAdmin",
  authMiddleware,
  superAdminMiddleware, 
  SuperAdminController.createAdmin
);

export default router;