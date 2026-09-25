import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export function createCrudController(Model, options = {}) {
  const {
    publicFilter = { isActive: true },
    adminSort = { sortOrder: 1, createdAt: -1 },
    publicSort = { sortOrder: 1, createdAt: -1 },
    notFoundMessage = 'Resource not found',
    createMessage = 'Created successfully',
    updateMessage = 'Updated successfully',
    deleteMessage = 'Deleted successfully',
    beforeCreate,
    beforeUpdate,
  } = options;

  return {
    getPublicList: asyncHandler(async (_req, res) => {
      const items = await Model.find(publicFilter).sort(publicSort);
      return successResponse(res, items);
    }),

    getAdminList: asyncHandler(async (_req, res) => {
      const items = await Model.find().sort(adminSort);
      return successResponse(res, items);
    }),

    getById: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id);

      if (!item) {
        return errorResponse(res, notFoundMessage, 404);
      }

      return successResponse(res, item);
    }),

    create: asyncHandler(async (req, res) => {
      let payload = req.body;

      if (beforeCreate) {
        payload = await beforeCreate(payload, req);
      }

      const item = await Model.create(payload);
      return successResponse(res, item, createMessage, 201);
    }),

    update: asyncHandler(async (req, res) => {
      let payload = req.body;

      if (beforeUpdate) {
        payload = await beforeUpdate(payload, req);
      }

      const item = await Model.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return errorResponse(res, notFoundMessage, 404);
      }

      return successResponse(res, item, updateMessage);
    }),

    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);

      if (!item) {
        return errorResponse(res, notFoundMessage, 404);
      }

      return successResponse(res, {}, deleteMessage);
    }),
  };
}
