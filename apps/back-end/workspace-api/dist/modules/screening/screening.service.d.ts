export type ScreeningDecision = "pass" | "hold" | "reject";
export declare function getScreeningDecision(applicationId: number): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
    applicationStatus: string;
} | null>;
export declare function saveScreeningDecision(applicationId: number, decision: ScreeningDecision, note?: string): Promise<{
    id: number;
    applicationId: number;
    decision: string;
    note: string | null;
    updatedAt: Date;
    applicationStatus: string;
}>;
//# sourceMappingURL=screening.service.d.ts.map