import { Certification } from '../models/Certification.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Certification, {
  notFoundMessage: 'Certification not found',
  createMessage: 'Certification created successfully',
  updateMessage: 'Certification updated successfully',
  deleteMessage: 'Certification deleted successfully',
});

export const {
  getPublicList: getPublicCertifications,
  getAdminList: getAdminCertifications,
  getById: getCertificationById,
  create: createCertification,
  update: updateCertification,
  remove: deleteCertification,
} = crud;
