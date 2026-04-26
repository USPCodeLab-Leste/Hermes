import bcrypt from "bcryptjs";
import { z } from "zod";

import superAdmin from "../models/superAdmin.model.js";
import userModel from "../models/user.model.js";

class SuperAdminController {
  async getUsersOverview(req, res) {
    try {
      const data = await superAdmin.getUsersOverview();

      return res.status(200).json({
        usuarios: {
          data: data.usuarios,
          total: Number(data.total_usuarios)
        },
        unverified: {
          emails: data.unverified_emails,
          total: Number(data.total_unverified)
        },
        admins: {
          emails: data.admin_emails,
          total: Number(data.total_admins)
        }
      });

    } catch (err) {
      console.error("ERROR GET USERS OVERVIEW:", err);
      return res.status(500).json({
        error: "Falha ao buscar overview de usuários"
      });
    }
  }

  async createAdmin(req, res) {
    const criaSchema = z.object({
      name: z.string().min(3, "Nome precisa de ao menos 3 caracteres"),
      email: z.email("Email inválido"),
      password: z.string().min(8, "Password precisa de ao menos 8 caracteres")
    }).strict();
    
    try {
      const { email, password, name } = criaSchema.parse(req.body);
      
      const emailFormatted = email.toLowerCase().trim();

      const existingUser = await userModel.findOne({ email: emailFormatted });
      if (existingUser) {
        return res.status(409).json({
          error: "Usuário já existe"
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await superAdmin.createAdmin({
        name,
        email: emailFormatted,
        password: hash
      });

      return res.status(201).json({
        message: "Admin criado com sucesso",
        user
      });

    } catch (err) {
      console.error("ERROR CREATE ADMIN:", err);

      if (err.name === "ZodError") {
        return res.status(400).json({ error: err });
      }

      return res.status(500).json({
        error: "Falha ao criar admin"
      });
    }
  }

}

export default new SuperAdminController();