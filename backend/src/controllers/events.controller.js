import eventsModel from "../models/events.model.js";

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

  }
  
}

export default new eventsController();