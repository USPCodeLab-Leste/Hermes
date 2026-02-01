import pool from "../config/database.js";
import crypto from "crypto";

class TagModel {
  
  // pra buscar Tag pelo Nome (para não duplicar "Tech" e "tech")
  async findByTitle(titulo) {
    const query = `SELECT * FROM tb_tag WHERE LOWER(titulo) = LOWER($1)`;
    const result = await pool.query(query, [titulo]);
    return result.rows[0];
  }

  // pra criar Tag
  async create(titulo) {
    const id = crypto.randomUUID();
    const query = `
      INSERT INTO tb_tag (id, titulo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [id, titulo]);
    return result.rows[0];
  }
  
  // buscar todas as tags (para listar no filtro depois)
  async findAll() {
    const result = await pool.query("SELECT * FROM tb_tag WHERE active = true");
    return result.rows;
  }
}

export default new TagModel();