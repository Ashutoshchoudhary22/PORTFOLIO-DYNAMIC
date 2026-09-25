import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Certification } from '../models/Certification.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { Service } from '../models/Service.js';
import { Education } from '../models/Education.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalProjects,
    publishedProjects,
    totalSkills,
    totalExperience,
    totalCertifications,
    totalMessages,
    unreadMessages,
    totalServices,
    totalEducation,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ published: true }),
    Skill.countDocuments({ isActive: true }),
    Experience.countDocuments({ isActive: true }),
    Certification.countDocuments({ isActive: true }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    Service.countDocuments({ isActive: true }),
    Education.countDocuments({ isActive: true }),
  ]);

  const recentMessages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email message isRead createdAt');

  return successResponse(res, {
    stats: {
      totalProjects,
      publishedProjects,
      totalSkills,
      totalExperience,
      totalCertifications,
      totalMessages,
      unreadMessages,
      totalServices,
      totalEducation,
    },
    recentMessages,
  });
});
