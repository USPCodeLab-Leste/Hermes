import { Router } from "express";
import { verifyEmail } from "../controllers/authController.js";

const router = Router();

router.get('/verify-email', verifyEmail);

export default router;