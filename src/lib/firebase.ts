// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "studio-2732445618-faed9",
  "appId": "1:388213966810:web:234e4c73ad4e41e4b462e3",
  "apiKey": "AIzaSyA25pebi7XOqpbhipXTMJcx2xakA1RsJSg",
  "authDomain": "studio-2732445618-faed9.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "388213966810"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
