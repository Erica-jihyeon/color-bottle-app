import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * ✅ GET /api/admin/subscriptions
 * - Firestore 'subscriptions' 컬렉션 전체 조회
 * - Admin SDK로 실행하므로 보안 규칙 영향을 받지 않음
 * - Timestamp를 ISO 문자열로 변환 (React 렌더링 오류 방지)
 */
export async function GET() {
  try {
    const snapshot = await adminDb.collection("subscriptions").get();

    if (snapshot.empty) {
      return NextResponse.json({ ok: true, data: [] });
    }

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();

      // 🔹 Timestamp → 문자열 변환
      return {
        id: doc.id,
        email: d.email || "(이메일 없음)",
        name: d.name || "이름 없음",
        status: d.status || "unknown",
        createdAt: d.createdAt?.toDate?.().toISOString?.() ?? null,
        expiresAt: d.expiresAt?.toDate?.().toISOString?.() ?? null,
      };
    });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error("🔥 관리자 구독 목록 조회 오류:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
