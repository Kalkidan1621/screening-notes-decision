import { z } from "zod";
export declare const createInterviewSchema: z.ZodObject<{
    interviewType: z.ZodString;
    scheduledAt: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    interviewerId: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    interviewType: string;
    scheduledAt: string;
    location?: string | undefined;
    interviewerId?: number | undefined;
    notes?: string | undefined;
}, {
    interviewType: string;
    scheduledAt: string;
    location?: string | undefined;
    interviewerId?: number | undefined;
    notes?: string | undefined;
}>;
export declare const updateInterviewStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["completed", "cancelled", "no_show"]>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "no_show";
}, {
    status: "cancelled" | "completed" | "no_show";
}>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewStatusInput = z.infer<typeof updateInterviewStatusSchema>;
//# sourceMappingURL=interview.schema.d.ts.map