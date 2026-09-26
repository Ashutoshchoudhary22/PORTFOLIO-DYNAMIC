const LAST_HERO_URL_KEY = "portfolio-last-hero-url";
const HERO_FALLBACK = "/hero-1.mp4";

function videoReadyKey(url: string) {
  return `video-ready:${url}`;
}

export function getHeroFallbackUrl() {
  return HERO_FALLBACK;
}

export function isHeroVideoCached(url: string) {
  if (typeof window === "undefined" || !url) return false;
  return sessionStorage.getItem(videoReadyKey(url)) === "1";
}

export function shouldSkipAppLoading() {
  if (typeof window === "undefined") return false;

  const lastUrl = sessionStorage.getItem(LAST_HERO_URL_KEY);
  if (lastUrl && isHeroVideoCached(lastUrl)) {
    return true;
  }

  return isHeroVideoCached(HERO_FALLBACK);
}

export function markHeroVideoCached(url: string) {
  if (typeof window === "undefined" || !url) return;
  sessionStorage.setItem(LAST_HERO_URL_KEY, url);
  sessionStorage.setItem(videoReadyKey(url), "1");
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const timeout = window.setTimeout(resolve, 8000);

    image.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    image.src = url;
  });
}

function preloadVideo(
  url: string,
  onProgress?: (ratio: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const timeout = window.setTimeout(() => {
      video.removeAttribute("src");
      video.load();
      resolve();
    }, 12000);

    const finish = () => {
      window.clearTimeout(timeout);
      video.removeAttribute("src");
      video.load();
      resolve();
    };

    video.addEventListener(
      "loadeddata",
      () => {
        onProgress?.(1);
        finish();
      },
      { once: true }
    );

    video.addEventListener("error", finish, { once: true });

    video.addEventListener("progress", () => {
      if (!video.duration || !video.buffered.length) return;
      onProgress?.(Math.min(video.buffered.end(0) / video.duration, 0.95));
    });

    video.src = url;
    video.load();
  });
}

export async function preloadHeroMedia(
  url: string,
  type: "video" | "image",
  onProgress?: (ratio: number) => void
) {
  if (!url) return;

  if (type === "image") {
    await preloadImage(url);
    onProgress?.(1);
    return;
  }

  await preloadVideo(url, onProgress);
}
