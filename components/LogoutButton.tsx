"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ✅ 세션/스토리지 정리
      window.localStorage.clear();

      // ✅ NextAuth 로그아웃 처리
      await signOut({ redirect: false });

      // ✅ 강제 리다이렉트 (App Router 방식)
      router.push("/enter");
      router.refresh();
    } catch (error) {
      console.error("🚫 로그아웃 오류:", error);
      router.push("/enter");
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: "1.4rem",
        padding: "0.7rem 1.5rem",
        border: "1px solid #999",
        borderRadius: "8px",
        fontSize: "0.95rem",
        background: "#f9f9f9",
        cursor: "pointer",
      }}
    >
      로그아웃
    </button>
  );
}
