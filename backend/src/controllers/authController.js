import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function signToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function setAuthCookie(res, token) {
  res.cookie('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin || !admin.isActive) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = signToken(admin._id);
  setAuthCookie(res, token);

  return successResponse(
    res,
    {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    },
    'Login successful'
  );
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('adminToken');
  return successResponse(res, {}, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, {
    id: req.admin._id,
    email: req.admin.email,
    name: req.admin.name,
    lastLoginAt: req.admin.lastLoginAt,
  });
});
