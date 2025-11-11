export const runtime = "nodejs";

import NextAuth, { type NextAuthOptions } from "next-auth";
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
    async signIn({ user }) {
      console.log("✅ 로그인 시도:", user.email);
      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        try {
          // ✅ 구독 상태 확인
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

          // ✅ 관리자 확인
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

    async session({ session, token }) {
      if (session?.user && token?.email) {
        session.user.email = token.email;
        session.user.subscriptionStatus = token.subscriptionStatus || "none";
        session.user.expiresAt = token.expiresAt || null;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/enter",
    signOut: "/enter",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
