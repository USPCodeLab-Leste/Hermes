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
            example: "false"
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
  }

};
