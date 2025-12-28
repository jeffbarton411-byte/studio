'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { sendEmail } from '@/lib/email';

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
