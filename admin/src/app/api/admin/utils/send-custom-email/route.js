// app/api/admin/utils/send-custom-email/route.js
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailUtils'; // Your existing email utility
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Protect this API

export const POST = adminAuthMiddleware(async (req) => {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ message: 'Recipient, subject, and HTML content are required.' }, { status: 400 });
    }

    await sendEmail(to, subject, html);

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error sending custom email:", error);
    return NextResponse.json({ message: 'Failed to send email.', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Only superadmin can send custom emails