import { Project } from '../models/Project.js';
import { createCrudController } from './crudFactory.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';
import { deleteCloudinaryAsset } from '../services/cloudinaryService.js';
import { sanitizeMediaArray, sanitizeMediaItem } from '../utils/sanitizeMedia.js';

const crud = createCrudController(Project, {
  publicFilter: { published: true },
  notFoundMessage: 'Project not found',
  createMessage: 'Project created successfully',
  updateMessage: 'Project updated successfully',
  deleteMessage: 'Project deleted successfully',
  beforeCreate: async (payload) => {
    if (!payload.slug && payload.title) {
      payload.slug = slugify(payload.title);
    }
    return payload;
  },
  beforeUpdate: async (payload) => {
    if (payload.title && !payload.slug) {
      payload.slug = slugify(payload.title);
    }
    return payload;
  },
});

export const getPublicProjects = asyncHandler(async (req, res) => {
  const filter = { published: true };

  if (req.query.featured === 'true') {
    filter.featured = true;
  }

  const projects = await Project.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  return successResponse(res, projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    published: true,
  });

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  return successResponse(res, project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  const mediaItems = [
    ...(project.media || []),
    ...(project.thumbnail ? [project.thumbnail] : []),
  ];

  await Promise.allSettled(
    mediaItems.map((item) =>
      deleteCloudinaryAsset(
        item.publicId,
        item.type === 'video' ? 'video' : 'image'
      )
    )
  );

  await project.deleteOne();

  return successResponse(res, {}, 'Project deleted successfully');
});

function prepareProjectPayload(payload = {}) {
  const prepared = { ...payload };

  if (prepared.title && !prepared.slug) {
    prepared.slug = slugify(prepared.title);
  }

  if (prepared.media !== undefined) {
    prepared.media = sanitizeMediaArray(prepared.media);
  }

  if (prepared.thumbnail !== undefined) {
    prepared.thumbnail = prepared.thumbnail ? sanitizeMediaItem(prepared.thumbnail) : null;
  }

  return prepared;
}

export const {
  getAdminList: getAdminProjects,
  getById: getProjectById,
} = crud;

export const createProject = asyncHandler(async (req, res) => {
  const payload = prepareProjectPayload(req.body);
  const project = await Project.create(payload);
  return successResponse(res, project, 'Project created successfully', 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  const payload = prepareProjectPayload(req.body);
  const fields = [
    'title',
    'slug',
    'shortDescription',
    'description',
    'technologies',
    'tags',
    'githubUrl',
    'liveUrl',
    'aiHint',
    'featured',
    'published',
    'sortOrder',
    'media',
    'thumbnail',
  ];

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      project[field] = payload[field];
      project.markModified(field);
    }
  });

  await project.save();

  return successResponse(res, project, 'Project updated successfully');
});
