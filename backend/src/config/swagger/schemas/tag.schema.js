export const tagSchemas = {

  TagResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000"
      },
      name: {
        type: "string",
        example: "Poker"
      },
      type: {
        type: "string",
        example: "Esportes"
      },
      active: {
        type: "boolean",
        example: true
      }
    }
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
