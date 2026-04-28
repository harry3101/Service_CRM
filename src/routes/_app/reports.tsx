import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Panel from "@/components/Panel";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_app/reports")({ component: Reports });

function Reports() {
  const [revByMonth, setRevByMonth] = useState<any[]>([]);
  const [callsByPriority, setCallsByPriority] = useState<any[]>([]);
  const [callsByCity, setCallsByCity] = useState<any[]>([]);
  const [engineerLoad, setEngineerLoad] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [rev, calls, alloc] = await Promise.all([
        supabase.from("revenue").select("amount,tax,invoice_date,status"),
        supabase.from("service_calls").select("priority, status, customers(city)"),
        supabase.from("call_allocations").select("engineers(name)"),
      ]);
      const rmap: Record<string, number> = {};
      (rev.data ?? []).filter(r => r.status === "paid").forEach(r => {
        const m = new Date(r.invoice_date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
        rmap[m] = (rmap[m] ?? 0) + Number(r.amount) + Number(r.tax);
      });
      setRevByMonth(Object.entries(rmap).map(([month, amount]) => ({ month, amount })));

      const pmap: Record<string, number> = {};
      (calls.data ?? []).forEach(c => { pmap[c.priority] = (pmap[c.priority] ?? 0) + 1; });
      setCallsByPriority(Object.entries(pmap).map(([priority, count]) => ({ priority, count })));

      const cmap: Record<string, number> = {};
      (calls.data ?? []).forEach((c: any) => {
        const city = c.customers?.city ?? "Unknown";
        cmap[city] = (cmap[city] ?? 0) + 1;
      });
      setCallsByCity(Object.entries(cmap).map(([city, count]) => ({ city, count })));

      const emap: Record<string, number> = {};
      (alloc.data ?? []).forEach((a: any) => {
        const n = a.engineers?.name ?? "—";
        emap[n] = (emap[n] ?? 0) + 1;
      });
      setEngineerLoad(Object.entries(emap).map(([engineer, calls]) => ({ engineer, calls })));
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Panel title="Monthly Revenue (₹)">
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={revByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="amount" stroke="oklch(0.45 0.16 255)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Calls by Priority">
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={callsByPriority}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
              <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="oklch(0.55 0.18 30)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Calls by City">
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={callsByCity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="oklch(0.6 0.15 200)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Engineer Allocation Load">
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={engineerLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 250)" />
              <XAxis dataKey="engineer" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="calls" fill="oklch(0.5 0.15 150)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
