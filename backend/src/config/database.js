import { Pool } from "pg";
import dotenv from "dotenv"; 

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  ssl: isProduction
});

export default pool;
