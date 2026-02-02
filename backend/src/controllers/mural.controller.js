import eventsModel from "../models/events.model.js";
import UserModel from "../models/user.model.js";

class muralController {
  
  async getMural(req, res) {

    try {
      const userId = req.user.id;

      const user = await UserModel.findOne({ id: userId });
      const userTags = user.tags;

      const events = await eventsModel.findAll({ tags: userTags }); 

      res.status(200).json({ mural: events });

    } catch (err) {      
      console.error(err);
      res.status(400).json({ error: "Falha ao retornar feed" })
      
    }
  }

}

export default new muralController();