import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // ✅ 로그인 허용 이메일 필터
    async signIn({ user }) {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(e => e.trim());
      if (allowedEmails && !allowedEmails.includes(user.email!)) {
        console.log("🚫 Unauthorized email:", user.email);
        return false;
      }
      return true;
    },

    // ✅ 로그인 후 항상 /dashboard로 이동
    async redirect({ url, baseUrl }) {
      return "/dashboard";
    },
  },

  // ✅ 로그인/로그아웃 후 이동 경로 명시 (선택)
  pages: {
    signIn: "/enter",
    signOut: "/enter",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
