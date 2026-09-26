import nodemailer from 'nodemailer';
import { getMailConfig, isMailConfigured } from '../config/mail.js';

let transporter;

function getTransporter() {
  if (!isMailConfigured()) {
    throw new Error('SMTP is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to .env');
  }

  if (!transporter) {
    const config = getMailConfig();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  return transporter;
}

export async function sendOtpEmail({ to, otp, purpose }) {
  const config = getMailConfig();
  const subject =
    purpose === 'reset'
      ? 'Portfolio Admin Password Reset OTP'
      : 'Portfolio Admin Login OTP';

  const intro =
    purpose === 'reset'
      ? 'Use this OTP to reset your admin password:'
      : 'Use this OTP to complete your admin login:';

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:520px;margin:0 auto;padding:24px;">
      <h2 style="margin:0 0 12px;color:#4f46e5;">Portfolio Admin</h2>
      <p style="margin:0 0 16px;">${intro}</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 20px;background:#f3f4f6;border-radius:12px;text-align:center;">
        ${otp}
      </div>
      <p style="margin:16px 0 0;color:#6b7280;font-size:14px;">
        This OTP expires in 10 minutes. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  await getTransporter().sendMail({
    from: config.from,
    to,
    subject,
    html,
    text: `${intro} ${otp}. This OTP expires in 10 minutes.`,
  });
}
