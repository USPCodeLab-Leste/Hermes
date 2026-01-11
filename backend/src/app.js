import express from "express";
import dotenv from "dotenv";
import { query } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import { initUserTable } from "./models/User.js";


dotenv.config();
const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    const res = await query ('SELECT NOW()');
    console.log("Banco de dados conectado com sucesso");
    await initUserTable();
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (error) {
    console.error("Erro ao iniciar:", error.message);
  }
});