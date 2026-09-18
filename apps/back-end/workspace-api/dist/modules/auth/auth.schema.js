import { z } from "zod";
// ================================
// REGISTER
// ================================
export const registerSchema = z.object({
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
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100),
});
// ================================
// LOGIN
// ================================
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address.")
        .max(255),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100),
});
// ================================
// CANDIDATE REGISTER
// ================================
export const candidateRegisterSchema = z.object({
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
        .email("Please enter a valid email address.")
        .max(255),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100),
});
// ================================
// ADMIN CREATE USER
// ================================
export const adminCreateUserSchema = z.object({
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
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100),
    role: z.enum([
        "ADMIN",
        "RECRUITER",
        "HIRING_MANAGER",
        "CANDIDATE",
    ]),
});
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
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .transform((value) => value.toLowerCase()),
});
export const resetPasswordSchema = z
    .object({
    token: z
        .string()
        .trim()
        .min(1, "Reset token is required."),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(100, "Password is too long."),
    confirmPassword: z
        .string()
        .min(8, "Please confirm your password."),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});
//# sourceMappingURL=auth.schema.js.map