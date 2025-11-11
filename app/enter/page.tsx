export const runtime = "nodejs";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/components/Dashboard";
import LoginSection from "@/components/LoginSection";
import { adminDb } from "@/lib/firebaseAdmin";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/LogoutButton";

/* -------------------------------------------------------
 ✅ EnterPage: 로그인 + Firestore 기반 접근 제어
------------------------------------------------------- */
export default async function EnterPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  // 🔹 로그인 안 된 경우
  if (!session) return <LoginSection />;

  let isAdmin = false;
  let subscriptionStatus: "active" | "expired" | null = null;
  let subscriptionName: string | null = null;
  let expiresAt: Date | null = null;

  if (email) {
    try {
      /* ✅ 관리자 여부 확인 */
      const adminRef = adminDb.collection("admins").doc(email);
      const adminSnap = await adminRef.get();

      if (adminSnap.exists && adminSnap.data()?.active === true) {
        isAdmin = true;
      }

      /* ✅ 구독 상태 확인 */
      const subsQuery = await adminDb
        .collection("subscriptions")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!subsQuery.empty) {
        const subsData = subsQuery.docs[0].data();
        subscriptionStatus = subsData.status ?? null;
        subscriptionName = subsData.name ?? null;
        expiresAt = subsData.expiresAt?.toDate?.() ?? null;
      } else {
        console.warn(`⚠️ No subscription found for ${email}`);
      }
    } catch (error) {
      console.error("❌ Firestore 접근 오류:", error);
    }
  }

  /* -------------------------------------------------------
   🚫 권한 없음 처리
  ------------------------------------------------------- */
  if (!isAdmin && subscriptionStatus !== "active") {
    return (
      <div
        style={{
          padding: "3rem 1rem",
          textAlign: "center",
          maxWidth: "480px",
          margin: "3rem auto",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.8rem" }}>
          접근 권한이 없습니다
        </h1>
        <p style={{ color: "#666", lineHeight: 1.5 }}>
          이 워크샵은 등록된 컬러인포스 강사 또는 관리자만 접근 가능합니다.
        </p>
        <p style={{ marginTop: "1rem", color: "#999" }}>
          현재 로그인된 이메일: <strong>{email}</strong>
        </p>

        {/* ✅ 로그아웃 버튼 */}
        <div style={{ marginTop: "1rem" }}>
          <LogoutButton />
        </div>

        <Footer />
      </div>
    );
  }

  /* -------------------------------------------------------
   ✅ 접근 허용 → Dashboard 렌더링
   - Dashboard 내부에서 useSession()으로 상태 관리
  ------------------------------------------------------- */
  return (
    <>
      <Dashboard />
      <Footer />
    </>
  );
}
