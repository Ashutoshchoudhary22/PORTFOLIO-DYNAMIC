export interface MediaItem {
  _id?: string;
  type: 'image' | 'video';
  provider?: string;
  publicId: string;
  secureUrl: string;
  thumbnailUrl?: string;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes?: number;
  sortOrder?: number;
  originalFilename?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export interface ProfileData {
  name: string;
  heroHeading: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  resume?: MediaItem;
  logo?: MediaItem;
  socialLinks: SocialLink[];
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: MediaItem;
  };
  sectionVideos?: SectionVideo[];
}

export interface SectionVideo {
  section: string;
  media: MediaItem;
}

export interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SkillItem {
  _id?: string;
  name: string;
  description?: string;
  category: string;
  iconType?: string;
  iconUrl?: string;
  bgColor?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  period?: string;
  description: string;
  technologies?: string[];
  sortOrder?: number;
  isActive?: boolean;
}

export interface EducationItem {
  _id?: string;
  degree: string;
  institution: string;
  period?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CertificationItem {
  _id?: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ProjectItem {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  tags?: string[];
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  aiHint?: string;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  media?: MediaItem[];
  thumbnail?: MediaItem;
}

export interface ServiceItem {
  _id?: string;
  title: string;
  description: string;
  iconType?: string;
  image?: MediaItem;
  video?: MediaItem;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export interface DashboardStats {
  stats: {
    totalProjects: number;
    publishedProjects: number;
    totalSkills: number;
    totalExperience: number;
    totalCertifications: number;
    totalMessages: number;
    unreadMessages: number;
    totalServices: number;
    totalEducation: number;
  };
  recentMessages: ContactMessage[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}
