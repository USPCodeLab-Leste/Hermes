import pool from "../config/database.js";
import crypto from "crypto";

class PostModel {
  
  // pra criar um Post 
  async create({ title, body, local, data_inicio, data_fim, img_banner, autor_id, tags }) {
    try {
      const id = crypto.randomUUID();
      const status = "published"; 

      // cria o Post
      const query = `
        INSERT INTO tb_post (id, title, body, local, data_inicio, data_fim, img_banner, status, autor_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [id, title, body, local, data_inicio, data_fim, img_banner, status, autor_id];
      
      const result = await pool.query(query, values);
      const post = result.rows[0];

      //  Se tiver tags, salva elas tbm
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
            // A. Insere a Tag (ou recupera se já existir)
            // estamos passando 'general' como type padrão, já que é obrigatório
            const tagRes = await pool.query(
                `INSERT INTO tb_tag (id, name, type, active) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
                 RETURNING id`,
                [crypto.randomUUID(), tagName, 'general', true]
            );
            const tagId = tagRes.rows[0].id;

            //  liga o post à tag na tabela pivo
            await pool.query(
                `INSERT INTO tb_post_tag (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [post.id, tagId]
            );
        }
      }

      return post;

    } catch (err) {
      console.error("ERROR CREATE POST:", err);
      throw err;
    }
  }

  // pra buscar todos (Feed) com filtros opcionais
  async findAll({ title, tag, limit = 10, offset = 0 } = {}) {
    let query = `
      SELECT 
        p.*,
        u.name AS autor_nome,
        COALESCE(ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
      FROM tb_post p
      JOIN tb_user u ON p.autor_id = u.id
      LEFT JOIN tb_post_tag pt ON p.id = pt.post_id
      LEFT JOIN tb_tag t ON pt.tag_id = t.id
      WHERE 1=1
    `;
    
    const values = [];
    let index = 1;

    // filtro por titulo
    if (title) {
      query += ` AND p.title ILIKE $${index}`;
      values.push(`%${title}%`);
      index++;
    }

    // filtro por tag
    if (tag) {
      query += ` AND t.name = $${index}`;
      values.push(tag);
      index++;
    }

    // ordenação + paginação
    query += `
      GROUP BY p.id, u.name
      ORDER BY p.data_inicio ASC
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // pra buscar um post pelo id
  async findById(id) {
    const query = `SELECT * FROM tb_post WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // escolhi manter esse metodo caso a gente precise usar separado, mas o create ja faz isso agora
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