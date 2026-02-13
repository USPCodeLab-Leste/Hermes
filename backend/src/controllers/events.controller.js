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
        tags = tags.split(",").map(value => value.trim());
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
      // Verifica se os dados estão de acordo com as normas para postas
      const body = createEventSchema.parse(req.body);

      // recebem os ides do post e do usuário, respectivamente
      const id = req.params.id;
      const id_user = req.user.id;

      // tags normalizadas para arrray
      const tags = Array.from(
        new Set([...(body.tags ?? []), "event"])
      );

      // Cria um nova constante para enviar os dados
      const content = {
        title: body.title,
        data_inicio: body.data_inicio,
        data_fim: body.data_fim,
        status: body.status,
        img_banner: body.img_banner,
        body: body.body,
        user_id: id_user,
        tags: tags,
      };

      let patchResponse;

      if(id && id_user) patchResponse = PostModel.patchEvents(id, content);
      else return res.status(400).json({error: "ID faltando"});

      if(!patchResponse) {
        console.error("Error to patch event.", patchResponse);
        return res.status(400).json({error: "Error to patch!"});
      }

      return res.status(200).json({results: patchResponse});

    } catch (err) {
      console.error(err);
    }
  }

  async getEventId(req, res) {
    const id = req.params.id;

    let response;

    if(id) response = await PostModel.findById(id);
    else return res.status(404).json({error: "ID não informado"});

    if(!response){
      console.error("Error to get event.", response);
      return res.status(404).json({error: "Event Not Found!"});
    }
    return res.status(200).json(response);
  }

  async deleteEvent(req, res) {
    const id = req.params.id;
    const id_user = req.user.id;

    let response;

    if(id && id_user) response = PostModel.deleteEvent(id, id_user);
    else return res.status(400).json({error: "ID não informado"});

    if(!response){
      console.error("Error to delete events.", response);
      return res.status(400).json({error: "Error to delete events"});

    }

    return res.status(200).json(response);

  }
  
}

export default new eventsController();