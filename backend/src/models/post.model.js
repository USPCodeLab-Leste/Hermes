import pool from "../config/database.js";
import crypto from "crypto";

class PostModel {
  
  // pra criar um Post
  async create({ titulo, descricao, local, data_inicio, data_fim, img_banner, autor_id }) {
    try {
      const id = crypto.randomUUID();
      const status = "PUBLICADO"; // Ou 'RASCUNHO', depedendo de como definimos a regra

      const query = `
        INSERT INTO tb_post (id, titulo, descricao, local, data_inicio, data_fim, img_banner, status, autor_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [id, titulo, descricao, local, data_inicio, data_fim, img_banner, status, autor_id];
      
      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (err) {
      console.error("ERROR CREATE POST:", err);
      throw err;
    }
  }

  // pra buscar todos (Feed) - Ja trazendo os dados do Autor
  async findAll() {
    const query = `
      SELECT p.*, u.name as autor_nome 
      FROM tb_post p
      JOIN tb_user u ON p.autor_id = u.id
      ORDER BY p.data_inicio ASC;
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  // pra buscar um Post pelo ID
  async findById(id) {
    const query = `SELECT * FROM tb_post WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // pra associar uma Tag a um Post (Preencher a tabela pivô)
  async addTag(postId, tagId) {
    const query = `
      INSERT INTO tb_post_tag (post_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING; -- Evita erro se já tiver a tag
    `;
    await pool.query(query, [postId, tagId]);
  }
}

export default new PostModel();