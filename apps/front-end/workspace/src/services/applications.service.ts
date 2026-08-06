import type {
  ApplicationResponse,
  ApplicationsResponse,
  ApplicationStatus,
} from "@/types/applications";

const API_URL = "http://localhost:3000";

export type CreateApplicationData = {
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  resumeName: string;
};

export type ApplicationStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export async function createApplication(
  data: CreateApplicationData,
): Promise<ApplicationResponse> {
  const response = await fetch(
    `${API_URL}/applications`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    let message =
      "Failed to submit application.";

    try {
      const errorData =
        await response.json();

      if (
        errorData &&
        typeof errorData.message ===
          "string"
      ) {
        message =
          errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getAllApplications(): Promise<
  ApplicationsResponse
> {
  const response = await fetch(
    `${API_URL}/applications`,
  );

  if (!response.ok) {
    let message =
      "Failed to load applications.";

    try {
      const errorData =
        await response.json();

      if (
        errorData &&
        typeof errorData.message ===
          "string"
      ) {
        message =
          errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getApplicationById(
  applicationId: number,
): Promise<ApplicationResponse> {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
  );

  if (!response.ok) {
    let message =
      "Failed to fetch application.";

    try {
      const errorData =
        await response.json();

      if (
        errorData &&
        typeof errorData.message ===
          "string"
      ) {
        message =
          errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function updateApplicationStatus(
  applicationId: number,
  status: ApplicationStatus,
): Promise<ApplicationResponse> {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
      }),
    },
  );

  if (!response.ok) {
    let message =
      "Failed to update application status.";

    try {
      const errorData =
        await response.json();

      if (
        errorData &&
        typeof errorData.message ===
          "string"
      ) {
        message =
          errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getApplicationStats(): Promise<{
  data: ApplicationStats;
}> {
  const response = await fetch(
    `${API_URL}/applications/stats`,
  );

  if (!response.ok) {
    let message =
      "Failed to load application statistics.";

    try {
      const errorData =
        await response.json();

      if (
        errorData &&
        typeof errorData.message ===
          "string"
      ) {
        message =
          errorData.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}