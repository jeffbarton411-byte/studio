
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { serviceAccount as localServiceAccount } from './service-account';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // Determine which service account object to use
  let serviceAccount = localServiceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', e);
    }
  }
    
  if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || serviceAccount.private_key.includes("PASTE YOUR NEW PRIVATE KEY HERE")) {
    throw new Error('Firebase Admin SDK service account credentials are not loaded correctly. Ensure FIREBASE_SERVICE_ACCOUNT environment variable is set for production, or update src/firebase/service-account.ts for local development.');
  }

  // Handle various potential formats of the private key (escaped vs literal newlines)
  let privateKey = serviceAccount.private_key;
  if (privateKey && typeof privateKey === 'string') {
    // If it contains literal '\n' as characters, replace them with actual newlines
    if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
    }
  }

  return initializeApp({
    credential: credential.cert({
        ...serviceAccount,
        private_key: privateKey
    }),
    projectId: serviceAccount.project_id
  });
}
