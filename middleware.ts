import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/enter",
  "/api/enter",
  "/_next",
  "/favicon",
  "/images",
  "/public",
  "/session",
];

const PUBLIC_EXTS = [".png", ".jpg", ".jpeg", ".svg", ".ico", ".css", ".js", ".json"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ 1️⃣ NextAuth 관련 경로는 예외
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  // ✅ 2️⃣ 모든 API 요청은 예외
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // ✅ 3️⃣ 정적 파일 및 공개 경로 통과
  if (PUBLIC_EXTS.some((ext) => pathname.endsWith(ext))) return NextResponse.next();
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) return NextResponse.next();

  // ✅ 4️⃣ NextAuth 세션 검사
  const token = await getToken({ req });

  // 세션 없으면 /enter로
  if (!token) {
    const url = new URL("/enter", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|session|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};
