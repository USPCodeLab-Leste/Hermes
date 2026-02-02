export const userSchemas = {
  UserResponse: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000"
      },
      name: {
        type: "string",
        example: "Usuario"
      },
      email: {
        type: "string",
        format: "email",
        example: "usuario@usp.br"
      },
      role: {
        type: "string",
        example: "USER"
      }
    }
  },

  UpdateUserRequest: {
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
        example: "Novo Nome"
      }
    }
  },

  UpdateUserResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Usuário atualizado com sucesso"
      },
      user: {
        $ref: "#/components/schemas/UserResponse"
      }
    }
  }
};
