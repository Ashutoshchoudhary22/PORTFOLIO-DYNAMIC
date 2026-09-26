export function getMailConfig() {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  };
}

export function isMailConfigured() {
  const config = getMailConfig();
  return Boolean(config.host && config.auth.user && config.auth.pass);
}
