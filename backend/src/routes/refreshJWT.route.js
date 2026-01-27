import express from "express";
import JWTController from "../controllers/jwt.controller.js";

const router = express.Router();

router.get("/refresh", JWTController.refresh);

export default router;
