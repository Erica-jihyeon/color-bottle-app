"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useSubscriptionWatcher() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<"active" | "expired" | "pending" | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const ref = doc(db, "subscriptions", session.user.email);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);
      const diffDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const expired = diffDays < 0;
      setStatus(expired ? "expired" : data.status);
      setDaysLeft(diffDays);
    });

    return () => unsubscribe();
  }, [session]);

  const markAsPending = async () => {
    if (!session?.user?.email) return;
    const ref = doc(db, "subscriptions", session.user.email);
    await updateDoc(ref, { status: "pending" });
    setStatus("pending");
  };

  return { status, daysLeft, markAsPending };
}
