// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionStatus?: "active" | "expired" | "none" | string;
      expiresAt?: Date | null;
      isAdmin?: boolean;
    };
  }

  interface User {
    subscriptionStatus?: "active" | "expired" | "none" | string;
    expiresAt?: Date | null;
    isAdmin?: boolean;
  }
}
