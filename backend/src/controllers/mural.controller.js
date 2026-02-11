import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

class muralController {
  
  async getMural(req, res) {
    try {
      const userId = req.user.id;

      let { limit, offset } = req.query;

      limit = Number(limit) || DEFAULT_LIMIT;
      offset = Number(offset) || 0;
      
      if (limit > MAX_LIMIT) { limit = MAX_LIMIT; }
      if (limit < 1) { limit = DEFAULT_LIMIT; }

      const user = await UserModel.findOne({ id: userId });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const userTags = user.tags;

      const events = await PostModel.findAll({
        tags: userTags,
        limit,
        offset
      });

      res.status(200).json({
        limit,
        offset,
        total: events.length,
        mural: events
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha ao retornar feed" });
    }
  }

}

export default new muralController();