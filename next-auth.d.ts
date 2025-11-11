import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionStatus?: string;
      expiresAt?: string | null;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    subscriptionStatus?: string;
    expiresAt?: string | null;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null;
    subscriptionStatus?: string;
    expiresAt?: string | null;
    isAdmin?: boolean;
  }
}

