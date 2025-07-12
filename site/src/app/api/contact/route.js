// app/api/contact/request/route.js
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact'; // Import the Contact model
import UserProfile from '@/models/UserProfile'; // Import UserProfile model
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'outlook', 'sendgrid', etc.
  auth: {
    user: process.env.GOOGLE_EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function POST(req) {
  await dbConnect(); // Connect to MongoDB

  try {
    const { userId, message, relatedWith, collegeId } = await req.json();

    // Basic validation
    if (!userId || !message || !relatedWith) {
      return NextResponse.json({ success: false, message: 'Missing required fields: userId, message, or relatedWith.' }, { status: 400 });
    }

    // collegeId is required if relatedWith is 'college'
    if (relatedWith === 'college' && !collegeId) {
      return NextResponse.json({ success: false, message: 'College ID is required for college-related contact when relatedWith is "college".' }, { status: 400 });
    }

    // Create a new contact request
    const newContactRequest = await Contact.create({
      userId,
      message,
      relatedWith,
      college: relatedWith === 'college' ? collegeId : undefined, // Only include college if relatedWith is 'college'
    });

    // Fetch user's email for confirmation email
    let userEmail = 'default@example.com'; // Fallback email
    try {
      const userProfile = await UserProfile.findById(userId); 
      if (userProfile && userProfile.email) {
        userEmail = userProfile.email;
      } else {
        console.warn(`User profile not found or email missing for userId: ${userId}. Using fallback email.`);
      }
    } catch (fetchError) {
      console.error('Error fetching user profile for email:', fetchError);
    }
    
    // Send confirmation email
    if (process.env.GOOGLE_EMAIL_USER && process.env.GOOGLE_APP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: process.env.GOOGLE_EMAIL_USER,
          to: userEmail, // Send to the user who submitted the request
          subject: 'UNIPDATES: Your Contact Request Has Been Received',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4CAF50;">Contact Request Received!</h2>
              <p>Dear UNIPDATES User,</p>
              <p>Thank you for contacting us. Your message has been successfully received.</p>
              <p><strong>Message:</strong> ${message}</p>
              <p>We will review your message and get back to you if a response is required.</p>
              <p>Best regards,</p>
              <p>The UNIPDATES Team</p>
            </div>
          `,
        });
        console.log('Contact confirmation email sent successfully.');
      } catch (emailError) {
        console.error('Error sending contact confirmation email:', emailError);
        // Do not block the request success if email fails, but log it.
      }
    } else {
      console.warn('Nodemailer credentials not set. Skipping contact email sending.');
    }

    return NextResponse.json({ success: true, data: newContactRequest }, { status: 201 });

  } catch (error) {
    console.error('Error creating contact request:', error);
    return NextResponse.json({ success: false, message: 'Failed to create contact request due to server error.', error: error.message }, { status: 500 });
  }
}