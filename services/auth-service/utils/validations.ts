import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name too short").max(100),
    email: z.string().email("Invalid email format"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must contain lowercase")
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain a number"),
    role: z.enum(['ADMIN', 'AGENT', 'CUSTOMER']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    token: z.string().optional()
  })
});

export const resetPasswordSchema = z.object({
    params: z.object({
      token: z.string().min(1)
    }),
    body: z.object({
      password: z.string().min(8)
    })
});
