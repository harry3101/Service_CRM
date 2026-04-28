import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";

/** Maps FirebaseAuth errors to user-facing text; 400s often mean Console/API key config. */
function getAuthErrorMessage(e: unknown): string {
  if (typeof e === "object" && e !== null && "code" in e) {
    const code = String((e as { code: string }).code);
    switch (code) {
      case "auth/operation-not-allowed":
        return "Email/password sign-in is turned off. In Firebase: Authentication → Sign-in method → enable Email/Password.";
      case "auth/invalid-api-key":
        return "Invalid API key. Confirm VITE_FIREBASE_API_KEY matches your Firebase Web app and redeploy.";
      case "auth/app-not-authorized":
        return "This domain is not authorized. Add your site to Firebase: Authentication → Settings → Authorized domains.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again in a few minutes.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password.";
      case "auth/email-already-in-use":
        return "This email is already registered. Sign in instead.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/weak-password":
        return "Use a stronger password (at least 6 characters).";
      default:
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error("[auth]", e);
        }
    }
  }
  if (e instanceof Error) return e.message;
  return "Sign in failed";
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null; cancelled?: boolean }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        try {
          await u.getIdToken(true);
          await api.authSync();
        } catch {
          /* API may be down or server auth not configured — still allow app shell */
        }
      }
    });
    return () => unsub();
  }, []);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (e) {
      return { error: getAuthErrorMessage(e) };
    }
  };

  const signInWithGoogle: AuthCtx["signInWithGoogle"] = async () => {
    try {
      const { user: u } = await signInWithPopup(auth, googleProvider);
      if (u) {
        try {
          await u.getIdToken();
          await api.authSync();
        } catch {
          /* onAuthStateChanged will sync */
        }
      }
      return { error: null, cancelled: false };
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        return { error: null, cancelled: true };
      }
      return { error: getAuthErrorMessage(e), cancelled: false };
    }
  };

  const signUp: AuthCtx["signUp"] = async (email, password, fullName) => {
    try {
      const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
      if (u && fullName) await updateProfile(u, { displayName: fullName });
      if (u) {
        try {
          await u.getIdToken();
          await api.authSync();
        } catch {
          /* sync retried on onAuthStateChanged */
        }
      }
      return { error: null };
    } catch (e) {
      return { error: getAuthErrorMessage(e) };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
