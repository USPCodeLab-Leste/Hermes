import UserModel from "../models/user.model.js";
import { updateUserSchema } from "../validators/auth.validator.js";

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

  async patchInfoMe(req, res) {

    try {
      const id = req.user.id;

      if(!id) {
        return res.status(400).json("Erro com o usuario");
      }

      const { name, /*email*/ } = updateUserSchema.parse(req.body);
      const updatedUser = await UserModel.update(id, {
        name, /*email*/ // Quando mudar email, precisa mandar verificacao novamente 
      });

      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user: updatedUser
      });

    } catch (err) {
      console.error(err);
      res.status(400).json("Erro ao atualizar informações do usuario");
    }
  }
}

export default new UserController();