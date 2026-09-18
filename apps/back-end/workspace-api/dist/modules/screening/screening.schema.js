import { z } from "zod";
// ================================
// SCREENING DECISION
// ================================
export const screeningDecisionSchema = z.object({
    decision: z.enum([
        "pass",
        "hold",
        "reject",
    ]),
    note: z
        .string()
        .trim()
        .max(1000, "Screening note cannot exceed 1000 characters.")
        .optional()
});
//# sourceMappingURL=screening.schema.js.map