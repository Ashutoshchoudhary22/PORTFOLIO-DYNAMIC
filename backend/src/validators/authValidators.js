import { body } from 'express-validator';

export const loginRequestOtpValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const verifyOtpValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit code'),
];

export const forgotPasswordOtpValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

export const setupAdminValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

export const resetPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp')
    .matches(/^\d{6}$/)
    .withMessage('OTP must be a 6-digit code'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];
