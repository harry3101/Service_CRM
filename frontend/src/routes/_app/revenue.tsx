import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Panel from "@/components/Panel";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";
import { Plus, IndianRupee, CheckCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/revenue")({ component: Revenue });

function Revenue() {
  const [rows, setRows] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    invoice_no: "",
    customer_id: "",
    call_id: "",
    amount: 0,
    tax: 0,
    status: "paid",
    invoice_date: new Date().toISOString().slice(0, 10),
  });

  const load = async () => {
    const [r, c, sc] = await Promise.all([
      api.getRevenue() as Promise<any[]>,
      api.getCustomers() as Promise<any[]>,
      api.getClosedServiceCalls(),
    ]);
    setRows(r);
    setCustomers(c);
    setCalls(sc);
  };
  useEffect(() => {
    load();
  }, []);

  const paid = rows.filter((r) => r.status === "paid");
  const totalPaid = paid.reduce((s, r) => s + Number(r.amount) + Number(r.tax), 0);
  const pending = rows
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + Number(r.amount) + Number(r.tax), 0);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const inv =
      form.invoice_no ||
      `INV-${new Date().getFullYear()}-${String(rows.length + 1).padStart(4, "0")}`;
    try {
      await api.createRevenue({
        ...form,
        invoice_no: inv,
        customer_id: form.customer_id || null,
        call_id: form.call_id || null,
      });
    } catch (e) {
      return toast.error(e instanceof Error ? e.message : "Failed");
    }
    toast.success("Invoice created");
    setOpen(false);
    load();
    setForm({
      invoice_no: "",
      customer_id: "",
      call_id: "",
      amount: 0,
      tax: 0,
      status: "paid",
      invoice_date: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KC
          icon={IndianRupee}
          label="Total Revenue (Paid)"
          value={`₹${totalPaid.toLocaleString("en-IN")}`}
        />
        <KC icon={CheckCircle} label="Paid Invoices" value={paid.length} />
        <KC icon={Clock} label="Pending Amount" value={`₹${pending.toLocaleString("en-IN")}`} />
      </div>
      <Panel
        title="Invoices & Revenue"
        actions={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" /> New Invoice
          </button>
        }
      >
        <table className="crm-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Linked Ticket</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="font-mono">{r.invoice_no}</td>
                <td>{r.invoice_date}</td>
                <td>{r.customers?.name ?? "—"}</td>
                <td className="font-mono text-[11px]">{r.service_calls?.ticket_no ?? "—"}</td>
                <td>₹{Number(r.amount).toLocaleString("en-IN")}</td>
                <td>₹{Number(r.tax).toLocaleString("en-IN")}</td>
                <td className="font-medium">
                  ₹{(Number(r.amount) + Number(r.tax)).toLocaleString("en-IN")}
                </td>
                <td>
                  <StatusBadge value={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={create} className="w-full max-w-md rounded bg-card shadow-xl">
            <div className="crm-panel-header">New Invoice</div>
            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <F label="Invoice #">
                <input
                  value={form.invoice_no}
                  onChange={(e) => setForm({ ...form, invoice_no: e.target.value })}
                  placeholder="auto"
                  className="i"
                />
              </F>
              <F label="Date">
                <input
                  type="date"
                  value={form.invoice_date}
                  onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                  className="i"
                />
              </F>
              <F label="Customer">
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="i"
                  required
                >
                  <option value="">— select —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </F>
              <F label="Linked Ticket">
                <select
                  value={form.call_id}
                  onChange={(e) => setForm({ ...form, call_id: e.target.value })}
                  className="i"
                >
                  <option value="">— none —</option>
                  {calls.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ticket_no}
                    </option>
                  ))}
                </select>
              </F>
              <F label="Amount ₹">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: +e.target.value })}
                  className="i"
                />
              </F>
              <F label="Tax ₹">
                <input
                  type="number"
                  step="0.01"
                  value={form.tax}
                  onChange={(e) => setForm({ ...form, tax: +e.target.value })}
                  className="i"
                />
              </F>
              <F label="Status" full>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="i"
                >
                  <option value="paid">paid</option>
                  <option value="pending">pending</option>
                </select>
              </F>
            </div>
            <div className="flex justify-end gap-2 border-t bg-secondary p-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-input bg-background px-3 py-1 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}`}</style>
    </div>
  );
}
function KC({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="crm-panel flex items-center gap-3 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}
function F({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
