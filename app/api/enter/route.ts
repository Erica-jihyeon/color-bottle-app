import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { password } = data;

  const correctPassword = process.env.WORKSHOP_PASSWORD;
  const version = process.env.WORKSHOP_VERSION || "default";

  console.log("입력된:", password, " / 저장된:", correctPassword);

  if (password === correctPassword) {
    const res = NextResponse.json({ success: true });

    // ✅ 쿠키 발급 (3시간 유지)
    res.cookies.set("cbt_auth", version, {
      httpOnly: true,
      maxAge: 60 * 60 * 3,
      secure: process.env.NODE_ENV === "production", // 로컬/배포 자동 구분
      sameSite: "strict",
      path: "/",
    });

    return res;
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }
}
