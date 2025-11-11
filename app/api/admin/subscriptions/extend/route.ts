import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

/**
 * ✅ POST /api/admin/subscriptions/extend
 * Body: { email: string }
 * - Firestore 'subscriptions' 컬렉션의 만료일을 1년 연장
 * - Admin SDK 사용 (permission-denied 방지)
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
    }

    // ✅ Firestore 문서 참조
    const ref = adminDb.collection("subscriptions").doc(email);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const data = snap.data();
    const baseDate = data?.expiresAt?.toDate?.() ?? new Date();
    const newExpiry = new Date(baseDate);
    newExpiry.setFullYear(baseDate.getFullYear() + 1);

    // ✅ 구독 갱신
    await ref.update({
      status: "active",
      expiresAt: Timestamp.fromDate(newExpiry),
    });

    console.log(`✅ ${email} 구독이 ${newExpiry.toISOString()} 까지 연장됨`);

    return NextResponse.json({
      ok: true,
      newExpiry: newExpiry.toISOString(),
    });
  } catch (err) {
    console.error("🔥 구독 연장 처리 중 오류:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
