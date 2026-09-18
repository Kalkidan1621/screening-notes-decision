import { z } from "zod";
export declare const screeningDecisionSchema: z.ZodObject<{
    decision: z.ZodEnum<["pass", "hold", "reject"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    decision: "hold" | "pass" | "reject";
    note?: string | undefined;
}, {
    decision: "hold" | "pass" | "reject";
    note?: string | undefined;
}>;
export type ScreeningDecisionInput = z.infer<typeof screeningDecisionSchema>;
//# sourceMappingURL=screening.schema.d.ts.map