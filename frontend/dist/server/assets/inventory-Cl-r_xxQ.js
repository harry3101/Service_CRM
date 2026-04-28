import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
import { b as api, t as toast } from "./router-D1CYIEEy.js";
import { P as Panel } from "./Panel-rdeUCfvE.js";
import { T as TriangleAlert } from "./triangle-alert-j62_mNTU.js";
import { P as Plus } from "./plus-aNwrniDg.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-B43O8m1H.js";
function Inventory() {
  const [rows, setRows] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    sku: "",
    name: "",
    category: "",
    stock_qty: 0,
    unit_price: 0,
    reorder_level: 5
  });
  const load = async () => {
    const data = await api.getInventory();
    setRows(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const totalValue = rows.reduce((s, r) => s + r.stock_qty * Number(r.unit_price), 0);
  const lowStock = rows.filter((r) => r.stock_qty <= r.reorder_level);
  const create = async (e) => {
    e.preventDefault();
    try {
      await api.createInventory(form);
    } catch (e2) {
      return toast.error(e2 instanceof Error ? e2.message : "Failed");
    }
    toast.success("Item added");
    setOpen(false);
    load();
    setForm({
      sku: "",
      name: "",
      category: "",
      stock_qty: 0,
      unit_price: 0,
      reorder_level: 5
    });
  };
  const adjust = async (id, delta) => {
    const item = rows.find((r) => r.id === id);
    if (!item) return;
    Math.max(0, item.stock_qty + delta);
    try {
      await api.adjustInventory(id, delta);
      load();
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Total Items", value: rows.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Inventory Value", value: `₹${totalValue.toLocaleString("en-IN")}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KCard, { label: "Low Stock Alerts", value: lowStock.length, warn: lowStock.length > 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Inventory & Spare Parts", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
      " Add Item"
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "crm-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "SKU" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Reorder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit ₹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total ₹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Adjust" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => {
        const low = r.stock_qty <= r.reorder_level;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: low ? "bg-destructive/5" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-[11px]", children: r.sku }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-medium", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: low ? "font-bold text-destructive" : "", children: [
            low && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mr-1 inline h-3 w-3" }),
            r.stock_qty
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-muted-foreground", children: r.reorder_level }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
            "₹",
            Number(r.unit_price).toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-medium", children: [
            "₹",
            (r.stock_qty * Number(r.unit_price)).toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => adjust(r.id, 1), className: "rounded border border-success/30 bg-success/10 px-1.5 text-[11px] text-success", children: "+1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => adjust(r.id, -1), className: "rounded border border-destructive/30 bg-destructive/10 px-1.5 text-[11px] text-destructive", children: "-1" })
          ] }) })
        ] }, r.id);
      }) })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: create, className: "w-full max-w-md rounded bg-card shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-panel-header", children: "New Inventory Item" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "SKU", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: form.sku, onChange: (e) => setForm({
          ...form,
          sku: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.category, onChange: (e) => setForm({
          ...form,
          category: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Name", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Stock Qty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, value: form.stock_qty, onChange: (e) => setForm({
          ...form,
          stock_qty: +e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Reorder Lvl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, value: form.reorder_level, onChange: (e) => setForm({
          ...form,
          reorder_level: +e.target.value
        }), className: "i" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Unit Price ₹", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", required: true, value: form.unit_price, onChange: (e) => setForm({
          ...form,
          unit_price: +e.target.value
        }), className: "i" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t bg-secondary p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setOpen(false), className: "rounded border border-input bg-background px-3 py-1 text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded bg-primary px-3 py-1 text-xs text-primary-foreground", children: "Add" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}` })
  ] });
}
function KCard({
  label,
  value,
  warn
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `crm-panel p-3 ${warn ? "border-destructive/40 bg-destructive/5" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold ${warn ? "text-destructive" : "text-foreground"}`, children: value })
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
  Inventory as component
};
