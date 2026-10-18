
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/+$/, "").replace(/\/api$/, "");

const EMPLOYERS_URL = `${API_URL}/api/employers`;

export type Employer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type EmployerResponse = {
  success: boolean;
  message?: string;
  data: Employer;
};

type EmployersResponse = {
  success: boolean;
  message?: string;
  data: Employer[];
};

export type CreateEmployerInput = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
};

export type UpdateEmployerInput = Partial<CreateEmployerInput>;

async function readResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed with status ${response.status}.`,
      );
    }

    return data as T;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      text || `Request failed with status ${response.status}.`,
    );
  }

  throw new Error(
    "The server returned a non-JSON response. Check the API endpoint.",
  );
}

export async function getAllEmployers(): Promise<EmployersResponse> {
  const response = await fetch(EMPLOYERS_URL, {
    method: "GET",
    credentials: "include",
  });

  return readResponse<EmployersResponse>(response);
}

export async function getEmployerById(
  id: number,
): Promise<EmployerResponse> {
  const response = await fetch(`${EMPLOYERS_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return readResponse<EmployerResponse>(response);
}

export async function createEmployer(
  input: CreateEmployerInput,
): Promise<EmployerResponse> {
  const response = await fetch(EMPLOYERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return readResponse<EmployerResponse>(response);
}

export async function updateEmployer(
  id: number,
  input: UpdateEmployerInput,
): Promise<EmployerResponse> {
  const response = await fetch(`${EMPLOYERS_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  return readResponse<EmployerResponse>(response);
}

export async function deleteEmployer(
  id: number,
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`${EMPLOYERS_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return readResponse<{ success: boolean; message?: string }>(
    response,
  );
}
