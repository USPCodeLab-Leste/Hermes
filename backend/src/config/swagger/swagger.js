import swaggerJSDoc from "swagger-jsdoc";
import { authSchemas } from "./schemas/auth.schema.js";
import { userSchemas } from "./schemas/user.schema.js";
import { eventSchemas } from "./schemas/events.schema.js";
import { muralSchemas } from "./schemas/mural.schema.js";
import { tagSchemas } from "./schemas/tag.schema.js";
import { infoSchemas  } from "./schemas/infos.schema.js";

const urlBack = process.env.BASE_URL;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Hermes API",
      version: "1.0.0",
      description: "O Hermes é a API oficial do mural digital de eventos, centralizando a comunicação entre entidades estudantis e alunos.<br><br> \
                    Para garantir a segurança e a confiabilidade das informações, todas as rotas são protegidas: apenas usuários autenticados com e-mail verificado podem acessar os recursos da API.<br> \
                    A plataforma permite criar, consultar e gerenciar eventos de forma organizada, filtrada por interesses e com controle de permissões, oferecendo uma experiência segura e eficiente."
    },
    servers: [
      {
        url: urlBack
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token"
        }
      },
      schemas: {
        ...authSchemas,
        ...userSchemas,
        ...muralSchemas,
        ...tagSchemas,
        ...eventSchemas,
        ...infoSchemas
      }
    }
  },
  apis: ["./src/routes/*.js"]
});

export default swaggerSpec;
