import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nome precisa de ao menos 3 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .refine(email => email.endsWith("@usp.br"), {
      message: "Email precisa terminar com @usp.br"
    }),
  password: z.string().min(8, "Password precisa de ao menos 8 caracteres")
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z
    .string()
    .email()
    .refine(email => email.endsWith("@usp.br"), {
      message: "Email precisa terminar com @usp.br"
    })
    .optional()
});
