import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? "unknown";

    const id = Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
    const now = Date.now();
    const expiresAt = now + 1000 * 60 * 60 * 24; // 24시간

    await addDoc(collection(db, "sessions"), {
      id,
      createdBy: email,
      createdAt: Timestamp.fromMillis(now),
      expiresAt: Timestamp.fromMillis(expiresAt),
    });

    return NextResponse.json({ id, expiresAt });
  } catch (error) {
    console.error("세션 생성 실패:", error);
    return NextResponse.json({ error: "세션 생성 실패" }, { status: 500 });
  }
}




