import type { ApiResponse, ProfileData, ProjectItem, ServiceItem } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const REVALIDATE_SECONDS = 3600;

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiResponse<T>;
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}

export async function fetchPublicProfile() {
  return fetchApi<ProfileData>("/profile");
}

export async function fetchPublicProjects() {
  return fetchApi<ProjectItem[]>("/projects");
}

export async function fetchPublicServices() {
  return fetchApi<ServiceItem[]>("/services");
}

export async function fetchSeoBundle() {
  const [profile, projects, services] = await Promise.all([
    fetchPublicProfile(),
    fetchPublicProjects(),
    fetchPublicServices(),
  ]);

  return { profile, projects: projects ?? [], services: services ?? [] };
}
