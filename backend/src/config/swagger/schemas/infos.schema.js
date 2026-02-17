export const infoSchemas = {

  Info: {
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
        example: "Aviso Importante"
      },

      body: {
        type: "string",
        minLength: 10,
        maxLength: 1000,
        example: "Informamos que o sistema ficará indisponível para manutenção."
      },

      local: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Bloco A"
      },

      status: {
        type: "string",
        example: "published"
      }, 

      autor_nome: {
        type: "string",
        example: "Hermes"
      },

      autor_id: {
        type: "string",
        format: "uuid",
        example: "43573bd9-62d8-4f33-af55-7c7dfbg652fd4"
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
        example: ["Aviso", "Manutenção"]
      }
    },

    required: [
      "id",
      "title",
      "body",
      "autor_nome"
    ]
  },


  CreateInfoRequest: {
    type: "object",
    additionalProperties: false,
    required: [
      "title",
      "body"
    ],
    properties: {

      title: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Aviso Importante"
      },

      body: {
        type: "string",
        minLength: 10,
        maxLength: 1000,
        example: "Informamos que o sistema ficará indisponível para manutenção."
      },

      local: {
        type: "string",
        minLength: 3,
        maxLength: 100,
        example: "Bloco A"
      },

      tags: {
        type: "array",
        items: {
          type: "string",
          minLength: 1
        },
        example: ["Aviso", "Manutenção"]
      }
    }
  },


  InfoListResponse: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Info"
        }
      },
      hasMore: {
        type: "boolean",
        example: false
      }
    },
    required: ["data", "hasMore"]
  },


  InfoCreatedResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "info criado com sucesso"
      }
    },
    required: ["message"]
  }

};
