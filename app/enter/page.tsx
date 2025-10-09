"use client";

import { useState, useEffect } from "react";

export default function EnterPage() {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const reason = q.get("reason");
    if (reason === "unauthorized") setMsg("비밀번호가 필요합니다.");
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.redirected) {
        window.location.href = res.url; // 정상 입장 → 홈으로 이동
      } else if (res.status === 401) {
        setMsg("비밀번호가 올바르지 않아요.");
      } else {
        setMsg("잠시 후 다시 시도해주세요.");
      }
    } catch (e) {
      setMsg("네트워크 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center bg-zinc-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h1 className="mb-2 text-xl font-semibold">워크샵 입장</h1>
        {msg && <p className="mb-3 text-sm text-red-600">{msg}</p>}
        <label className="block text-sm text-zinc-600 mb-2">비밀번호</label>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="워크샵 비밀번호"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "입장하기"}
        </button>
      </form>
    </main>
  );
}
