import pool from "../config/database.js";

class eventsModel {
  
  // Precisa devolver com base em um limite e tags
  // Na falta de tag na requisição, não filtrar 
  async findAll({ limit = 10, tags = [] }) {

  }

  async findById(id) {

  }

  async create() {

  }

  async searchEvent(search = undefined) {
    let query = `
      SELECT *
      FROM post
      JOIN post_tag. ON post_tag.post_id = post.id
      JOIN tag on post_tag.id_tag = tag.id
    `;

    const values = [];

    if(search != undefined) {
      query += ` WHERE post.id = $1 OR post.local = $1 OR post.titulo = $1`
      values.push(search);
    }

    query += `;`;


    const result = await
    pool
    .query(query, values)
    .then( res => res.rows[0])
    .catch( err => console.error("ERROR GET EVENTS: ", err));

    return result;


  }

}

export default new eventsModel();

/*

let query = `
SELECT *
FROM post
JOIN post_tag on post_tag.idPost = post.idPost
JOIN tag on tag.tag_id = post_tag.tag_id
`;
const values = [tags, limit || "ALL"];
if(tags != []){
  query += ` WHERE tag.title = ANY($1)`;
}
query += ` LIMIT $2`;

const result = await
pool
.query(query, values)
.then( res => res.rows[0])
.catch( err => console.error("ERROR GET EVENTS ON SEARCH: ", err));

return result;

*/