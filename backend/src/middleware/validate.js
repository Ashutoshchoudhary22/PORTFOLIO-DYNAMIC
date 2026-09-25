import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});

    return errorResponse(res, 'Validation failed', 400, formatted);
  }

  next();
}
