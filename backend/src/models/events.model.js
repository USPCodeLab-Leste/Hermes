import pool from "../config/database.js";

class eventsModel {
  
  // Precisa devolver com base em um limite e tags
  // Na falta de tag na requisição, não filtrar 
  async findAll({ title, local, tags = [], limit = 10 }) {
    let query = `
      SELECT DISTINCT post.*
      FROM post
      JOIN post_tag. ON post_tag.post_id = post.id
      JOIN tag on post_tag.id_tag = tag.id
      WHERE 1=1
    `;

    const values = [];
    const index = 1;

    if(title) {
      query += ` OR post.titulo = $${index}`;
      values.push(title);
      index++;
    }

    if(local) {
      query += ` OR post.local = $${index}`;
      values.push(local);
      index++;
    }

    if(tags) {
      query += ` OR tag.titulo IN $${index}`;
      values.push(tags);
      index++;
    }

    query += ` LIMIT ${index};`;


    const result = await
    pool
    .query(query, values)
    .then( res => res.rows[0])
    .catch( err => console.error("ERROR GET EVENTS: ", err));

    return result;
  }

  async findById(id) {

  }

  async create() {

  }

  async searchEvent() {
  }

}

export default new eventsModel();