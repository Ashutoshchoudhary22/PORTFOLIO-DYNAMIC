"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, GraduationCap, Star, Award, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { SectionBackground } from "@/components/section-background";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { SectionSkeleton } from "@/components/section-skeleton";
import { cn } from "@/lib/utils";
import type { SkillItem } from "@/lib/types";

const aboutTabs: {
  value: string;
  label: string;
  mobileLabel: string;
  icon: LucideIcon;
  activeClass: string;
  iconClass: string;
  ringClass: string;
}[] = [
  {
    value: "skills",
    label: "Skills",
    mobileLabel: "Skills",
    icon: Star,
    activeClass:
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/35 data-[state=active]:to-cyan-500/20 data-[state=active]:border-emerald-400/45 data-[state=active]:shadow-[0_0_24px_rgba(52,211,153,0.22)]",
    iconClass: "text-emerald-400",
    ringClass: "group-data-[state=active]:bg-emerald-400/20 group-data-[state=active]:ring-emerald-400/40",
  },
  {
    value: "experience",
    label: "Experience",
    mobileLabel: "Work",
    icon: Briefcase,
    activeClass:
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/35 data-[state=active]:to-violet-500/20 data-[state=active]:border-blue-400/45 data-[state=active]:shadow-[0_0_24px_rgba(96,165,250,0.22)]",
    iconClass: "text-blue-400",
    ringClass: "group-data-[state=active]:bg-blue-400/20 group-data-[state=active]:ring-blue-400/40",
  },
  {
    value: "education",
    label: "Education",
    mobileLabel: "Study",
    icon: GraduationCap,
    activeClass:
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500/35 data-[state=active]:to-orange-500/20 data-[state=active]:border-amber-400/45 data-[state=active]:shadow-[0_0_24px_rgba(251,191,36,0.22)]",
    iconClass: "text-amber-400",
    ringClass: "group-data-[state=active]:bg-amber-400/20 group-data-[state=active]:ring-amber-400/40",
  },
  {
    value: "certifications",
    label: "Certifications",
    mobileLabel: "Certs",
    icon: Award,
    activeClass:
      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-fuchsia-500/35 data-[state=active]:to-pink-500/20 data-[state=active]:border-fuchsia-400/45 data-[state=active]:shadow-[0_0_24px_rgba(232,121,249,0.22)]",
    iconClass: "text-fuchsia-400",
    ringClass: "group-data-[state=active]:bg-fuchsia-400/20 group-data-[state=active]:ring-fuchsia-400/40",
  },
];

const ABOUT_IMAGES = "/png-icons";

const TechLogo = ({
  name,
  logoUrl,
  bgColor,
}: {
  name: string;
  logoUrl: string;
  bgColor?: string;
}) => {
  return (
    <div
      className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-2 transition-all duration-500 ease-out group-hover:scale-110"
      style={{ backgroundColor: bgColor ? `${bgColor}15` : undefined }}
    >
      <Image
        key={logoUrl}
        src={logoUrl}
        alt={name}
        width={64}
        height={64}
        className="w-full h-full object-contain drop-shadow-lg group-hover:brightness-110 transition-all duration-500"
        unoptimized
      />
    </div>
  );
};

