import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.error("❌ Firebase Admin 초기화 실패: 환경변수가 누락되었습니다.", {
      projectId,
      clientEmail: !!clientEmail,
      privateKeyLength: privateKey?.length || 0,
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();





