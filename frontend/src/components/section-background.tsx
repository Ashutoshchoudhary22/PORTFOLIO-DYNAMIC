"use client";

import { memo } from "react";
import Image from "next/image";
import { LazyVideo } from "@/components/lazy-video";
import { getSectionMedia } from "@/lib/api";
import type { SectionVideo } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionBackgroundProps {
  sectionVideos?: SectionVideo[];
  section: string;
  fallback?: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
  "aria-label"?: string;
}

function SectionBackgroundComponent({
  sectionVideos,
  section,
  fallback = "",
  className = "w-full h-full object-cover",
  preload = "none",
  "aria-label": ariaLabel,
}: SectionBackgroundProps) {
  const media = getSectionMedia(sectionVideos, section, fallback);
  const isAbsolute = className.includes("absolute");

  if (!media.secureUrl) {
    return null;
  }

  if (media.type === "image") {
    return (
      <div
        className={cn(isAbsolute ? "absolute inset-0" : "relative w-full h-full")}
      >
        <Image
          src={media.secureUrl}
          alt={ariaLabel || `${section} background`}
          fill
          className={className}
          sizes="100vw"
          loading="lazy"
          unoptimized={
            media.secureUrl.startsWith("/") || media.secureUrl.includes("cloudinary.com")
          }
        />
      </div>
    );
  }

  return (
    <LazyVideo
      src={media.secureUrl}
      poster={media.thumbnailUrl}
      className={className}
      preload={preload}
      aria-label={ariaLabel}
    />
  );
}

export const SectionBackground = memo(SectionBackgroundComponent);
