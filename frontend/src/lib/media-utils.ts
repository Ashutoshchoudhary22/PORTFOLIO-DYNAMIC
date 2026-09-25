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
