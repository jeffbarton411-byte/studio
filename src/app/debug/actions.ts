
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
    
    // Test write
    const docRef = await firestore.collection('test_connections').add({
      message: 'Connection test from debug page',
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    });
    
    // Test read
    const docSnap = await docRef.get();
    
    console.log('Test document written with ID: ', docRef.id);
    return { 
      success: true, 
      id: docRef.id,
      data: docSnap.data(),
      projectId: app.options.credential ? (app.options as any).projectId : 'unknown'
    };
  } catch (error: any) {
    console.error('Firestore test failed:', error);
    return { success: false, error: error.message, stack: error.stack };
  }
}

export async function runEmailTest() {
  console.log('Running Email test...');
  try {
    const adminEmail = 'jeffbarton@mode-transportation.com';
    const result = await sendEmail({
      to: adminEmail,
      subject: 'Infrastructure Test - drive4mmm',
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #000; color: #fff;">
          <h1 style="color: #F97316;">Infrastructure Test</h1>
          <p>This is a diagnostic email from the <strong>drive4mmm</strong> debug panel.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (result.success) {
      return { success: true, message: `Test email sent successfully to ${adminEmail}` };
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
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const missingVars = [];
  if (!cloudName) missingVars.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  if (!apiKey) missingVars.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET');

  if (missingVars.length > 0) {
    return { success: false, error: `Missing environment variables: ${missingVars.join(', ')}` };
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({ timestamp }, apiSecret);

    return { 
      success: true, 
      message: `Connected to Cloudinary: ${cloudName}`,
      details: { timestamp, signature: signature.substring(0, 8) + '...' }
    };

  } catch (error: any) {
    console.error('Cloudinary test failed:', error);
    return { success: false, error: error.message };
  }
}
