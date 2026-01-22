import express from "express";
import eventsController from "../controllers/events.controller.js";

const router = express.Router();

router.get("/events", eventsController.getEvents);
router.get("/events/:id", eventsController.getEvents);
router.post("/events"/*, middleware ADMIN*/, eventsController.postEvents);

export default router;
