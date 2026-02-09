import express from "express";
import tagController from "../controllers/tag.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /tags:
 *   get:
 *     summary: Listar todas as tags ativas
 *     description: Retorna todas as tags ativas cadastradas no sistema
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TagResponse'
 *       404:
 *         description: Nenhuma tag encontrada
 *       500:
 *         description: Erro interno
 */
router.get("/tags", tagController.getTags);

/**
 * @openapi
 * /tags/{name}:
 *   get:
 *     summary: Buscar tag pelo nome
 *     description: Retorna uma tag específica pelo nome (case insensitive)
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da tag
 *     responses:
 *       200:
 *         description: Tag encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tag:
 *                   $ref: '#/components/schemas/TagResponse'
 *       404:
 *         description: Tag não encontrada
 *       500:
 *         description: Erro interno
 */
router.get("/tags/:name", tagController.getTagByName);

/**
 * @openapi
 * /tags:
 *   post:
 *     summary: Criar uma nova tag
 *     description: Cria uma nova tag (apenas administradores)
 *     tags:
 *       - Tags
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       201:
 *         description: Tag criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tag criada com sucesso
 *                 tag:
 *                   $ref: '#/components/schemas/TagResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores
 *       409:
 *         description: Tag já existe
 *       500:
 *         description: Erro interno
 */
router.post(
  "/tags",
  authMiddleware,
  adminMiddleware,
  tagController.createTag
);

export default router;
