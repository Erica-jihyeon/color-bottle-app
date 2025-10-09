import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.WORKSHOP_PASSWORD || "";
  const ok = !!password && password === expected;

  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 비밀번호 일치 → 홈으로 리다이렉트 + 쿠키 발급
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("cbt_auth", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 6, // 6시간 유지
  });
  return res;
}
