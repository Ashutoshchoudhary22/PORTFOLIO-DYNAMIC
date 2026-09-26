import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isMailConfigured } from '../config/mail.js';
import { createAndSendOtp, verifyOtp } from '../services/otpService.js';

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

function issueAuthResponse(res, admin, message) {
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
    message
  );
}

async function findActiveAdminByEmail(email) {
  return Admin.findOne({ email: email.toLowerCase() }).select('+password');
}

export const requestLoginOtp = asyncHandler(async (req, res) => {
  if (!isMailConfigured()) {
    return errorResponse(res, 'Email service is not configured on the server', 503);
  }

  const { email, password } = req.body;
  const admin = await findActiveAdminByEmail(email);

  if (!admin || !admin.isActive) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const otpMeta = await createAndSendOtp({
    email: admin.email,
    purpose: 'login',
  });

  return successResponse(
    res,
    {
      email: admin.email,
      expiresInMinutes: otpMeta.expiresInMinutes,
    },
    'OTP sent to your admin email'
  );
});

export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() });

  if (!admin || !admin.isActive) {
    return errorResponse(res, 'Invalid login attempt', 401);
  }

  const result = await verifyOtp({
    email: admin.email,
    otp,
    purpose: 'login',
  });

  if (!result.valid) {
    return errorResponse(res, result.message, 401);
  }

  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  return issueAuthResponse(res, admin, 'Login successful');
});

export const requestForgotPasswordOtp = asyncHandler(async (req, res) => {
  if (!isMailConfigured()) {
    return errorResponse(res, 'Email service is not configured on the server', 503);
  }

  const { email } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase(), isActive: true });

  if (admin) {
    await createAndSendOtp({
      email: admin.email,
      purpose: 'reset',
    });
  }

  return successResponse(
    res,
    { email: email.toLowerCase() },
    'If this admin account exists, an OTP has been sent to the registered email'
  );
});

export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const admin = await findActiveAdminByEmail(email);

  if (!admin || !admin.isActive) {
    return errorResponse(res, 'Invalid password reset attempt', 401);
  }

  const result = await verifyOtp({
    email: admin.email,
    otp,
    purpose: 'reset',
  });

  if (!result.valid) {
    return errorResponse(res, result.message, 401);
  }

  admin.password = newPassword;
  await admin.save();

  return successResponse(res, {}, 'Password updated successfully. You can log in now.');
});

export const getSetupStatus = asyncHandler(async (_req, res) => {
  const adminCount = await Admin.countDocuments();
  return successResponse(res, { needsSetup: adminCount === 0 });
});

export const setupAdmin = asyncHandler(async (req, res) => {
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    return errorResponse(res, 'Admin account already exists. Signup is disabled.', 403);
  }

  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const admin = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  return successResponse(
    res,
    {
      email: admin.email,
      name: admin.name,
    },
    'Admin account created successfully. Please log in.'
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
