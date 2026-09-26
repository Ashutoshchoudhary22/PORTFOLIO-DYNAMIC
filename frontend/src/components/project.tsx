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
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { SectionBackground } from "@/components/section-background";
import { SectionSkeleton } from "@/components/section-skeleton";
import { isCloudinaryUrl } from "@/lib/media-utils";
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

function ProjectCard({ project }: { project: ProjectItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = getProjectImages(project);
  const video = getProjectVideo(project);
  const hasSlider = images.length > 1;
  const tags = project.tags || project.technologies || [];

  useEffect(() => {
    if (!hasSlider) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hasSlider, images.length]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col group border border-transparent hover:border-accent">
      <div className="aspect-video relative overflow-hidden">
        {images.length > 0 ? (
          <div className="w-full h-full relative">
            {images.map((src, index) => (
              <Image
                key={`${project._id || project.slug}-${src}`}
                src={src}
                alt={project.title}
                fill
                unoptimized={src.startsWith("/") || isCloudinaryUrl(src)}
                className={`object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        ) : video ? (
          <LazyVideo
            key={video.secureUrl}
            src={video.secureUrl}
            poster={video.thumbnailUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={project.aiHint}
            preload="none"
          />
        ) : (
          <div className="w-full h-full bg-black/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-white">{project.title}</CardTitle>
        <CardDescription className="text-white/70">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col items-center">
        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary text-white">
              {tag}
            </Badge>
          ))}
        </div>
        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Project
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore GitHub
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
    <section id="projects" className="relative py-20 lg:py-32">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
