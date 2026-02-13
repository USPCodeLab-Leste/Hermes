import pool from "../config/database.js";
import crypto from "crypto";
import TagModel from "./tag.model.js";

class PostModel {
  
  // pra criar um Post 
  async create({ title, body, local, data_inicio, data_fim, img_banner, autor_id, tags }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const id = crypto.randomUUID();
      const status = "published";

      const query = `
        INSERT INTO tb_post 
        (id, title, body, local, data_inicio, data_fim, img_banner, status, autor_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
      `;

      const values = [
        id,
        title,
        body,
        local,
        data_inicio,
        data_fim,
        img_banner,
        status,
        autor_id
      ];

      const result = await client.query(query, values);
      const post = result.rows[0];

      // relação post <-> tag
      if (Array.isArray(tags) && tags.length > 0) {

        for (const tagName of tags) {

          // procura tag existente
          let tag = await TagModel.findByName(tagName);

          // se não existir, cria
          if (!tag) {
            tag = await TagModel.create(tagName, "general");
          }

          // cria relação post <-> tag
          await client.query(
            `INSERT INTO tb_post_tag (post_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [post.id, tag.id]
          );
        }
      }

      await client.query("COMMIT");

      return post;

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("ERROR CREATE POST:", err);
      
      throw err;
    } finally {
      client.release();
    }
  }

  // pra buscar todos (Feed) com filtros opcionais
  async findAll({ title, tags, excludeIds, limit = 10, offset = 0 } = {}) {
    let query = `
      SELECT 
        p.*,
        u.name AS autor_nome,
        COALESCE(
          ARRAY_AGG(DISTINCT t.name) 
          FILTER (WHERE t.name IS NOT NULL),
          '{}'
        ) AS tags
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

    // filtro por nomes de tags
    if (tags) {

      // transforma em array se vier string
      const tagArray = Array.isArray(tags) ? tags : [tags];

      query += `
        AND p.id IN (
          SELECT pt.post_id
          FROM tb_post_tag pt
          JOIN tb_tag t2 ON pt.tag_id = t2.id
          WHERE LOWER(t2.name) = ANY($${index})
        )
      `;

      values.push(tagArray.map(tag => tag.toLowerCase()));
      index++;
    }

    // excluir posts já carregados
    if (excludeIds && excludeIds.length > 0) {
      query += ` AND p.id <> ALL($${index})`;
      values.push(excludeIds);
      index++;
    }

    query += `
      GROUP BY p.id, u.name
      ORDER BY p.data_inicio ASC NULLS LAST
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    values.push(limit + 1, offset);

    const result = await pool.query(query, values);
    const hasMore = result.rows.length > limit;

    if (hasMore) {
      result.rows.pop(); // remove o extra
    }

    return {
      data: result.rows,
      hasMore
    };
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