const getSkillIcon = (skill: SkillItem) => {
  if (skill.iconUrl) {
    return (
      <TechLogo name={skill.name} logoUrl={skill.iconUrl} bgColor={skill.bgColor} />
    );
  }

  const baseUrl = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
  const localLogos: { [key: string]: { url: string; bgColor?: string } } = {
    "AWS (CI/CD)": { url: `${ABOUT_IMAGES}/Awss.png`, bgColor: "#FF9900" },
    Git: { url: `${ABOUT_IMAGES}/git.png`, bgColor: "#F05032" },
    GitHub: { url: `${ABOUT_IMAGES}/github.png`, bgColor: "#181717" },
    Hostinger: { url: `${ABOUT_IMAGES}/hostinger.webp`, bgColor: "#673DE6" },
    MongoDB: { url: `${ABOUT_IMAGES}/mongo-db2.png`, bgColor: "#47A248" },
    MySQL: { url: `${ABOUT_IMAGES}/my-sql.png`, bgColor: "#4479A1" },
    Nginx: { url: `${ABOUT_IMAGES}/nginxs.png`, bgColor: "#009639" },
    "Node.js": { url: `${ABOUT_IMAGES}/node-js.png`, bgColor: "#339933" },
    Prisma: { url: `${ABOUT_IMAGES}/primaa.png`, bgColor: "#2D3748" },
    Redux: { url: `${ABOUT_IMAGES}/redux-icon.webp`, bgColor: "#764ABC" },
    "Redux RTK Query": { url: `${ABOUT_IMAGES}/rtk-query2.png`, bgColor: "#764ABC" },
    Vercel: { url: `${ABOUT_IMAGES}/vercels.png`, bgColor: "#000000" },
  };

  const local = localLogos[skill.name];
  if (local) {
    return <TechLogo name={skill.name} logoUrl={local.url} bgColor={local.bgColor} />;
  }

  const logos: { [key: string]: { url: string; bgColor?: string } } = {
    JavaScript: { url: `${baseUrl}/javascript/javascript-original.svg`, bgColor: "#F7DF1E" },
    TypeScript: { url: `${baseUrl}/typescript/typescript-original.svg`, bgColor: "#3178C6" },
    "React.js": { url: `${baseUrl}/react/react-original.svg`, bgColor: "#20232A" },
    "Next.js": { url: `${baseUrl}/nextjs/nextjs-original.svg`, bgColor: "#000000" },
    HTML5: { url: `${baseUrl}/html5/html5-original.svg`, bgColor: "#E34F26" },
    CSS3: { url: `${baseUrl}/css3/css3-original.svg`, bgColor: "#1572B6" },
    Vite: { url: `${baseUrl}/vitejs/vitejs-original.svg`, bgColor: "#646CFF" },
    "Express.js": {
      url: "https://ajeetchaulagain.com/static/7cb4af597964b0911fe71cb2f8148d64/8d565/express-js.webp",
      bgColor: "#000000",
    },
    PostgreSQL: { url: `${baseUrl}/postgresql/postgresql-original.svg`, bgColor: "#336791" },
    Docker: { url: `${baseUrl}/docker/docker-original.svg`, bgColor: "#2496ED" },
  };

  const logo = logos[skill.name];
  if (logo) {
    return <TechLogo name={skill.name} logoUrl={logo.url} bgColor={logo.bgColor} />;
  }

  return (
    <TechLogo
      name={skill.name}
      logoUrl="https://via.placeholder.com/64/10B981/FFFFFF?text=?"
      bgColor="#10B981"
    />
  );
};

