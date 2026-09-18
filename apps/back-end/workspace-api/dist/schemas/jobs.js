import { z } from "zod";
export const createJobSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Job title must be at least 3 characters.")
        .max(255, "Job title cannot exceed 255 characters."),
    employer: z
        .string()
        .trim()
        .min(2, "Employer must be at least 2 characters.")
        .max(255, "Employer cannot exceed 255 characters."),
    department: z
        .string()
        .trim()
        .min(2, "Department must be at least 2 characters.")
        .max(100, "Department cannot exceed 100 characters."),
    location: z
        .string()
        .trim()
        .min(2, "Location must be at least 2 characters.")
        .max(100, "Location cannot exceed 100 characters."),
    employmentType: z.enum([
        "full-time",
        "part-time",
        "contract",
        "internship",
    ], {
        message: "Please select a valid employment type.",
    }),
    workingTime: z
        .string()
        .trim()
        .min(2, "Working time is required.")
        .max(100, "Working time cannot exceed 100 characters."),
    experience: z
        .string()
        .trim()
        .min(1, "Experience is required.")
        .max(100, "Experience cannot exceed 100 characters."),
    educationalQualification: z
        .string()
        .trim()
        .min(2, "Educational qualification is required.")
        .max(255, "Educational qualification cannot exceed 255 characters."),
    openingDate: z
        .string()
        .trim()
        .min(1, "Opening date is required."),
    closingDate: z
        .string()
        .trim()
        .min(1, "Closing date is required."),
    salary: z
        .string()
        .trim()
        .min(1, "Salary is required.")
        .max(100, "Salary cannot exceed 100 characters."),
    priority: z.enum([
        "low",
        "medium",
        "high",
    ], {
        message: "Please select a valid priority.",
    }),
    description: z
        .string()
        .trim()
        .min(20, "Job description must be at least 20 characters.")
        .max(10000, "Job description cannot exceed 10,000 characters."),
    status: z
        .enum([
        "active",
        "inactive",
    ])
        .default("active"),
});
//# sourceMappingURL=jobs.js.map