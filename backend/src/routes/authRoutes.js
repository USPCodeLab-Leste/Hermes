import { Router } from "express";
import { verifyEmail } from "../controllers/authController.js";
import { sendVerificationEmail } from "../services/emailService.js";
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/verify-email', verifyEmail);


// rota teste 
router.get('/teste-envio', async (req,res) => {
    try {
        const emailFake = "bixo2026@usp.br";
        const token = jwt.sign({email: emailFake }, process.env.JWT_EMAIL_SECRET || 'segredinho secreto'); // token qualquer so pra testar o link
        await sendVerificationEmail(emailFake,token);
        res.send("<h1>E-mail enviado com sucesso!<h1> <p>Verifique a url no console pra verificar o email<p>");
    } catch (error) {
        res.status(500).send("Houve um error ao enviar: " + error.message);
    }

});

export default router;