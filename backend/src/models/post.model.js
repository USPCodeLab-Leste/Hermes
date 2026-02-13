import { serialize } from "v8";
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
  async findAll({ title, tags, limit = 10, offset = 0 } = {}) {
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
    if (tags) {
      query += ` AND t.name = ANY ($${index})`;
      values.push(tags);
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
    let query = `
    SELECT 
    p.id,
    p.title,
    p.body,
    p.local,
    p.img_banner,
    p.status,
    p.data_inicio,
    p.data_fim,
    p.created_at,
    t.id,
    t.name
    FROM tb_post p
    LEFT JOIN tb_post_tag pt ON pt.post_id = p.id
    LEFT JOIN tb_tag t ON t.id = pt.tag_id
    WHERE p.id = $1;`;

    let values = [id];

    const result = await
    pool
    .query(query, values)
    .then( res => res.rows[0])
    .catch( err => console.error("ERROR GET EVENT: ", err));

    return result;
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

  async patchEvents(id, info) {
    // Pesquisa do criador daquele post
    const querySearchPost = `SELECT autor_id FROM tb_post WHERE id = $1;`;
    let searchPostAutorId = await pool.query(querySearchPost, [id]);
    
    // Verifica se o usuário é o criador do post
    if(info.user_id !== searchPostAutorId.rows[0].autor_id) return {error: "ID do usuário não condiz com o do post"};

    // Monsta a query para autalizar a tabela post;
    let queryUpdateTbPost = `
    UPDATE tb_post
    SET id=$1`;

    const values = [id];
    let idx = 2;

    if(info.title) {
      queryUpdateTbPost += `, title = $${idx}`;
      values.push(info.title);
      idx++;
    }

    if(info.data_inicio) {
      queryUpdateTbPost += `, data_inicio = $${idx} `;
      values.push(info.data_inicio);
      idx++;
    }

    if(info.data_fim) {
      queryUpdateTbPost += `, data_fim = $${idx} `;
      values.push(info.data_fim);
      idx++;
    }

    if(info.status) {
      queryUpdateTbPost += `, status = $${idx} `;
      values.push(info.status);
      idx++;
    }

    if(info.img_banner) {
      queryUpdateTbPost += `, img_banner = $${idx} `;
      values.push(info.img_banner);
      idx++;
    }

    if(info.body) {
      queryUpdateTbPost += `, body = $${idx} `;
      values.push(info.body);
      idx++;
    }

    queryUpdateTbPost += `
    WHERE id = $1`;

    ///

    const result = [];

    // Atualiza tanto a tabela tags quanto a tabela de relacionamento entre tags e posts
    if(info.tags){
      let queryDeletePostTags = `DELETE FROM tb_post_tag WHERE post_id = $1;`; // query para deletar todas as antigas tags relacionadas ao post antes

      await pool.query(queryDeletePostTags, [id]).catch(err => {
        console.error("ERROR TO DELETE OLDS TAGS", err);
        return {error: "Try to delete old tags"};
      });

      // vai passar por cada tag
      for(const tag of info.tags){
        // Tenta inserir na tabela de tags a nova tag e caso já exista, ela só retorna o id da tag já existente
        const queryInsertTbTag = `INSERT INTO tb_tag (id, name, type, active)
        VALUES ($1,$2,$3,$4)
        ON CONFLICT (name)
        DO UPDATE SET name = EXCLUDED.name
        RETURNING id;`;

        const values = [crypto.randomUUID(), tag, "generic", true];

        const resultInsertTbTag = await pool.query(queryInsertTbTag, values)
        .catch(err => {
          console.error("ERROR TO TRY INSERT INTO TAG TABLE", err);
          return {error: "TRY TO INSERT INTO TAG TABLE"};
        });

        if(resultInsertTbTag.error) return resultInsertTbTag.error;

        const idTag = resultInsertTbTag.rows[0].id;

        await this.addTag(id, idTag);
      }
    }

    // Roda o comando que atualiza a tabela dos posts
    result.push(await pool
      .query(queryUpdateTbPost, values)
      .then( res => res.rows[0])
      .catch( err => {
        console.error("ERROR PATCH POST: ", err)
        return {error: "Error to try Update Tb_post"};
      })
    );

    if(result.error) result.status = 400;
    else result.status = 200;
    return result;

  }

  async deleteEvent(id, user_id) {
    // Resgata o autor do post
    const search = await pool.query(
      `SELECT autor_id FROM tb_post WHERE id = $1;`, [id]
    ).then(res => res.rows[0]);

    // Verifica se o id do autor e do usuário condiz
    if(user_id !== search.autor_id) return {error: "ID do usuário não condiz com do POST"}

    //  Query para deletar o post
    const queryTb_post = `DELETE FROM tb_post WHERE id = $1;`;

    // Query para deletas os relacionamentos do post com as tags
    const queryTb_post_tag = `DELETE FROM tb_post_tag WHERE post_id = $1;`;

    const values = [id];

    const result = [];

    result.push(await pool
      .query(queryTb_post, values)
      .then( res => res.rows[0])
      .catch( err => {
        console.error("ERROR DELETE EVENT: ", err)
        return err;
      })
    );

    result.push(
      await pool
      .query(queryTb_post_tag, values)
      .then( res => res.rows[0])
      .catch( err => {
        console.error("ERROR DELETE RELATION TB_POST_TAG: ", err)
        return err;
      })
    );

    if(result) return result.status = 400;

    return result.status = 200;
  }
}

export default new PostModel();