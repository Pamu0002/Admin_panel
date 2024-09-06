// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1CdjrKz29bLKOFXZkTkc09DMMZYLaXAk",
  authDomain: "medicare-3ec1a.firebaseapp.com",
  projectId: "medicare-3ec1a",
  storageBucket: "medicare-3ec1a.appspot.com",
  messagingSenderId: "748246390802",
  appId: "1:748246390802:web:843233bdcb68d2457ce0cb",
  measurementId: "G-LCKKC4NP46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
