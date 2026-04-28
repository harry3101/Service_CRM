import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user) nav({ to: "/" }); }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password, fullName);
    setBusy(false);
    if (res.error) toast.error(res.error);
    else { toast.success(mode === "login" ? "Welcome back" : "Account created"); nav({ to: "/" }); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-header p-4">
      <div className="w-full max-w-sm overflow-hidden rounded shadow-2xl">
        <div className="bg-header px-5 py-4 text-header-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-white/15 font-bold">S</div>
            <div>
              <div className="text-lg font-bold leading-tight">Symphony</div>
              <div className="text-[11px] opacity-80">Service Center CRM</div>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            {mode === "login" ? "Sign in to your account" : "Create an account"}
          </h2>
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} required
                className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted-foreground">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" />
          </div>
          <button type="submit" disabled={busy}
            className="w-full rounded bg-primary py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="block w-full text-center text-[11px] text-primary hover:underline">
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>
        <div className="bg-secondary px-5 py-2 text-center text-[10px] text-muted-foreground">
          © 2026 Symphony Service CRM · v1.0
        </div>
      </div>
    </div>
  );
}
