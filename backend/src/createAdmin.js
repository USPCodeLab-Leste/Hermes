import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "./config/database.js";

// pega argumentos do terminal
const args = process.argv.slice(2);

const EMAIL = args[0];
const SENHA = args[1];
const NAME  = args[2];

async function createAdmin() {
  if (!EMAIL || !SENHA || !NAME) {
    console.log("Uso: node create-admin.js <email> <senha> <name>");
    process.exit(1);
  }

  const emailFormatted = EMAIL.toLowerCase().trim();
  const hash = await bcrypt.hash(SENHA, 10);

  try {
    await pool.query(
      `INSERT INTO tb_user (id, name, email, password, role, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        crypto.randomUUID(),
        NAME,
        emailFormatted,
        hash,
        "ADMIN",
        true,
      ]
    );

    console.log("Admin criado com sucesso!");
  } catch (err) {
    console.error("Erro ao criar admin:", err.message);
  } finally {
    process.exit();
  }
}

createAdmin();