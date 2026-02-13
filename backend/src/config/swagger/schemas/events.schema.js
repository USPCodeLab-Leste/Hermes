export const eventSchemas = {
  Event: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
      },
      title: {
        type: "string",
        example: "Workshop de Node.js"
      },
      body: {
        type: "string",
        example: "Evento sobre boas práticas em Node.js"
      },
      local: {
        type: "string",
        example: "Auditório Central"
      },
      data_inicio: {
        type: "string",
        format: "date-time",
        example: "2026-03-10T18:00:00Z"
      },
      data_fim: {
        type: "string",
        format: "date-time",
        example: "2026-03-10T21:00:00Z"
      },
      img_banner: {
        type: "string",
        format: "uri",
        example: "https://meusite.com/banner.png"
      },
      autor_nome: {
        type: "string",
        example: "Hermes"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        example: ["Poker", "event"]
      }
    },
    required: [
      "id",
      "title",
      "local",
      "data_inicio",
      "data_fim",
      "autor_nome",
      "tags"
    ]
  },

  CreateEventRequest: {
    type: "object",
    required: ["title", "data_inicio", "data_fim", "local", "tags"],
    properties: {
      title: { type: "string", minLength: 3, maxLength: 100 },
      body: { type: "string", minLength: 10, maxLength: 1000 },
      local: { type: "string", minLength: 3, maxLength: 100 },
      data_inicio: { type: "string", format: "date-time" },
      data_fim: { type: "string", format: "date-time" },

      img_banner: {
        type: "string",
        format: "uri",
        maxLength: 200
      }
    }
  },

  EventListResponse: {
    type: "array",
    items: {
      $ref: "#/components/schemas/Event"
    }
  },

  EventCreatedResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Evento criado com sucesso"
      }
    },
    required: ["message"]
  }
};
