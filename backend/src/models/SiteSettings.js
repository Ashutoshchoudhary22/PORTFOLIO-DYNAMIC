import mongoose from 'mongoose';
import { mediaSchema } from './MediaSchema.js';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const sectionVideoSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ['hero', 'about', 'services', 'projects', 'contact', 'header', 'footer', 'login'],
      required: true,
      trim: true,
    },
    media: mediaSchema,
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    profileName: { type: String, default: 'Ashutosh Choudhary' },
    heroHeading: { type: String, default: "Hi, I'm Ashutosh Choudhary" },
    heroSubtitle: {
      type: String,
      default:
        'Full Stack Developer with 1.5+ years of experience building production-grade MERN SaaS platforms, HRM systems, CRM solutions, and enterprise dashboards.',
    },
    aboutText: {
      type: String,
      default:
        'Full Stack Developer with 1.5+ years of experience building production-grade SaaS platforms, HRM systems, and enterprise dashboards with the MERN stack.',
    },
    contactEmail: { type: String, default: 'akkychoudhary5468@gmail.com' },
    contactHeading: { type: String, default: "Let's Build Something Great" },
    contactSubtitle: {
      type: String,
      default:
        'Have a project, product, or team opportunity in mind? Send a message or email me.',
    },
    projectsHeading: { type: String, default: 'My Projects' },
    projectsSubtitle: {
      type: String,
      default:
        'Here are some of my key projects showcasing expertise in MERN stack development, B2B platforms, HRM systems, and enterprise solutions.',
    },
    servicesHeading: { type: String, default: 'My Services' },
    footerText: { type: String, default: 'Made by Ashutosh Choudhary' },
    logo: mediaSchema,
    resume: mediaSchema,
    sectionVideos: [sectionVideoSchema],
    socialLinks: [socialLinkSchema],
    seo: {
      title: { type: String, default: 'Ashutosh Choudhary Portfolio' },
      description: {
        type: String,
        default:
          'Portfolio of Ashutosh Choudhary, a Full Stack Developer specializing in MERN, SaaS, HRM, CRM, and enterprise dashboards.',
      },
      canonicalUrl: String,
      ogImage: mediaSchema,
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
