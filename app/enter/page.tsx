"use client";
import { useState } from "react";

export default function EnterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // ✅ 쿠키 저장 필수
      });

      if (res.ok) {
        window.location.href = "/"; // 메인 페이지로 이동
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
      <h1>워크샵 입장</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 10 }}>입장</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
