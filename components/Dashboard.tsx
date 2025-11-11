"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Copy } from "lucide-react";
import { signOut } from "next-auth/react";
import Footer from "@/components/Footer";


export default function Dashboard({
  user,
  isAdmin,
  subscriptionStatus,
  subscriptionName,
  expiresAt,
}) {
  const [creating, setCreating] = useState(false);
  const [sessionLink, setSessionLink] = useState<string | null>(null);

  const isExpired = subscriptionStatus === "expired";
  const now = dayjs();
  const expiryDate = expiresAt ? dayjs(expiresAt) : null;

  // ✅ 남은 일수 계산
  const daysRemaining = useMemo(() => {
    if (!expiryDate) return null;
    const diff = expiryDate.diff(now, "day");
    return diff >= 0 ? diff : null;
  }, [expiryDate, now]);

  // ✅ 하루 세션 링크 생성
  const handleCreateSession = async () => {
    try {
      setCreating(true);
      const res = await fetch("/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email || "unknown@user" }),
      });

      const data = await res.json();
      setCreating(false);

      if (!res.ok) {
        alert("세션 생성 실패: " + (data.error || "서버 오류"));
        return;
      }

      setSessionLink(data.url);
    } catch (err) {
      console.error("세션 생성 오류:", err);
      setCreating(false);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  // ✅ 링크 복사
  const copyToClipboard = () => {
    if (sessionLink) {
      const fullUrl = `${window.location.origin}${sessionLink}`;
      navigator.clipboard.writeText(fullUrl);
      alert("링크가 복사되었습니다!");
    }
  };

  // ✅ 로그아웃
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/enter" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-6 py-10">
      <main className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-md border border-zinc-200 p-8 space-y-6">
        {/* 헤더 */}
        <h1 className="text-3xl font-bold text-zinc-800 text-center">
          UDUL STUDIO 대시보드
        </h1>
        <p className="text-center text-zinc-600">
          {isExpired
            ? "구독이 만료되었습니다. 아래에서 구독을 연장할 수 있습니다."
            : "오늘의 워크샵을 시작하거나 참가자 세션을 관리하세요."}
        </p>

        {/* 남은 일수 배너 */}
        {!isExpired && daysRemaining !== null && daysRemaining <= 7 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-amber-700 font-medium">
              ⏰ 구독 만료까지 {daysRemaining}일 남았습니다.
            </p>
          </div>
        )}

        {/* 구독 상태 */}
        <div className="text-center text-sm text-zinc-600">
          <p>
            현재 구독 상태:{" "}
            <strong className={isExpired ? "text-red-500" : "text-green-600"}>
              {subscriptionStatus}
            </strong>
          </p>
          {expiresAt && (
            <p>만료일: {dayjs(expiresAt).format("YYYY년 M월 D일")}</p>
          )}
        </div>

        {/* 만료된 사용자용 UI */}
        {isExpired ? (
          <div className="mt-6 text-center space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-rose-700 font-medium">
                ⚠️ 현재 구독이 만료되어 워크샵 기능을 사용할 수 없습니다.
              </p>
            </div>

            <a
              href="mailto:udulstudio@gmail.com?subject=[컬러바틀앱 구독신청]"
              className="inline-block rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white px-4 py-2 text-sm font-medium hover:brightness-110 transition"
            >
              📨 구독 연장 신청 보내기
            </a>
          </div>
        ) : (
          <>
            {/* 컬러보틀 실행 */}
            <a
              href="/workshop"
              className="block w-full rounded-xl py-3 text-center font-medium transition bg-gradient-to-r from-purple-500 to-pink-400 text-white hover:brightness-110"
            >
              🎨 컬러보틀 바로 실행하기
            </a>

            {/* 하루 세션 링크 생성 */}
            <button
              onClick={handleCreateSession}
              disabled={creating}
              className={`w-full rounded-xl py-3 font-medium transition ${
                creating
                  ? "bg-gray-300 text-gray-500"
                  : "bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:brightness-110"
              }`}
            >
              {creating ? "🔄 생성 중..." : "🌿 하루 세션 링크 생성하기"}
            </button>

            {/* 세션 링크 표시 */}
            {sessionLink && (
              <div className="mt-4 bg-zinc-100 border border-zinc-200 rounded-xl p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="truncate text-zinc-700">
                  {`${window.location.origin}${sessionLink}`}
                </span>
                <div className="flex gap-2">
                  <a
                    href={sessionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 text-sm"
                  >
                    열기
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-zinc-300 rounded-md hover:bg-zinc-200"
                  >
                    <Copy size={14} /> 복사
                  </button>
                </div>
              </div>
            )}

            {/* 관리자 페이지 이동 */}
            {isAdmin && (
              <a
                href="/admin/subscriptions"
                className="block text-center bg-gradient-to-r from-gray-800 to-gray-700 text-white py-2.5 rounded-xl font-medium hover:brightness-110 transition"
              >
                🔧 관리자 페이지로 이동
              </a>
            )}
          </>
        )}

        {/* 로그아웃 */}
        <div className="text-center mt-6">
          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-600 hover:text-zinc-800 underline"
          >
            로그아웃
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
