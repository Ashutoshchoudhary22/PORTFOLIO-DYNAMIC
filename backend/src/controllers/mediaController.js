import {
  deleteCloudinaryAsset,
  generateSignedUploadParams,
  isCloudinaryConfigured,
  mapCloudinaryUploadResult,
} from '../services/cloudinaryService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUploadSignature = asyncHandler(async (req, res) => {
  if (!isCloudinaryConfigured()) {
    return errorResponse(res, 'Cloudinary is not configured on the server', 503);
  }

  const { folder = 'portfolio', resourceType = 'auto' } = req.query;

  const signedParams = generateSignedUploadParams({
    folder,
    resourceType,
  });

  return successResponse(res, signedParams, 'Upload signature generated');
});

export const saveUploadedMedia = asyncHandler(async (req, res) => {
  const { uploadResult, type, sortOrder = 0 } = req.body;

  if (!uploadResult?.public_id || !uploadResult?.secure_url) {
    return errorResponse(res, 'Invalid Cloudinary upload result', 400);
  }

  const media = {
    ...mapCloudinaryUploadResult(uploadResult, type),
    sortOrder,
  };

  return successResponse(res, media, 'Media metadata saved', 201);
});

export const deleteMediaAsset = asyncHandler(async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;

  if (!publicId) {
    return errorResponse(res, 'publicId is required', 400);
  }

  const result = await deleteCloudinaryAsset(publicId, resourceType);

  return successResponse(res, result, 'Media deleted from Cloudinary');
});
