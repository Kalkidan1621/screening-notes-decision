export type ScreeningDecision = "pass" | "hold" | "reject";

export interface ScreeningDecisionResponse {
  data: {
    decision: ScreeningDecision;
    note: string;
    updatedAt: string;
  } | null;
}