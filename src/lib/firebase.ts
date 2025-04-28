
// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkPxECvIMK-p4ClLzSSgQmT23LDF9_paM",
  authDomain: "softlib-1b4db.firebaseapp.com",
  projectId: "softlib-1b4db",
  storageBucket: "softlib-1b4db.firebasestorage.app",
  messagingSenderId: "450565788691",
  appId: "1:450565788691:web:52ed2de8abe7a713c89be6",
  measurementId: "G-KPFTMLMWB4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
