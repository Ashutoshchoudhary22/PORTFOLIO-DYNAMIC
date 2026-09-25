import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    iconType: { type: String, default: 'code' },
    iconUrl: String,
    bgColor: String,
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, sortOrder: 1 });

export const Skill = mongoose.model('Skill', skillSchema);
