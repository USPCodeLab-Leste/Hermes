export const eventSchemas = {
  /**
   * Modelo base de Evento
   * (usado em listas e respostas)
   */
  Event: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
      },
      titulo: {
        type: "string",
        example: "Workshop de Node.js"
      },
      descricao: {
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
      }
    },
    required: [
      "id",
      "titulo",
      "local",
      "data_inicio",
      "data_fim",
      "autor_nome"
    ]
  },

  CreateEventRequest: {
    type: "object",
    required: ["titulo", "data_inicio", "data_fim", "local"],
    properties: {
      titulo: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Workshop de Node.js"
      },
      descricao: {
        type: "string",
        minLength: 10,
        maxLength: 1000,
        example: "Evento sobre backend e boas práticas"
      },
      local: {
        type: "string",
        minLength: 3,
        maxLength: 100,
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
      tags: {
        type: "array",
        items: {
          type: "string",
          example: "backend"
        },
        example: ["backend", "node"]
      },
      img_banner: {
        type: "string",
        format: "uri",
        maxLength: 200,
        example: "https://meusite.com/banner.png"
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
