
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { serviceAccount } from './service-account';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || serviceAccount.private_key === "PASTE YOUR NEW PRIVATE KEY HERE") {
    throw new Error('Service account credentials are not loaded correctly. Please generate a new private key and paste it into src/firebase/service-account.ts');
  }

  // The private key from the service account file is used directly.
  // No special formatting is needed when importing from a .ts file.
  return initializeApp({
    credential: credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
}
