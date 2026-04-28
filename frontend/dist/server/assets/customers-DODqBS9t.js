import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D8zzwFOR.js";
import { b as api, t as toast } from "./router-DcoUKonF.js";
import { P as Panel } from "./Panel-CashBaQX.js";
import { P as Plus } from "./plus-BEf70hjq.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DuCBdKa-.js";
function Customers() {
  const [rows, setRows] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: ""
  });
  const load = async () => {
    const data = await api.getCustomers();
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = rows.filter((r) => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.city?.toLowerCase().includes(q.toLowerCase()) || r.phone?.includes(q));
  const create = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(form);
    } catch (e2) {
      return toast.error(e2 instanceof Error ? e2.message : "Failed");
    }
    toast.success("Customer added");
    setOpen(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: ""
    });
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { title: `Customers (${filtered.length})`, actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
      " New Customer"
    ] }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search name, phone, city…", className: "mb-2 w-64 rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:border-ring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Since" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.city }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: c.address }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: new Date(c.created_at).toLocaleDateString("en-IN") })
        ] }, c.id)) })
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "w-full max-w-md rounded bg-card shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-panel-header", children: "New Customer" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "City", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.city, onChange: (e) => setForm({
          ...form,
          city: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Address", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.address, onChange: (e) => setForm({
          ...form,
          address: e.target.value
        }), className: "i" }) })
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
  Customers as component
};
