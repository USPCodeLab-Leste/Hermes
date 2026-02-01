import express from "express";
import muralController from "../controllers/mural.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/mural", authMiddleware,  muralController.getMural);

export default router;
