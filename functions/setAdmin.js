const admin = require("firebase-admin");

// Path to service account JSON key file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Your user UID
const uid = "qm4X86rDEYTR8AdSvAdTQSe9gtH3";

// Set admin custom claim
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin privileges granted to UID: ${uid}`);
  })
  .catch((error) => {
    console.error("❌ Failed to set admin claim:", error);
  });
