import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

let db;

export function initializeFirebase() {
  try {
    // Try to use service account file first
    const serviceAccountPath = resolve('./serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  } catch (e) {
    // Fall back to environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  }
  
  db = admin.firestore();
  console.log('✅ Firebase initialized');
  return db;
}

export function getDb() {
  return db;
}

export function getAuth() {
  return admin.auth();
}
