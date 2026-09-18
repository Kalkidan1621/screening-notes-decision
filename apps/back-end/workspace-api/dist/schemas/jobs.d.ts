import { z } from "zod";
export declare const createJobSchema: z.ZodObject<{
    title: z.ZodString;
    employer: z.ZodString;
    department: z.ZodString;
    location: z.ZodString;
    employmentType: z.ZodEnum<["full-time", "part-time", "contract", "internship"]>;
    workingTime: z.ZodString;
    experience: z.ZodString;
    educationalQualification: z.ZodString;
    openingDate: z.ZodString;
    closingDate: z.ZodString;
    salary: z.ZodString;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    description: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["active", "inactive"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    employer: string;
    department: string;
    location: string;
    employmentType: "contract" | "full-time" | "internship" | "part-time";
    workingTime: string;
    experience: string;
    educationalQualification: string;
    openingDate: string;
    closingDate: string;
    salary: string;
    priority: "high" | "low" | "medium";
    description: string;
    status: "active" | "inactive";
}, {
    title: string;
    employer: string;
    department: string;
    location: string;
    employmentType: "contract" | "full-time" | "internship" | "part-time";
    workingTime: string;
    experience: string;
    educationalQualification: string;
    openingDate: string;
    closingDate: string;
    salary: string;
    priority: "high" | "low" | "medium";
    description: string;
    status?: "active" | "inactive" | undefined;
}>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
//# sourceMappingURL=jobs.d.ts.map