import pool from "../config/database.js";
import crypto from "crypto";

class UserModel {
  
  // findOne genérico
  async findOne({ email, id }) {
    let query;
    let values;
    
    if(id != undefined) {
      query = `
      SELECT *
      FROM tb_user
      WHERE id = $1;`;

      values = [id];

    } else {
      query = `
      SELECT *
      FROM tb_user
      WHERE email = $1;`;

      values = [email];
      
    }
    
    const result = await
    pool
    .query(query, values)
    .then( res => res.rows[0])
    .catch( err => console.error("ERROR GET USER BY ID/EMAIL: ", err));

    return result;
  }

  // Cria usuario
  async create({ name, email, password, role = "ADMIN" }) {
    try {
      const id = crypto.randomUUID();

      const query = `
        INSERT INTO tb_user (id, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const values = [id, name, email, password, role];
      const result = await pool.query(query, values);

      return { id: result.rows[0].id };

    } catch (err) {

      console.error("ERROR CREATE USER:", err);
      throw err;

    }
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(data[key]);
        index++;
      }
    }

    if (!fields.length) {
      throw new Error("NO_FIELDS_TO_UPDATE");
    }

    const query = `
      UPDATE tb_user
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING id, name, email, role
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Seguir tag
  async followTag(userId, tagId) {
    const query = `
      INSERT INTO tb_user_tag (user_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, tag_id) DO NOTHING
      RETURNING user_id, tag_id
    `;

    const result = await pool.query(query, [userId, tagId]);
    return result.rows[0];
  }

  // Deixar de seguir tag
  async unfollowTag(userId, tagId) {
    const query = `
      DELETE FROM tb_user_tag
      WHERE user_id = $1 AND tag_id = $2
    `;

    await pool.query(query, [userId, tagId]);
  }

  // Buscar tags favoritas do usuário
  async getUserTags(userId) {
    const query = `
      SELECT t.id, t.name, t.type
      FROM tb_tag t
      JOIN tb_user_tag ut ON ut.tag_id = t.id
      WHERE ut.user_id = $1 AND t.active = TRUE
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async verifyUserEmail(id) {
    const sql = `
      UPDATE tb_user
      SET is_verified = TRUE
      WHERE id = $1
      RETURNING id, email, is_verified
    `;
    const result = await pool.query(sql, [id]);
    return result.rows[0];
  }
  
}

export default new UserModel();