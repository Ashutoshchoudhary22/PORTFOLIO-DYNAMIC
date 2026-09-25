import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.adminToken;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : cookieToken;

  if (!token) {
    return errorResponse(res, 'Authentication required', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(decoded.id).select('+password');

  if (!admin || !admin.isActive) {
    return errorResponse(res, 'Admin account not found or inactive', 401);
  }

  req.admin = admin;
  next();
});
