import { Router } from "express";
import BaseContentController from "../controllers/content.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js"

import { createInfoSchema } from "../validators/content.validator.js";

const router = Router();
const infosController = new BaseContentController("info", createInfoSchema);

/**
 * @swagger
 * /infos:
 *   get:
 *     summary: Lista infos
 *     description: Retorna avisos e comunicados
 *     tags: [Infos]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           maximum: 20
 *           example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Lista de infos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InfoListResponse"
 */
router.get("/infos", infosController.get.bind(infosController));

/**
 * @swagger
 * /infos:
 *   post:
 *     summary: Cria uma nova info
 *     description: Rota restrita a administradores
 *     tags: [Infos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateInfoRequest"
 *     responses:
 *       201:
 *         description: Info criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InfoCreatedResponse"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Falha na criação da info
 */
router.post("/infos", authMiddleware, adminMiddleware, infosController.create.bind(infosController));

export default router;
