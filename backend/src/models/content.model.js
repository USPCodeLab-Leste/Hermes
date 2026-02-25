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
    const query = `
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
      WHERE p.id = $1
      GROUP BY p.id, u.name
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async update(id, info) {

    // Pesquisa do criador daquele content
    const querySearchContent = `SELECT autor_id FROM tb_content WHERE id = $1;`;
    let searchContentAutorId = await pool.query(querySearchContent, [id]);

    if (!searchContentAutorId.rows[0]) return null;

    // Verifica se o usuário é o criador
    if (info.autor_id !== searchContentAutorId.rows[0].autor_id)
      return null;

    // Monta query dinâmica
    let queryUpdateTbContent = `
    UPDATE tb_content
    SET id=$1`;

    const values = [id];
    let idx = 2;

    if (info.title) {
      queryUpdateTbContent += `, title = $${idx}`;
      values.push(info.title);
      idx++;
    }

    if (info.data_inicio) {
      queryUpdateTbContent += `, data_inicio = $${idx}`;
      values.push(info.data_inicio);
      idx++;
    }

    if (info.data_fim) {
      queryUpdateTbContent += `, data_fim = $${idx}`;
      values.push(info.data_fim);
      idx++;
    }

    if (info.status) {
      queryUpdateTbContent += `, status = $${idx}`;
      values.push(info.status);
      idx++;
    }

    if (info.img_banner) {
      queryUpdateTbContent += `, img_banner = $${idx}`;
      values.push(info.img_banner);
      idx++;
    }

    if (info.body) {
      queryUpdateTbContent += `, body = $${idx}`;
      values.push(info.body);
      idx++;
    }

    queryUpdateTbContent += `
    WHERE id = $1
    RETURNING *`;

    // Atualiza tags
    if (info.tags) {

      const queryDeleteTags = `DELETE FROM tb_content_tag WHERE content_id = $1;`;

      await pool.query(queryDeleteTags, [id])
        .catch(err => {
          console.error("ERROR TO DELETE OLDS TAGS", err);
          return null;
        });

      for (const tag of info.tags) {

        const queryInsertTbTag = `
        INSERT INTO tb_tag (id, name, type, active)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id;`;

        const valuesTag = [crypto.randomUUID(), tag, "general", true];

        const resultInsertTbTag = await pool.query(queryInsertTbTag, valuesTag)
          .catch(err => {
            console.error("ERROR TO INSERT TAG", err);
            return null;
          });

        if (!resultInsertTbTag) continue;

        const idTag = resultInsertTbTag.rows[0].id;

        await pool.query(
          `INSERT INTO tb_content_tag (content_id, tag_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING`,
          [id, idTag]
        );
      }
    }

    const result = await pool
      .query(queryUpdateTbContent, values)
      .then(res => res.rows[0])
      .catch(err => {
        console.error("ERROR PATCH CONTENT: ", err);
        return null;
      });

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