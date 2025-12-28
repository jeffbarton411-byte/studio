
import { initializeApp, getApps, getApp, type App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { serviceAccount } from './service-account';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key) {
    throw new Error('Service account credentials are not loaded correctly. Check src/firebase/service-account.ts');
  }

  // The private_key from the service account JSON contains literal "\n" characters.
  // We need to replace them with actual newline characters for the PEM parser to work correctly.
  const formattedPrivateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

  return initializeApp({
    credential: credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: formattedPrivateKey,
    }),
  });
}
