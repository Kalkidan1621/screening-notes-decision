import { z } from "zod";
export declare const createApplicationSchema: z.ZodObject<{
    jobId: z.ZodNumber;
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    resume: z.ZodType<File, z.ZodTypeDef, File>;
}, "strip", z.ZodTypeAny, {
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    resume: File;
}, {
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    resume: File;
}>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
//# sourceMappingURL=applications.d.ts.map