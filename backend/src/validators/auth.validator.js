import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nome precisa de ao menos 3 caracteres"),
  email: z
    .email("Email inválido")
    .refine(email => email.endsWith("@usp.br"), {
      message: "Email precisa terminar com @usp.br"
    }),
  password: z.string().min(8, "Password precisa de ao menos 8 caracteres")
}).strict();

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z
    .email()
    .refine(email => email.endsWith("@usp.br"), {
      message: "Email precisa terminar com @usp.br"
    })
    .optional()
}).strict();

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Password precisa de ao menos 8 caracteres"),
  newPassword: z.string().min(8, "Password precisa de ao menos 8 caracteres")
}).strict();