
'use server';

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  // We only create the transporter if the credentials are provided
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      `***************************************************************************
       * GMAIL_EMAIL or GMAIL_APP_PASSWORD environment variables are not set.  *
       * Email will not be sent. Please create a .env.local file with these    *
       * variables to enable email sending.                                    *
       ***************************************************************************`
    );
    // In a real app, you might want to throw an error or handle this case differently
    // For this prototype, we will just log a warning and not send the email.
    return { success: false, message: 'Email credentials not configured.' };
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"FormFlow Pro" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}
