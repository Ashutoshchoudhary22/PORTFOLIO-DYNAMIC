import { Experience } from '../models/Experience.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Experience, {
  notFoundMessage: 'Experience not found',
  createMessage: 'Experience created successfully',
  updateMessage: 'Experience updated successfully',
  deleteMessage: 'Experience deleted successfully',
});

export const {
  getPublicList: getPublicExperience,
  getAdminList: getAdminExperience,
  getById: getExperienceById,
  create: createExperience,
  update: updateExperience,
  remove: deleteExperience,
} = crud;
