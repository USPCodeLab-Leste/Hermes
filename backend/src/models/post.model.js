import pool from "../config/database.js";
import crypto from "crypto";

class PostModel {
  
  // pra criar um Post
  async create({ title, body, local, data_inicio, data_fim, img_banner, autor_id }) {
    try {
      const id = crypto.randomUUID();
      const status = "published"; 

      const query = `
        INSERT INTO tb_post (id, title, body, local, data_inicio, data_fim, img_banner, status, autor_id)
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

  // pra buscar todos (Feed) com filtros opcionais, que caso sejam undefined ou vazio, tudo é retornado
  async findAll({ title, tag } = {}) {
    let query = `
      SELECT DISTINCT p.*, u.name as autor_nome 
      FROM tb_post p
      JOIN tb_user u ON p.autor_id = u.id
      LEFT JOIN tb_post_tag pt ON p.id = pt.post_id
      LEFT JOIN tb_tag t ON pt.tag_id = t.id
      WHERE 1=1
    `;
    
    const values = [];
    let index = 1;

    // filtro por titulo (busca parcial e case insensitive)
    if (title) {
      query += ` AND p.title ILIKE $${index}`;
      values.push(`%${title}%`);
      index++;
    }

    // filtro por tag especifica (exemplo: trazer so "Workshop")
    if (tag) {
      query += ` AND t.title = $${index}`;
      values.push(tag);
      index++;
    }

    query += ` ORDER BY p.data_inicio ASC`;
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  // pra buscar um post pelo id
  async findById(id) {
    const query = `SELECT * FROM tb_post WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // pra associar uma tag a um post
  async addTag(postId, tagId) {
    const query = `
      INSERT INTO tb_post_tag (post_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `;
    await pool.query(query, [postId, tagId]);
  }
}

export default new PostModel();