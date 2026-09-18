import { z } from "zod";
export const hiringDecisionSchema = z.object({
    decision: z.enum(["approve", "hold", "reject"]),
    note: z
        .string()
        .trim()
        .max(2000, "Note must not exceed 2000 characters.")
        .optional(),
});
//# sourceMappingURL=hiring-decision.schema.js.map