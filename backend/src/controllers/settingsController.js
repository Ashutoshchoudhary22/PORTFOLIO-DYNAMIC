import { SiteSettings } from '../models/SiteSettings.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  return settings;
}

export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  return successResponse(res, settings);
});

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  return successResponse(res, settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const allowedFields = [
    'profileName',
    'heroHeading',
    'heroSubtitle',
    'aboutText',
    'contactEmail',
    'contactHeading',
    'contactSubtitle',
    'projectsHeading',
    'projectsSubtitle',
    'servicesHeading',
    'footerText',
    'logo',
    'resume',
    'sectionVideos',
    'socialLinks',
    'seo',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
      settings.markModified(field);
    }
  });

  await settings.save();

  return successResponse(res, settings, 'Settings updated successfully');
});

export const getPublicProfile = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();

  return successResponse(res, {
    name: settings.profileName,
    heroHeading: settings.heroHeading,
    heroSubtitle: settings.heroSubtitle,
    aboutText: settings.aboutText,
    contactEmail: settings.contactEmail,
    resume: settings.resume,
    logo: settings.logo,
    socialLinks: settings.socialLinks?.filter((link) => link.isActive) || [],
    seo: settings.seo,
    sectionVideos: settings.sectionVideos || [],
  });
});

export const getSocialLinks = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  const links = (settings.socialLinks || [])
    .filter((link) => link.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return successResponse(res, links);
});
