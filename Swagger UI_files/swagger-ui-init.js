
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.3",
    "info": {
      "title": "Hermes API",
      "version": "1.0.0",
      "description": "Documentação da API do Hermes"
    },
    "servers": [
      {
        "url": "http://localhost:3000"
      }
    ],
    "components": {
      "securitySchemes": {
        "cookieAuth": {
          "type": "apiKey",
          "in": "cookie",
          "name": "token"
        }
      },
      "schemas": {
        "AuthRegisterRequest": {
          "type": "object",
          "required": [
            "name",
            "email",
            "password"
          ],
          "properties": {
            "name": {
              "type": "string",
              "minLength": 3,
              "example": "Hermes"
            },
            "email": {
              "type": "string",
              "format": "email",
              "pattern": ".*@usp\\.br$",
              "example": "hermes@usp.br",
              "description": "O email deve terminar com @usp.br"
            },
            "password": {
              "type": "string",
              "minLength": 8,
              "example": "12345678"
            }
          }
        },
        "AuthRegisterResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Usuario criado. Um email de verificação foi enviado"
            },
            "userId": {
              "type": "string",
              "format": "uuid",
              "example": "550e8400-e29b-41d4-a716-446655440000"
            }
          }
        },
        "AuthLoginRequest": {
          "type": "object",
          "required": [
            "email",
            "password"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "pattern": ".*@usp\\.br$",
              "example": "hermes@usp.br",
              "description": "O email deve terminar com @usp.br"
            },
            "password": {
              "type": "string",
              "minLength": 8,
              "example": "12345678"
            }
          }
        },
        "AuthLoginResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Login realizado com sucesso"
            }
          }
        },
        "AuthRefreshResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Token renovado com sucesso"
            }
          }
        },
        "UserResponse": {
          "type": "object",
          "properties": {
            "user": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "format": "uuid",
                  "example": "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
                },
                "name": {
                  "type": "string",
                  "example": "Hermes"
                },
                "email": {
                  "type": "string",
                  "format": "email",
                  "pattern": ".*@usp\\.br$",
                  "example": "hermes@usp.br"
                },
                "role": {
                  "type": "string",
                  "example": "USER"
                },
                "is_verified": {
                  "type": "boolean",
                  "example": "false"
                }
              },
              "required": [
                "id",
                "name",
                "email",
                "role"
              ]
            }
          },
          "required": [
            "user"
          ]
        },
        "UpdateUserRequest": {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "Mercúrio"
            }
          }
        },
        "UpdateUserResponse": {
          "allOf": [
            {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "Usuário atualizado com sucesso"
                }
              },
              "required": [
                "message"
              ]
            },
            {
              "$ref": "#/components/schemas/UserResponse"
            }
          ]
        },
        "FollowTagRequest": {
          "type": "object",
          "required": [
            "tagId"
          ],
          "properties": {
            "tagId": {
              "type": "string",
              "format": "uuid",
              "example": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          }
        },
        "FollowTagResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Tag seguida com sucesso"
            },
            "tagId": {
              "type": "string",
              "format": "uuid",
              "example": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          },
          "required": [
            "message",
            "tagId"
          ]
        },
        "UnfollowTagResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "Tag removida das favoritas com sucesso"
            }
          },
          "required": [
            "message"
          ]
        },
        "MuralResponse": {
          "type": "object",
          "properties": {
            "hasMore": {
              "type": "boolean",
              "description": "Indica se há mais eventos para carregar",
              "example": false
            },
            "mural": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "format": "uuid",
                    "example": "0b4378ec-b15e-4278-a043-a3afdfc526f3"
                  },
                  "title": {
                    "type": "string",
                    "example": "Workshop de Node.js"
                  },
                  "body": {
                    "type": "string",
                    "example": "Evento sobre boas práticas em Node.js"
                  },
                  "local": {
                    "type": "string",
                    "example": "Auditório Central"
                  },
                  "data_inicio": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2026-03-10T18:00:00Z"
                  },
                  "data_fim": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2026-03-10T21:00:00Z"
                  },
                  "img_banner": {
                    "type": "string",
                    "format": "uri",
                    "example": "https://meusite.com/banner.png"
                  },
                  "status": {
                    "type": "string",
                    "example": "published"
                  },
                  "autor_id": {
                    "type": "string",
                    "format": "uuid",
                    "example": "05af4352-6833-45f3-a9c8-4f4b8c1fec32"
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time",
                    "example": "2026-02-13T01:17:40.274Z"
                  },
                  "autor_nome": {
                    "type": "string",
                    "example": "Hermes"
                  },
                  "tags": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "example": [
                      "event",
                      "Hermes",
                      "node"
                    ]
                  }
                },
                "required": [
                  "id",
                  "title",
                  "local",
                  "data_inicio",
                  "data_fim",
                  "autor_nome",
                  "tags"
                ]
              }
            }
          },
          "required": [
            "hasMore",
            "mural"
          ]
        },
        "TagResponse": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "example": "550e8400-e29b-41d4-a716-446655440000"
            },
            "name": {
              "type": "string",
              "example": "Poker"
            },
            "type": {
              "type": "string",
              "example": "Esportes"
            },
            "active": {
              "type": "boolean",
              "example": true
            }
          }
        },
        "CreateTagRequest": {
          "type": "object",
          "required": [
            "name",
            "type"
          ],
          "properties": {
            "name": {
              "type": "string",
              "example": "Poker"
            },
            "type": {
              "type": "string",
              "example": "Esportes"
            }
          }
        },
        "Event": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "example": "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
            },
            "title": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Workshop de Node.js"
            },
            "body": {
              "type": "string",
              "minLength": 10,
              "maxLength": 1000,
              "example": "Evento sobre boas práticas em Node.js"
            },
            "local": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Auditório Central"
            },
            "data_inicio": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T18:00:00Z"
            },
            "data_fim": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T21:00:00Z"
            },
            "img_banner": {
              "type": "string",
              "format": "uri",
              "maxLength": 200,
              "example": "https://meusite.com/banner.png"
            },
            "status": {
              "type": "string",
              "example": "published"
            },
            "autor_id": {
              "type": "string",
              "format": "uuid",
              "example": "43573bd9-62d8-4f33-af55-7c7dfbg652fd4"
            },
            "autor_nome": {
              "type": "string",
              "example": "Hermes"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T11:30:00Z"
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "Node",
                "Backend"
              ]
            }
          },
          "required": [
            "id",
            "title",
            "body",
            "local",
            "data_inicio",
            "data_fim",
            "autor_nome"
          ]
        },
        "CreateEventRequest": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "title",
            "body",
            "data_inicio",
            "data_fim",
            "local"
          ],
          "properties": {
            "title": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Workshop de Node.js"
            },
            "body": {
              "type": "string",
              "minLength": 10,
              "maxLength": 1000,
              "example": "Evento sobre boas práticas em Node.js"
            },
            "local": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Auditório Central"
            },
            "data_inicio": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T18:00:00Z"
            },
            "data_fim": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T21:00:00Z"
            },
            "img_banner": {
              "type": "string",
              "format": "uri",
              "maxLength": 200,
              "example": "https://meusite.com/banner.png"
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "Node",
                "Backend"
              ]
            }
          }
        },
        "EventListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Event"
              }
            },
            "hasMore": {
              "type": "boolean",
              "example": false
            }
          },
          "required": [
            "data",
            "hasMore"
          ]
        },
        "EventCreatedResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "event criado com sucesso"
            }
          },
          "required": [
            "message"
          ]
        },
        "Info": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid",
              "example": "97963bd9-62d8-4f33-af55-7c7c83ad2fd4"
            },
            "title": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Aviso Importante"
            },
            "body": {
              "type": "string",
              "minLength": 10,
              "maxLength": 1000,
              "example": "Informamos que o sistema ficará indisponível para manutenção."
            },
            "local": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Bloco A"
            },
            "status": {
              "type": "string",
              "example": "published"
            },
            "autor_nome": {
              "type": "string",
              "example": "Hermes"
            },
            "autor_id": {
              "type": "string",
              "format": "uuid",
              "example": "43573bd9-62d8-4f33-af55-7c7dfbg652fd4"
            },
            "created_at": {
              "type": "string",
              "format": "date-time",
              "example": "2026-03-10T11:30:00Z"
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "Aviso",
                "Manutenção"
              ]
            }
          },
          "required": [
            "id",
            "title",
            "body",
            "autor_nome"
          ]
        },
        "CreateInfoRequest": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "title",
            "body"
          ],
          "properties": {
            "title": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Aviso Importante"
            },
            "body": {
              "type": "string",
              "minLength": 10,
              "maxLength": 1000,
              "example": "Informamos que o sistema ficará indisponível para manutenção."
            },
            "local": {
              "type": "string",
              "minLength": 3,
              "maxLength": 100,
              "example": "Bloco A"
            },
            "tags": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "example": [
                "Aviso",
                "Manutenção"
              ]
            }
          }
        },
        "InfoListResponse": {
          "type": "object",
          "properties": {
            "data": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Info"
              }
            },
            "hasMore": {
              "type": "boolean",
              "example": false
            }
          },
          "required": [
            "data",
            "hasMore"
          ]
        },
        "InfoCreatedResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "example": "info criado com sucesso"
            }
          },
          "required": [
            "message"
          ]
        }
      }
    },
    "paths": {
      "/auth/register": {
        "post": {
          "summary": "Registro de usuário",
          "description": "Cria um novo usuário com email ainda não confirmado.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthRegisterRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Usuário criado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AuthRegisterResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos"
            },
            "409": {
              "description": "Email já está em uso"
            },
            "500": {
              "description": "Falha ao criar usuario"
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "summary": "Login do usuário",
          "description": "Autentica o usuário e cria um cookie HttpOnly com JWT.",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthLoginRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Login realizado com sucesso",
              "headers": {
                "Set-Cookie": {
                  "description": "Cookie HttpOnly com o token JWT",
                  "schema": {
                    "type": "string"
                  }
                }
              },
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AuthLoginResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos ou falha no login"
            },
            "401": {
              "description": "Credenciais inválidas"
            }
          }
        }
      },
      "/auth/refresh": {
        "get": {
          "summary": "Renovar token JWT",
          "description": "Valida o refresh token enviado via cookie HttpOnly e gera um novo access token. O novo token é retornado em cookie HttpOnly.\n",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "refreshCookie": []
            }
          ],
          "responses": {
            "200": {
              "description": "Token renovado com sucesso",
              "headers": {
                "Set-Cookie": {
                  "description": "Novo cookie HttpOnly com o **access token**",
                  "schema": {
                    "type": "string"
                  }
                }
              },
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AuthRefreshResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Refresh token não fornecido"
            },
            "403": {
              "description": "Refresh token inválido ou expirado"
            },
            "500": {
              "description": "Erro interno ao renovar token"
            }
          }
        }
      },
      "/auth/verify-email": {
        "get": {
          "summary": "Verificar e-mail do usuário",
          "description": "Valida o token de verificação enviado via query string e marca o e-mail do usuário como verificado. O token é gerado no momento do registro e enviado por e-mail ao usuário.\n",
          "tags": [
            "Auth"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "token",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Token de verificação enviado por e-mail"
            }
          ],
          "responses": {
            "200": {
              "description": "E-mail verificado com sucesso",
              "content": {
                "application/json": {
                  "example": {
                    "message": "Email verificado com sucesso"
                  }
                }
              }
            },
            "400": {
              "description": "Token não fornecido, inválido ou usuário não encontrado"
            },
            "500": {
              "description": "Erro interno do servidor"
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "summary": "Logout",
          "description": "Invalida o token JWT do utilizador autenticado.",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Logout realizado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Logout realizado com sucesso"
                      }
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Não autorizado (token inválido ou ausente)"
            },
            "500": {
              "description": "Erro interno do servidor"
            }
          }
        }
      },
      "/auth/change-password": {
        "patch": {
          "summary": "Alterar senha do utilizador autenticado",
          "description": "Permite que o utilizador autenticado altere a sua senha informando a senha atual.",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "oldPassword",
                    "newPassword"
                  ],
                  "properties": {
                    "oldPassword": {
                      "type": "string",
                      "example": 12345678
                    },
                    "newPassword": {
                      "type": "string",
                      "example": "NovaSenhaForte123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Senha alterada com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Senha alterada com sucesso"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos"
            },
            "401": {
              "description": "Não autorizado ou senha antiga incorreta"
            },
            "404": {
              "description": "Utilizador não encontrado"
            },
            "500": {
              "description": "Erro interno do servidor"
            }
          }
        }
      },
      "/events": {
        "get": {
          "summary": "Lista eventos",
          "description": "Retorna eventos com paginação e filtro opcional por título e/ou tags",
          "tags": [
            "Events"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "title",
              "schema": {
                "type": "string"
              },
              "description": "Filtra eventos pelo título"
            },
            {
              "in": "query",
              "name": "tag",
              "schema": {
                "type": "array"
              },
              "description": "Filtra eventos por uma ou mais tags.\n"
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "example": 10,
                "maximum": 20
              },
              "description": "Quantidade máxima de resultados (máx 20)"
            },
            {
              "in": "query",
              "name": "offset",
              "schema": {
                "type": "integer",
                "example": 0
              },
              "description": "Offset da paginação"
            }
          ],
          "responses": {
            "200": {
              "description": "Lista de eventos",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/EventListResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Falha na busca de eventos"
            },
            "404": {
              "description": "Eventos não encontrados"
            }
          }
        },
        "post": {
          "summary": "Cria um novo evento",
          "description": "Cria um evento (rota restrita a administradores)",
          "tags": [
            "Events"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateEventRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Evento criado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/EventCreatedResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Acesso restrito a administradores"
            },
            "500": {
              "description": "Falha na criação do evento"
            }
          }
        }
      },
      "/events/{id}": {
        "get": {
          "tags": [
            "Events"
          ],
          "summary": "Buscar evento por ID",
          "description": "Retorna um evento específico pelo ID",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID do evento",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Evento encontrado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Event"
                  }
                }
              }
            },
            "404": {
              "description": "Evento não encontrado"
            }
          }
        },
        "patch": {
          "tags": [
            "Events"
          ],
          "summary": "Atualizar evento",
          "description": "Atualiza parcialmente um evento existente (apenas autor ou admin)",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID do evento",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateEventRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Evento atualizado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Event"
                  }
                }
              }
            },
            "400": {
              "description": "Erro na atualização"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Sem permissão"
            }
          }
        },
        "delete": {
          "tags": [
            "Events"
          ],
          "summary": "Deletar evento",
          "description": "Remove um evento existente (apenas autor ou admin)",
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID do evento",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Evento deletado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Evento deletado com sucesso"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Erro ao deletar evento"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Sem permissão"
            }
          }
        }
      },
      "/infos": {
        "get": {
          "summary": "Lista infos",
          "description": "Retorna avisos e comunicados",
          "tags": [
            "Infos"
          ],
          "parameters": [
            {
              "in": "query",
              "name": "title",
              "schema": {
                "type": "string"
              }
            },
            {
              "in": "query",
              "name": "tags",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "style": "form",
              "explode": true
            },
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "maximum": 20,
                "example": 10
              }
            },
            {
              "in": "query",
              "name": "offset",
              "schema": {
                "type": "integer",
                "example": 0
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Lista de infos",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/InfoListResponse"
                  }
                }
              }
            }
          }
        },
        "post": {
          "summary": "Cria uma nova info",
          "description": "Rota restrita a administradores",
          "tags": [
            "Infos"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateInfoRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Info criada com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/InfoCreatedResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Acesso restrito a administradores"
            },
            "500": {
              "description": "Falha na criação da info"
            }
          }
        }
      },
      "/infos/{id}": {
        "get": {
          "summary": "Buscar info por ID",
          "description": "Retorna uma info específica pelo ID",
          "tags": [
            "Infos"
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID da info",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Info encontrada com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Info"
                  }
                }
              }
            },
            "404": {
              "description": "Info não encontrada"
            }
          }
        },
        "patch": {
          "summary": "Atualizar info",
          "description": "Atualiza parcialmente uma info existente (apenas admin)",
          "tags": [
            "Infos"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID da info",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateInfoRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Info atualizada com sucesso"
            },
            "400": {
              "description": "Erro na atualização"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Sem permissão"
            }
          }
        },
        "delete": {
          "summary": "Deletar info",
          "description": "Remove uma info existente (apenas admin)",
          "tags": [
            "Infos"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "description": "ID da info",
              "schema": {
                "type": "string",
                "format": "uuid"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Info deletada com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "info deletado com sucesso"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Erro ao deletar info"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Sem permissão"
            }
          }
        }
      },
      "/mural": {
        "get": {
          "summary": "Retorna o mural personalizado do usuário",
          "description": "Retorna eventos filtrados pelas tags do usuário autenticado, com suporte a paginação via limit e offset.",
          "tags": [
            "Mural"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "parameters": [
            {
              "in": "query",
              "name": "limit",
              "schema": {
                "type": "integer",
                "minimum": 1,
                "maximum": 20,
                "default": 10
              },
              "description": "Quantidade de eventos retornados"
            },
            {
              "in": "query",
              "name": "offset",
              "schema": {
                "type": "integer",
                "minimum": 0,
                "default": 0
              },
              "description": "Offset da paginação"
            }
          ],
          "responses": {
            "200": {
              "description": "Mural retornado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MuralResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Usuário não autenticado"
            },
            "404": {
              "description": "Usuário não encontrado"
            },
            "500": {
              "description": "Erro interno do servidor"
            }
          }
        }
      },
      "/tags": {
        "get": {
          "summary": "Listar todas as tags ativas",
          "description": "Retorna todas as tags ativas cadastradas no sistema",
          "tags": [
            "Tags"
          ],
          "responses": {
            "200": {
              "description": "Lista de tags",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "tags": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/TagResponse"
                        }
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Nenhuma tag encontrada"
            },
            "500": {
              "description": "Erro interno"
            }
          }
        },
        "post": {
          "summary": "Criar uma nova tag",
          "description": "Cria uma nova tag (apenas administradores)",
          "tags": [
            "Tags"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTagRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Tag criada com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "message": {
                        "type": "string",
                        "example": "Tag criada com sucesso"
                      },
                      "tag": {
                        "$ref": "#/components/schemas/TagResponse"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Dados inválidos"
            },
            "401": {
              "description": "Não autenticado"
            },
            "403": {
              "description": "Acesso restrito a administradores"
            },
            "409": {
              "description": "Tag já existe"
            },
            "500": {
              "description": "Erro interno"
            }
          }
        }
      },
      "/tags/{name}": {
        "get": {
          "summary": "Buscar tag pelo nome",
          "description": "Retorna uma tag específica pelo nome (case insensitive)",
          "tags": [
            "Tags"
          ],
          "parameters": [
            {
              "in": "path",
              "name": "name",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Nome da tag"
            }
          ],
          "responses": {
            "200": {
              "description": "Tag encontrada",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "tag": {
                        "$ref": "#/components/schemas/TagResponse"
                      }
                    }
                  }
                }
              }
            },
            "404": {
              "description": "Tag não encontrada"
            },
            "500": {
              "description": "Erro interno"
            }
          }
        }
      },
      "/users/me": {
        "get": {
          "summary": "Retorna os dados do usuário autenticado",
          "description": "Retorna as informações do usuário baseado no JWT armazenado em cookie HttpOnly",
          "tags": [
            "User"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Dados do usuário autenticado",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Erro ao pegar informações do usuario"
            },
            "401": {
              "description": "Usuário não autenticado"
            }
          }
        },
        "patch": {
          "summary": "Atualiza os dados do usuário autenticado",
          "description": "Atualiza parcialmente os dados do usuário autenticado (atualmente apenas o nome)",
          "tags": [
            "User"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Usuário atualizado com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UpdateUserResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Erro ao atualizar informações do usuario"
            },
            "401": {
              "description": "Usuário não autenticado"
            }
          }
        }
      },
      "/users/me/tags": {
        "post": {
          "summary": "Seguir uma tag",
          "description": "Permite que o usuário autenticado siga uma tag específica.",
          "tags": [
            "User"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FollowTagRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Tag seguida com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/FollowTagResponse"
                  }
                }
              }
            },
            "400": {
              "description": "tagId é obrigatório"
            },
            "401": {
              "description": "Usuário não autenticado"
            },
            "500": {
              "description": "Erro ao seguir tag"
            }
          }
        }
      },
      "/users/me/tags/{tagId}": {
        "delete": {
          "summary": "Deixar de seguir uma tag",
          "description": "Remove uma tag da lista de favoritas do usuário autenticado.",
          "tags": [
            "User"
          ],
          "security": [
            {
              "cookieAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "tagId",
              "required": true,
              "schema": {
                "type": "string",
                "format": "uuid"
              },
              "description": "ID da tag a ser removida"
            }
          ],
          "responses": {
            "200": {
              "description": "Tag removida com sucesso",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UnfollowTagResponse"
                  }
                }
              }
            },
            "400": {
              "description": "tagId é obrigatório"
            },
            "401": {
              "description": "Usuário não autenticado"
            },
            "500": {
              "description": "Erro ao remover tag"
            }
          }
        }
      }
    },
    "tags": []
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
