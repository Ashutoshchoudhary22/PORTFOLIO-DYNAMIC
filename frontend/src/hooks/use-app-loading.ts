"use client";

import { useEffect, useState } from "react";
import { getSectionMedia, publicApi } from "@/lib/api";
import {
  getHeroFallbackUrl,
  isHeroVideoCached,
  markHeroVideoCached,
  preloadHeroMedia,
  shouldSkipAppLoading,
} from "@/lib/video-preload";

export function useAppLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function prepareHeroMedia() {
      if (shouldSkipAppLoading()) {
        setProgress(100);
        setIsLoading(false);
        return;
      }

      let heroUrl = getHeroFallbackUrl();
      let mediaType: "video" | "image" = "video";

      try {
        setProgress(15);
        const profile = await publicApi.getProfile();
        const media = getSectionMedia(profile?.sectionVideos, "hero", heroUrl);
        if (media.secureUrl) {
          heroUrl = media.secureUrl;
          mediaType = media.type === "image" ? "image" : "video";
        }
      } catch {
        // fallback hero video
      }

      if (cancelled) return;

      if (isHeroVideoCached(heroUrl)) {
        setProgress(100);
        setIsLoading(false);
        return;
      }

      setProgress(35);

      await preloadHeroMedia(heroUrl, mediaType, (ratio) => {
        if (!cancelled) {
          setProgress(35 + Math.round(ratio * 65));
        }
      });

      if (cancelled) return;

      markHeroVideoCached(heroUrl);
      setProgress(100);
      window.setTimeout(() => setIsLoading(false), 150);
    }

    void prepareHeroMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoading, progress };
}
