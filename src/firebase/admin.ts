import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined;

  if (serviceAccount) {
    // For production environments with service account credentials
    return initializeApp({
      credential: credential.cert(serviceAccount),
    });
  } else {
    // For local development or environments without explicit service accounts
    // (e.g., relying on Application Default Credentials in Google Cloud environments)
    return initializeApp();
  }
}
