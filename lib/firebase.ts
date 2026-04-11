import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtZzm_wnE_lyi3F8qr8iCQdQA4TSEyozU",
  authDomain: "gaby-club.firebaseapp.com",
  projectId: "gaby-club",
  storageBucket: "gaby-club.firebasestorage.app",
  messagingSenderId: "1088486906554",
  appId: "1:1088486906554:web:7a30202f2a92c0010d8083"
};

// Inicializar solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };