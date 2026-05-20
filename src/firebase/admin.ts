import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { serviceAccount as localServiceAccount } from './service-account';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : localServiceAccount;
    
  if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || serviceAccount.private_key.includes("PASTE YOUR NEW PRIVATE KEY HERE")) {
    throw new Error('Firebase Admin SDK service account credentials are not loaded correctly. Ensure FIREBASE_SERVICE_ACCOUNT environment variable is set for production, or update src/firebase/service-account.ts for local development.');
  }

  // Fix for newline characters in private keys which often causes "16 UNAUTHENTICATED"
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  return initializeApp({
    credential: credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}
