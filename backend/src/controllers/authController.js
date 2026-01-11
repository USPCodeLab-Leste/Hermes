import jwt from 'jsonwebtoken';
import { verifyUserEmail } from '../models/User.js';

export const verifyEmail = async (req, res) => {
try {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({error: "Token não fornecido"});
    }

    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await verifyUserEmail(decoded.id);

    if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado"} );
    }

    return res.status(200).json({ message: "Email verificado com sucesso" });

} catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Token inválido ou expirado"});
}

};