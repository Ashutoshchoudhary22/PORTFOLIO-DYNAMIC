import { adminApi } from './api';
import { API_BASE_URL } from './axios';
import type { MediaItem } from './types';

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

export function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function mapCloudinaryResult(result: Record<string, unknown>, file: File): MediaItem {
  const isVideo = result.resource_type === 'video' || file.type.startsWith('video/');
  const secureUrl = String(result.secure_url);

  return {
    type: isVideo ? 'video' : 'image',
    provider: 'cloudinary',
    publicId: String(result.public_id),
    secureUrl,
    thumbnailUrl: isVideo ? secureUrl.replace(/\.[^.]+$/, '.jpg') : secureUrl,
    format: String(result.format || ''),
    width: Number(result.width || 0),
    height: Number(result.height || 0),
    duration: Number(result.duration || 0),
    bytes: Number(result.bytes || 0),
    originalFilename: file.name,
  };
}

function uploadPdfLocally(
  file: File,
  token: string,
  onProgress?: (progress: UploadProgress) => void
) {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise<MediaItem>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/admin/media/local`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

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
        if (xhr.status >= 200 && xhr.status < 300 && response.success) {
          resolve(response.data as MediaItem);
          return;
        }
        reject(new Error(response.message || 'PDF upload failed'));
      } catch {
        reject(new Error('Invalid upload response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

export async function uploadMediaFile(
  file: File,
  token: string,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video';
    onProgress?: (progress: UploadProgress) => void;
  } = {}
): Promise<MediaItem> {
  if (isPdfFile(file)) {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('PDF must be 10MB or smaller.');
    }
    return uploadPdfLocally(file, token, options.onProgress);
  }

  const resourceType =
    options.resourceType === 'video' || options.resourceType === 'image'
      ? options.resourceType
      : file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name)
        ? 'video'
        : 'image';

  const maxBytes = resourceType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(
      resourceType === 'video' ? 'Video must be 100MB or smaller.' : 'Image must be 10MB or smaller.'
    );
  }

  const result = await uploadToCloudinary(file, token, {
    folder: options.folder,
    resourceType,
    onProgress: options.onProgress,
  });

  return mapCloudinaryResult(result, file);
}
