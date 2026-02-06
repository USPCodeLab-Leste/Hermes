import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { registerSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";

class AuthController {

  async register(req, res) {
    try {
      // Recebendo e validando com zod
      const { email, password, name } = registerSchema.parse(req.body);

      // Conferindo se email ja esta em uso
      const existingUser = await UserModel.findOne({ email: email });
      if(existingUser) {
        return res.status(409).json({ error: "Email already in use" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criando usuario
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword
      });

      res.status(201).json({ message: "Usuario criado", userId: user.id });

    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err });
      }
      res.status(500).json({ error: "Falha ao criar usuario" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Verificando Email 
      const user = await UserModel.findOne({ email: email });
      if(!user) {
        return res.status(401).json({ error: "Email ou Password is incorrect" });
      }

      // Verificando Password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Email or Password is incorrect" });
      }

      // Criando Token
      const token = jwt.sign(
        {
          data: {
            id: user.id,
            role: user.role || "USER"
          }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,   
        sameSite: "lax"
      });

      // --- AQUI ESTÁ A MUDANÇA ---
      // Agora o token vai aparecer no JSON pra você copiar
      res.status(200).json({ 
        message: "Login realizado com sucesso",
        token: token, 
        user: {
            id: user.id,
            name: user.name,
            role: user.role
        }
      });

    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Falha no login" })
    }
  }
}

export default new AuthController();