import { NextResponse, type NextRequest } from "next/server";
import admin from "firebase-admin";

/**
 * ✅ Firebase Admin 초기화
 * - 중복 초기화 방지
 * - PEM 줄바꿈 복원 (Vercel 환경)
 * - 환경 변수 누락 검사
 */
try {
  if (!admin.apps.length) {
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
  }
} catch (error) {
  console.error("🔥 Firebase Admin 초기화 중 오류:", error);
}

const db = admin.firestore();

/**
 * ✅ GET /api/admin/check?email=example@gmail.com
 * - Firestore 'admins' 컬렉션에서 이메일 확인
 * - Admin SDK 사용 (permission-denied 방지)
 */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
    }

    const docRef = db.collection("admins").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn(`⚠️ 관리자 문서 없음: ${email}`);
      return NextResponse.json({ ok: false, error: "not_admin" });
    }

    const data = doc.data();

    if (data?.active === true) {
      console.log(`✅ 관리자 인증 성공: ${email}`);
      return NextResponse.json({ ok: true, role: data.role || "admin" });
    }

    console.warn(`⚠️ 비활성 관리자: ${email}`);
    return NextResponse.json({ ok: false, error: "inactive" });
  } catch (error) {
    console.error("❌ Firestore 관리자 확인 중 오류:", error);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
