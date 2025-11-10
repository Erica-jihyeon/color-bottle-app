"use client";

import React from "react";

export default function SubscriptionBannerOrModal({
  status,
  daysLeft,
  markAsPending,
}: {
  status: "active" | "expired" | "pending" | null;
  daysLeft: number | null;
  markAsPending: () => void;
}) {
  const supportEmail = "udulstudio@gmail.com";
  const subject = encodeURIComponent("[컬러바틀앱 구독신청]");
  const body = encodeURIComponent(
    `안녕하세요, UDUL STUDIO 구독 갱신을 신청합니다.\n\n이름:\n이메일:\n요청사항:\n\n감사합니다.`
  );
  const mailto = `mailto:${supportEmail}?subject=${subject}&body=${body}`;

  if (status === "pending") {
    return (
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-yellow-100 px-5 py-3 text-sm text-yellow-800 shadow">
        📩 구독 신청이 접수되었습니다. 관리자의 승인을 기다려주세요.
      </div>
    );
  }

  if (status === "active" && daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) {
    return (
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-indigo-100 px-5 py-3 text-sm text-indigo-700 shadow">
        ⏳ 구독 만료까지 {daysLeft}일 남았습니다.
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="rounded-2xl bg-white p-6 shadow-xl max-w-sm w-full text-center">
          <h2 className="text-lg font-semibold mb-3 text-red-600">구독이 만료되었습니다</h2>
          <p className="text-sm text-zinc-700 mb-5 leading-relaxed">
            서비스를 계속 이용하시려면 구독을 갱신해주세요.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href={mailto}
              onClick={markAsPending}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700"
            >
              다시 구독하기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
