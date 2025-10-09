import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/enter", "/api/enter", "/_next", "/favicon", "/images", "/public"];
const PUBLIC_EXTS = [".png",".jpg",".jpeg",".svg",".ico",".css",".js",".json"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 정적 파일 & 공개 경로 통과
  if (PUBLIC_EXTS.some((ext) => pathname.endsWith(ext))) return NextResponse.next();
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) return NextResponse.next();

  // 쿠키 확인
  const cookieVersion = req.cookies.get("cbt_auth")?.value;
  const currentVersion = process.env.WORKSHOP_VERSION || "default";

  if (cookieVersion !== currentVersion) {
    const url = new URL("/enter", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