export function About() {
  const { profile, skills, experience, education, certifications, loading } =
    usePortfolioContext();

  if (loading) {
    return <SectionSkeleton rows={4} />;
  }

  return (
    <section id="about" className="portfolio-section relative py-12 md:py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 motion-reduce:hidden">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="about"
          className="w-full h-full object-cover opacity-50 md:opacity-70"
          aria-label="Background video of abstract digital patterns"
          preload="none"
        />
        <div className="absolute inset-0 bg-black/60 md:bg-black/50 backdrop-blur-sm"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mx-auto max-w-[700px] text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse">
            About Me
          </h2>
          <p className="mx-auto max-w-[700px] md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse">
            {profile?.aboutText}
          </p>
        </div>
        <div className="flex justify-center">
          <Tabs defaultValue="skills" className="w-full max-w-4xl">
            <TabsList className="relative flex h-auto w-full gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-black/45 p-1.5 backdrop-blur-xl md:grid md:grid-cols-4 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {aboutTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "group relative flex min-w-[4.75rem] flex-1 flex-col items-center gap-1.5 rounded-xl border border-transparent px-2 py-2.5 text-white/50 transition-all duration-300 sm:min-w-0 sm:flex-row sm:gap-2 sm:px-3 sm:py-2.5",
                      "hover:bg-white/[0.06] hover:text-white/85",
                      "data-[state=active]:text-white data-[state=active]:shadow-lg",
                      "focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0",
                      tab.activeClass
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 transition-all duration-300 group-data-[state=active]:scale-105",
                        tab.ringClass
                      )}
                    >
                      <Icon className={cn("h-4 w-4 transition-transform", tab.iconClass)} />
                    </span>
                    <span className="text-[10px] font-semibold leading-tight sm:hidden">
                      {tab.mobileLabel}
                    </span>
                    <span className="hidden text-sm font-semibold sm:inline">{tab.label}</span>
                    <span className="absolute bottom-1 left-1/2 hidden h-0.5 w-6 -translate-x-1/2 rounded-full bg-white/70 opacity-0 transition-opacity group-data-[state=active]:opacity-100 sm:block" />
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="skills">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="pt-6 space-y-8">
                  {skills.map((category, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
                        {category.category}
                      </h4>
                      <div className="flex flex-wrap justify-start gap-3 md:gap-4 lg:gap-5">
                        {category.skills.map((skill, skillIndex) => (
                          <div
                            key={skill._id || skillIndex}
                            className="relative flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] hover:from-white/[0.15] hover:via-white/[0.10] hover:to-white/[0.05] border border-white/20 hover:border-green-400/50 transition-all duration-500 cursor-pointer group hover:shadow-[0_8px_32px_rgba(74,222,128,0.15)] hover:-translate-y-1 backdrop-blur-lg flex-shrink-0"
                            style={{
                              animationDelay: `${skillIndex * 50}ms`,
                              animation: "fadeInUp 0.6s ease-out forwards",
                            }}
                          >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/0 via-blue-400/0 to-purple-400/0 group-hover:from-green-400/10 group-hover:via-blue-400/5 group-hover:to-purple-400/10 transition-all duration-500 blur-xl"></div>
                            <div className="relative z-10">{getSkillIcon(skill)}</div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50 scale-95 group-hover:scale-100">
                              <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 text-white text-xs rounded-xl px-4 py-3 border border-green-400/40 shadow-2xl shadow-green-400/20 max-w-[220px] text-center backdrop-blur-md">
                                <p className="font-bold whitespace-nowrap text-green-400 drop-shadow-lg">
                                  {skill.name}
                                </p>
                                <p className="text-white/80 mt-1.5 text-[10px] leading-tight">
                                  {skill.description}
                                </p>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                                  <div className="border-4 border-transparent border-t-gray-900/95"></div>
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-[5px]">
                                    <div className="border-4 border-transparent border-t-green-400/60 shadow-lg"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="experience">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="pt-6 space-y-6 md:space-y-8">
                  {experience.map((exp, index) => (
                    <div key={exp._id || index} className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-400/20 border border-green-400/50 shrink-0">
                          <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                        </div>
                        {index < experience.length - 1 && (
                          <div className="w-px h-full bg-white/20 my-2 md:my-4 hidden sm:block"></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white/70 font-mono text-xs md:text-sm">{exp.period}</p>
                        <h3 className="text-lg md:text-xl font-headline text-white">{exp.role}</h3>
                        <p className="font-semibold text-white/80 text-sm md:text-base">{exp.company}</p>
                        <p className="text-white/70 mt-2 text-sm md:text-base">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="education">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="pt-6 space-y-6 md:space-y-8">
                  {education.map((edu, index) => (
                    <div key={edu._id || index} className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-400/20 border border-green-400/50 shrink-0">
                          <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                        </div>
                        {index < education.length - 1 && (
                          <div className="w-px h-full bg-white/20 my-2 md:my-4 hidden sm:block"></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white/70 font-mono text-xs md:text-sm">{edu.period}</p>
                        <h3 className="text-lg md:text-xl font-headline text-white">{edu.degree}</h3>
                        <p className="font-semibold text-white/80 text-sm md:text-base">{edu.institution}</p>
                        <p className="text-white/70 mt-2 text-sm md:text-base">{edu.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="certifications">
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="pt-6 space-y-6 md:space-y-8">
                  {certifications.map((cert, index) => (
                    <div key={cert._id || index} className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-400/20 border border-green-400/50 shrink-0">
                          <Award className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg md:text-xl font-headline text-white">{cert.title}</h3>
                        <p className="font-semibold text-white/80 text-sm md:text-base">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default About;
