export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

/**
 * ✅ 서버에서 세션 생성 (Admin SDK 사용)
 * - Firestore 보안 규칙 영향 없음
 * - 7일 유효기간
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    // UUID 기반 세션 ID
    const id = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일

    // ✅ Admin SDK는 보안 규칙 무시하고 바로 쓰기 가능
    await adminDb.collection("sessions").doc(id).set({
      email,
      createdAt: now,
      expiresAt,
      active: true,
    });

    console.log(`✅ 세션 생성 완료: ${email} (${id})`);

    return NextResponse.json({
      ok: true,
      url: `/session/${id}`,
      expiresAt,
    });
  } catch (err) {
    console.error("❌ 세션 생성 오류:", err);
    return NextResponse.json({ error: "세션 생성 실패" }, { status: 500 });
  }
}

