import TagModel from "../models/tag.model.js";

class tagController {

  // GET /tags
  async getTags(req, res) {
    try {
      const tags = await TagModel.findAll();

      if (!tags || tags.length === 0) {
        return res.status(404).json({ error: "Nenhuma tag encontrada" });
      }

      return res.status(200).json({ tags });

    } catch (err) {
      console.error("ERROR GET TAGS:", err);
      return res.status(500).json({ error: "Falha ao buscar tags" });
    }
  }

  // GET /tags/:name
  async getTagByName(req, res) {
    try {
      const { name } = req.params;

      const tag = await TagModel.findByName(name);

      if (!tag) {
        return res.status(404).json({ error: "Tag não encontrada" });
      }

      return res.status(200).json({ tag });

    } catch (err) {
      console.error("ERROR GET TAG BY NAME:", err);
      return res.status(500).json({ error: "Falha ao buscar tag" });
    }
  }

  // POST /tags
  async createTag(req, res) {
    try {
      const { name, type } = req.body;

      if (!name || !type) {
        return res.status(400).json({ error: "name e type são obrigatórios" });
      }

      const existingTag = await TagModel.findByName(name);

      if (existingTag) {
        return res.status(409).json({ error: "Tag já existe" });
      }

      const tag = await TagModel.create(name, type);

      return res.status(201).json({
        message: "Tag criada com sucesso",
        tag
      });

    } catch (err) {
      console.error("ERROR CREATE TAG:", err);
      return res.status(500).json({ error: "Falha ao criar tag" });
    }
  }

  async desativaTag(req, res) {
    try {
      const { id } = req.params;

      const deleted = await TagModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Tag não encontrada" });
      }

      return res.status(200).json({
        message: "Tag desativada com sucesso"
      });

    } catch (err) {
      console.error("ERROR DELETE TAG:", err);
      return res.status(500).json({ error: "Falha ao desativar tag" });
    }
  }
}

export default new tagController();
