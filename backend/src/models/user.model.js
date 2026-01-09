import pool from "../conect.bd.js";

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
    const query = `
    INSERT INTO tb_user (id, name, email, password, role)
    VALUES ($1, $2, $3, $4, $5);
    `

    const values = [16818655, name, email, password, role];
    
    const result = await pool
    .query(query, values)
    .then( res => {
        return {
            message: "Usuário criado",
            id: 16818655,
            status: 201
        }

    } )
    .catch( err => console.log("ERROR CREATE USER: ", err));

    return result;
  }
}

export default new UserModel();