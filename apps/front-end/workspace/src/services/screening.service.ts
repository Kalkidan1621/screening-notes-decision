import type { ScreeningDecisionResponse } from "../types/screening";

const API_URL = "http://localhost:3000";

async function getErrorMessage(response: Response) {
  try {
    const errorData = await response.json();

    return (
      errorData.message ||
      `Request failed with status ${response.status}`
    );
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function getScreeningDecision(
  stageId: string,
): Promise<ScreeningDecisionResponse> {
  try {
    const response = await fetch(
      `${API_URL}/hiring/application/screening/${stageId}/decision`,
    );

    if (!response.ok) {
      const message = await getErrorMessage(response);

      throw new Error(
        `Failed to load screening decision: ${message}`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to load screening decision.");
  }
}

export async function saveScreeningDecision(
  stageId: string,
  data: {
    decision: "pass" | "hold" | "reject";
    note: string;
  },
): Promise<ScreeningDecisionResponse> {
  try {
    const response = await fetch(
      `${API_URL}/hiring/application/screening/${stageId}/decision`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(response);

      throw new Error(
        `Failed to save screening decision: ${message}`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to save screening decision.");
  }
}