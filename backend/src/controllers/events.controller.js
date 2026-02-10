import PostModel from "../models/post.model.js";
import { createEventSchema } from "../validators/post.validator.js"

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

class eventsController {

  async getEvents(req, res) {
    try {
      let { title, limit, offset, tag } = req.query;

      limit = Number(limit) || DEFAULT_LIMIT;
      offset = Number(offset) || 0;

      if (limit > MAX_LIMIT) limit = MAX_LIMIT;
      if (limit < 1) limit = DEFAULT_LIMIT;

      // Normaliza tag para array
      let tags = tag;
      if (tags && !Array.isArray(tags)) {
        tags = [tags];
      }

      const events = await PostModel.findAll({
        title,
        tags,
        limit,
        offset
      });

      return res.status(200).json(events);

    } catch (err) {
      console.error(err);
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

  async patchEvents(req, res) {
    try {
      const body = req.body;
      const id = req.params.id;

      let patchResponse;

      if(id) patchResponse = eventsModel.patchEvents(id, body);
      else return res.status(400).json({error: "ID faltando"});

      if(!patchResponse) {
        console.error("Error to patch event.", patchResponse);
        return res.status(400).json({error: "Error to patch!"});
      }

      return res.status(200).json({results: patchResponse});

    } catch (err) {
      console.log(err);
    }
  }

  async getEventId(req, res) {
    const id = req.params.id;

    let response;

    if(id) response = eventsModel.findById(id);
    else return res.status(404).json({error: "ID não informado"});

    if(!response){
      console.error("Error to get event.", response);
      return res.status(404).json({error: "Event Not Found!"});
    }

    return res.status(200).json(response);
  }

  async deleteEvent(req, res) {
    const id = req.id;

    let response;

    if(id) response = eventsModel.deleteEvent(id);
    else return res.status(400).json({error: "ID não informado"});

    if(!response){
      console.error("Error to delete events.", response);
      return res.status(400).json({error: "Error to delete events"});

    }

    return res.status(200).json(response);

  }
  
}

export default new eventsController();