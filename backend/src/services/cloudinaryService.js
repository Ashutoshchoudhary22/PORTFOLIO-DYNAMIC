import { cloudinary } from '../config/cloudinary.js';

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  );
}

function getUploadConstraints(resourceType = 'auto') {
  if (resourceType === 'video') {
    return {
      allowedFormats: ['mp4', 'webm', 'mov'],
    };
  }

  if (resourceType === 'auto') {
    return {
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov'],
    };
  }

  return {
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'],
  };
}

export function generateSignedUploadParams({
  folder = 'portfolio',
  resourceType = 'auto',
}) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }

  const { allowedFormats } = getUploadConstraints(resourceType);
  const timestamp = Math.round(Date.now() / 1000);

  const uploadParams = {
    timestamp,
    folder,
    allowed_formats: allowedFormats.join(','),
  };

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET.trim()
  );

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    apiKey: process.env.CLOUDINARY_API_KEY.trim(),
    signature,
    uploadParams,
    resourceType,
  };
}

export async function deleteCloudinaryAsset(publicId, resourceType = 'image') {
  if (!publicId || !isCloudinaryConfigured()) return null;
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}

export function mapCloudinaryUploadResult(result, type) {
  const isVideo = type === 'video' || result.resource_type === 'video';

  return {
    type: isVideo ? 'video' : 'image',
    provider: 'cloudinary',
    publicId: result.public_id,
    secureUrl: result.secure_url,
    thumbnailUrl: isVideo
      ? cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [{ width: 800, crop: 'limit' }],
        })
      : result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    duration: result.duration,
    bytes: result.bytes,
    originalFilename: result.original_filename,
  };
}

export function getOptimizedVideoUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    secure: true,
    streaming_profile: 'full_hd',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
}

export function getOptimizedImageUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });
}
