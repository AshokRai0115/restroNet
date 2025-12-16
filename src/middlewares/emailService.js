// utils/email.js
const nodemailer = require('nodemailer');

async function createTransporter() {
  // Use environment variables in production for credentials & secure.
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * sendMail({ to, subject, html })
 */
async function sendMail({ to, subject, html, text }) {
  const transporter = await createTransporter();
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  const info = await transporter.sendMail({ from, to, subject, html, text });
  // in prod you may log info.messageId
  return info;
}

module.exports = { sendMail };
