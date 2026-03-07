import pool from "../config/database.js";
import crypto from "crypto";

class TagModel {
  
  async findById(id) {
    const query = `
      SELECT *
      FROM tb_tag
      WHERE id = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async findByName(name) {
    const query = `
      SELECT *
      FROM tb_tag
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1
    `;

    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  // pra criar tag
  async create(name, type) {
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO tb_tag (id, name, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [id, name, type]);
    return result.rows[0];
  }
  
  // para buscar todas as tags ativas
  async findAll() {
    // ORDER BY name ASC para ficar organizado alfabeticamente
    const result = await pool.query("SELECT * FROM tb_tag WHERE active = true ORDER BY name ASC");
    return result.rows;
  }

  async delete(id) {
    const result = await pool.query(
      `UPDATE tb_tag 
      SET active = false 
      WHERE id = $1 
      RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

async reactivate(id) {
  const query = "UPDATE tb_tag SET active = true WHERE id = $1 RETURNING *";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // retorna a tag atualizada
  } catch (error) {
    console.log("Erro no model ao reativar tag:", error);
    throw error;
  }
}

}

export default new TagModel();
