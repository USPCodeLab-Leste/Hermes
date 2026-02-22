import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { registerSchema, changePasswordSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/email.service.js";

const isProduction = process.env.NODE_ENV === "production";

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

      // Email de verificação
      const emailToken = jwt.sign(
        { id: user.id },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: "1d" }
      );

      await sendVerificationEmail(email, emailToken);

      // Envia email de verificação
      return res.status(201).json({
        message: "Usuario criado. Um email de verificação foi enviado.",
        userId: user.id
      });

    } catch (err) {

      if (err.name === "ZodError") {
        return res.status(400).json({ error: err });
      }
      
      console.error(err);
      res.status(500).json({ error: "Falha ao criar usuario" });
    }

  }

  async login(req, res) {

    try {

      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      // ACCESS TOKEN (curta duração)
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role || "USER"
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      // REFRESH TOKEN (longa duração)
      const refreshToken = jwt.sign(
        {
          id: user.id,
          role: user.role || "USER"
        },
        process.env.ACCESS_TOKEN_SECRET_REFRESH,
        { expiresIn: "7d" }
      );

      // Cookies
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction
      });

      res.status(200).json({ message: "Login realizado com sucesso" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha no login" });
    }
  }

  async logout(req, res) {

    try {
      
      await res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction
      });

      await res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction
      });

      return res.status(200).json({ message: "Logout realizado com sucesso" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha no log-out" });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
    
      if (!token) {
        return res.status(400).json({error: "Token não fornecido"});
      }
    
      const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
      const user = await UserModel.verifyUserEmail(decoded.id);
    
      if (!user) {
        return res.status(400).json({ error: "Usuário não encontrado"} );
      }
    
      return res.status(200).json({ message: "Email verificado com sucesso" });
    
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({ error: "O token expirou. Solicite um novo link de verificação." });
      }
      
      console.log(err);
      return res.status(500).json({ error: "Erro interno ao verificar email." });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Dados incompletos" });
      }

      const user = await UserModel.findOne({id: userId});
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // compara senha antiga
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Senha antiga incorreta" });
      }

      // gera novo hash
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(userId, hashedPassword);

      return res.status(200).json({ message: "Senha alterada com sucesso" });

    } catch (err) {
      console.error(err);
      
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

}

export default new AuthController();
