import mongoose from 'mongoose';
import { mediaSchema, normalizeMediaPayload } from './MediaSchema.js';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: String,
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    githubUrl: String,
    liveUrl: String,
    aiHint: String,
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    media: [mediaSchema],
    thumbnail: mediaSchema,
  },
  { timestamps: true }
);

projectSchema.pre('save', function normalizeMedia(next) {
  if (this.media?.length) {
    this.media = normalizeMediaPayload(this.media);
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
