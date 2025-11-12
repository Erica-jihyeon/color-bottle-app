export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? "unknown";

    // ✅ 세션 ID 및 만료 시간 설정
    const id = uuidv4();
    const now = new Date();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24시간

    // ✅ Firestore(Admin SDK)로 저장
    await adminDb.collection("sessions").doc(id).set({
      id,
      createdBy: email,
      createdAt: now,
      expiresAt,
    });

    console.log(`✅ 하루 세션 생성 완료: ${id} (${email})`);

    return NextResponse.json({
      ok: true,
      url: `/session/${id}`,
      expiresAt,
    });
  } catch (error) {
    console.error("❌ 세션 생성 오류:", error);
    return NextResponse.json(
      { ok: false, error: "세션 생성 실패" },
      { status: 500 }
    );
  }
}
