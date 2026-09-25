import mongoose from 'mongoose';
import { mediaSchema } from './MediaSchema.js';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    iconType: {
      type: String,
      enum: ['code', 'database', 'cloud', 'custom'],
      default: 'code',
    },
    image: mediaSchema,
    video: mediaSchema,
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
