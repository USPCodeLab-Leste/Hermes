import UserModel from "../models/user.model.js";
import { updateUserSchema } from "../validators/auth.validator.js";

class UserController {

  async getInfoMe(req, res) {

    try {
      const id = req.user.id;
      const user = await UserModel.findOne({id});
      const userTags = await UserModel.getUserTags(id);

      res.status(200).json({
        "user": {
          "id": user.id,
          "name": user.name,
          "email": user.email,
          "role": user.role,
          "userTags": userTags
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

  async followTag(req, res) {
    try {
      const userId = req.user.id;
      const { tagId } = req.body;

      if (!tagId) {
        return res.status(400).json({ error: "tagId é obrigatório" });
      }

      await UserModel.followTag(userId, tagId);

      return res.status(200).json({
        message: "Tag seguida com sucesso"
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao seguir tag" });
    }
  }

  async unfollowTag(req, res) {
    try {
      const userId = req.user.id;
      const { tagId } = req.params;

      if (!tagId) {
        return res.status(400).json({ error: "tagId é obrigatório" });
      }

      await UserModel.unfollowTag(userId, tagId);

      return res.status(200).json({
        message: "Tag removida das favoritas com sucesso"
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover tag" });
    }
  }


}

export default new UserController();