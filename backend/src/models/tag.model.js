import pool from "../config/database.js";
import crypto from "crypto";

class TagModel {
  
  // pra buscar tag pelo nome
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
}

export default new TagModel();