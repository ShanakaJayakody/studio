// TODO: Replace with your actual Firebase project configuration
// It's recommended to use environment variables for these values.
// Example: process.env.NEXT_PUBLIC_FIREBASE_API_KEY

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore

const firebaseConfig = {
  apiKey: "AIzaSyAK7HAO4JDFpjaCn9E1Y8hoNAtBgFno20k",
  authDomain: "mwp-dm-test-5.firebaseapp.com",
  projectId: "mwp-dm-test-5",
  storageBucket: "mwp-dm-test-5.firebasestorage.app", 
  messagingSenderId: "1029984674097",
  appId: "1:1029984674097:web:11d957f183c8a827281010",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore and export it

export { app, auth, db }; // Export db
