import eventsModel from "../models/events.model.js";
import { createEventSchema } from "../validators/events.validator.js"

class eventsController {

  async getEvents(req, res) {
    try {
      const {titulo, local, tag } = req.body;

      const events = eventsModel.searchEvent({titulo, local, tag});

      if(!events) return res.status(404).json({ error: "Events not found!"});

      return res.status(200).json(events);
    } catch (err) {
      console.log(err);
    }
  }

  async postEvents(req, res) {

    try {
      const userId = req.user.id;

      // Recebe dados e verifica com Zod
      const data = createEventSchema.parse(req.body);

      await eventsModel.create({
        ...data,
        autor_id: userId,
      });

      res.status(201).json({ message: "Evento criado com sucesso" })

    } catch (err) {      
      console.error(err);
      res.status(500).json({ error: "Falha na criação do evento" })
      
    }
  }
  
}

export default new eventsController();