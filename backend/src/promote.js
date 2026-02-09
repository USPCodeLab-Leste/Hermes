import pool from "./config/database.js";

async function promoteToAdmin() {
  // ⚠️ COLOQUE AQUI O EMAIL QUE VOCÊ USOU NESSE USUÁRIO "teste Admin"
  const emailAlvo = "teste@usp.br"; 

  try {
    console.log(`👑 Promovendo ${emailAlvo} a ADMIN (Maiúsculo)...`);
    
    // MUDANÇA: role = 'ADMIN' (Maiúsculo)
    const result = await pool.query(
      "UPDATE tb_user SET role = 'ADMIN' WHERE email = $1 RETURNING *",
      [emailAlvo]
    );

    if (result.rowCount === 0) {
      console.log("❌ Usuário não encontrado! Verifique se o email no código está igual ao do Swagger.");
    } else {
      console.log("✅ SUCESSO! Banco atualizado:", result.rows[0]);
    }

  } catch (err) {
    console.error("❌ Erro:", err.message);
  } finally {
    await pool.end();
  }
}

promoteToAdmin();