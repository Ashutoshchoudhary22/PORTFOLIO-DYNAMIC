export function sanitizeMediaItem(item) {
  if (!item?.publicId || !item?.secureUrl) return null;

  return {
    type: item.type,
    provider: item.provider || 'cloudinary',
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

export function sanitizeMediaArray(media = []) {
  return media
    .map(sanitizeMediaItem)
    .filter(Boolean)
    .map((item, index) => ({ ...item, sortOrder: item.sortOrder ?? index }));
}
