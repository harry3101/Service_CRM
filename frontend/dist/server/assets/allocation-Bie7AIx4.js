import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-D8zzwFOR.js";
import { b as api, t as toast } from "./router-DcoUKonF.js";
import { P as Panel } from "./Panel-CashBaQX.js";
import { S as StatusBadge } from "./StatusBadge-B9z-cIVH.js";
import { U as UserCheck } from "./user-check-C8HleGQ0.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DuCBdKa-.js";
function Allocation() {
  const [calls, setCalls] = reactExports.useState([]);
  const [engineers, setEngineers] = reactExports.useState([]);
  const [allocations, setAllocations] = reactExports.useState([]);
  const [pick, setPick] = reactExports.useState({});
  const load = async () => {
    const [c, e, a] = await Promise.all([api.getOpenCalls(), api.getEngineers(), api.getCallAllocations()]);
    setCalls(c);
    setEngineers(e);
    setAllocations(a);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const allocate = async (callId) => {
    const eid = pick[callId];
    if (!eid) return toast.error("Select an engineer");
    try {
      await api.createCallAllocation({
        call_id: callId,
        engineer_id: eid
      });
      toast.success("Engineer allocated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Allocation failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Pending & Active Calls — Allocate Engineer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Ticket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Engineer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        calls.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: c.ticket_no }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
            c.customers?.name,
            " ·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: c.customers?.city })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.product }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: c.priority }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: c.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: pick[c.id] ?? "", onChange: (e) => setPick({
            ...pick,
            [c.id]: e.target.value
          }), className: "rounded border border-input bg-background px-1 py-0.5 text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— select —" }),
            engineers.map((en) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: en.id, children: [
              en.name,
              " (",
              en.specialization,
              ")"
            ] }, en.id))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => allocate(c.id), className: "flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[11px] text-primary-foreground hover:bg-primary/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3 w-3" }),
            " Allocate"
          ] }) })
        ] }, c.id)),
        calls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-6 text-center text-muted-foreground", children: "No pending calls." }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Recent Allocations", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Ticket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Engineer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Specialization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Allocated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Notes" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allocations.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono", children: a.service_calls?.ticket_no }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.service_calls?.product }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.engineers?.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.engineers?.specialization }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { value: a.service_calls?.status ?? "-" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: new Date(a.allocated_at).toLocaleString("en-IN") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.notes })
      ] }, a.id)) })
    ] }) })
  ] });
}
export {
  Allocation as component
};
