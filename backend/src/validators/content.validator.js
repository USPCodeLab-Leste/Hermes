import { z } from "zod";

const baseContentSchema = {
  title: z
    .string()
    .min(3, "Título precisa ter pelo menos 3 caracteres")
    .max(100),

  body: z
    .string()
    .min(10, "Descrição precisa ter pelo menos 10 caracteres")
    .max(1000),

  tags: z
    .array(
      z.string().min(1, "Tag não pode ser vazia")
    )
    .optional(),
};

export const createInfoSchema = z.object({
  ...baseContentSchema,

  local: z
    .string()
    .min(3, "Local precisa ter pelo menos 3 caracteres")
    .max(100)
    .optional(),

}).strict();

export const createEventSchema = z.object({
  ...baseContentSchema,

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

  img_banner: z
    .url("Link inválido")
    .max(200, "Link muito longo")
    .optional()

}).strict();

// Deixa tudo opcional para o /patch
export const updateInfoSchema = createInfoSchema.partial().strict();
export const updateEventSchema = createEventSchema.partial().strict();
