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
    .regex(
      /^\d{10}$/,
      "Phone number must contain exactly 10 digits.",
    ),

  resume: z.custom<File>(
    (value) => {
      return (
        value !== null &&
        typeof value === "object" &&
        "name" in value
      );
    },
    {
      message: "Please upload your resume.",
    },
  ),
});

export type CreateApplicationInput =
  z.infer<typeof createApplicationSchema>;