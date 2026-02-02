export const authSchemas = {
  AuthRegisterRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        example: "Usuario"
      },
      email: {
        type: "string",
        format: "email",
        example: "usuario@usp.br"
      },
      password: {
        type: "string",
        minLength: 8,
        example: "12345678"
      }
    }
  },

  AuthRegisterResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Usuário criado"
      },
      userId: {
        type: "string",
        format: "uuid",
        example: "550e8400-e29b-41d4-a716-446655440000"
      }
    }
  },

  AuthLoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        example: "usuario@usp.br"
      },
      password: {
        type: "string",
        example: "12345678"
      }
    }
  },

  DefaultMessageResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Login realizado com sucesso"
      }
    }
  }
};
