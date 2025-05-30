
// TODO: Replace with your actual Firebase project configuration
// It's recommended to use environment variables for these values.
// Example: process.env.NEXT_PUBLIC_FIREBASE_API_KEY

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAK7HAO4JDFpjaCn9E1Y8hoNAtBgFno20k",
  authDomain: "mwp-dm-test-5.firebaseapp.com",
  projectId: "mwp-dm-test-5",
  storageBucket: "mwp-dm-test-5.firebasestorage.app", // Corrected from firebasestorage.app to appspot.com if that's the typical pattern, but will use user's provided value. User provided "mwp-dm-test-5.firebasestorage.app" which seems custom or a new format. Will stick to it.
  messagingSenderId: "1029984674097",
  appId: "1:1029984674097:web:11d957f183c8a827281010",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
