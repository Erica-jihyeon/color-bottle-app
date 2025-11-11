import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/enter",
  "/api/enter",
  "/_next",
  "/favicon",
  "/images",
  "/public",
  "/session",
];

const PUBLIC_EXTS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".css",
  ".js",
  ".json",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ NextAuth 관련
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // ✅ API 요청, 정적 파일, 공개 경로 통과
  if (pathname.startsWith("/api/")) return NextResponse.next();
  if (PUBLIC_EXTS.some((ext) => pathname.endsWith(ext))) return NextResponse.next();
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) return NextResponse.next();

  // ✅ 로그인 쿠키 검사
  const sessionCookie =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (pathname.startsWith("/admin")) {
    // 로그인 안 되어 있으면 → 로그인 페이지로
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
    // 로그인 되어 있으면 → API에서 admin 체크
    // (실제 검증은 클라이언트 단에서 /api/admin/check 호출)
    return NextResponse.next();
  }

  // ✅ 워크샵 접근 보호
  if (pathname.startsWith("/workshop")) {
    if (sessionCookie) return NextResponse.next();

    const cookieVersion = req.cookies.get("cbt_auth")?.value;
    const currentVersion = process.env.WORKSHOP_VERSION || "default";
    if (cookieVersion !== currentVersion) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
    return NextResponse.next();
  }

  // ✅ 기본 보호
  const cookieVersion = req.cookies.get("cbt_auth")?.value;
  const currentVersion = process.env.WORKSHOP_VERSION || "default";
  if (cookieVersion !== currentVersion) {
    return NextResponse.redirect(new URL("/enter", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|session|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};
