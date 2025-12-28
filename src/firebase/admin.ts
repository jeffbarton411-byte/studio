import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { serviceAccount } from './service-account';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!serviceAccount || !serviceAccount.project_id) {
    throw new Error('Service account credentials are not loaded correctly. Check src/firebase/service-account.ts');
  }

  return initializeApp({
    credential: credential.cert(serviceAccount),
  });
}
