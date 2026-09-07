import { z } from "zod";

export const createEmployerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Employer name must be at least 2 characters.")
    .max(255, "Employer name must not exceed 255 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email must not exceed 255 characters."),

  phone: z
    .string()
    .trim()
    .max(50, "Phone number must not exceed 50 characters.")
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(255, "Address must not exceed 255 characters.")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .max(5000, "Description must not exceed 5000 characters.")
    .optional()
    .or(z.literal("")),

  logoUrl: z
    .string()
    .trim()
    .url("Logo URL must be a valid URL.")
    .max(2000, "Logo URL is too long.")
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().optional(),
});

export const updateEmployerSchema = createEmployerSchema.partial();

export const employerIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive("Employer ID must be a positive integer."),
});

export type CreateEmployerInput = z.infer<
  typeof createEmployerSchema
>;

export type UpdateEmployerInput = z.infer<
  typeof updateEmployerSchema
>;