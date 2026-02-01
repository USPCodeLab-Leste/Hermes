import express from "express";
import eventsController from "../controllers/events.controller.js";
import { authMiddleware, adminMiddleware  } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/events", eventsController.getEvents);
router.get("/events/:id", eventsController.getEvents);
router.post("/events", authMiddleware, adminMiddleware, eventsController.postEvents);

export default router;
