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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
  }

  try {
    const doc = await db.collection("admins").doc(email).get();
    if (!doc.exists) {
      return NextResponse.json({ ok: false, error: "not_admin" });
    }

    const data = doc.data();
    if (data?.active === true) {
      return NextResponse.json({ ok: true, role: data.role || "admin" });
    }

    return NextResponse.json({ ok: false, error: "inactive" });
  } catch (err) {
    console.error("Firestore admin check error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
