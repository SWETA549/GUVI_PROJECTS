import type { AuthResponse, Job, JobApplication } from "./types";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("careernest_token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data as T;
}

export const api = {
  register: (body: object) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: object) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  jobs: (keyword = "", location = "") => {
    const q = new URLSearchParams();
    if (keyword) q.set("keyword", keyword);
    if (location) q.set("location", location);
    return request<Job[]>(`/jobs${q.toString() ? `?${q}` : ""}`);
  },
  job: (id: string) => request<Job>(`/jobs/${id}`),
  createJob: (body: object) => request<Job>("/jobs", { method: "POST", body: JSON.stringify(body) }),
  updateJob: (id: string, body: object) => request<Job>(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteJob: (id: string) => request<void>(`/jobs/${id}`, { method: "DELETE" }),
  apply: (jobId: string) => request<JobApplication>(`/applications/jobs/${jobId}`, { method: "POST" }),
  myApplications: () => request<JobApplication[]>("/applications/me"),
  employerApplications: () => request<JobApplication[]>("/applications/employer"),
  updateStatus: (id: string, status: string) =>
    request<JobApplication>(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
};
