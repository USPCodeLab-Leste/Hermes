import { Router } from "express";
import BaseContentController from "../controllers/content.controller.js";
import { authMiddleware, emailVerifiedMiddleware, adminMiddleware } from "../middleware/auth.middleware.js"

import { createEventSchema, updateEventSchema } from "../validators/content.validator.js";

const router = Router();
const eventsController = new BaseContentController(
  "event",
  {
    create: createEventSchema,
    update: updateEventSchema
  }
);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista eventos
 *     description: Retorna eventos com paginação e filtro opcional por título e/ou tags
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtra eventos pelo título
 *
 *       - in: query
 *         name: tag
 *         schema:
 *           type: array
 *         description: >
 *           Filtra eventos por uma ou mais tags.
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *           maximum: 20
 *         description: Quantidade máxima de resultados (máx 20)
 *
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
 *         description: Eventos não encontrados
 *       400:
 *         description: Falha na busca de eventos
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: E-mail não verificado
 */
router.get("/events", authMiddleware, emailVerifiedMiddleware, eventsController.get.bind(eventsController));

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     summary: Buscar evento por ID
 *     description: Retorna um evento específico pelo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Evento encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: E-mail não verificado
 *       404:
 *         description: Evento não encontrado
 */
router.get("/events/:id", authMiddleware, emailVerifiedMiddleware, eventsController.getById.bind(eventsController));

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
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EventCreatedResponse"
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 *       500:
 *         description: Falha na criação do evento
 */
router.post("/events", authMiddleware, emailVerifiedMiddleware, adminMiddleware, eventsController.create.bind(eventsController));

/**
 * @openapi
 * /events/{id}:
 *   patch:
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     summary: Atualizar evento
 *     description: Atualiza parcialmente um evento existente (apenas autor ou admin)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateEventRequest"
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       400:
 *         description: Erro na atualização
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 */
router.patch(
  "/events/:id",
  authMiddleware,
  emailVerifiedMiddleware,
  adminMiddleware,
  eventsController.patch.bind(eventsController)
);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     security:
 *       - cookieAuth: []
 *     summary: Deletar evento
 *     description: Remove um evento existente (apenas autor ou admin)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento deletado com sucesso
 *       400:
 *         description: Erro ao deletar evento
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso restrito a administradores e/ou E-mail não verificado
 */
router.delete(
  "/events/:id",
  authMiddleware,
  emailVerifiedMiddleware,
  adminMiddleware,
  eventsController.delete.bind(eventsController)
);

export default router;
