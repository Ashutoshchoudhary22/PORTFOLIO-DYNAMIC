"use client";

import { useEffect, useRef, useState } from "react";

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

export function LazyVideo({
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
          } else if (!loop && !video.paused) {
            video.pause();
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [loop]);

  useEffect(() => {
    if (preload === "auto" || preload === "metadata") {
      setShouldLoad(true);
    }
  }, [preload]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    video.load();
    if (autoPlay && isInView) {
      void video.play().catch(() => undefined);
    }
  }, [src, shouldLoad, autoPlay, isInView]);

  return (
    <video
      key={src}
      ref={videoRef}
      className={className}
      autoPlay={autoPlay && isInView}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={shouldLoad ? preload : "none"}
      poster={poster}
      data-ai-hint={dataAiHint}
      aria-label={ariaLabel}
    >
      {shouldLoad && <source src={src} />}
      Your browser does not support the video tag.
    </video>
  );
}
