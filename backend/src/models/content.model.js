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
    icon_name = null,
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
        (id, title, body, local, data_inicio, data_fim, img_banner, icon_name, status, autor_id, type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
        icon_name,
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

  async findAll({
    title,
    tags,
    priorityTags,
    type,
    excludeIds,
    limit,
    offset,
    onlyFuture
  } = {}) {
    
    const hasPriorityTags = Array.isArray(priorityTags) && priorityTags.length > 0;
    const hasFilterTags = Array.isArray(tags) && tags.length > 0;

    let query = `
      SELECT 
        p.*,
        u.name AS autor_nome,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'type', t.type
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
    `;

    const values = [];
    let index = 1;

    // prioridade do mural
    if (hasPriorityTags) {
      query += `,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM tb_content_tag pt2
            JOIN tb_tag t2 ON pt2.tag_id = t2.id
            WHERE pt2.content_id = p.id
            AND LOWER(t2.name) = ANY($${index})
          )
          THEN 0
          ELSE 1
        END AS priority
      `;

      values.push(priorityTags.map(tag => tag.toLowerCase()));
      index++;
    }

    query += `
      FROM tb_content p
      JOIN tb_user u ON p.autor_id = u.id
      LEFT JOIN tb_content_tag pt ON p.id = pt.content_id
      LEFT JOIN tb_tag t ON pt.tag_id = t.id
      WHERE 1=1
    `;

    // filtro por título
    if (title) {
      query += ` AND p.title ILIKE $${index}`;
      values.push(`%${title}%`);
      index++;
    }

    // filtro por tipo
    if (type) {
      query += ` AND p.type = $${index}`;
      values.push(type);
      index++;
    }

    // filtro real por tags
    if (hasFilterTags) {
      query += `
        AND p.id IN (
          SELECT pt2.content_id
          FROM tb_content_tag pt2
          JOIN tb_tag t2 ON pt2.tag_id = t2.id
          WHERE LOWER(t2.name) = ANY($${index})
        )
      `;

      values.push(tags.map(tag => tag.toLowerCase()));
      index++;
    }

    // exclusão
    if (excludeIds?.length > 0) {
      query += ` AND p.id <> ALL($${index})`;
      values.push(excludeIds);
      index++;
    }

    if (onlyFuture) {
      query += ` AND p.data_inicio IS NOT NULL AND p.data_inicio >= CURRENT_DATE`;
    }

    query += `
      GROUP BY p.id, u.name
    `;

    // ordenação
    if (hasPriorityTags) {
      query += `
        ORDER BY priority ASC, p.data_inicio ASC NULLS LAST
      `;
    } else {
      query += `
        ORDER BY p.data_inicio ASC NULLS LAST
      `;
    }

    // paginação
    if (limit !== undefined && offset !== undefined) {
      query += `
        LIMIT $${index}
        OFFSET $${index + 1}
      `;
      values.push(limit + 1, offset);
    }

    const result = await pool.query(query, values);

    const hasMore = limit !== undefined ? result.rows.length > limit : false;
    if (hasMore) result.rows.pop();

    return {
      data: result.rows,
      hasMore
    };
  }

  // pra buscar um content pelo id
  async findById(id) {
    const query = `
      SELECT 
        p.*,
        u.name AS autor_nome,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', t.id,
              'name', t.name,
              'type', t.type
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM tb_content p
      JOIN tb_user u ON p.autor_id = u.id
      LEFT JOIN tb_content_tag pt ON p.id = pt.content_id
      LEFT JOIN tb_tag t ON pt.tag_id = t.id
      WHERE p.id = $1
      GROUP BY p.id, u.name
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async getByMonth({ month, year }) {
    const query = `
      SELECT *
      FROM tb_content
      WHERE 
        type = 'event'
        AND data_inicio >= DATE_TRUNC('month', MAKE_DATE($1, $2, 1))
        AND data_inicio < DATE_TRUNC('month', MAKE_DATE($1, $2, 1)) + INTERVAL '1 month'
      ORDER BY data_inicio ASC
    `;

    const values = [year, month];

    const result = await pool.query(query, values);
    return result.rows;
  }

  async update(id, info) {

    const querySearchContent = `
      SELECT autor_id FROM tb_content WHERE id = $1;
    `;
    const searchContentAutorId = await pool.query(querySearchContent, [id]);

    if (!searchContentAutorId.rows[0]) return null;

    if (info.autor_id !== searchContentAutorId.rows[0].autor_id) return null;

    let query = `UPDATE tb_content SET `;
    const values = [];
    let idx = 1;
    const updates = [];

    if (info.title !== undefined) {
      updates.push(`title = $${idx++}`);
      values.push(info.title);
    }

    if (info.data_inicio !== undefined) {
      updates.push(`data_inicio = $${idx++}`);
      values.push(info.data_inicio);
    }

    if (info.data_fim !== undefined) {
      updates.push(`data_fim = $${idx++}`);
      values.push(info.data_fim);
    }

    if (info.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(info.status);
    }

    if (info.local !== undefined) {
      updates.push(`local = $${idx++}`);
      values.push(info.local);
    }

    if (info.img_banner !== undefined) {
      updates.push(`img_banner = $${idx++}`);
      values.push(info.img_banner);
    }

    if (info.icon_name !== undefined) {
      updates.push(`icon_name = $${idx++}`);
      values.push(info.icon_name);
    }

    if (info.body !== undefined) {
      updates.push(`body = $${idx++}`);
      values.push(info.body);
    }

    if (updates.length === 0 && !info.tags) {
      return null; // nada para atualizar
    }

    if (updates.length > 0) {
      query += updates.join(", ");
      query += ` WHERE id = $${idx} RETURNING *`;
      values.push(id);
    }

    const result = updates.length > 0
      ? await pool.query(query, values).then(res => res.rows[0])
      : null;

    // Atualização de tags
    if (info.tags !== undefined) {
      await pool.query(`DELETE FROM tb_content_tag WHERE content_id = $1`, [id]);

      for (const tag of info.tags) {
        const resultTag = await pool.query(`
          INSERT INTO tb_tag (id, name, type, active)
          VALUES ($1,$2,$3,$4)
          ON CONFLICT (name)
          DO UPDATE SET name = EXCLUDED.name
          RETURNING id;
        `, [crypto.randomUUID(), tag, "general", true]);

        const idTag = resultTag.rows[0].id;

        await pool.query(`
          INSERT INTO tb_content_tag (content_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [id, idTag]);
      }
    }

    return result;
  }

  async delete(id, user_id) {

    // Resgata o autor
    const search = await pool.query(
      `SELECT autor_id FROM tb_content WHERE id = $1;`,
      [id]
    ).then(res => res.rows[0]);

    if (!search) return null;

    // Verifica se autor é o mesmo
    if (user_id !== search.autor_id)
      return null;

    // Deleta relacionamento
    await pool.query(
      `DELETE FROM tb_content_tag WHERE content_id = $1;`,
      [id]
    ).catch(err => {
      console.error("ERROR DELETE RELATION TB_CONTENT_TAG:", err);
      return null;
    });

    // Deleta content
    const result = await pool.query(
      `DELETE FROM tb_content WHERE id = $1 RETURNING *;`,
      [id]
    ).then(res => res.rows[0])
    .catch(err => {
      console.error("ERROR DELETE CONTENT:", err);
      return null;
    });

    return result;
  }

}

export default new ContentModel();