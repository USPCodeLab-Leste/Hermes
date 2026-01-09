import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: new URL('./.env', import.meta.url) });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false
});

export default pool;