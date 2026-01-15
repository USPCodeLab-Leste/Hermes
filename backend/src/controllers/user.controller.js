import UserModel from "../models/user.model.js";

class UserController {

  async getInfoMe(req, res) {

    try {
      const id = req.user.id;
      const user = await UserModel.findOne({id});

      res.status(200).json({
        "user": {
          "id": user.id,
          "name": user.name,
          "email": user.email,
          "role": user.role
        }
      });

    } catch (err) {
      console.error(err);
      res.status(400).json("Erro ao pegar informações do usuario");
    }
  
  }
}

export default new UserController();