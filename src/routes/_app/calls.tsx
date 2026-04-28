import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Panel from "@/components/Panel";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/calls")({ component: Calls });

function Calls() {
  const [rows, setRows] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ticket_no: "", customer_id: "", product: "", serial_no: "", issue: "", priority: "medium", scheduled_date: "" });

  const load = async () => {
    const { data } = await supabase.from("service_calls").select("*, customers(name,phone,city)").order("created_at", { ascending: false });
    setRows(data ?? []);
  };

  useEffect(() => {
    load();
    supabase.from("customers").select("id,name").then(({ data }) => setCustomers(data ?? []));
  }, []);

  const filtered = rows.filter(r => {
    const matchQ = !q || r.ticket_no.toLowerCase().includes(q.toLowerCase()) || r.product?.toLowerCase().includes(q.toLowerCase()) || r.customers?.name?.toLowerCase().includes(q.toLowerCase());
    const matchS = !statusFilter || r.status === statusFilter;
    return matchQ && matchS;
  });

  const updateStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "closed") patch.closed_at = new Date().toISOString();
    const { error } = await supabase.from("service_calls").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Status updated"); load(); }
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = form.ticket_no || `SC-${new Date().getFullYear()}-${String(rows.length + 1).padStart(4, "0")}`;
    const { error } = await supabase.from("service_calls").insert({ ...form, ticket_no: ticket, scheduled_date: form.scheduled_date || null, customer_id: form.customer_id || null });
    if (error) toast.error(error.message);
    else { toast.success("Call created"); setOpen(false); setForm({ ticket_no: "", customer_id: "", product: "", serial_no: "", issue: "", priority: "medium", scheduled_date: "" }); load(); }
  };

  return (
    <div className="space-y-3">
      <Panel
        title={`Service Calls (${filtered.length})`}
        actions={
          <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-3 w-3" /> New Call
          </button>
        }
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ticket/product/customer"
              className="rounded border border-input bg-background py-1 pl-7 pr-2 text-xs focus:outline-none focus:border-ring" />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded border border-input bg-background py-1 px-2 text-xs">
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="allocated">Allocated</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="crm-table">
            <thead>
              <tr><th>Ticket</th><th>Customer</th><th>Product</th><th>Issue</th><th>Priority</th><th>Status</th><th>Scheduled</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="font-mono">{r.ticket_no}</td>
                  <td>{r.customers?.name}<div className="text-[10px] text-muted-foreground">{r.customers?.phone} · {r.customers?.city}</div></td>
                  <td>{r.product}<div className="text-[10px] text-muted-foreground">{r.serial_no}</div></td>
                  <td className="max-w-xs truncate">{r.issue}</td>
                  <td><StatusBadge value={r.priority} /></td>
                  <td><StatusBadge value={r.status} /></td>
                  <td>{r.scheduled_date ?? "-"}</td>
                  <td>
                    <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="rounded border border-input bg-background py-0.5 px-1 text-[11px]">
                      <option value="open">open</option>
                      <option value="allocated">allocated</option>
                      <option value="in-progress">in-progress</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-muted-foreground">No service calls match filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={create} className="w-full max-w-lg rounded bg-card shadow-xl">
            <div className="crm-panel-header">New Service Call</div>
            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <Field label="Ticket #"><input value={form.ticket_no} onChange={e => setForm({ ...form, ticket_no: e.target.value })} placeholder="auto" className="input-sm" /></Field>
              <Field label="Customer">
                <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} className="input-sm" required>
                  <option value="">— select —</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Product"><input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} className="input-sm" /></Field>
              <Field label="Serial #"><input value={form.serial_no} onChange={e => setForm({ ...form, serial_no: e.target.value })} className="input-sm" /></Field>
              <Field label="Priority">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-sm">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </Field>
              <Field label="Scheduled Date"><input type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} className="input-sm" /></Field>
              <Field label="Issue Description" full><textarea required value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} rows={3} className="input-sm" /></Field>
            </div>
            <div className="flex justify-end gap-2 border-t bg-secondary p-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded border border-input bg-background px-3 py-1 text-xs">Cancel</button>
              <button type="submit" className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Create</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.input-sm{width:100%;border:1px solid var(--color-input);background:var(--color-background);padding:4px 6px;border-radius:4px;font-size:12px}.input-sm:focus{outline:none;border-color:var(--color-ring)}`}</style>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1 block text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
