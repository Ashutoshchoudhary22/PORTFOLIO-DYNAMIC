import { errorResponse } from '../utils/apiResponse.js';

export function notFoundHandler(req, res) {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message])
    );
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return errorResponse(res, `${field} already exists`, 409);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid resource identifier', 400);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Invalid or expired token', 401);
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? err.statusCode
        ? err.message
        : 'Internal server error'
      : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
}
