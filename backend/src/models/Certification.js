import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    period: { type: String, trim: true },
    description: { type: String, trim: true },
    iconUrl: { type: String, trim: true },
    issueDate: Date,
    credentialUrl: String,
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Certification = mongoose.model('Certification', certificationSchema);
