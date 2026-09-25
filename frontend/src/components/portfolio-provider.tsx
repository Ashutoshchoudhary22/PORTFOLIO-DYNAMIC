"use client";

import { createContext, useContext } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProfileData,
  ProjectItem,
  ServiceItem,
  SkillCategory,
} from "@/lib/types";

interface PortfolioContextValue {
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

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const value = usePortfolio();
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioContext must be used within PortfolioProvider");
  }
  return context;
}

export function PortfolioStatusBanner() {
  const { loading, error } = usePortfolioContext();

  if (loading || !error) return null;

  return (
    <div className="bg-red-900/80 text-white text-center text-sm py-2 px-4">
      Unable to load portfolio data from API: {error}. Start MongoDB and the backend server, then run{" "}
      <code className="font-mono">npm run seed --prefix backend</code>.
    </div>
  );
}
