"use client";

import Link from "next/link";
import { Github, Linkedin, FileText } from "lucide-react";
import { SectionBackground } from "@/components/section-background";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getMediaUrl } from "@/lib/api";

export function Footer() {
  const { profile } = usePortfolioContext();
  const resumeUrl = getMediaUrl(profile?.resume, "/Ashutosh.Choudhary.Resume.pdf");
  const socialLinks = profile?.socialLinks || [];

  return (
    <footer className="relative border-t border-white/10 bg-gray-900/30 backdrop-blur-md overflow-hidden">
      {/* Background Video */}
      <SectionBackground
        sectionVideos={profile?.sectionVideos}
        section="footer"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 md:opacity-70"
        preload="none"
      />

      <div className="relative container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:gap-6 md:py-0 z-10">
        <div className="flex flex-col items-center gap-2 px-4 md:flex-row md:gap-4 md:px-0">
          <p className="text-sm md:text-xs leading-tight text-white text-center md:text-left">
            {profile?.name ? `Made by ${profile.name}` : "Made by Ashutosh Choudhary"} ©{" "}
            {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            if (link.icon === "github") {
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  className="group"
                >
                  <Github className="h-5 w-5 md:h-4 md:w-4 text-white group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                </Link>
              );
            }
            if (link.icon === "linkedin") {
              return (
                <Link
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  className="group"
                >
                  <Linkedin className="h-5 w-5 md:h-4 md:w-4 text-white group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
                </Link>
              );
            }
            return null;
          })}
          <Link
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Resume"
            className="group"
            download="Ashutosh_Choudhary_Resume.pdf"
          >
            <FileText className="h-5 w-5 md:h-4 md:w-4 text-white group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </footer>
  );
}