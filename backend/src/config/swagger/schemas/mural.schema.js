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
      total: {
        type: "integer",
        example: 1
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
