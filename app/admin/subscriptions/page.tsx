"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Subscription = {
  email: string;
  status: string;
  expiresAt: string;
  plan: string;
};

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  const fetchSubscriptions = async () => {
    const snapshot = await getDocs(collection(db, "subscriptions"));
    const data = snapshot.docs.map((d) => ({
      email: d.id,
      ...d.data(),
    })) as Subscription[];
    setSubs(data);
  };

  const handleApprove = async (email: string) => {
    const ref = doc(db, "subscriptions", email);
    await updateDoc(ref, {
      status: "active",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30일
    });
    alert(`${email} 님의 구독이 30일간 활성화되었습니다.`);
    fetchSubscriptions();
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-white p-10">
      <h1 className="text-2xl font-bold mb-6 text-violet-700">구독 관리 대시보드</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-violet-100 text-left">
            <th className="p-3">이메일</th>
            <th className="p-3">상태</th>
            <th className="p-3">만료일</th>
            <th className="p-3">플랜</th>
            <th className="p-3">관리</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.email} className="border-b">
              <td className="p-3">{s.email}</td>
              <td className="p-3">
                {s.status === "pending" ? (
                  <span className="text-yellow-600 font-semibold">대기중</span>
                ) : s.status === "expired" ? (
                  <span className="text-red-600 font-semibold">만료</span>
                ) : (
                  <span className="text-green-600 font-semibold">활성</span>
                )}
              </td>
              <td className="p-3">{s.expiresAt?.split("T")[0]}</td>
              <td className="p-3">{s.plan}</td>
              <td className="p-3">
                {s.status === "pending" && (
                  <button
                    onClick={() => handleApprove(s.email)}
                    className="rounded-md bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700"
                  >
                    승인하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
