export const userSchemas = {
  UserResponse: {
    type: "object",
    properties: {
      user: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
          },
          name: {
            type: "string",
            example: "Hermes"
          },
          email: {
            type: "string",
            format: "email",
            pattern: ".*@usp\\.br$",
            example: "hermes@usp.br"
          },
          role: {
            type: "string",
            example: "USER"
          },
          is_verified: {
            type: "boolean",
            example: false
          },
          userTags: {
            type: "array",
            items: {
              $ref: "#/components/schemas/TagBase"
            }
          }
        },
        required: ["id", "name", "email", "role"]
      }
    },
    required: ["user"]
  },


  UpdateUserRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        example: "Mercúrio"
      }
    }
  },

  UpdateUserResponse: {
    allOf: [
      {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Usuário atualizado com sucesso"
          }
        },
        required: ["message"]
      },
      {
        $ref: "#/components/schemas/UserResponse"
      }
    ]
  },

  FollowTagRequest: {
    type: "object",
    required: ["tagId"],
    properties: {
      tagId: {
        type: "string",
        format: "uuid",
        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  },

  FollowTagResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Tag seguida com sucesso"
      },
      tagId: {
        type: "string",
        format: "uuid",
        example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    },
    required: ["message", "tagId"]
  },

  UnfollowTagResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Tag removida das favoritas com sucesso"
      }
    },
    required: ["message"]
  }

};
