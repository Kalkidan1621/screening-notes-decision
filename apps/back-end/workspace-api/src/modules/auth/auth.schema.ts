import { z } from "zod";

// ================================
// REGISTER
// ================================

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(
      2,
      "First name must be at least 2 characters.",
    )
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      "Last name must be at least 2 characters.",
    )
    .max(100),

  email: z
    .string()
    .trim()
    .email(
      "Please provide a valid email address.",
    )
    .max(255),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters.",
    )
    .max(100),
});

export type RegisterInput = z.infer<
  typeof registerSchema
>;

// ================================
// LOGIN
// ================================

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(
      "Please provide a valid email address.",
    )
    .max(255),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters.",
    )
    .max(100),
});

export type LoginInput = z.infer<
  typeof loginSchema
>;

// ================================
// CANDIDATE REGISTER
// ================================

export const candidateRegisterSchema =
  z.object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name must be at least 2 characters.",
      )
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name must be at least 2 characters.",
      )
      .max(100),

    email: z
      .string()
      .trim()
      .email(
        "Please enter a valid email address.",
      )
      .max(255),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters.",
      )
      .max(100),
  });

export type CandidateRegisterInput =
  z.infer<
    typeof candidateRegisterSchema
  >;

// ================================
// ADMIN CREATE USER
// ================================

export const adminCreateUserSchema =
  z.object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "First name must be at least 2 characters.",
      )
      .max(100),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Last name must be at least 2 characters.",
      )
      .max(100),

    email: z
      .string()
      .trim()
      .email(
        "Please provide a valid email address.",
      )
      .max(255),

    password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters.",
      )
      .max(100),

    role: z.enum([
      "ADMIN",
      "RECRUITER",
      "HIRING_MANAGER",
      "CANDIDATE",
    ]),
  });

export type AdminCreateUserInput =
  z.infer<
    typeof adminCreateUserSchema
  >;
  // ================================
// UPDATE PROFILE
// ================================

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255),
});

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;

// ================================
// CHANGE PASSWORD
// ================================

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100),

    confirmPassword: z
      .string()
      .min(8, "Please confirm your new password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;