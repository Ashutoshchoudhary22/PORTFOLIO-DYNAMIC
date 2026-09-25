import type { MediaItem } from "./types";

export function sanitizeMediaItem(item?: MediaItem | null): MediaItem | null {
  if (!item?.publicId || !item?.secureUrl) return null;

  return {
    type: item.type,
    provider: item.provider || "cloudinary",
    publicId: item.publicId,
    secureUrl: item.secureUrl,
    thumbnailUrl: item.thumbnailUrl,
    format: item.format,
    width: item.width,
    height: item.height,
    duration: item.duration,
    bytes: item.bytes,
    sortOrder: item.sortOrder ?? 0,
    originalFilename: item.originalFilename,
  };
}

export function sanitizeMediaArray(media: MediaItem[] = []): MediaItem[] {
  return media
    .map(sanitizeMediaItem)
    .filter((item): item is MediaItem => Boolean(item))
    .map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index }));
}

export function isCloudinaryUrl(url?: string) {
  return Boolean(url?.includes("cloudinary.com"));
}

function getDownloadFilename(media: MediaItem): string {
  if (media.originalFilename) return media.originalFilename;

  const base = media.publicId.split("/").pop() || media.publicId;
  if (media.format && !base.includes(".")) {
    return `${base}.${media.format}`;
  }

  return base;
}

export function getMediaDownloadUrl(media: MediaItem): string {
  if (isCloudinaryUrl(media.secureUrl)) {
    return media.secureUrl.replace("/upload/", "/upload/fl_attachment/");
  }

  return media.secureUrl;
}

function triggerDownload(url: string, filename: string, openInNewTab = false) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  if (openInNewTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadMedia(media: MediaItem) {
  const filename = getDownloadFilename(media);

  try {
    const response = await fetch(media.secureUrl);
    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, filename);
    URL.revokeObjectURL(objectUrl);
    return;
  } catch {
    triggerDownload(getMediaDownloadUrl(media), filename, true);
  }
}
