export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/components/Dashboard";
import LoginSection from "@/components/LoginSection";
import admin from "firebase-admin";
import Footer from "@/components/Footer";

/* -------------------------------------------------------
 ✅ Firebase Admin SDK 초기화 (서버 환경 전용)
------------------------------------------------------- */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/* -------------------------------------------------------
 ✅ EnterPage: 로그인 + Firestore 기반 접근 제어
------------------------------------------------------- */
export default async function EnterPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  // 1️⃣ 로그인 안 된 경우
  if (!session) return <LoginSection />;

  let isAdmin = false;
  let subscriptionStatus: "active" | "expired" | null = null;
  let subscriptionName: string | null = null;
  let expiresAt: Date | null = null;

  if (email) {
    try {
      /* ✅ 관리자 확인 */
      const adminDoc = await db.collection("admins").doc(email).get();
      if (adminDoc.exists && adminDoc.data()?.active) {
        isAdmin = true;
      }

      /* ✅ 구독 상태 확인 */
      const subsSnap = await db
        .collection("subscriptions")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!subsSnap.empty) {
        const subsData = subsSnap.docs[0].data();
        subscriptionStatus = subsData.status || null;
        subscriptionName = subsData.name || null;
        expiresAt = subsData.expiresAt?.toDate?.() || null;
      }
    } catch (error) {
      console.error("❌ Firestore 접근 오류:", error);
    }
  }

  /* -------------------------------------------------------
   ✅ 권한 없음 처리
  ------------------------------------------------------- */
  if (!isAdmin && !subscriptionStatus) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>접근 권한이 없습니다</h1>
        <p>이 워크샵은 등록된 교사 또는 관리자만 접근 가능합니다.</p>
        <p style={{ marginTop: "1rem", color: "#888" }}>
          현재 로그인된 이메일: <strong>{email}</strong>
        </p>
        <a
          href="/api/auth/signout"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            border: "1px solid #999",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          로그아웃
        </a>
      </div>
    );
  }

  /* -------------------------------------------------------
   ✅ 권한 OK → Dashboard 렌더링
  ------------------------------------------------------- */
  return (
    <Dashboard
      user={session.user}
      isAdmin={isAdmin}
      subscriptionStatus={subscriptionStatus}
      subscriptionName={subscriptionName}
      expiresAt={expiresAt}
    />
  );
}
