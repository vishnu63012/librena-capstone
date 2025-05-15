import { onSchedule } from "firebase-functions/v2/scheduler";
import fetch from "cross-fetch";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// ✅ Initialize Firebase Admin
initializeApp();
const db = getFirestore();

const jsonUrls = [
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Front%20end%20database%20.json",
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Backend%20database.json",
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Analytics%20dataset.json",
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Authentication%20dataset.json",
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Databse%20dataset.json",
  "https://raw.githubusercontent.com/vishnu63012/librena-data/main/Testing%20dataset.json"
];

// ✅ Shared GitHub sync logic
const syncLibrariesFromGitHubHandler = async (triggeredBy: "cron") => {
  let totalAdded = 0;
  let totalSkipped = 0;

  for (const url of jsonUrls) {
    try {
      const response = await fetch(url);
      const libraries = await response.json();

      if (!Array.isArray(libraries)) {
        console.error("❌ Invalid JSON (not an array):", url);
        continue;
      }

      for (const lib of libraries) {
        if (!lib.id || !lib.name) {
          console.warn("⛔ Skipping invalid library:", lib);
          totalSkipped++;
          continue;
        }

        const docRef = db.collection("libraries").doc(lib.id);
        const existing = await docRef.get();

        if (!existing.exists || JSON.stringify(existing.data()) !== JSON.stringify(lib)) {
          await docRef.set({ ...lib, createdAt: Timestamp.now() }, { merge: true });
          totalAdded++;
        } else {
          totalSkipped++;
        }
      }

      console.log(`✅ Synced from ${url}`);
    } catch (err) {
      console.error(`❌ Error syncing ${url}:`, err);
    }
  }

  await db.collection("syncLogs").add({
    timestamp: Timestamp.now(),
    added: totalAdded,
    skipped: totalSkipped,
    triggeredBy,
    sources: jsonUrls,
  });

  console.log(`📊 Sync Summary — Added: ${totalAdded}, Skipped: ${totalSkipped}`);
  return { added: totalAdded, skipped: totalSkipped };
};

// ✅ Scheduled function: runs every 24 hours
export const syncLibrariesFromGitHub = onSchedule("every 24 hours", async () => {
  await syncLibrariesFromGitHubHandler("cron");
});

// ✅ Callable function to assign admin role to a user (fully typed)
export const makeAdmin = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ uid: string }>) => {
    const { uid } = request.data;

    if (!request.auth?.token?.admin) {
      throw new functions.https.HttpsError("permission-denied", "Only admins can assign roles.");
    }

    if (!uid) {
      throw new functions.https.HttpsError("invalid-argument", "User UID is required.");
    }

    await admin.auth().setCustomUserClaims(uid, { admin: true });

    return { message: `Admin claim set for UID: ${uid}` };
  }
);
