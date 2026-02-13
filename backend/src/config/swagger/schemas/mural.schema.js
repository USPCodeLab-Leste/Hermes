export const muralSchemas = {
  MuralResponse: {
    type: "object",
    properties: {
      limit: {
        type: "integer",
        example: 10
      },
      offset: {
        type: "integer",
        example: 0
      },
      hasMore: {
        type: "boolean",
        description: "Indica se há mais eventos para carregar",
        example: false
      },
      mural: {
        type: "array",
        items: {
          $ref: "#/components/schemas/EventListResponse"
        }
      }
    }
  }
};
