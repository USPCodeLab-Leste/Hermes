import "../src/config/env.js"; 

import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../src/app.js";
import pool from "../src/config/database.js";

const emailTeste = `teste_${Date.now()}@usp.br`;
const senhaTeste = "senha123";

beforeAll(async () => {
    try {
        // Tenta limpar, mas se a tabela não existir, ignora o erro
        await pool.query("DELETE FROM users WHERE email = $1", [emailTeste]);
    } catch (error) {
        // Código 42P01 significa "Tabela não existe". Ignoramos isso na primeira execução.
        if (error.code !== '42P01') {
            console.error("⚠️ Aviso na limpeza:", error.message);
        }
    }
});

afterAll(async () => {
    await pool.end();
});

describe("Autenticação (Auth Endpoints)", () => {

    it("Deve registrar um novo usuário", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                name: "Usuário de Teste",
                email: emailTeste,
                password: senhaTeste,
                cargo: "aluno"
            });

        if (res.statusCode !== 201) console.log("Erro no registro:", res.body);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("userId"); 
    });

    it("Não deve logar com senha errada", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                email: emailTeste,
                password: "senhaErrada"
            });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
});