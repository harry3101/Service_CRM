import { U as jsxRuntimeExports } from "./worker-entry-BZNBjeUw.js";
function Panel({ title, actions, children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `crm-panel ${className}`, children: [
    (title || actions) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-panel-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: title }),
      actions
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children })
  ] });
}
export {
  Panel as P
};
