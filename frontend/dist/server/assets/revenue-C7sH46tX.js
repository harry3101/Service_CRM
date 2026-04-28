import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { b as api, t as toast } from "./router-D1CYIEEy.js";
import { P as Panel } from "./Panel-rdeUCfvE.js";
import { S as StatusBadge } from "./StatusBadge-CA_NfgzH.js";
import { I as IndianRupee } from "./indian-rupee-DSBgp6EY.js";
import { c as createLucideIcon } from "./createLucideIcon-B43O8m1H.js";
import { P as Plus } from "./plus-aNwrniDg.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function Revenue() {
  const [rows, setRows] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [calls, setCalls] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    invoice_no: "",
    customer_id: "",
    call_id: "",
    amount: 0,
    tax: 0,
    status: "paid",
    invoice_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const load = async () => {
    const [r, c, sc] = await Promise.all([api.getRevenue(), api.getCustomers(), api.getClosedServiceCalls()]);
    setRows(r);
    setCustomers(c);
    setCalls(sc);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const paid = rows.filter((r) => r.status === "paid");
  const totalPaid = paid.reduce((s, r) => s + Number(r.amount) + Number(r.tax), 0);
  const pending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount) + Number(r.tax), 0);
  const create = async (e) => {
    e.preventDefault();
    const inv = form.invoice_no || `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(rows.length + 1).padStart(4, "0")}`;
    try {
      await api.createRevenue({
        ...form,
        invoice_no: inv,
        customer_id: form.customer_id || null,
        call_id: form.call_id || null
      });
    } catch (e2) {
      return toast.error(e2 instanceof Error ? e2.message : "Failed");
    }
    toast.success("Invoice created");
    setOpen(false);
    load();
    setForm({
      invoice_no: "",
      customer_id: "",
      call_id: "",
      amount: 0,
      tax: 0,
      status: "paid",
      invoice_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KC, { icon: IndianRupee, label: "Total Revenue (Paid)", value: `₹${totalPaid.toLocaleString("en-IN")}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KC, { icon: CircleCheckBig, label: "Paid Invoices", value: paid.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KC, { icon: Clock, label: "Pending Amount", value: `₹${pending.toLocaleString("en-IN")}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Invoices & Revenue", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
      " New Invoice"
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Invoice #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Linked Ticket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Tax" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: r.invoice_no }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.invoice_date }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.customers?.name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-[11px]", children: r.service_calls?.ticket_no ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
          "₹",
          Number(r.amount).toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
          "₹",
          Number(r.tax).toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-medium", children: [
          "₹",
          (Number(r.amount) + Number(r.tax)).toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: r.status }) })
      ] }, r.id)) })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "w-full max-w-md rounded bg-card shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-panel-header", children: "New Invoice" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Invoice #", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.invoice_no, onChange: (e) => setForm({
          ...form,
          invoice_no: e.target.value
        }), placeholder: "auto", className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.invoice_date, onChange: (e) => setForm({
          ...form,
          invoice_date: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Customer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.customer_id, onChange: (e) => setForm({
          ...form,
          customer_id: e.target.value
        }), className: "i", required: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— select —" }),
          customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Linked Ticket", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.call_id, onChange: (e) => setForm({
          ...form,
          call_id: e.target.value
        }), className: "i", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— none —" }),
          calls.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.ticket_no }, c.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Amount ₹", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", required: true, value: form.amount, onChange: (e) => setForm({
          ...form,
          amount: +e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Tax ₹", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", value: form.tax, onChange: (e) => setForm({
          ...form,
          tax: +e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Status", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.status, onChange: (e) => setForm({
          ...form,
          status: e.target.value
        }), className: "i", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "pending" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t bg-secondary p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "rounded border border-input bg-background px-3 py-1 text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded bg-primary px-3 py-1 text-xs text-primary-foreground", children: "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}` })
  ] });
}
function KC({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-panel flex items-center gap-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: value })
    ] })
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
  Revenue as component
};
