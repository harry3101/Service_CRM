import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { u as useAuth, a as useNavigate, t as toast } from "./router-D1CYIEEy.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AuthPage() {
  const {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle
  } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = reactExports.useState("login");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) nav({
      to: "/"
    });
  }, [user, loading, nav]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-header p-4 text-header-foreground text-sm", children: "Starting…" });
  }
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = mode === "login" ? await signIn(email, password) : await signUp(email, password, fullName);
    setBusy(false);
    if (res.error) toast.error(res.error);
    else {
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      nav({
        to: "/"
      });
    }
  };
  const google = async () => {
    setBusy(true);
    const res = await signInWithGoogle();
    setBusy(false);
    if (res.cancelled) return;
    if (res.error) toast.error(res.error);
    else {
      toast.success("Signed in with Google");
      nav({
        to: "/"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-header p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm overflow-hidden rounded shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-header px-5 py-4 text-header-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded bg-white/15 text-xs font-bold", children: "DC" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold leading-tight", children: "DEMO CRM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] opacity-80", children: "Service Center" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: mode === "login" ? "Sign in to your account" : "Create an account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: google, disabled: busy, className: "flex w-full items-center justify-center gap-2 rounded border border-input bg-background py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary disabled:opacity-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleGlyph, {}),
        "Continue with Google"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "or use email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[11px] font-medium text-muted-foreground", children: "Full Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: fullName, onChange: (e) => setFullName(e.target.value), required: true, className: "w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[11px] font-medium text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[11px] font-medium text-muted-foreground", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full rounded border border-input bg-background px-2 py-1.5 text-sm focus:border-ring focus:outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "w-full rounded bg-primary py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50", children: busy ? "Please wait…" : mode === "login" ? "Sign In" : "Sign Up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode(mode === "login" ? "signup" : "login"), className: "block w-full text-center text-[11px] text-primary hover:underline", children: mode === "login" ? "New here? Create an account" : "Already have an account? Sign in" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-secondary px-5 py-2 text-center text-[10px] text-muted-foreground", children: "© 2026 DEMO CRM · v1.0" })
  ] }) });
}
function GoogleGlyph() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", "aria-hidden": true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
  ] });
}
export {
  AuthPage as component
};
