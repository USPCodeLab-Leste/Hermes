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
  async create({ name, email, password, role = "USER" }) {
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
  
}

export default new UserModel();