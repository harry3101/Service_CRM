import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { b as api, t as toast } from "./router-D1CYIEEy.js";
import { P as Panel } from "./Panel-rdeUCfvE.js";
import { S as StatusBadge } from "./StatusBadge-CA_NfgzH.js";
import { S as Search } from "./search-YcQuNHwG.js";
import { c as createLucideIcon } from "./createLucideIcon-B43O8m1H.js";
import { P as Plus } from "./plus-aNwrniDg.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode);
function Calls() {
  const [rows, setRows] = reactExports.useState([]);
  const [customers, setCustomers] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    ticket_no: "",
    customer_id: "",
    product: "",
    serial_no: "",
    issue: "",
    priority: "medium",
    scheduled_date: ""
  });
  const load = async () => {
    const data = await api.getServiceCalls();
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
    api.getCustomers().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setCustomers(list.map((c) => ({
        id: c.id,
        name: c.name
      })));
    }).catch(() => setCustomers([]));
  }, []);
  const filtered = rows.filter((r) => {
    const matchQ = !q || r.ticket_no.toLowerCase().includes(q.toLowerCase()) || r.product?.toLowerCase().includes(q.toLowerCase()) || r.customers?.name?.toLowerCase().includes(q.toLowerCase());
    const matchS = !statusFilter || r.status === statusFilter;
    return matchQ && matchS;
  });
  const updateStatus = async (id, status) => {
    const patch = {
      status
    };
    if (status === "closed") patch.closed_at = (/* @__PURE__ */ new Date()).toISOString();
    try {
      await api.updateServiceCall(id, patch);
      toast.success("Status updated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };
  const create = async (e) => {
    e.preventDefault();
    const ticket = form.ticket_no || `SC-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(rows.length + 1).padStart(4, "0")}`;
    try {
      await api.createServiceCall({
        ...form,
        ticket_no: ticket,
        scheduled_date: form.scheduled_date || null,
        customer_id: form.customer_id || null,
        serial_no: form.serial_no
      });
      toast.success("Call created");
      setOpen(false);
      setForm({
        ticket_no: "",
        customer_id: "",
        product: "",
        serial_no: "",
        issue: "",
        priority: "medium",
        scheduled_date: ""
      });
      load();
    } catch (e2) {
      toast.error(e2 instanceof Error ? e2.message : "Create failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Panel, { title: `Service Calls (${filtered.length})`, actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
      " New Call"
    ] }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search ticket/product/customer", className: "rounded border border-input bg-background py-1 pl-7 pr-2 text-xs focus:outline-none focus:border-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3 w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "rounded border border-input bg-background py-1 px-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "open", children: "Open" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "allocated", children: "Allocated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "in-progress", children: "In Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "closed", children: "Closed" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Ticket" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Issue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Priority" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Scheduled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: r.ticket_no }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
              r.customers?.name,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                r.customers?.phone,
                " · ",
                r.customers?.city
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
              r.product,
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: r.serial_no })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-xs truncate", children: r.issue }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: r.priority }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: r.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.scheduled_date ?? "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: r.status, onChange: (e) => updateStatus(r.id, e.target.value), className: "rounded border border-input bg-background py-0.5 px-1 text-[11px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "open", children: "open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "allocated", children: "allocated" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "in-progress", children: "in-progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "closed", children: "closed" })
            ] }) })
          ] }, r.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "py-6 text-center text-muted-foreground", children: "No service calls match filters." }) })
        ] })
      ] }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "w-full max-w-lg rounded bg-card shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-panel-header", children: "New Service Call" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Ticket #", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.ticket_no, onChange: (e) => setForm({
          ...form,
          ticket_no: e.target.value
        }), placeholder: "auto", className: "input-sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Customer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.customer_id, onChange: (e) => setForm({
          ...form,
          customer_id: e.target.value
        }), className: "input-sm", required: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— select —" }),
          customers.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: form.product, onChange: (e) => setForm({
          ...form,
          product: e.target.value
        }), className: "input-sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Serial #", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.serial_no, onChange: (e) => setForm({
          ...form,
          serial_no: e.target.value
        }), className: "input-sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Priority", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.priority, onChange: (e) => setForm({
          ...form,
          priority: e.target.value
        }), className: "input-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Scheduled Date", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.scheduled_date, onChange: (e) => setForm({
          ...form,
          scheduled_date: e.target.value
        }), className: "input-sm" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Issue Description", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, value: form.issue, onChange: (e) => setForm({
          ...form,
          issue: e.target.value
        }), rows: 3, className: "input-sm" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t bg-secondary p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "rounded border border-input bg-background px-3 py-1 text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded bg-primary px-3 py-1 text-xs text-primary-foreground", children: "Create" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.input-sm{width:100%;border:1px solid var(--color-input);background:var(--color-background);padding:4px 6px;border-radius:4px;font-size:12px}.input-sm:focus{outline:none;border-color:var(--color-ring)}` })
  ] });
}
function Field({
  label,
  children,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
export {
  Calls as component
};
