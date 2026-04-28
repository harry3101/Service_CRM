import { M as useRouter, U as jsxRuntimeExports, _ as Outlet } from "./worker-entry-BZNBjeUw.js";
import { u as useAuth, a as useNavigate, L as Link, R as RouteLoading, N as Navigate } from "./router-D1CYIEEy.js";
import { S as Search } from "./search-YcQuNHwG.js";
import { c as createLucideIcon } from "./createLucideIcon-B43O8m1H.js";
import { P as PhoneCall, a as Package } from "./phone-call-C6cdQAL8.js";
import { U as UserCheck } from "./user-check-DcVKZev1.js";
import { I as IndianRupee } from "./indian-rupee-DSBgp6EY.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$7 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$6);
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
const __iconNode$4 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const NAV = [
  { group: "Main", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true }
  ] },
  { group: "Service", items: [
    { to: "/calls", label: "Call Management", icon: PhoneCall },
    { to: "/allocation", label: "Call Allocation", icon: UserCheck }
  ] },
  { group: "Operations", items: [
    { to: "/inventory", label: "Inventory", icon: Package },
    { to: "/customers", label: "Customers", icon: Users },
    { to: "/engineers", label: "Engineers", icon: Wrench }
  ] },
  { group: "Finance", items: [
    { to: "/revenue", label: "Revenue", icon: IndianRupee },
    { to: "/reports", label: "Reports", icon: ChartColumn }
  ] },
  { group: "System", items: [
    { to: "/settings", label: "Settings", icon: Settings }
  ] }
];
const TITLES = {
  "/": "Dashboard",
  "/calls": "Call Management",
  "/allocation": "Call Allocation",
  "/inventory": "Inventory",
  "/customers": "Customers",
  "/engineers": "Engineers",
  "/revenue": "Revenue",
  "/reports": "Reports",
  "/settings": "Settings"
};
function CrmLayout() {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const title = TITLES[loc.pathname] ?? "DEMO CRM";
  const handleLogout = async () => {
    await signOut();
    nav({ to: "/auth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-12 items-center justify-between bg-header px-3 text-header-foreground shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded bg-white/10 text-[10px] font-bold leading-tight text-white", children: "DC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold leading-tight", children: "DEMO CRM" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] leading-tight opacity-75", children: "Service Center" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden flex-1 max-w-md mx-6 md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Search ticket, customer, part…",
            className: "w-full rounded bg-white/10 py-1.5 pl-7 pr-2 text-xs placeholder:text-white/60 focus:bg-white/20 focus:outline-none"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 cursor-pointer opacity-80 hover:opacity-100" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline opacity-90", children: user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "flex items-center gap-1 rounded bg-white/10 px-2 py-1 hover:bg-white/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
          " Logout"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-56 shrink-0 overflow-y-auto bg-sidebar text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "py-2 text-[12.5px]", children: NAV.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50", children: group.group }),
        group.items.map((item) => {
          const exact = "exact" in item && item.exact;
          const active = exact ? loc.pathname === item.to : item.to !== "/" && loc.pathname.startsWith(item.to);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              className: `flex items-center gap-2 px-3 py-1.5 border-l-2 transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-primary-foreground" : "border-l-transparent hover:bg-sidebar-accent/60"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
              ]
            },
            item.to
          );
        })
      ] }, group.group)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-1 flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b bg-card px-4 py-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Home" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
      ] })
    ] })
  ] });
}
function AppShell() {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(RouteLoading, {});
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/auth", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CrmLayout, {});
}
export {
  AppShell as component
};
