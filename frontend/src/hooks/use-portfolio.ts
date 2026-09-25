"use client";

import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProfileData,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from "@/lib/types";

interface PortfolioState {
  profile: ProfileData | null;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  profile: null,
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  services: [],
  loading: true,
  error: null,
};

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function loadPortfolio() {
      try {
        const [profile, skills, experience, education, certifications, projects, services] =
          await Promise.all([
            publicApi.getProfile(),
            publicApi.getSkills(),
            publicApi.getExperience(),
            publicApi.getEducation(),
            publicApi.getCertifications(),
            publicApi.getProjects(),
            publicApi.getServices(),
          ]);

        if (!mounted) return;

        setState({
          profile,
          skills,
          experience,
          education,
          certifications,
          projects,
          services,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!mounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load portfolio data",
        }));
      }
    }

    loadPortfolio();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
