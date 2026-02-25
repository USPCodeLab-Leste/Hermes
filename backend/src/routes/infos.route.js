import { Router } from "express";
import BaseContentController from "../controllers/content.controller.js";
import { authMiddleware, emailVerifiedMiddleware, adminMiddleware } from "../middleware/auth.middleware.js"

import { createInfoSchema, updateInfoSchema } from "../validators/content.validator.js";

const router = Router();
const infosController = new BaseContentController(
  "info",
  {
    create: createInfoSchema,
    update: updateInfoSchema
  }
);

/**
 * @swagger
 * /infos:
 *   get:
 *     summary: Lista infos
 *     description: Retorna avisos e comunicados
 *     tags: [Infos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 * 
 *       - in: query
 *         name: tag
 *         schema:
 *           type: array
 *         description: >
 *           Filtra infos por uma ou mais tags.
 * 
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
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: E-mail não verificado
 */
router.get("/infos", authMiddleware, emailVerifiedMiddleware, infosController.get.bind(infosController));

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
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 *       500:
 *         description: Falha na criação da info
 */
router.post("/infos", authMiddleware, emailVerifiedMiddleware, adminMiddleware, infosController.create.bind(infosController));

/**
 * @swagger
 * /infos/{id}:
 *   get:
 *     summary: Buscar info por ID
 *     description: Retorna uma info específica pelo ID
 *     tags: [Infos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da info
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Info encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Info"
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: E-mail não verificado
 *       404:
 *         description: Info não encontrada
 */
router.get(
  "/infos/:id", authMiddleware, emailVerifiedMiddleware, infosController.getById.bind(infosController)
);

/**
 * @swagger
 * /infos/{id}:
 *   patch:
 *     summary: Atualizar info
 *     description: Atualiza parcialmente uma info existente (apenas admin)
 *     tags: [Infos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da info
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateInfoRequest"
 *     responses:
 *       200:
 *         description: Info atualizada com sucesso
 *       400:
 *         description: Erro na atualização
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 */
router.patch(
  "/infos/:id",
  authMiddleware,
  emailVerifiedMiddleware,
  adminMiddleware,
  infosController.patch.bind(infosController)
);

/**
 * @swagger
 * /infos/{id}:
 *   delete:
 *     summary: Deletar info
 *     description: Remove uma info existente (apenas admin)
 *     tags: [Infos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da info
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Info deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: info deletado com sucesso
 *       400:
 *         description: Erro ao deletar info
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 */
router.delete(
  "/infos/:id",
  authMiddleware,
  emailVerifiedMiddleware,
  adminMiddleware,
  infosController.delete.bind(infosController)
);

export default router;
