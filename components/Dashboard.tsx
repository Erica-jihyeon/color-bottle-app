"use client";

import useSubscriptionWatcher from "@/hooks/useSubscriptionWatcher";
import SubscriptionBannerOrModal from "@/components/SubscriptionBannerOrModal";

export default function DashboardPage() {
  const { status, daysLeft, markAsPending } = useSubscriptionWatcher();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-violet-50">
      <SubscriptionBannerOrModal
        status={status}
        daysLeft={daysLeft}
        markAsPending={markAsPending}
      />

      <main className="p-10">
        <h1 className="text-2xl font-bold text-violet-700 mb-6">
          UDUL STUDIO 대시보드
        </h1>
        <p className="text-zinc-700 mb-10">
          오늘의 워크샵을 시작하거나 참가자 세션을 관리하세요.
        </p>

        <div className="flex gap-4">
          <a
            href="/workshop"
            className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-sm text-violet-700 shadow-sm hover:bg-violet-50"
          >
            🎨 컬러보틀 바로 실행하기
          </a>
          <a
            href="/api/auth/signout"
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50"
          >
            로그아웃
          </a>
        </div>
      </main>
    </div>
  );
}
