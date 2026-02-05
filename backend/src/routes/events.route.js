import express from "express";
import eventsController from "../controllers/events.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Lista eventos
 *     description: Retorna o feed de eventos com paginação e filtro opcional por título
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Filtra eventos pelo título
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Quantidade máxima de resultados (máx 20)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Offset da paginação
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EventListResponse"
 *       404:
 *         description: Evento não encontrado
 *       400:
 *         description: Falha na busca de eventos
 * 
 */
router.get("/events", eventsController.getEvents);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     description: Cria um evento (rota restrita a administradores)
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateEventRequest"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EventCreatedResponse"
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores
 *       500:
 *         description: Falha na criação do evento
 */
router.post("/events", authMiddleware, adminMiddleware, eventsController.postEvents);

export default router;
