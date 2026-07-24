import type { ScreeningDecisionResponse } from "../types/screening";

const API_URL = "http://localhost:3000";

export async function getScreeningDecision(stageId: string):Promise<ScreeningDecisionResponse> {
  const response = await fetch(
    `${API_URL}/hiring/application/screening/${stageId}/decision`
  );

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
}


export async function saveScreeningDecision(
  stageId: string,
  data: {
    decision: "pass" | "hold" | "reject";
    note: string;
  }
): Promise<ScreeningDecisionResponse> {

  const response = await fetch(
    `${API_URL}/hiring/application/screening/${stageId}/decision`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
}