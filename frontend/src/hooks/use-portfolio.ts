"use client";

import { useQueries } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProfileData,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from "@/lib/types";

const portfolioQueries = [
  { key: queryKeys.profile, fn: publicApi.getProfile },
  { key: queryKeys.skills, fn: publicApi.getSkills },
  { key: queryKeys.experience, fn: publicApi.getExperience },
  { key: queryKeys.education, fn: publicApi.getEducation },
  { key: queryKeys.certifications, fn: publicApi.getCertifications },
  { key: queryKeys.projects, fn: publicApi.getProjects },
  { key: queryKeys.services, fn: publicApi.getServices },
] as const;

export function usePortfolio() {
  const results = useQueries({
    queries: portfolioQueries.map(({ key, fn }) => ({
      queryKey: key,
      queryFn: fn,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const [
    profileResult,
    skillsResult,
    experienceResult,
    educationResult,
    certificationsResult,
    projectsResult,
    servicesResult,
  ] = results;

  const loading = results.some((result) => result.isLoading);
  const errorResult = results.find((result) => result.isError);

  return {
    profile: (profileResult.data as ProfileData | undefined) ?? null,
    skills: (skillsResult.data as SkillCategory[] | undefined) ?? [],
    experience: (experienceResult.data as ExperienceItem[] | undefined) ?? [],
    education: (educationResult.data as EducationItem[] | undefined) ?? [],
    certifications: (certificationsResult.data as CertificationItem[] | undefined) ?? [],
    projects: (projectsResult.data as ProjectItem[] | undefined) ?? [],
    services: (servicesResult.data as ServiceItem[] | undefined) ?? [],
    loading,
    error: errorResult?.error instanceof Error ? errorResult.error.message : null,
    isFetching: results.some((result) => result.isFetching),
  };
}
