// firebaseConfig.js

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
  apiKey: "YOUR_API_KEY_HERE",

  // The domain for Firebase Auth redirects
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

  // Your unique project identifier
  projectId: "YOUR_PROJECT_ID",

  // The storage bucket for files (if you use Firebase Storage)
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",

  // Used for Firebase Cloud Messaging
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  // Unique identifier for this specific app within the project
  appId: "YOUR_APP_ID",

  // (Optional) For Google Analytics
  measurementId: "G-YOUR_MEASUREMENT_ID"
};
