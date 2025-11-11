import admin from "firebase-admin";
import dayjs from "dayjs";
import ColorBottleTarotApp from "@/components/ColorBottleTarotApp";
import Footer from "@/components/Footer";

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

export default async function SessionPage({ params }: { params: { id: string } }) {
  const sessionId = params.id;

  try {
    const doc = await db.collection("sessions").doc(sessionId).get();

    if (!doc.exists) {
      return (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>세션을 찾을 수 없습니다</h1>
          <p style={{ color: "#666" }}>잘못된 링크이거나 삭제된 세션입니다.</p>
          <Footer />
        </div>
      );
    }

    const data = doc.data();
    const expiresAt = data?.expiresAt?.toDate();
    const now = new Date();

    // ✅ 만료 확인
    if (!expiresAt || dayjs(expiresAt).isBefore(now)) {
      // 🔄 자동 비활성화 (optional)
      await db.collection("sessions").doc(sessionId).update({ active: false });

      return (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h1>이 워크샵 링크는 만료되어 더 이상 접속할 수 없습니다.</h1>
          <Footer />
        </div>
      );
    }

    // ✅ 유효 → 워크샵 실행
    return (
      <div style={{ minHeight: "100vh" }}>
        <ColorBottleTarotApp />
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("🔥 세션 로드 오류:", error);
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h1>세션을 불러오는 중 오류가 발생했습니다.</h1>
        <p style={{ color: "#888" }}>잠시 후 다시 시도해주세요.</p>
        <Footer />
      </div>
    );
  }
}
