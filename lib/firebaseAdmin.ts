// lib/firebaseAdmin.ts
import admin from "firebase-admin";

if (!admin.apps.length) {
  console.log("🔥 FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
  console.log("🔥 PRIVATE_KEY starts with:", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 50));

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();





