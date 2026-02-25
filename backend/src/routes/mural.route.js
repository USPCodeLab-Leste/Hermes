import express from "express";
import muralController from "../controllers/mural.controller.js";
import { authMiddleware, emailVerifiedMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /mural:
 *   get:
 *     summary: Retorna o mural personalizado do usuário
 *     description:
 *       Retorna eventos filtrados pelas tags do usuário autenticado,
 *       com suporte a paginação via limit e offset.
 *     tags:
 *       - Mural
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Quantidade de eventos retornados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Offset da paginação
 *     responses:
 *       200:
 *         description: Mural retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MuralResponse'
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: E-mail não verificado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/mural", authMiddleware, emailVerifiedMiddleware,  muralController.getMural);

export default router;
