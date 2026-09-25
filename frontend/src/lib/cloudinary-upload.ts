import { adminApi } from './api';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadToCloudinary(
  file: File,
  token: string,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video';
    onProgress?: (progress: UploadProgress) => void;
  } = {}
) {
  const { folder = 'portfolio', resourceType = 'auto', onProgress } = options;

  const signature = await adminApi.getUploadSignature(token, {
    folder,
    resourceType,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signature.apiKey);
  formData.append('signature', signature.signature);

  Object.entries(signature.uploadParams).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`;

  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress({
        loaded: event.loaded,
        total: event.total,
        percentage: Math.round((event.loaded / event.total) * 100),
      });
    };

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response);
        } else {
          reject(new Error(response.error?.message || 'Cloudinary upload failed'));
        }
      } catch {
        reject(new Error('Invalid Cloudinary response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}
