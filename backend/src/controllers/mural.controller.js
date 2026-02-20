import ContentModel from "../models/content.model.js";
import UserModel from "../models/user.model.js";

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

class MuralController {
  
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

      const userTags = await UserModel.getUserTags(userId);
      const tags = userTags.map(t => t.name);
      
      let result  = await ContentModel.findAll({
        tags,
        limit,
        offset,
        type: "event"
      });

      let events = result.data;
      let hasMore = result.hasMore;

      // Se veio menos que o limite, completa o restante
      if (events.length < limit) {

        const remaining = limit - events.length;
        const existingIds = events.map(e => e.id);

        const extraResult = await ContentModel.findAll({
          limit: remaining,
          offset: 0,
          excludeIds: existingIds,
          type: "event"
        });

        events = [...events, ...extraResult.data];

        // se o extra ainda tem mais
        hasMore = hasMore || extraResult.hasMore;
      }

      // Remove o campo type
      events = events.map(event => {
        const { type, ...rest } = event;
        return rest;
      });

      res.status(200).json({
        mural: events,
        hasMore
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Falha ao retornar feed" });
    }
  }

}

export default new MuralController();