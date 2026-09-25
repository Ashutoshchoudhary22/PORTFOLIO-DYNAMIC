import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { generateSignedUploadParams } from '../services/cloudinaryService.js';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  'base64'
);

const signed = generateSignedUploadParams({
  folder: 'portfolio/backgrounds/hero',
  resourceType: 'auto',
});

const formData = new FormData();
formData.append(
  'file',
  new Blob([tinyPng], { type: 'image/png' }),
  'test.png'
);
formData.append('api_key', signed.apiKey);
formData.append('signature', signed.signature);

Object.entries(signed.uploadParams).forEach(([key, value]) => {
  formData.append(key, String(value));
});

const uploadUrl = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`;

const response = await fetch(uploadUrl, {
  method: 'POST',
  body: formData,
});

const body = await response.json();

if (!response.ok) {
  console.error('SIGNED_UPLOAD_FAILED', response.status, body);
  process.exit(1);
}

console.log('SIGNED_UPLOAD_OK', body.public_id);
await cloudinary.uploader.destroy(body.public_id);
