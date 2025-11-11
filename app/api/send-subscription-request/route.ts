import { NextResponse } from "next/server";
import admin from "firebase-admin";

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

export async function POST(req: Request) {
  const { email, name } = await req.json();

  try {
    await db.collection("mail").add({
      to: process.env.MAIL_RECEIVER || "udulstudio@gmail.com",
      message: {
        subject: "[컬러바틀앱 구독신청]",
        text: `다음 사용자가 구독 연장을 요청했습니다.\n\n이름: ${name}\n이메일: ${email}`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ 메일 전송 실패:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
