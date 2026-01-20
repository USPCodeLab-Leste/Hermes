import express from "express";
import UserController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users/me", authMiddleware, UserController.getInfoMe);

export default router;
