import { z } from "zod";
export declare const hiringDecisionSchema: z.ZodObject<{
    decision: z.ZodEnum<["approve", "hold", "reject"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    decision: "approve" | "hold" | "reject";
    note?: string | undefined;
}, {
    decision: "approve" | "hold" | "reject";
    note?: string | undefined;
}>;
export type HiringDecisionInput = z.infer<typeof hiringDecisionSchema>;
//# sourceMappingURL=hiring-decision.schema.d.ts.map