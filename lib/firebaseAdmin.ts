import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // 🔹 중요: Vercel에서는 줄바꿈이 \\n 으로 저장되므로 실제 줄바꿈으로 복원
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("❌ Firebase Admin 초기화 실패: 환경변수가 누락되었습니다.", {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      privateKeyLength: privateKey?.length || 0,
    });
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("✅ Firebase Admin 초기화 성공");
    } catch (error) {
      console.error("🔥 Firebase Admin 초기화 중 오류 발생:", error);
    }
  }
}

// 🔹 Firestore & Auth export
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();






