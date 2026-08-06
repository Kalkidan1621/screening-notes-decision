export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export type Application = {
  id: number;
  jobId: number;
  jobTitle: string | null;
  fullName: string;
  email: string;
  phone: string;
  resumeName: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationsResponse = {
  data: Application[];
};

export type ApplicationResponse = {
  message: string;
  data: Application;
};
export type ApplicationStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};