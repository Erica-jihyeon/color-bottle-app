import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 로그인/정적 리소스는 통과
const PUBLIC_PREFIXES = [
  "/enter",
  "/api/enter",
  "/_next",
  "/favicon", "/icon", "/apple-icon",
  "/images", "/public"
];

const PUBLIC_EXTENSIONS = [
  ".png",".jpg",".jpeg",".webp",".svg",".ico",
  ".css",".js",".txt",".xml",".map",".json",".woff",".woff2",".ttf",".otf"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) 정적 파일 확장자는 통과
  if (PUBLIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return NextResponse.next();
  }
  // 2) 공개 prefix는 통과
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 3) 비밀번호 쿠키 검사 (app/api/enter/route.ts에서 설정했던 이름과 일치해야 함)
  const authed = req.cookies.get("cbt_auth")?.value === "ok";
  if (!authed) {
    const url = new URL("/enter", req.url);
    url.searchParams.set("reason", "unauthorized");
    return NextResponse.redirect(url);
  }

  // 통과
  return NextResponse.next();
}

// ★ 모든 경로에 적용
export const config = {
  matcher: ["/:path*"],
};
