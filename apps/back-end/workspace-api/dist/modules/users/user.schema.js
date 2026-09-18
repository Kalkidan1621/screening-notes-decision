import { z } from "zod";
export const createUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters.")
        .max(100, "First name must not exceed 100 characters."),
    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters.")
        .max(100, "Last name must not exceed 100 characters."),
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(255),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100),
    roleId: z
        .number()
        .int()
        .positive("Invalid role."),
});
export const updateUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    lastName: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .optional(),
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address.")
        .max(255)
        .optional(),
    roleId: z
        .number()
        .int()
        .positive()
        .optional(),
});
export const updateUserStatusSchema = z.object({
    isActive: z.boolean(),
});
export const changeUserRoleSchema = z.object({
    roleId: z
        .number()
        .int()
        .positive("Invalid role."),
});
//# sourceMappingURL=user.schema.js.map