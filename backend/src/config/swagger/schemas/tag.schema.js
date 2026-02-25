export const tagSchemas = {

  TagBase: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      name: {
        type: "string"
      },
      type: {
        type: "string"
      }
    },
    required: ["id", "name", "type"]
  },

  TagResponse: {
    allOf: [
      { $ref: "#/components/schemas/TagBase" },
      {
        type: "object",
        properties: {
          active: {
            type: "boolean",
            example: true
          }
        }
      }
    ]
  },

  CreateTagRequest: {
    type: "object",
    required: ["name", "type"],
    properties: {
      name: {
        type: "string",
        example: "Poker"
      },
      type: {
        type: "string",
        example: "Esportes"
      }
    }
  }

};
