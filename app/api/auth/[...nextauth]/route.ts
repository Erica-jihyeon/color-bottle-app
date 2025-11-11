import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /* -------------------------------------------------------
     ✅ 로그인은 모든 구글 사용자 허용
     - 차단하지 않고, Firestore에서 상태 확인
    ------------------------------------------------------- */
    async signIn({ user }) {
      console.log("✅ 로그인 시도:", user.email);
      return true; // 누구나 로그인 가능
    },

    /* -------------------------------------------------------
     ✅ JWT 토큰에 Firestore 기반 사용자 정보 저장
     - subscriptions, admins 컬렉션에서 구독/권한 상태 불러오기
    ------------------------------------------------------- */
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const subRef = doc(db, "subscriptions", user.email);
          const subSnap = await getDoc(subRef);

          if (subSnap.exists()) {
            const data = subSnap.data();
            token.subscriptionStatus = data.status || "unknown";
            token.expiresAt = data.expiresAt?.toDate?.() || null;
          } else {
            token.subscriptionStatus = "none";
            token.expiresAt = null;
          }

          // 관리자 여부 확인
          const adminRef = doc(db, "admins", user.email);
          const adminSnap = await getDoc(adminRef);
          token.isAdmin = adminSnap.exists() && adminSnap.data()?.active === true;
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
    async session({ session, token }) {
      if (token?.email) {
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
    async redirect({ baseUrl }) {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
