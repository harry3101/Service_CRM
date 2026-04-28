import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Panel from "@/components/Panel";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";

export const Route = createFileRoute("/_app/allocation")({ component: Allocation });

function Allocation() {
  const [calls, setCalls] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [pick, setPick] = useState<Record<string, string>>({});

  const load = async () => {
    const [c, e, a] = await Promise.all([
      supabase.from("service_calls").select("*, customers(name,city)").in("status", ["open","allocated","in-progress"]).order("priority"),
      supabase.from("engineers").select("*"),
      supabase.from("call_allocations").select("*, engineers(name,specialization), service_calls(ticket_no,product,status)").order("allocated_at", { ascending: false }),
    ]);
    setCalls(c.data ?? []); setEngineers(e.data ?? []); setAllocations(a.data ?? []);
  };
  useEffect(() => { load(); }, []);

  const allocate = async (callId: string) => {
    const eid = pick[callId];
    if (!eid) return toast.error("Select an engineer");
    const { error } = await supabase.from("call_allocations").insert({ call_id: callId, engineer_id: eid });
    if (error) return toast.error(error.message);
    await supabase.from("service_calls").update({ status: "allocated" }).eq("id", callId);
    toast.success("Engineer allocated"); load();
  };

  return (
    <div className="space-y-3">
      <Panel title="Pending & Active Calls — Allocate Engineer">
        <table className="crm-table">
          <thead><tr><th>Ticket</th><th>Customer</th><th>Product</th><th>Priority</th><th>Status</th><th>Engineer</th><th>Action</th></tr></thead>
          <tbody>
            {calls.map(c => (
              <tr key={c.id}>
                <td className="font-mono">{c.ticket_no}</td>
                <td>{c.customers?.name} · <span className="text-muted-foreground">{c.customers?.city}</span></td>
                <td>{c.product}</td>
                <td><StatusBadge value={c.priority} /></td>
                <td><StatusBadge value={c.status} /></td>
                <td>
                  <select value={pick[c.id] ?? ""} onChange={e => setPick({ ...pick, [c.id]: e.target.value })}
                    className="rounded border border-input bg-background px-1 py-0.5 text-[11px]">
                    <option value="">— select —</option>
                    {engineers.map(en => <option key={en.id} value={en.id}>{en.name} ({en.specialization})</option>)}
                  </select>
                </td>
                <td>
                  <button onClick={() => allocate(c.id)} className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[11px] text-primary-foreground hover:bg-primary/90">
                    <UserCheck className="h-3 w-3" /> Allocate
                  </button>
                </td>
              </tr>
            ))}
            {calls.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">No pending calls.</td></tr>}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent Allocations">
        <table className="crm-table">
          <thead><tr><th>Ticket</th><th>Product</th><th>Engineer</th><th>Specialization</th><th>Status</th><th>Allocated</th><th>Notes</th></tr></thead>
          <tbody>
            {allocations.map(a => (
              <tr key={a.id}>
                <td className="font-mono">{a.service_calls?.ticket_no}</td>
                <td>{a.service_calls?.product}</td>
                <td>{a.engineers?.name}</td>
                <td>{a.engineers?.specialization}</td>
                <td><StatusBadge value={a.service_calls?.status ?? "-"} /></td>
                <td className="text-muted-foreground">{new Date(a.allocated_at).toLocaleString("en-IN")}</td>
                <td>{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
