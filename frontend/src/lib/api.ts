import type {
  ApiResponse,
  CertificationItem,
  DashboardStats,
  EducationItem,
  ExperienceItem,
  ProfileData,
  ProjectItem,
  ServiceItem,
  SkillCategory,
  AdminUser,
  ContactMessage,
  SkillItem,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const payload: ApiResponse<T> = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload.data;
}

export const publicApi = {
  getProfile: () => request<ProfileData>('/profile'),
  getSkills: () => request<SkillCategory[]>('/skills'),
  getExperience: () => request<ExperienceItem[]>('/experience'),
  getEducation: () => request<EducationItem[]>('/education'),
  getCertifications: () => request<CertificationItem[]>('/certifications'),
  getProjects: () => request<ProjectItem[]>('/projects'),
  getProjectBySlug: (slug: string) => request<ProjectItem>(`/projects/${slug}`),
  getServices: () => request<ServiceItem[]>('/services'),
  submitContact: (data: { name: string; email: string; message: string }) =>
    request<{ id: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ token: string; admin: AdminUser }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: (token: string) =>
    request<Record<string, never>>('/admin/auth/logout', { method: 'POST' }, token),
  getMe: (token: string) => request<AdminUser>('/admin/auth/me', {}, token),
  getDashboard: (token: string) =>
    request<DashboardStats>('/admin/dashboard', {}, token),
  getSettings: (token: string) => request<Record<string, unknown>>('/admin/settings', {}, token),
  updateSettings: (token: string, data: Record<string, unknown>) =>
    request<Record<string, unknown>>(
      '/admin/settings',
      { method: 'PUT', body: JSON.stringify(data) },
      token
    ),
  getSkills: (token: string) => request<SkillItem[]>('/admin/skills', {}, token),
  createSkill: (token: string, data: Record<string, unknown>) =>
    request('/admin/skills', { method: 'POST', body: JSON.stringify(data) }, token),
  updateSkill: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteSkill: (token: string, id: string) =>
    request(`/admin/skills/${id}`, { method: 'DELETE' }, token),
  getExperience: (token: string) =>
    request<ExperienceItem[]>('/admin/experience', {}, token),
  createExperience: (token: string, data: Record<string, unknown>) =>
    request('/admin/experience', { method: 'POST', body: JSON.stringify(data) }, token),
  updateExperience: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteExperience: (token: string, id: string) =>
    request(`/admin/experience/${id}`, { method: 'DELETE' }, token),
  getEducation: (token: string) =>
    request<EducationItem[]>('/admin/education', {}, token),
  createEducation: (token: string, data: Record<string, unknown>) =>
    request('/admin/education', { method: 'POST', body: JSON.stringify(data) }, token),
  updateEducation: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteEducation: (token: string, id: string) =>
    request(`/admin/education/${id}`, { method: 'DELETE' }, token),
  getCertifications: (token: string) =>
    request<CertificationItem[]>('/admin/certifications', {}, token),
  createCertification: (token: string, data: Record<string, unknown>) =>
    request('/admin/certifications', { method: 'POST', body: JSON.stringify(data) }, token),
  updateCertification: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteCertification: (token: string, id: string) =>
    request(`/admin/certifications/${id}`, { method: 'DELETE' }, token),
  getProjects: (token: string) => request<ProjectItem[]>('/admin/projects', {}, token),
  createProject: (token: string, data: Record<string, unknown>) =>
    request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }, token),
  updateProject: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteProject: (token: string, id: string) =>
    request(`/admin/projects/${id}`, { method: 'DELETE' }, token),
  getServices: (token: string) => request<ServiceItem[]>('/admin/services', {}, token),
  createService: (token: string, data: Record<string, unknown>) =>
    request('/admin/services', { method: 'POST', body: JSON.stringify(data) }, token),
  updateService: (token: string, id: string, data: Record<string, unknown>) =>
    request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),
  deleteService: (token: string, id: string) =>
    request(`/admin/services/${id}`, { method: 'DELETE' }, token),
  getMessages: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return request<{ messages: ContactMessage[]; pagination: { page: number; limit: number; total: number; pages: number } }>(
      `/admin/messages${query}`,
      {},
      token
    );
  },
  updateMessage: (token: string, id: string, data: { isRead?: boolean; isReplied?: boolean }) =>
    request(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, token),
  deleteMessage: (token: string, id: string) =>
    request(`/admin/messages/${id}`, { method: 'DELETE' }, token),
  getUploadSignature: (
    token: string,
    params: { folder?: string; resourceType?: string } = {}
  ) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request<{
      cloudName: string;
      apiKey: string;
      signature: string;
      uploadParams: Record<string, string | number>;
      resourceType: string;
    }>(`/admin/media/signature?${query}`, {}, token);
  },
  deleteMedia: (token: string, publicId: string, resourceType: string) =>
    request(
      '/admin/media',
      { method: 'DELETE', body: JSON.stringify({ publicId, resourceType }) },
      token
    ),
};

export function getMediaUrl(media?: { secureUrl?: string } | null, fallback = '') {
  return media?.secureUrl || fallback;
}

export function getSectionMedia(
  sectionVideos: { section: string; media: { secureUrl: string; type?: string; thumbnailUrl?: string } }[] | undefined,
  section: string,
  fallback: string
) {
  const match = sectionVideos?.find((item) => item.section === section);

  if (match?.media?.secureUrl) {
    return {
      type: (match.media.type as "image" | "video") || "video",
      secureUrl: match.media.secureUrl,
      thumbnailUrl: match.media.thumbnailUrl,
    };
  }

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fallback);
  return {
    type: isImage ? ("image" as const) : ("video" as const),
    secureUrl: fallback,
    thumbnailUrl: undefined,
  };
}

export function getSectionVideo(
  sectionVideos: { section: string; media: { secureUrl: string } }[] | undefined,
  section: string,
  fallback: string
) {
  return getSectionMedia(sectionVideos, section, fallback).secureUrl;
}
