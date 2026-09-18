import type { HiringDecisionInput } from "./hiring-decision.schema.js";
export declare function getHiringDecision(applicationId: number): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
} | null>;
export declare function saveHiringDecision(applicationId: number, data: HiringDecisionInput): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
} | undefined>;
export declare function moveApplicationToHiringDecision(applicationId: number): Promise<{
    id: number;
    candidateId: number | null;
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    resumeName: string;
    resumeUrl: string | null;
    resumePath: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
} | undefined>;
export declare function markApplicationAsHired(applicationId: number): Promise<{
    id: number;
    candidateId: number | null;
    jobId: number;
    fullName: string;
    email: string;
    phone: string;
    resumeName: string;
    resumeUrl: string | null;
    resumePath: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
} | undefined>;
//# sourceMappingURL=hiring-decision.service.d.ts.map