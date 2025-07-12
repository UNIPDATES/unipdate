// lib/emailUtils.js
import nodemailer from 'nodemailer';

const GOOGLE_EMAIL_USER = process.env.GOOGLE_EMAIL_USER;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

if (!GOOGLE_EMAIL_USER || !GOOGLE_APP_PASSWORD) {
  console.warn("Nodemailer environment variables (GOOGLE_EMAIL_USER, GOOGLE_APP_PASSWORD) are not fully set. Email sending might fail.");
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' for Gmail, or configure SMTP for other services
  auth: {
    user: GOOGLE_EMAIL_USER,
    pass: GOOGLE_APP_PASSWORD,
  },
});

/**
 * Sends an email using Nodemailer.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} html - HTML content of the email.
 * @returns {Promise<Object>} Mail send information.
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `Your Admin System <${GOOGLE_EMAIL_USER}>`, // Sender address
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};