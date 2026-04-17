import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAl_IO_Y-xWCK333pnXQmGiaJ3IuIrdJEk",
  authDomain: "tipico-caribeno.firebaseapp.com",
  projectId: "tipico-caribeno",
  storageBucket: "tipico-caribeno.firebasestorage.app",
  messagingSenderId: "349147555780",
  appId: "1:349147555780:web:35372f753cb66d50cca691"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };