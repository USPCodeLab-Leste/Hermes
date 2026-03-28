export const muralSchemas = {
  MuralResponse: {
    type: "object",
    properties: {
      hasMore: { type: "boolean", description: "Indica se há mais eventos para carregar", example: false },
      mural: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "0b4378ec-b15e-4278-a043-a3afdfc526f3" },
            title: { type: "string", example: "Workshop de Node.js" },
            body: { type: "string", example: "Evento sobre boas práticas em Node.js" },
            local: { type: "string", example: "Auditório Central" },
            data_inicio: { type: "string", format: "date-time", example: "2026-03-10T18:00:00Z" },
            data_fim: { type: "string", format: "date-time", example: "2026-03-10T21:00:00Z" },
            img_banner: { type: "string", format: "uri", example: "https://meusite.com/banner.png" },
            status: { type: "string", example: "published" },
            autor_id: { type: "string", format: "uuid", example: "05af4352-6833-45f3-a9c8-4f4b8c1fec32" },
            created_at: { type: "string", format: "date-time", example: "2026-02-13T01:17:40.274Z" },
            autor_nome: { type: "string", example: "Hermes" },
            tags: { 
              type: "array",
              items: {
                $ref: "#/components/schemas/TagBase"
              }
            }
          },
          required: ["id", "title", "local", "data_inicio", "data_fim", "autor_nome", "tags"]
        }
      }
    },
    required: ["hasMore", "mural"]
  }
};
