const API_URL = "http://localhost:3000";

export type InterviewStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type Interview = {
  id: number;
  applicationId: number;
  interviewType: string;
  scheduledAt: string;
  location: string | null;
  notes: string | null;
  status: InterviewStatus;
  interviewerId: number | null;
  interviewerFirstName: string | null;
  interviewerLastName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateInterviewInput = {
  interviewType: string;
  scheduledAt: string;
  location?: string;
  interviewerId?: number;
  notes?: string;
};

export async function getApplicationInterview(
  applicationId: number,
): Promise<Interview | null> {
  const response = await fetch(
    `${API_URL}/hiring/interviews/application/${applicationId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to load interview.",
    );
  }

  return data.data ?? null;
}

export async function createInterview(
  applicationId: number,
  input: CreateInterviewInput,
): Promise<Interview> {
  const response = await fetch(
    `${API_URL}/hiring/interviews/application/${applicationId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to schedule interview.",
    );
  }

  return data.data as Interview;
}

export async function updateInterviewStatus(
  interviewId: number,
  status:
    | "completed"
    | "cancelled"
    | "no_show",
): Promise<Interview> {
  const response = await fetch(
    `${API_URL}/hiring/interviews/${interviewId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update interview status.",
    );
  }

  return data.data as Interview;
}