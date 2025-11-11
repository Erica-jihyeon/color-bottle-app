import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
    }

    // 7일 유효기간
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1 * 60 * 1000);

    // Firestore에 저장
    const sessionRef = await addDoc(collection(db, "sessions"), {
      email,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      active: true,
    });

    const sessionUrl = `/session/${sessionRef.id}`;

    return NextResponse.json({ url: sessionUrl });
  } catch (err) {
    console.error("❌ 세션 생성 오류:", err);
    return NextResponse.json({ error: "세션 생성 실패" }, { status: 500 });
  }
}
