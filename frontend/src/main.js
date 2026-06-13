import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createClient } from './api/client.js';
import { initializeApp as initApp } from './app.js';

// Firebase config - replace with your config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Initialize API client
const apiClient = createClient(import.meta.env.VITE_API_URL || 'http://localhost:3001');

// Wait for auth state to change, then initialize app
onAuthStateChanged(auth, (user) => {
  initApp({
    auth,
    apiClient,
    user
  });
});
