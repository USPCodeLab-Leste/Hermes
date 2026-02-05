import swaggerJSDoc from "swagger-jsdoc";
import { authSchemas } from "./schemas/auth.schema.js";
import { userSchemas } from "./schemas/user.schema.js";
import { eventSchemas } from "./schemas/events.schema.js";
import { muralSchemas } from "./schemas/mural.schema.js";

const PORT = process.env.PORT || 3000;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Hermes API",
      version: "1.0.0",
      description: "Documentação da API do Hermes"
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
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
        ...eventSchemas,
        ...muralSchemas
      }
    }
  },
  apis: ["./src/routes/*.js"]
});

export default swaggerSpec;
