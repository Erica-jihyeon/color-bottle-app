import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ColorBottleTarotApp from "@/components/ColorBottleTarotApp";

export default async function SessionPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Firestore에서 세션 데이터 조회
  const q = query(collection(db, "sessions"), where("id", "==", id));
  const snapshot = await getDocs(q);
  const session = snapshot.docs[0]?.data();
  const now = Date.now();

  const expired = !session || now > session.expiresAt.toMillis();

  if (expired) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#333",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>🔒 세션이 종료되었습니다</h2>
        <p style={{ color: "#666" }}>
          이 워크샵 링크는 만료되어 더 이상 접속할 수 없습니다.<br />
          새로운 세션 링크를 교사에게 문의해주세요.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", textAlign: "center" }}>
      <h2 style={{ marginTop: "2rem" }}>🌿 오늘의 워크샵 세션</h2>
      <ColorBottleTarotApp />
    </div>
  );
}
