import { z } from "zod";

export const createApplicationSchema = z.object({
  jobId: z
    .number()
    .int("Job ID must be a whole number.")
    .positive("Job ID must be greater than zero."),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(255, "Full name cannot exceed 255 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email cannot exceed 255 characters."),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters.")
    .max(50, "Phone number cannot exceed 50 characters."),

  resumeName: z
    .string()
    .trim()
    .min(1, "Please upload your resume.")
    .max(255, "Resume file name cannot exceed 255 characters."),
});

export type CreateApplicationInput = z.infer<
  typeof createApplicationSchema
>;