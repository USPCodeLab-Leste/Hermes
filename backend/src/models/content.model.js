import pool from "../config/database.js";
import crypto from "crypto";
import TagModel from "./tag.model.js";

class ContentModel {
  
  async create({
    title,
    body,
    local = null,
    data_inicio = null,
    data_fim = null,
    img_banner = null,
    autor_id,
    tags = [],
    type = "post"
  }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const id = crypto.randomUUID();
      const status = "published";

      const query = `
        INSERT INTO tb_content  
        (id, title, body, local, data_inicio, data_fim, img_banner, status, autor_id, type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
        autor_id,
        type
      ];

      const result = await client.query(query, values);
      const content = result.rows[0];

      // relação content <-> tag
      if (Array.isArray(tags) && tags.length > 0) {

        for (const tagName of tags) {

          // procura tag existente
          let tag = await TagModel.findByName(tagName);

          // se não existir, cria
          if (!tag) {
            tag = await TagModel.create(tagName, "general");
          }

          // cria relação content <-> tag
          await client.query(
            `INSERT INTO tb_content_tag (content_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [content.id, tag.id]
          );
        }
      }

      await client.query("COMMIT");

      return content;

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("ERROR CREATE CONTENT:", err);
      
      throw err;
    } finally {
      client.release();
    }
  }

  // pra buscar todos (Feed) com filtros opcionais
  async findAll({ title, tags, type, excludeIds, limit = 10, offset = 0 } = {}) {
    let query = `
      SELECT 
        p.*,
        u.name AS autor_nome,
        COALESCE(
          ARRAY_AGG(DISTINCT t.name) 
          FILTER (WHERE t.name IS NOT NULL),
          '{}'
        ) AS tags
      FROM tb_content p
      JOIN tb_user u ON p.autor_id = u.id
      LEFT JOIN tb_content_tag pt ON p.id = pt.content_id
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

    // filtro por type
    if (type) {
      query += ` AND p.type = $${index}`;
      values.push(type);
      index++;
    }

    // filtro por nomes de tags
    if (tags) {

      // transforma em array se vier string
      const tagArray = Array.isArray(tags) ? tags : [tags];

      query += `
        AND p.id IN (
          SELECT pt.content_id
          FROM tb_content_tag pt
          JOIN tb_tag t2 ON pt.tag_id = t2.id
          WHERE LOWER(t2.name) = ANY($${index})
        )
      `;

      values.push(tagArray.map(tag => tag.toLowerCase()));
      index++;
    }

    // excluir content já carregados
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

  // pra buscar um content pelo id
  async findById(id) {
    const query = `SELECT * FROM tb_content WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

}

export default new ContentModel();