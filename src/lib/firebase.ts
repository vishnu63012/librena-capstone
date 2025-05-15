// ✅ Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkPxECvIMK-p4ClLzSSgQmT23LDF9_paM",
  authDomain: "softlib-1b4db.firebaseapp.com",
  projectId: "softlib-1b4db",
  storageBucket: "softlib-1b4db.appspot.com",
  messagingSenderId: "450565788691",
  appId: "1:450565788691:web:52ed2de8abe7a713c89be6",
  measurementId: "G-KPFTMLMWB4",
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Firebase Services
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Export for use across the app
export {
  app,
  db,
  auth,
};
