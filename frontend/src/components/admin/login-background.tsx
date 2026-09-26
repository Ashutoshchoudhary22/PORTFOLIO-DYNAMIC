"use client";

import Image from "next/image";
import { getSectionMedia } from "@/lib/api";
import type { SectionVideo } from "@/lib/types";

type LoginBackgroundProps = {
  sectionVideos?: SectionVideo[];
};

export function LoginBackground({ sectionVideos }: LoginBackgroundProps) {
  const media = getSectionMedia(sectionVideos, "login", "");

  if (!media.secureUrl) {
    return null;
  }

  if (media.type === "image") {
    return (
      <Image
        src={media.secureUrl}
        alt="Login background"
        fill
        priority
        className="object-cover"
        unoptimized={
          media.secureUrl.startsWith("/") || media.secureUrl.includes("cloudinary.com")
        }
      />
    );
  }

  return (
    <video
      key={media.secureUrl}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={media.thumbnailUrl}
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden
    >
      <source src={media.secureUrl} />
    </video>
  );
}
