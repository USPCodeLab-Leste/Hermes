import ContentModel from "../models/content.model.js";
import UserModel from "../models/user.model.js"; 
import { Expo } from "expo-server-sdk";
const expo = new Expo()

const MAX_LIMIT = 20;
const DEFAULT_LIMIT = 10;

class BaseContentController {

  constructor(type, schema = null) {
    this.type = type;
    this.schema = schema;
  }

  // Helpers
  // para remover campos null
  removeNullFields(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null)
    );
  }

  // para remover campos da sua escolha 
  removeUnwantedFields(obj) {
    const fieldsToRemove = ["type"];

    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) =>
        value !== null &&
        !fieldsToRemove.includes(key)
      )
    );
  }


  async get(req, res) {
    try {
      let { title, limit, offset, tag } = req.query;

      limit = Number(limit) || DEFAULT_LIMIT;
      offset = Number(offset) || 0;

      if (limit > MAX_LIMIT) limit = MAX_LIMIT;
      if (limit < 1) limit = DEFAULT_LIMIT;

      // Normaliza tags para array
      const normalizedTags = tag && tag !== ""
        ? (Array.isArray(tag) ? tag : [tag])
        : undefined;

      // Monta objeto base
      const queryOptions = {
        title,
        type: this.type,
        tags: normalizedTags,
      };

      // Só aplica paginação se NÃO for info
      if (this.type !== "info") {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }

      const content = await ContentModel.findAll(queryOptions);

      // Remove campos null de cada item
      const cleanedData = content.data.map(item =>
        this.removeUnwantedFields(
          this.removeNullFields(item)
        )
      );

      const response = {
        data: cleanedData
      };

      if (this.type !== "info") {
        response.hasMore = content.hasMore;
      }

      return res.status(200).json(response);

    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: `Falha na busca de ${this.type}` });
    }
  }

  async create(req, res) {

    try {
      const userId = req.user.id;

      // Se tiver schema (Zod), valida
      const data = this.schema.create ? this.schema.create.parse(req.body) : req.body;

      const { tags, ...contentData } = data;

      const newContent = await ContentModel.create({
        ...contentData,
        type: this.type,
        autor_id: userId,
        tags
      });

      // parte pro broadcast de notificações
      try {
        const pushTokens = await UserModel.getAllPushTokens();

        if (pushTokens && pushTokens.length > 0) {
          let messages = [];
          
          for (let pushToken of pushTokens) {
            if (!Expo.isExpoPushToken(pushToken)) continue;

            messages.push({
              to: pushToken,
              sound: 'default',
              title: `${newContent.title}`, 
  
              body: newContent.body 
                    ? `${newContent.body.substring(0, 100)}...` 
                    : `Toque para conferir as novidades na área de ${this.type}!`,
        
              data: { 
                url: `/home?event=${newContent.id}&q=${encodeURIComponent(newContent.title)}` 
              },
            });
          }

          let chunks = expo.chunkPushNotifications(messages);
          for (let chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
          }
          console.log(`Push enviada para ${messages.length} celulares.`);
        }
      } catch (pushError) {
        // se a notificação falhar, o post ainda é criado com sucesso
        console.error("Erro no envio de notificações:", pushError);
      }
    

      return res.status(201).json({
        message: `${this.type} criado com sucesso`
      });

    } catch (err) {
      console.error(err);

      if (err.name === "ZodError") {
        return res.status(400).json({
          error: "Dados inválidos",
          details: err
        });
      }

      return res.status(500).json({
        error: `Falha na criação de ${this.type}`
      });
    }
  }
  
  async patch(req, res) {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      if (!id) {
        return res.status(400).json({ error: "ID não informado" });
      }

      const contentCheck = await ContentModel.findById(id);

      if (!contentCheck) {
        return res.status(404).json({ error: `${this.type} não encontrado` });
      }

      if (contentCheck.autor_id !== userId) {
        return res.status(403).json({ error: "acesso negado: Você não é o autor deste conteúdo."});
      }

      const body = this.schema.update
        ? this.schema.update.parse(req.body)
        : req.body;

      const { tags, ...contentData } = body;

      const updatedContent = await ContentModel.update(id, {
        ...contentData,
        type: this.type,
        autor_id: userId,
        tags
      });

      if (!updatedContent) {
        return res.status(400).json({
          error: `Erro ao atualizar ${this.type}`
        });
      }

      return res.status(200).json({
        message: `${this.type} atualizado com sucesso`
      });

    } catch (err) {
      console.error(err);

      if (err.name === "ZodError") {
        return res.status(400).json({
          error: "Dados inválidos",
          details: err
        });
      }

      return res.status(500).json({
        error: `Falha ao atualizar ${this.type}`
      });
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ error: "ID não informado" });
      }

      const response = await ContentModel.findById(id);

      if (!response) {
        return res.status(404).json({ error: `${this.type} não encontrado` });
      }

      const cleanedData = this.removeUnwantedFields(
        this.removeNullFields(response)
      );

      return res.status(200).json(cleanedData);

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: `Erro ao buscar ${this.type}`
      });
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      if (!id) {
        return res.status(400).json({ error: "ID não informado" });
      }
      
      const contentCheck = await ContentModel.findById(id);

      if (!contentCheck) {
        return res.status(404).json({ error: `${this.type} não encontrado`});
      }

      if (contentCheck.autor_id !== userId) {
        return res.status(403).json({ error: "acesso negado: Você não é o autor deste conteúdo"});
      }
      
      const response = await ContentModel.delete(id, userId);

      if (!response) {
        return res.status(400).json({
          error: `Erro ao deletar ${this.type}`
        });
      }

      return res.status(200).json({
        message: `${this.type} deletado com sucesso`
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: `Falha ao deletar ${this.type}`
      });
    }
  }

}

export default BaseContentController;