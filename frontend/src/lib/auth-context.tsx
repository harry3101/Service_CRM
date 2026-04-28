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
      return { error: e instanceof Error ? e.message : "Sign in failed" };
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
      return { error: err?.message || "Google sign-in failed", cancelled: false };
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
      return { error: e instanceof Error ? e.message : "Sign up failed" };
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
