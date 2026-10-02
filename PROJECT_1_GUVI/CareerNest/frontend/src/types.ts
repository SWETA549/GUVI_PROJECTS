export type Role = "JOB_SEEKER" | "EMPLOYER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface AuthResponse extends User {
  token: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline?: string;
  employerId: string;
  employerName: string;
}

export type ApplicationStatus = "APPLIED" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  employerId: string;
  status: ApplicationStatus;
  appliedAt: string;
}
