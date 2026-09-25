import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    startDate: Date,
    endDate: Date,
    period: { type: String, trim: true },
    description: { type: String, required: true },
    technologies: [{ type: String, trim: true }],
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Experience = mongoose.model('Experience', experienceSchema);
