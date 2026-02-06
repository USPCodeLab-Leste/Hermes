import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configurações de caminho
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORREÇÃO: Apenas "../.env" (sai de 'src' e vai para 'backend')
const envPath = path.resolve(__dirname, "../.env");

// Carrega o .env
console.log(`📍 Procurando .env em: ${envPath}`);
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  console.error("⚠️  Não achei o arquivo .env! Verifique se o nome está correto.");
} else {
  console.log("🔓 .env carregado! Senha disponível?", process.env.DB_PASSWORD ? "SIM" : "NÃO");
}

async function setup() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: false
  };

  // 1. Conecta no banco padrão 'postgres' para criar o 'hermes'
  console.log("🔨 Verificando banco de dados 'hermes'...");
  const clientRoot = new pg.Client({ ...config, database: "postgres" });
  
  try {
    await clientRoot.connect();
    // Tenta criar o banco (se já existir, o comando falha mas a gente ignora)
    try {
      await clientRoot.query('CREATE DATABASE hermes');
      console.log("✅ Banco de dados 'hermes' criado com sucesso!");
    } catch (err) {
      if (err.code === '42P04') { // Código de erro: banco já existe
        console.log("ℹ️  Banco 'hermes' já existia. Seguindo...");
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("❌ Erro ao conectar no postgres:", err.message);
    return; // Para tudo se não conseguir conectar na raiz
  } finally {
    await clientRoot.end();
  }

  // 2. Agora conecta no banco 'hermes' para criar as tabelas
  console.log("⏳ Criando tabelas...");
  const clientHermes = new pg.Client({ ...config, database: "hermes" });

  try {
    await clientHermes.connect();
    
    // Lê o SQL
    const sqlPath = path.join(__dirname, "../database/init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    
    // Roda o SQL
    await clientHermes.query(sql);
    console.log("🚀 TUDO PRONTO! Tabelas criadas com sucesso.");
    
  } catch (err) {
    console.error("❌ Erro ao criar tabelas:", err.message);
  } finally {
    await clientHermes.end();
  }
}

setup();