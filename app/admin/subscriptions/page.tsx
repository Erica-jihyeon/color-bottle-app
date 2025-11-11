"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Subscription = {
  id: string;
  email: string;
  name?: string;
  status: string;
  expiresAt?: string;
};

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // 🔁 서버 API로 Firestore 데이터 불러오기 (firebase-admin 사용)
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch("/api/admin/subscriptions", { cache: "no-store" });
        const json = await res.json();
        if (json.ok) setSubs(json.data);
        else console.error("서버 응답 오류:", json.error);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // ✅ 구독 1년 연장 (서버 API 호출)
  const handleExtend = async (email: string) => {
    try {
      setUpdating(email);
      const res = await fetch("/api/admin/subscriptions/extend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (json.ok) {
        alert(`${email} 님의 구독이 1년 연장되었습니다 ✅`);
        setSubs((prev) =>
          prev.map((s) =>
            s.email === email ? { ...s, expiresAt: json.newExpiry, status: "active" } : s
          )
        );
      } else {
        alert(`❌ 연장 실패: ${json.error}`);
      }
    } catch (err) {
      console.error("연장 중 오류:", err);
      alert("연장 중 오류가 발생했습니다 ❌");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700";
      case "expired":
        return "text-red-600";
      case "pending":
        return "text-amber-600";
      default:
        return "text-gray-500 italic";
    }
  };

  if (loading) return <p className="p-6">불러오는 중...</p>;

  return (
    <div className="relative p-8">
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-5 right-5 z-50 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-100 transition"
      >
        ← 메인 대시보드로
      </button>

      <h1 className="text-2xl font-bold mb-6 text-violet-700">구독 관리 대시보드</h1>

      <table className="w-full border-collapse bg-white shadow-sm rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-violet-50 border-b border-violet-100 text-left">
            <th className="p-3 font-medium">이름</th>
            <th className="p-3 font-medium">이메일</th>
            <th className="p-3 font-medium">상태</th>
            <th className="p-3 font-medium">만료일</th>
            <th className="p-3 font-medium">작업</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub) => (
            <tr key={sub.id} className="border-b border-zinc-100 hover:bg-violet-50/30 transition">
              <td className="p-3">{sub.name || "이름 없음"}</td>
              <td className="p-3">{sub.email}</td>
              <td className={`p-3 font-medium ${getStatusColor(sub.status)}`}>
                {sub.status}
              </td>
              <td className="p-3">{sub.expiresAt || "-"}</td>
              <td className="p-3">
                <button
                  onClick={() => handleExtend(sub.email)}
                  disabled={updating === sub.email}
                  className={`rounded-lg border px-3 py-1.5 text-sm shadow-sm transition ${
                    updating === sub.email
                      ? "bg-gray-100 text-gray-500 border-gray-200"
                      : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
                  }`}
                >
                  {updating === sub.email ? "처리 중..." : "1년 연장"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subs.length === 0 && (
        <p className="text-center text-gray-500 mt-6">등록된 구독 정보가 없습니다.</p>
      )}
    </div>
  );
}
