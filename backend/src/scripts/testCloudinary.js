import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

const tiny =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

try {
  const ping = await cloudinary.api.ping();
  console.log('PING_OK', ping);

  const upload = await cloudinary.uploader.upload(tiny, { folder: 'portfolio/test' });
  console.log('SERVER_UPLOAD_OK', upload.public_id);
  await cloudinary.uploader.destroy(upload.public_id);
  console.log('CLEANUP_OK');
} catch (error) {
  console.error('CLOUDINARY_ERROR', error.message || error);
  process.exit(1);
}
