import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Título precisa ter pelo menos 3 caracteres")
    .max(100),

  //autor_id: z.
   // uuid("autor_id precisa ser um UUID válido"),

  data_inicio: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      { message: "Data de início inválida" }
    ),

  data_fim: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      { message: "Data de término inválida" }
    ),

  local: z
    .string()
    .min(3, "Local precisa ter pelo menos 3 caracteres")
    .max(100),

  body: z
    .string()
    .min(10, "Descrição precisa ter pelo menos 10 caracteres")
    .max(1000)
    .optional(),

  tags: z
    .array(
      z.string().min(1, "Tag não pode ser vazia")
    )
    .min(1, "Evento precisa ter pelo menos uma tag")
    .optional(),

  img_banner: z
    .url("Link inválido")
    .max(200, "Link muito longo")
    .optional()

}).strict();
