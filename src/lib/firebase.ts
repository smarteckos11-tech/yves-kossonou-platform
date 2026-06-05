import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4sQ_F16m48R1Wm1gI_6BDR8hPA7d2A9M",
  authDomain: "vora-a8334.firebaseapp.com",
  projectId: "vora-a8334",
  storageBucket: "vora-a8334.firebasestorage.app",
  messagingSenderId: "1045672768245",
  appId: "1:1045672768245:web:00b9c2e0e86a41e82e8bbc",
  measurementId: "G-GVBL3B9LN9"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
