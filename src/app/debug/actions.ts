'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';

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
