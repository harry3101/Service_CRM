import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
      api.getOpenCalls() as Promise<any[]>,
      api.getEngineers() as Promise<any[]>,
      api.getCallAllocations() as Promise<any[]>,
    ]);
    setCalls(c);
    setEngineers(e);
    setAllocations(a);
  };
  useEffect(() => {
    load();
  }, []);

  const allocate = async (callId: string) => {
    const eid = pick[callId];
    if (!eid) return toast.error("Select an engineer");
    try {
      await api.createCallAllocation({ call_id: callId, engineer_id: eid });
      toast.success("Engineer allocated");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Allocation failed");
    }
  };

  return (
    <div className="space-y-3">
      <Panel title="Pending & Active Calls — Allocate Engineer">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Engineer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((c) => (
              <tr key={c.id}>
                <td className="font-mono">{c.ticket_no}</td>
                <td>
                  {c.customers?.name} ·{" "}
                  <span className="text-muted-foreground">{c.customers?.city}</span>
                </td>
                <td>{c.product}</td>
                <td>
                  <StatusBadge value={c.priority} />
                </td>
                <td>
                  <StatusBadge value={c.status} />
                </td>
                <td>
                  <select
                    value={pick[c.id] ?? ""}
                    onChange={(e) => setPick({ ...pick, [c.id]: e.target.value })}
                    className="rounded border border-input bg-background px-1 py-0.5 text-[11px]"
                  >
                    <option value="">— select —</option>
                    {engineers.map((en) => (
                      <option key={en.id} value={en.id}>
                        {en.name} ({en.specialization})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => allocate(c.id)}
                    className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[11px] text-primary-foreground hover:bg-primary/90"
                  >
                    <UserCheck className="h-3 w-3" /> Allocate
                  </button>
                </td>
              </tr>
            ))}
            {calls.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  No pending calls.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      <Panel title="Recent Allocations">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Product</th>
              <th>Engineer</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Allocated</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a) => (
              <tr key={a.id}>
                <td className="font-mono">{a.service_calls?.ticket_no}</td>
                <td>{a.service_calls?.product}</td>
                <td>{a.engineers?.name}</td>
                <td>{a.engineers?.specialization}</td>
                <td>
                  <StatusBadge value={a.service_calls?.status ?? "-"} />
                </td>
                <td className="text-muted-foreground">
                  {new Date(a.allocated_at).toLocaleString("en-IN")}
                </td>
                <td>{a.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
