import { apiRequest } from "./axios";
import type {
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
} from "./types";

export const publicApi = {
  getProfile: () => apiRequest<ProfileData>("/profile"),
  getSkills: () => apiRequest<SkillCategory[]>("/skills"),
  getExperience: () => apiRequest<ExperienceItem[]>("/experience"),
  getEducation: () => apiRequest<EducationItem[]>("/education"),
  getCertifications: () => apiRequest<CertificationItem[]>("/certifications"),
  getProjects: () => apiRequest<ProjectItem[]>("/projects"),
  getProjectBySlug: (slug: string) => apiRequest<ProjectItem>(`/projects/${slug}`),
  getServices: () => apiRequest<ServiceItem[]>("/services"),
  submitContact: (data: { name: string; email: string; message: string }) =>
    apiRequest<{ id: string }>("/contact", {
      method: "POST",
      data,
    }),
};

export const adminApi = {
  getSetupStatus: () =>
    apiRequest<{ needsSetup: boolean }>("/admin/auth/setup-status"),
  setupAdmin: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) =>
    apiRequest<{ email: string; name: string }>("/admin/auth/setup", {
      method: "POST",
      data,
    }),
  requestLoginOtp: (email: string, password: string) =>
    apiRequest<{ email: string; expiresInMinutes: number }>(
      "/admin/auth/login/request-otp",
      {
        method: "POST",
        data: { email, password },
      }
    ),
  verifyLoginOtp: (email: string, otp: string) =>
    apiRequest<{ token: string; admin: AdminUser }>("/admin/auth/login/verify-otp", {
      method: "POST",
      data: { email, otp },
    }),
  requestForgotPasswordOtp: (email: string) =>
    apiRequest<{ email: string }>("/admin/auth/forgot-password/request-otp", {
      method: "POST",
      data: { email },
    }),
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) =>
    apiRequest<Record<string, never>>("/admin/auth/forgot-password/reset", {
      method: "POST",
      data: { email, otp, newPassword },
    }),
  logout: (token: string) =>
    apiRequest<Record<string, never>>("/admin/auth/logout", { method: "POST" }, token),
  getMe: (token: string) => apiRequest<AdminUser>("/admin/auth/me", {}, token),
  getDashboard: (token: string) =>
    apiRequest<DashboardStats>("/admin/dashboard", {}, token),
  getSettings: (token: string) =>
    apiRequest<Record<string, unknown>>("/admin/settings", {}, token),
  updateSettings: (token: string, data: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>(
      "/admin/settings",
      { method: "PUT", data },
      token
    ),
  getSkills: (token: string) => apiRequest<SkillItem[]>("/admin/skills", {}, token),
  createSkill: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/skills", { method: "POST", data }, token),
  updateSkill: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/skills/${id}`, { method: "PUT", data }, token),
  deleteSkill: (token: string, id: string) =>
    apiRequest(`/admin/skills/${id}`, { method: "DELETE" }, token),
  getExperience: (token: string) =>
    apiRequest<ExperienceItem[]>("/admin/experience", {}, token),
  createExperience: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/experience", { method: "POST", data }, token),
  updateExperience: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/experience/${id}`, { method: "PUT", data }, token),
  deleteExperience: (token: string, id: string) =>
    apiRequest(`/admin/experience/${id}`, { method: "DELETE" }, token),
  getEducation: (token: string) =>
    apiRequest<EducationItem[]>("/admin/education", {}, token),
  createEducation: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/education", { method: "POST", data }, token),
  updateEducation: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/education/${id}`, { method: "PUT", data }, token),
  deleteEducation: (token: string, id: string) =>
    apiRequest(`/admin/education/${id}`, { method: "DELETE" }, token),
  getCertifications: (token: string) =>
    apiRequest<CertificationItem[]>("/admin/certifications", {}, token),
  createCertification: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/certifications", { method: "POST", data }, token),
  updateCertification: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/certifications/${id}`, { method: "PUT", data }, token),
  deleteCertification: (token: string, id: string) =>
    apiRequest(`/admin/certifications/${id}`, { method: "DELETE" }, token),
  getProjects: (token: string) => apiRequest<ProjectItem[]>("/admin/projects", {}, token),
  createProject: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/projects", { method: "POST", data }, token),
  updateProject: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/projects/${id}`, { method: "PUT", data }, token),
  deleteProject: (token: string, id: string) =>
    apiRequest(`/admin/projects/${id}`, { method: "DELETE" }, token),
  getServices: (token: string) => apiRequest<ServiceItem[]>("/admin/services", {}, token),
  createService: (token: string, data: Record<string, unknown>) =>
    apiRequest("/admin/services", { method: "POST", data }, token),
  updateService: (token: string, id: string, data: Record<string, unknown>) =>
    apiRequest(`/admin/services/${id}`, { method: "PUT", data }, token),
  deleteService: (token: string, id: string) =>
    apiRequest(`/admin/services/${id}`, { method: "DELETE" }, token),
  getMessages: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiRequest<{
      messages: ContactMessage[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/admin/messages${query}`, {}, token);
  },
  updateMessage: (token: string, id: string, data: { isRead?: boolean; isReplied?: boolean }) =>
    apiRequest(`/admin/messages/${id}`, { method: "PATCH", data }, token),
  deleteMessage: (token: string, id: string) =>
    apiRequest(`/admin/messages/${id}`, { method: "DELETE" }, token),
  getUploadSignature: (
    token: string,
    params: { folder?: string; resourceType?: string } = {}
  ) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{
      cloudName: string;
      apiKey: string;
      signature: string;
      uploadParams: Record<string, string | number>;
      resourceType: string;
    }>(`/admin/media/signature?${query}`, {}, token);
  },
  deleteMedia: (token: string, publicId: string, resourceType: string) =>
    apiRequest(
      "/admin/media",
      { method: "DELETE", data: { publicId, resourceType } },
      token
    ),
};

export function getMediaUrl(media?: { secureUrl?: string } | null, fallback = "") {
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
