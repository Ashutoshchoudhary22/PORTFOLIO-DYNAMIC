import { Service } from '../models/Service.js';
import { createCrudController } from './crudFactory.js';

const crud = createCrudController(Service, {
  notFoundMessage: 'Service not found',
  createMessage: 'Service created successfully',
  updateMessage: 'Service updated successfully',
  deleteMessage: 'Service deleted successfully',
});

export const {
  getPublicList: getPublicServices,
  getAdminList: getAdminServices,
  getById: getServiceById,
  create: createService,
  update: updateService,
  remove: deleteService,
} = crud;
