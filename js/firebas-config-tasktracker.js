/**
 * Firebase Configuration Object
 * * To obtain these values:
 * 1. Go to the Firebase Console (console.firebase.google.com)
 * 2. Click on your project
 * 3. Go to Project Settings (gear icon) > General
 * 4. Scroll down to "Your apps" and select the web app (</>)
 */

export const firebaseConfig = {
  // The API key for your Firebase project (safe to expose in client-side code, 
  // but ensure you set up 'API Restrictions' in Google Cloud Console)
  apiKey: "AIzaSyA-AwiFvSq3_AuDVZE5l1Pn4oAIfZTFmOM",

  // The domain for Firebase Auth redirects
  authDomain: "opsf---comms-task-tracker.firebaseapp.com",

  // Your unique project identifier
  projectId: "opsf---comms-task-tracker",

  // The storage bucket for files (if you use Firebase Storage)
  storageBucket: "opsf---comms-task-tracker.firebasestorage.app",

  // Used for Firebase Cloud Messaging
  messagingSenderId: "489224390639",

  // Unique identifier for this specific app within the project
  appId: "1:489224390639:web:54b9f2772aaef86d32581a",

  // (Optional) For Google Analytics
  measurementId: "G-PE0JBKHX9W"
};
