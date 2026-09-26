"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LazyVideo } from "@/components/lazy-video";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { SectionBackground } from "@/components/section-background";
import { SectionSkeleton } from "@/components/section-skeleton";
import { isCloudinaryUrl } from "@/lib/media-utils";
import { cn } from "@/lib/utils";
import type { ProjectItem, MediaItem } from "@/lib/types";

function getProjectImages(project: ProjectItem): string[] {
  const urls: string[] = [];

  if (project.thumbnail?.secureUrl) {
    urls.push(project.thumbnail.secureUrl);
  }

  const mediaImages =
    project.media
      ?.filter((item) => item.type === "image")
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => item.secureUrl) || [];

  for (const url of mediaImages) {
    if (!urls.includes(url)) urls.push(url);
  }

  return urls;
}

function getProjectVideo(project: ProjectItem): MediaItem | undefined {
  return project.media?.find((item) => item.type === "video");
}

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = getProjectImages(project);
  const video = getProjectVideo(project);
  const hasSlider = images.length > 1;
  const tags = project.tags || project.technologies || [];
  const projectNumber = String(index + 1).padStart(2, "0");

  useEffect(() => {
    if (!hasSlider) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasSlider, images.length]);

  return (
    <Card className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/35 hover:shadow-[0_24px_60px_rgba(139,92,246,0.22)]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-violet-500/0 to-fuchsia-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/10 group-hover:via-violet-500/5 group-hover:to-fuchsia-500/10 group-hover:opacity-100" />

      <div className="relative p-3 pb-0">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/30">
          {images.length > 0 ? (
            <div className="relative h-full w-full">
              {images.map((src, imageIndex) => (
                <Image
                  key={`${project._id || project.slug}-${src}`}
                  src={src}
                  alt={project.title}
                  fill
                  unoptimized={src.startsWith("/") || isCloudinaryUrl(src)}
                  className={cn(
                    "object-cover transition-all duration-700 ease-in-out group-hover:scale-[1.04]",
                    imageIndex === currentIndex ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
            </div>
          ) : video ? (
            <LazyVideo
              key={video.secureUrl}
              src={video.secureUrl}
              poster={video.thumbnailUrl}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              data-ai-hint={project.aiHint}
              preload="none"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 to-black" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-white/80 backdrop-blur-md">
            {projectNumber}
          </span>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-violet-500/80 group-hover:opacity-100"
              aria-label={`Open ${project.title}`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          {hasSlider && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((src, dotIndex) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show image ${dotIndex + 1}`}
                  onClick={() => setCurrentIndex(dotIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    dotIndex === currentIndex
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CardHeader className="relative space-y-3 pb-3">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400" />
        <CardTitle className="line-clamp-2 font-headline text-xl leading-snug text-white md:text-2xl">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed text-white/65 md:text-base">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative mt-auto flex flex-col gap-4 pb-6">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/60">
                +{tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-wrap gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] hover:shadow-violet-500/35"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Projects() {
  const { profile, projects, loading } = usePortfolioContext();

  if (loading) {
    return <SectionSkeleton rows={3} />;
  }

  return (
    <section id="projects" className="portfolio-section relative py-20 lg:py-32">
      <div className="absolute inset-0 z-0">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="projects"
          className="w-full h-full object-cover"
          preload="none"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mx-auto max-w-[700px] text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse">
            My Projects
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse">
            Here are some of my key projects showcasing expertise in MERN stack development,
            B2B platforms, HRM systems, and enterprise solutions.
          </p>
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-white/70">No projects published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project._id || project.slug}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
