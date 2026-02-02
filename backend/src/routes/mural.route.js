import express from "express";
import muralController from "../controllers/mural.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /mural:
 *   get:
 *     summary: Retorna o mural de eventos do usuário
 *     description: |
 *       Retorna uma lista de eventos filtrados de acordo com as tags do usuário autenticado.
 *     tags:
 *       - Mural
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos do mural
 *         content:
 *           application/json:
 *             schema:
 */
router.get("/mural", authMiddleware,  muralController.getMural);

export default router;
