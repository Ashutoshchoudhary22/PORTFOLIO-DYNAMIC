import mongoose from 'mongoose';

export const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    provider: {
      type: String,
      default: 'cloudinary',
    },
    publicId: {
      type: String,
      required: true,
    },
    secureUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    format: String,
    width: Number,
    height: Number,
    duration: Number,
    bytes: Number,
    sortOrder: {
      type: Number,
      default: 0,
    },
    originalFilename: String,
  },
  { _id: true }
);

export function normalizeMediaPayload(media = []) {
  return [...media]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item, index) => ({
      ...item,
      sortOrder: item.sortOrder ?? index,
    }));
}
