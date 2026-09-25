import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary credentials missing — media uploads will be disabled');
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME.trim(),
    api_key: CLOUDINARY_API_KEY.trim(),
    api_secret: CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });

  return true;
}

export { cloudinary };
