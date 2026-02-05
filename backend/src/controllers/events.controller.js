import PostModel from "../models/post.model.js";
import { createEventSchema } from "../validators/post.validator.js"

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

class eventsController {

  async getEvents(req, res) {
    try {
      let { titulo, limit, offset } = req.query;

      limit = Number(limit) || DEFAULT_LIMIT;
      offset = Number(offset) || 0;
      
      if (limit > MAX_LIMIT) { limit = MAX_LIMIT; }
      if (limit < 1) { limit = DEFAULT_LIMIT; }

      const events = await PostModel.findAll({ titulo, limit, offset });

      if(!events) return res.status(404).json({ error: "Events not found!"});

      return res.status(200).json(events);
    
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Falha na busca de eventos" });
    }
  }

  async postEvents(req, res) {

    try {
      const userId = req.user.id;

      // Recebe dados e verifica com Zod
      const data = createEventSchema.parse(req.body);

      // Garante que a tag "event" sempre exista:
      // - Usa as tags vindas do body (se existirem)
      // - Adiciona a tag fixa "event"
      // - Remove duplicatas usando Set
      const tags = Array.from(
        new Set([...(data.tags ?? []), "event"])
      );

      await PostModel.create({
        ...data,
        autor_id: userId,
        tags: tags
      });

      res.status(201).json({ message: "Evento criado com sucesso" })

    } catch (err) {      
      console.error(err);
      res.status(500).json({ error: "Falha na criação do evento" })
      
    }
  }
  
}

export default new eventsController();