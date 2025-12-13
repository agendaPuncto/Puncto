import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

let app: App;

// Initialize Firebase Admin SDK (server-side only)
if (!getApps().length) {
  let serviceAccount: any;

  // Option 1: Use service account JSON file path (for development)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }
  }
  // Option 2: Use service account JSON string (for Vercel)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // Option 3: Use individual environment variables (for production)
  else {
    serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }

  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || serviceAccount.projectId,
  });
} else {
  app = getApps()[0];
}

// Export Firebase Admin services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
