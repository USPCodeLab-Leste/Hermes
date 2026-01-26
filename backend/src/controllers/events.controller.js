import eventsModel from "../models/events.model.js";

class eventsController {

  async getEvents(req, res) {
    try {
      const events = eventsModel.searchEvent(req.params.id);

      if(events == undefined) {
        return res.status(400).json({error: "Events not found"});
      }

      return res.status(200).json(events);
    } catch (err) {
      console.log(err);
    }
  }

  async postEvents(req, res) {

  }
  
}

export default new eventsController();