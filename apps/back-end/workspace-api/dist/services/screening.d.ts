export declare function getScreeningDecision(applicationId: number): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
} | null>;
export declare function saveScreeningDecision(applicationId: number, decision: "pass" | "hold" | "reject", note?: string): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
} | undefined>;
//# sourceMappingURL=screening.d.ts.map