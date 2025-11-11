export const runtime = "nodejs";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adminDb as db } from "@/lib/firebaseAdmin";

/**
 * ✅ NextAuthOptions 타입은 생략 (빌드 에러 방지)
 */
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /* -------------------------------------------------------
     ✅ 로그인: 모든 구글 사용자 허용
     ------------------------------------------------------- */
    async signIn({ user }: { user: any }) {
      console.log("✅ 로그인 시도:", user.email);
      return true;
    },

    /* -------------------------------------------------------
     ✅ JWT 토큰에 Firestore 기반 사용자 정보 저장
     ------------------------------------------------------- */
    async jwt({ token, user }: { token: any; user: any }) {
      if (user?.email) {
        try {
          console.log("✅ JWT 콜백 시작:", user.email);

          // ✅ Firestore Admin SDK로 subscriptions 문서 조회
          const subSnap = await db
            .collection("subscriptions")
            .where("email", "==", user.email)
            .limit(1)
            .get();

          if (!subSnap.empty) {
            const data = subSnap.docs[0].data();
            console.log("🔥 구독 문서:", data);
            token.subscriptionStatus = data.status || "unknown";
            token.expiresAt = data.expiresAt?.toDate?.() || null;
          } else {
            console.log("⚠️ 구독 문서 없음:", user.email);
            token.subscriptionStatus = "none";
            token.expiresAt = null;
          }

          // ✅ 관리자 여부 확인
          const adminSnap = await db
            .collection("admins")
            .doc(user.email)
            .get();

          token.isAdmin =
            adminSnap.exists && adminSnap.data()?.active === true;
        } catch (err) {
          console.error("⚠️ Firestore 조회 오류:", err);
        }

        token.email = user.email;
      }
      return token;
    },

    /* -------------------------------------------------------
     ✅ 세션에 이메일, 구독상태, 관리자여부 포함
     ------------------------------------------------------- */
    async session({
      session,
      token,
    }: {
      session: any;
      token: any;
    }) {
      if (session?.user && token?.email) {
        session.user.email = token.email;
        session.user.subscriptionStatus = token.subscriptionStatus || "none";
        session.user.expiresAt = token.expiresAt || null;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },

    /* -------------------------------------------------------
     ✅ 로그인 후 항상 /dashboard로 리디렉트
     ------------------------------------------------------- */
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/dashboard`;
    },
  },

  /* -------------------------------------------------------
   ✅ 로그인 / 로그아웃 경로 지정
  ------------------------------------------------------- */
  pages: {
    signIn: "/enter",
    signOut: "/enter",
  },
};

// ✅ NextAuth를 핸들러로 래핑
const handler = (NextAuth as any)(authOptions);
export { handler as GET, handler as POST };
