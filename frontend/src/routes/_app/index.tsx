import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Panel from "@/components/Panel";
import StatusBadge from "@/components/StatusBadge";
import {
  PhoneCall,
  IndianRupee,
  Package,
  UserCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

interface Kpis {
  totalRevenue: number;
  openCalls: number;
  allocated: number;
  lowStock: number;
  totalCalls: number;
  closedCalls: number;
}

function Dashboard() {
  const [kpis, setKpis] = useState<Kpis>({
    totalRevenue: 0,
    openCalls: 0,
    allocated: 0,
    lowStock: 0,
    totalCalls: 0,
    closedCalls: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [statusPie, setStatusPie] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [callRows, revRows, invRows] = await Promise.all([
        api.getServiceCalls() as Promise<any[]>,
        api.getRevenue() as Promise<any[]>,
        api.getInventory() as Promise<any[]>,
      ]);
      const totalRevenue = revRows
        .filter((r) => r.status === "paid")
        .reduce((s, r) => s + Number(r.amount) + Number(r.tax), 0);
      setKpis({
        totalRevenue,
        openCalls: callRows.filter((c) => c.status === "open").length,
        allocated: callRows.filter((c) => c.status === "allocated" || c.status === "in-progress")
          .length,
        lowStock: invRows.filter((i) => i.stock_qty <= i.reorder_level).length,
        totalCalls: callRows.length,
        closedCalls: callRows.filter((c) => c.status === "closed").length,
      });
      setRecent(callRows.slice(0, 6));

      // revenue by month
      const map: Record<string, number> = {};
      revRows.forEach((r) => {
        const m = new Date(r.invoice_date).toLocaleDateString("en-IN", { month: "short" });
        map[m] = (map[m] ?? 0) + Number(r.amount);
      });
      setRevenueChart(Object.entries(map).map(([month, amount]) => ({ month, amount })));

      // status pie
      const sMap: Record<string, number> = {};
      callRows.forEach((c) => {
        sMap[c.status] = (sMap[c.status] ?? 0) + 1;
      });
      setStatusPie(Object.entries(sMap).map(([name, value]) => ({ name, value })));
    })();
  }, []);

  const PIE_COLORS = [
    "hsl(220 85% 55%)",
    "hsl(40 90% 55%)",
    "hsl(150 60% 45%)",
    "hsl(0 70% 55%)",
    "hsl(200 70% 50%)",
  ];

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${kpis.totalRevenue.toLocaleString("en-IN")}`}
          accent="success"
        />
        <KpiCard icon={PhoneCall} label="Open Calls" value={kpis.openCalls} accent="info" />
        <KpiCard icon={UserCheck} label="In Progress" value={kpis.allocated} accent="warning" />
        <KpiCard
          icon={Package}
          label="Low Stock Items"
          value={kpis.lowStock}
          accent="destructive"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Panel title="Revenue Trend" className="lg:col-span-2">
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={revenueChart}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="oklch(0.45 0.16 255)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Calls by Status">
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  label={{ fontSize: 10 }}
                >
                  {statusPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent Service Calls"
        actions={
          <a href="/calls" className="text-[11px] text-primary hover:underline">
            View all →
          </a>
        }
      >
        <table className="crm-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c) => (
              <tr key={c.id}>
                <td className="font-mono">{c.ticket_no}</td>
                <td>
                  {c.customers?.name}{" "}
                  <span className="text-muted-foreground">· {c.customers?.city}</span>
                </td>
                <td>{c.product}</td>
                <td>
                  <StatusBadge value={c.priority} />
                </td>
                <td>
                  <StatusBadge value={c.status} />
                </td>
                <td className="text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MiniStat icon={TrendingUp} label="Total Calls" value={kpis.totalCalls} />
        <MiniStat icon={UserCheck} label="Closed" value={kpis.closedCalls} />
        <MiniStat icon={AlertTriangle} label="Items to Reorder" value={kpis.lowStock} />
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: any;
  accent: string;
}) {
  const accentMap: Record<string, string> = {
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
    warning: "text-warning-foreground bg-warning/15",
    destructive: "text-destructive bg-destructive/10",
  };
  return (
    <div className="crm-panel flex items-center gap-3 p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded ${accentMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-lg font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="crm-panel flex items-center justify-between p-3">
      <div>
        <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
        <div className="text-base font-semibold text-foreground">{value}</div>
      </div>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}
