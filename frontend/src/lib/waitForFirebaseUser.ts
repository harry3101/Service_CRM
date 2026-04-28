import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AUTH_READY_MS = 12_000;

/**
 * Resolves when Firebase has finished restoring session (client only).
 * Times out so route guards never hang on a blank screen.
 */
export function waitForFirebaseUser(): Promise<User | null> {
  if (import.meta.env.SSR) {
    return Promise.resolve(null);
  }
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }
  return new Promise((resolve) => {
    let timeout: ReturnType<typeof setTimeout>;
    let settled = false;
    const done = (user: User | null) => {
      if (settled) return;
      settled = true;
      if (timeout) clearTimeout(timeout);
      unsubscribe();
      resolve(user);
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => done(user));
    timeout = setTimeout(() => {
      if (import.meta.env.DEV) {
        console.warn(
          "[auth] Firebase onAuthStateChanged did not fire within " +
            AUTH_READY_MS / 1000 +
            "s; treating as signed out. Check VITE_FIREBASE_* in .env and Firebase config."
        );
      }
      done(null);
    }, AUTH_READY_MS);
  });
}
