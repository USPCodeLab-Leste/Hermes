export const authSchemas = {
  AuthRegisterRequest: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        minLength: 3,
        example: "Hermes"
      },
      email: {
        type: "string",
        format: "email",
        pattern: ".*@usp\\.br$",
        example: "hermes@usp.br",
        description: "O email deve terminar com @usp.br"
      },
      password: {
        type: "string",
        minLength: 8,
        example: "12345678",
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
        pattern: ".*@usp\\.br$",
        example: "hermes@usp.br",
        description: "O email deve terminar com @usp.br"
      },
      password: {
        type: "string",
        minLength: 8,
        example: "12345678",
      }
    }
  },

  AuthLoginResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        example: "Login realizado com sucesso"
      }
    }
  },

};
