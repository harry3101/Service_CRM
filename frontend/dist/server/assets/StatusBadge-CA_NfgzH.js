import { U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
const MAP = {
  open: "bg-info/15 text-info border-info/30",
  allocated: "bg-warning/20 text-warning-foreground border-warning/40",
  "in-progress": "bg-primary/15 text-primary border-primary/30",
  closed: "bg-success/15 text-success border-success/30",
  paid: "bg-success/15 text-success border-success/30",
  pending: "bg-warning/20 text-warning-foreground border-warning/40",
  available: "bg-success/15 text-success border-success/30",
  "on-call": "bg-info/15 text-info border-info/30",
  "off-duty": "bg-muted text-muted-foreground border-border",
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-warning/20 text-warning-foreground border-warning/40",
  low: "bg-muted text-muted-foreground border-border"
};
function StatusBadge({ value }) {
  const cls = MAP[value?.toLowerCase()] ?? "bg-muted text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded border px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${cls}`, children: value });
}
export {
  StatusBadge as S
};
