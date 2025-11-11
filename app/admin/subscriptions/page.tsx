"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Subscription = {
  id: string;
  email: string;
  name?: string;
  status: string;
  createdAt?: Timestamp;
  expiresAt?: Timestamp;
};

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // 🔁 Firestore 실시간 반영
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "subscriptions"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          email: raw.email || "(이메일 없음)",
          name: raw.name || "이름 없음",
          status: raw.status || "unknown",
          createdAt: raw.createdAt,
          expiresAt: raw.expiresAt,
        } as Subscription;
      });
      setSubs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 🕒 날짜 변환
  const formatDate = (ts?: Timestamp) => {
    if (!ts) return "-";
    const date = ts.toDate();
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ 구독 1년 연장
  const handleExtend = async (email: string, currentExpiry?: Timestamp) => {
    try {
      setUpdating(email);
      const ref = doc(db, "subscriptions", email);
      const baseDate = currentExpiry ? currentExpiry.toDate() : new Date();
      const newExpiry = new Date(baseDate);
      newExpiry.setFullYear(baseDate.getFullYear() + 1);

      await updateDoc(ref, {
        status: "active",
        expiresAt: Timestamp.fromDate(newExpiry),
      });

      alert(`${email} 님의 구독이 1년 연장되었습니다 ✅`);
    } catch (err) {
      console.error("Error updating subscription:", err);
      alert("연장 중 오류가 발생했습니다 ❌");
    } finally {
      setUpdating(null);
    }
  };

  // 🎨 상태 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700";
      case "expired":
        return "text-red-600";
      case "pending":
        return "text-amber-600";
      case "unknown":
        return "text-gray-500 italic";
      default:
        return "text-gray-700";
    }
  };

  if (loading) return <p className="p-6">불러오는 중...</p>;

  return (
    <div className="relative p-8">
      {/* 🔙 화면 고정형 버튼 */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-5 right-5 z-50 rounded-full border border-violet-200 bg-violet-50 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-100 hover:shadow transition"
      >
        ← 메인 대시보드로
      </button>

      <h1 className="text-2xl font-bold mb-6 text-violet-700">
        구독 관리 대시보드
      </h1>

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
            <tr
              key={sub.id}
              className="border-b border-zinc-100 hover:bg-violet-50/30 transition"
            >
              <td className="p-3">{sub.name}</td>
              <td className="p-3">{sub.email}</td>
              <td className={`p-3 font-medium ${getStatusColor(sub.status)}`}>
                {sub.status}
              </td>
              <td className="p-3">{formatDate(sub.expiresAt)}</td>
              <td className="p-3">
                <button
                  onClick={() => handleExtend(sub.email, sub.expiresAt)}
                  disabled={updating === sub.email}
                  className={`rounded-lg border px-3 py-1.5 text-sm shadow-sm transition
                    ${
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
        <p className="text-center text-gray-500 mt-6">
          등록된 구독 정보가 없습니다.
        </p>
      )}
    </div>
  );
}
