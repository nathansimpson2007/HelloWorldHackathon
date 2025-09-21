// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "fs-ast-default-6479e",
  "appId": "1:936991157978:web:736ac3a7771741517728f3",
  "storageBucket": "fs-ast-default-6479e.appspot.com",
  "apiKey": "AIzaSyAzVbL5k7O3b5Q4f6R7c8d9e0f1g2h3i4",
  "authDomain": "fs-ast-default-6479e.firebaseapp.com",
  "messagingSenderId": "936991157978"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
