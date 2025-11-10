"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard({ user }: { user: any }) {
  const [sessionLink, setSessionLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/create-session", { method: "POST" });
      const data = await res.json();
      setSessionLink(`${window.location.origin}/session/${data.id}`);
    } catch (err) {
      console.error("세션 생성 실패:", err);
      alert("세션을 생성하는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        minHeight: "100vh",
      }}
    >
      <h1>👋 안녕하세요, {user?.name ?? "사용자"} 님</h1>
      <p>오늘의 워크샵을 어떻게 시작하시겠어요?</p>

      {/* 선택 버튼 두 가지 */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link
          href="/workshop"
          style={{
            padding: "1rem 1.5rem",
            border: "2px solid #3b7a57",
            borderRadius: "12px",
            textDecoration: "none",
            color: "#3b7a57",
            fontWeight: 600,
          }}
        >
          🎨 컬러보틀 바로 실행하기
        </Link>

        <button
          onClick={createSession}
          disabled={loading}
          style={{
            padding: "1rem 1.5rem",
            border: "2px solid #0070f3",
            borderRadius: "12px",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "생성 중..." : "🌿 하루 세션 링크 생성하기"}
        </button>
      </div>

      {/* 세션 링크가 생성되면 표시 */}
      {sessionLink && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px dashed #888",
            borderRadius: "10px",
            background: "#f9f9f9",
            width: "fit-content",
          }}
        >
          <p>📎 참가자용 링크:</p>
          <a
            href={sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3" }}
          >
            {sessionLink}
          </a>
        </div>
      )}

      {/* 로그아웃 */}
      <a
        href="/api/auth/signout"
        style={{
          marginTop: "2rem",
          fontSize: "0.9rem",
          color: "#777",
          textDecoration: "underline",
        }}
      >
        로그아웃
      </a>
    </div>
  );
}
