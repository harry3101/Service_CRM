import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { b as api, t as toast } from "./router-D1CYIEEy.js";
import { P as Panel } from "./Panel-rdeUCfvE.js";
import { S as StatusBadge } from "./StatusBadge-CA_NfgzH.js";
import { P as Plus } from "./plus-aNwrniDg.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-B43O8m1H.js";
function Engineers() {
  const [rows, setRows] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    specialization: "",
    status: "available"
  });
  const load = async () => {
    const data = await api.getEngineers();
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    try {
      await api.createEngineer(form);
    } catch (e2) {
      return toast.error(e2 instanceof Error ? e2.message : "Failed");
    }
    toast.success("Engineer added");
    setOpen(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      specialization: "",
      status: "available"
    });
    load();
  };
  const setStatus = async (id, status) => {
    try {
      await api.updateEngineer(id, {
        status
      });
      load();
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: `Engineers (${rows.length})`, actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
      " Add Engineer"
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Specialization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Change" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: e.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.specialization }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: e.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: e.status, onChange: (ev) => setStatus(e.id, ev.target.value), className: "rounded border border-input bg-background px-1 py-0.5 text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "available", children: "available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "on-call", children: "on-call" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "off-duty", children: "off-duty" })
        ] }) })
      ] }, e.id)) })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "w-full max-w-md rounded bg-card shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-panel-header", children: "New Engineer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Name", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.phone, onChange: (e) => setForm({
          ...form,
          phone: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: form.email, onChange: (e) => setForm({
          ...form,
          email: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Specialization", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.specialization, onChange: (e) => setForm({
          ...form,
          specialization: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.status, onChange: (e) => setForm({
          ...form,
          status: e.target.value
        }), className: "i", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "available", children: "available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "on-call", children: "on-call" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "off-duty", children: "off-duty" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t bg-secondary p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "rounded border border-input bg-background px-3 py-1 text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded bg-primary px-3 py-1 text-xs text-primary-foreground", children: "Save" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}` })
  ] });
}
function F({
  label,
  children,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground", children: label }),
    children
  ] });
}
export {
  Engineers as component
};
