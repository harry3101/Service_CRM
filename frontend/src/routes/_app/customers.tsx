import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Panel from "@/components/Panel";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/customers")({ component: Customers });

function Customers() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "" });

  const load = async () => {
    const data = (await api.getCustomers()) as any[];
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.city?.toLowerCase().includes(q.toLowerCase()) || r.phone?.includes(q));

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCustomer(form);
    } catch (e) {
      return toast.error(e instanceof Error ? e.message : "Failed");
    }
    toast.success("Customer added"); setOpen(false); setForm({ name: "", phone: "", email: "", address: "", city: "" }); load();
  };

  return (
    <div className="space-y-3">
      <Panel
        title={`Customers (${filtered.length})`}
        actions={<button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"><Plus className="h-3 w-3" /> New Customer</button>}
      >
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, city…" className="mb-2 w-64 rounded border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:border-ring" />
        <table className="crm-table">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th>Address</th><th>Since</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="font-medium">{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.city}</td>
                <td className="text-muted-foreground">{c.address}</td>
                <td className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={create} className="w-full max-w-md rounded bg-card shadow-xl">
            <div className="crm-panel-header">New Customer</div>
            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <F label="Name" full><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="i" /></F>
              <F label="Phone"><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="i" /></F>
              <F label="Email"><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="i" /></F>
              <F label="City"><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="i" /></F>
              <F label="Address" full><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="i" /></F>
            </div>
            <div className="flex justify-end gap-2 border-t bg-secondary p-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded border border-input bg-background px-3 py-1 text-xs">Cancel</button>
              <button type="submit" className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Save</button>
            </div>
          </form>
        </div>
      )}
      <style>{`.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}`}</style>
    </div>
  );
}
function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={full ? "col-span-2" : ""}><label className="mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground">{label}</label>{children}</div>;
}
