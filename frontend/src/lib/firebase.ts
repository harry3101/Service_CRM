import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error(
    "[firebase] Missing VITE_FIREBASE_* variables. Add them to frontend/.env (see .env.example)."
  );
}

let app: FirebaseApp;
if (getApps().length) {
  app = getApps()[0]!;
} else {
  app = initializeApp(firebaseConfig);
}

export const firebaseApp = app;
export const auth: Auth = getAuth(app);

let _analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok) _analytics = getAnalytics(app);
    })
    .catch(() => {});
}
export function getFirebaseAnalytics() {
  return _analytics;
}
