// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCe_z200upjOu_DNNKCXAuGM32dkJEGFjs",
  authDomain: "color-bottle-app.firebaseapp.com",
  projectId: "color-bottle-app",
  storageBucket: "color-bottle-app.firebasestorage.app",
  messagingSenderId: "111860424223",
  appId: "1:111860424223:web:37d9bef47b2639e7c03f2a"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
