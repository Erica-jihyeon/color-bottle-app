import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * 매일 자정 실행: 만료된 세션 자동 비활성화
 */
export const deactivateExpiredSessions = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("America/Toronto")
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();

    const snapshot = await db
      .collection("sessions")
      .where("active", "==", true)
      .where("expiresAt", "<", now)
      .get();

    if (snapshot.empty) {
      console.log("✅ 만료된 세션 없음");
      return null;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { active: false });
    });

    await batch.commit();
    console.log(`🕒 ${snapshot.size}개의 세션 비활성화 완료`);
    return null;
  });
