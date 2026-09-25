import { Education } from '../models/Education.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Education, {
  notFoundMessage: 'Education entry not found',
  createMessage: 'Education created successfully',
  updateMessage: 'Education updated successfully',
  deleteMessage: 'Education deleted successfully',
});

export const {
  getPublicList: getPublicEducation,
  getAdminList: getAdminEducation,
  getById: getEducationById,
  create: createEducation,
  update: updateEducation,
  remove: deleteEducation,
} = crud;
