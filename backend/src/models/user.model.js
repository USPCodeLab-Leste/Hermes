class UserModel {
  
  // findOne genérico
  async findOne({ email, id }) {

  }

  // Cria usuario
  async create({ nome, email, password, role = "USER" }) {

  }
}

export default new UserModel();