// lib/emailUtils.js
import nodemailer from 'nodemailer';

// Configure Nodemailer with your Google App Specific Password
// IMPORTANT: Store these securely in your .env.local file.
// GOOGLE_EMAIL_USER=your_email@gmail.com
// GOOGLE_APP_PASSWORD=your_app_specific_password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

/**
 * Sends an email with the given options.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text content.
 * @param {string} html - HTML content.
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL_USER,
      to,
      subject,
      text,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Failed to send email.');
  }
};

/**
 * Generates a random 6-digit OTP.
 * @returns {string} The generated OTP.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};