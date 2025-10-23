"use client";
import { useState } from "react";

export default function EnterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 서버 API로 비밀번호 전달 → (미들웨어에서 쓰는) 쿠키 발급
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // ✅ 쿠키 저장 필수!
      });

      if (res.ok) {
        // ✅ 쿠키가 설정되었으므로 메인으로 이동
        window.location.assign("/");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EAF8F6] via-[#F3E8FF] to-[#FFEFF6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/85 shadow-xl backdrop-blur-xl p-8 md:p-10">
        {/* 파스텔 그라데이션 타이틀 */}
        <h1 className="mb-6 text-center text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-[#C8B6E2] via-[#F5C6EC] to-[#B8E0D2] bg-clip-text text-transparent">
          워크샵 입장
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="sr-only" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-[#E7E4F3] bg-white/95 px-5 py-3.5 text-center text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-[#C8B6E2] focus:ring-4 focus:ring-[#EADCF6] focus:outline-none"
          />

          {error && (
            <p className="text-center text-sm text-rose-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-2xl bg-gradient-to-r from-[#F5C6EC] via-[#C8B6E2] to-[#B8E0D2] px-5 py-3.5 text-sm font-semibold text-zinc-900 shadow-md transition active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "확인 중..." : "입장"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          비밀번호는 워크샵 진행자에게 문의하세요.
        </p>
        <p className="mt-6 text-center text-3xs md:text-3xs font-extrabold leading-tight bg-gradient-to-r from-[#C8B6E2] via-[#F5C6EC] to-[#B8E0D2] bg-clip-text text-transparent">
          UDUL STUDIO - 컬러인포스
        </p>
      </div>
    </div>
  );
}
