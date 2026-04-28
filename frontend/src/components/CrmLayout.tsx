import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PhoneCall,
  UserCheck,
  Package,
  Users,
  Wrench,
  IndianRupee,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { group: "Main", items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    group: "Service",
    items: [
      { to: "/calls", label: "Call Management", icon: PhoneCall },
      { to: "/allocation", label: "Call Allocation", icon: UserCheck },
    ],
  },
  {
    group: "Operations",
    items: [
      { to: "/inventory", label: "Inventory", icon: Package },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/engineers", label: "Engineers", icon: Wrench },
    ],
  },
  {
    group: "Finance",
    items: [
      { to: "/revenue", label: "Revenue", icon: IndianRupee },
      { to: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  { group: "System", items: [{ to: "/settings", label: "Settings", icon: Settings }] },
];

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/calls": "Call Management",
  "/allocation": "Call Allocation",
  "/inventory": "Inventory",
  "/customers": "Customers",
  "/engineers": "Engineers",
  "/revenue": "Revenue",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function CrmLayout() {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const title = TITLES[loc.pathname] ?? "DEMO CRM";

  const handleLogout = async () => {
    await signOut();
    nav({ to: "/auth" });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex h-12 items-center justify-between bg-header px-3 text-header-foreground shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-[10px] font-bold leading-tight text-white">
            DC
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">DEMO CRM</div>
            <div className="text-[10px] leading-tight opacity-75">Service Center</div>
          </div>
        </div>
        <div className="hidden flex-1 max-w-md mx-6 md:block">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60" />
            <input
              placeholder="Search ticket, customer, part…"
              className="w-full rounded bg-white/10 py-1.5 pl-7 pr-2 text-xs placeholder:text-white/60 focus:bg-white/20 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Bell className="h-4 w-4 cursor-pointer opacity-80 hover:opacity-100" />
          <span className="hidden sm:inline opacity-90">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 hover:bg-white/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 overflow-y-auto bg-sidebar text-sidebar-foreground">
          <nav className="py-2 text-[12.5px]">
            {NAV.map((group) => (
              <div key={group.group} className="mb-2">
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const exact = "exact" in item && item.exact;
                  const active = exact
                    ? loc.pathname === item.to
                    : item.to !== "/" && loc.pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-3 py-1.5 border-l-2 transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-primary-foreground"
                          : "border-l-transparent hover:bg-sidebar-accent/60"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Breadcrumb bar */}
          <div className="flex items-center justify-between border-b bg-card px-4 py-1.5 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Home</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">{title}</span>
            </div>
            <div className="text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
