import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Panel from "@/components/Panel";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/engineers")({ component: Engineers });

function Engineers() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", specialization: "", status: "available" });

  const load = async () => {
    const data = (await api.getEngineers()) as any[];
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEngineer(form);
    } catch (e) {
      return toast.error(e instanceof Error ? e.message : "Failed");
    }
    toast.success("Engineer added"); setOpen(false); setForm({ name: "", phone: "", email: "", specialization: "", status: "available" }); load();
  };

  const setStatus = async (id: string, status: string) => {
    try {
      await api.updateEngineer(id, { status });
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-3">
      <Panel title={`Engineers (${rows.length})`} actions={<button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"><Plus className="h-3 w-3" /> Add Engineer</button>}>
        <table className="crm-table">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Specialization</th><th>Status</th><th>Change</th></tr></thead>
          <tbody>
            {rows.map(e => (
              <tr key={e.id}>
                <td className="font-medium">{e.name}</td>
                <td>{e.phone}</td>
                <td>{e.email}</td>
                <td>{e.specialization}</td>
                <td><StatusBadge value={e.status} /></td>
                <td>
                  <select value={e.status} onChange={ev => setStatus(e.id, ev.target.value)} className="rounded border border-input bg-background px-1 py-0.5 text-[11px]">
                    <option value="available">available</option>
                    <option value="on-call">on-call</option>
                    <option value="off-duty">off-duty</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={create} className="w-full max-w-md rounded bg-card shadow-xl">
            <div className="crm-panel-header">New Engineer</div>
            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <F label="Name" full><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="i" /></F>
              <F label="Phone"><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="i" /></F>
              <F label="Email"><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="i" /></F>
              <F label="Specialization"><input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} className="i" /></F>
              <F label="Status">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="i">
                  <option value="available">available</option><option value="on-call">on-call</option><option value="off-duty">off-duty</option>
                </select>
              </F>
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
