import admin from "firebase-admin";

// ✅ Firebase Admin SDK는 Node.js 환경에서만 실행되어야 함
export const runtime = "nodejs";

/**
 * ✅ Firebase Admin 초기화
 * - 중복 초기화 방지 (Next.js에서 hot reload 시 multiple app 방지)
 * - PRIVATE_KEY 줄바꿈(\\n → \n) 복원
 * - 환경 변수 누락 시 명확한 로그 출력
 */
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.error("❌ Firebase Admin 환경 변수 누락", {
        hasProjectId: !!projectId,
        hasClientEmail: !!clientEmail,
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
      console.log("✅ Firebase Admin 초기화 성공");
    }
  } catch (error) {
    console.error("🔥 Firebase Admin 초기화 중 오류:", error);
  }
}

// ✅ Firestore & Auth 인스턴스 내보내기
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();







