export const eventSchemas = {
  Event: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
      },

      title: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Workshop de Node.js"
      },

      body: {
        type: "string",
        minLength: 10,
        maxLength: 1000,
        example: "Evento sobre boas práticas em Node.js"
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

      img_banner: {
        type: "string",
        format: "uri",
        maxLength: 200,
        example: "https://meusite.com/banner.png"
      },

      status: {
        type: "string",
        example: "published"
      }, 

      autor_id: {
        type: "string",
        format: "uuid",
        example: "43573bd9-62d8-4f33-af55-7c7dfbg652fd4"
      },

      autor_nome: {
        type: "string",
        example: "Hermes"
      },

      created_at: {
        type: "string",
        format: "date-time",
        example: "2026-03-10T11:30:00Z"
      },

      tags: {
        type: "array",
        items: {
          type: "string",
          minLength: 1
        },
        example: ["Node", "Backend"]
      },

      
    },

    required: [
      "id",
      "title",
      "body",
      "local",
      "data_inicio",
      "data_fim",
      "autor_nome"
    ]
  },


  CreateEventRequest: {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "body",
      "data_inicio",
      "data_fim",
      "local"
    ],
    properties: {

      title: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Workshop de Node.js"
      },

      body: {
        type: "string",
        minLength: 10,
        maxLength: 1000,
        example: "Evento sobre boas práticas em Node.js"
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

      img_banner: {
        type: "string",
        format: "uri",
        maxLength: 200,
        example: "https://meusite.com/banner.png"
      },

      tags: {
        type: "array",
        items: {
          type: "string",
          minLength: 1
        },
        example: ["Node", "Backend"]
      }
    }
  },

  EventListResponse: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Event"
        }
      },
      hasMore: {
        type: "boolean",
        example: false
      }
    },
    required: ["data", "hasMore"]
  },

  EventCreatedResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "event criado com sucesso"
      }
    },
    required: ["message"]
  }

};
