import * as admin from 'firebase-admin';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Assumes GOOGLE_APPLICATION_CREDENTIALS is set
    // Or you can pass specific config here for development
  });
}

export default admin;
