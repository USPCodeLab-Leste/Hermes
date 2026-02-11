import express from "express";
import AuthController from "../controllers/auth.controller.js";
import JWTController from "../controllers/jwt.controller.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/refresh", JWTController.refresh);

export default router;
