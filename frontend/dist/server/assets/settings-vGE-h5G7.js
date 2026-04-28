import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { u as useAuth, b as api, t as toast } from "./router-D1CYIEEy.js";
import { P as Panel } from "./Panel-rdeUCfvE.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Settings() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = reactExports.useState({
    full_name: "",
    phone: ""
  });
  const [roles, setRoles] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, r] = await Promise.all([api.getProfile(), api.getMyRoles()]);
        setProfile({
          full_name: p.full_name ?? "",
          phone: p.phone ?? ""
        });
        setRoles(r.roles);
      } catch {
      }
    })();
  }, [user]);
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.updateProfile(profile);
      toast.success("Profile saved");
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "Save failed");
    }
    setBusy(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "My Profile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: user?.email ?? "", disabled: true, className: "w-full rounded border border-input bg-secondary px-2 py-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.full_name, onChange: (e) => setProfile({
          ...profile,
          full_name: e.target.value
        }), className: "w-full rounded border border-input bg-background px-2 py-1.5 focus:outline-none focus:border-ring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: profile.phone, onChange: (e) => setProfile({
          ...profile,
          phone: e.target.value
        }), className: "w-full rounded border border-input bg-background px-2 py-1.5 focus:outline-none focus:border-ring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, className: "rounded bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50", children: busy ? "Saving…" : "Save Profile" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Account & Permissions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "User ID", v: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px]", children: user?.id }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Roles", v: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: roles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "No roles" }) : roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10.5px] uppercase text-primary", children: r }, r)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Plan", v: "Standard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Region", v: "Asia / IN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "pt-2 text-[11px] text-muted-foreground", children: "Roles control who can create, update or delete CRM records. Contact a workspace admin to change roles." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "System", className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-xs md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Application", value: "DEMO CRM v1.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Build", value: "2026.04.28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Database", value: "Connected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Support", value: "support@democrm.app" })
    ] }) })
  ] });
}
function Row({
  k,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/60 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: v })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-border bg-secondary/40 p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: value })
  ] });
}
export {
  Settings as component
};
