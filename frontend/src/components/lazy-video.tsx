"use client";

import { memo, useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  poster?: string;
  "data-ai-hint"?: string;
  "aria-label"?: string;
}

function LazyVideoComponent({
  src,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "none",
  poster,
  "data-ai-hint": dataAiHint,
  "aria-label": ariaLabel,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShouldLoad(true);
          } else {
            setIsInView(false);
            video.pause();
          }
        });
      },
      {
        rootMargin: "120px 0px",
        threshold: 0.12,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useEffect(() => {
    if (preload === "auto" || preload === "metadata") {
      setShouldLoad(true);
    }
  }, [preload]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isInView && autoPlay) {
      if (video.readyState === 0) {
        video.load();
      }
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }, [src, shouldLoad, autoPlay, isInView]);

  return (
    <video
      ref={videoRef}
      className={className}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={shouldLoad ? preload : "none"}
      poster={poster}
      disablePictureInPicture
      data-ai-hint={dataAiHint}
      aria-label={ariaLabel}
    >
      {shouldLoad && <source src={src} />}
      Your browser does not support the video tag.
    </video>
  );
}

export const LazyVideo = memo(LazyVideoComponent);
