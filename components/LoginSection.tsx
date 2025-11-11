"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginSection() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      // ✅ Google 로그인 트리거
      await signIn("google", { callbackUrl: "/enter" });
    } catch (err) {
      console.error("로그인 실패:", err);
      alert("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #E3F2FD, #F3E5F5)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#333",
          marginBottom: "1rem",
        }}
      >
        🎨 UDUL STUDIO 워크샵 입장
      </h1>

      <p style={{ fontSize: "1rem", color: "#555", marginBottom: "2rem" }}>
        Google 계정으로 로그인해주세요.
      </p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "0.8rem 1.6rem",
          borderRadius: "10px",
          border: "1px solid #4285F4",
          background: loading ? "#90CAF9" : "#4285F4",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {loading ? "로그인 중..." : "🔑 Google로 로그인"}
      </button>

      <footer style={{ marginTop: "2rem", fontSize: "0.85rem", color: "#777" }}>
        © {new Date().getFullYear()} UDUL STUDIO – Color Bottle App
      </footer>
    </div>
  );
}
