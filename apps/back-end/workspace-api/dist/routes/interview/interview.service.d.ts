import type { CreateInterviewInput } from "./interview.schema.js";
export declare function getApplicationInterview(applicationId: number): Promise<{
    id: number;
    applicationId: number;
    interviewType: string;
    scheduledAt: Date;
    location: string | null;
    notes: string | null;
    status: string;
    interviewerId: number | null;
    interviewerFirstName: string | null;
    interviewerLastName: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare function createInterview(applicationId: number, input: CreateInterviewInput): Promise<{
    id: number;
    applicationId: number;
    interviewType: string;
    scheduledAt: Date;
    location: string | null;
    notes: string | null;
    status: string;
    interviewerId: number | null;
    createdAt: Date;
    updatedAt: Date;
    interviewerFirstName: string | null;
    interviewerLastName: string | null;
}>;
export declare function updateInterviewStatus(interviewId: number, status: "completed" | "cancelled" | "no_show"): Promise<{
    id: number;
    applicationId: number;
    interviewType: string;
    scheduledAt: Date;
    location: string | null;
    notes: string | null;
    status: string;
    interviewerId: number | null;
    createdAt: Date;
    updatedAt: Date;
    interviewerFirstName: string | null;
    interviewerLastName: string | null;
    applicationStatus: string | undefined;
}>;
//# sourceMappingURL=interview.service.d.ts.map