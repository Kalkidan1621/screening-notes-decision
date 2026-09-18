import { z } from "zod";
export const createInterviewSchema = z.object({
    interviewType: z
        .string()
        .trim()
        .min(2, "Interview type is required.")
        .max(50),
    // Frontend must send a valid ISO datetime with timezone
    scheduledAt: z
        .string()
        .datetime({
        offset: true,
    }),
    location: z
        .string()
        .trim()
        .max(255)
        .optional(),
    interviewerId: z
        .number()
        .int()
        .positive()
        .optional(),
    notes: z
        .string()
        .trim()
        .max(2000)
        .optional(),
});
export const updateInterviewStatusSchema = z.object({
    status: z.enum([
        "completed",
        "cancelled",
        "no_show",
    ]),
});
//# sourceMappingURL=interview.schema.js.map