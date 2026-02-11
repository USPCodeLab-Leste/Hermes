import { query } from '../config/database.js';

export async function initUserTable() {
    await query(` CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nusp VARCHAR(9) UNIQUE NOT NULL,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    await query(sql);
    console.log("Tabela User inicializada");
}

export async function verifyUserEmail(id) {
    const sql = `
    UPDATE USER
    SET is_verified TRUE
    WHERE id = $1
    RETURNING id, email, is_verified
    `;
    const result = await query (sql, [id]);
    return result.rows[0];
}