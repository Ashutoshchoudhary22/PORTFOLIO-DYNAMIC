import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AdminOtp } from '../models/AdminOtp.js';
import { sendOtpEmail } from './emailService.js';

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function generateOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

export async function createAndSendOtp({ email, purpose }) {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOtpCode();
  const otpHash = await bcrypt.hash(otp, 10);

  await AdminOtp.deleteMany({ email: normalizedEmail, purpose, used: false });

  await AdminOtp.create({
    email: normalizedEmail,
    otpHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });

  await sendOtpEmail({
    to: normalizedEmail,
    otp,
    purpose,
  });

  return { expiresInMinutes: 10 };
}

export async function verifyOtp({ email, otp, purpose }) {
  const normalizedEmail = email.toLowerCase().trim();
  const record = await AdminOtp.findOne({
    email: normalizedEmail,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .select('+otpHash');

  if (!record) {
    return { valid: false, message: 'OTP expired or invalid. Request a new one.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.used = true;
    await record.save();
    return { valid: false, message: 'Too many invalid attempts. Request a new OTP.' };
  }

  const isMatch = await bcrypt.compare(String(otp), record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return { valid: false, message: 'Invalid OTP. Please try again.' };
  }

  record.used = true;
  await record.save();
  await AdminOtp.deleteMany({ email: normalizedEmail, purpose });

  return { valid: true };
}
