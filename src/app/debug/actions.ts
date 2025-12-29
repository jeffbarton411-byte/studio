
'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { sendEmail } from '@/lib/email';
import { v2 as cloudinary } from 'cloudinary';

export async function runFirestoreTest() {
  console.log('Running Firestore test...');
  try {
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);
    const docRef = await firestore.collection('test').add({
      message: 'Hello from debug page!',
      timestamp: new Date(),
    });
    console.log('Test document written with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('Firestore test failed:', error);
    return { success: false, error: error.message };
  }
}

export async function runEmailTest() {
  console.log('Running Email test...');
  try {
    const result = await sendEmail({
      to: 'jeffbarton411@gmail.com',
      subject: 'Test Email from FormFlow Pro',
      html: '<p>This is a test email to confirm the email sending functionality is working.</p>',
    });

    if (result.success) {
      return { success: true, message: 'Test email sent successfully!' };
    }
    return { success: false, error: result.message };
  } catch (error: any) {
    console.error('Email test failed:', error);
    return { success: false, error: error.message };
  }
}

export async function runCloudinaryTest() {
  console.log('Running Cloudinary test...');
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const missingVars = [];
  if (!cloudName) missingVars.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missingVars.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET');

  if (missingVars.length > 0) {
    const errorMessage = `The following server-side environment variables are missing: ${missingVars.join(', ')}. Please set them in your Vercel project settings.`;
    console.error('Cloudinary test failed:', errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    // Configure cloudinary instance for the test
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    // Attempt to generate a signature as a way of validating credentials
    const timestamp = Math.round(new Date().getTime() / 1000);
    cloudinary.utils.api_sign_request({ timestamp }, apiSecret);

    const successMessage = `Successfully connected to Cloudinary cloud: '${cloudName}'. Credentials appear to be valid.`;
    console.log('Cloudinary test success:', successMessage);
    return { success: true, message: successMessage };

  } catch (error: any) {
    console.error('Cloudinary test failed during API call:', error);
    return { success: false, error: `Failed to connect or generate signature. Error: ${error.message}. This usually means your API Key or Secret is incorrect.` };
  }
}
