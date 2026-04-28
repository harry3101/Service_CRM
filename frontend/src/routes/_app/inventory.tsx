import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Panel from "@/components/Panel";
import { toast } from "sonner";
import { Plus, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

function Inventory() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    stock_qty: 0,
    unit_price: 0,
    reorder_level: 5,
  });

  const load = async () => {
    const data = (await api.getInventory()) as any[];
    setRows(data ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const totalValue = rows.reduce((s, r) => s + r.stock_qty * Number(r.unit_price), 0);
  const lowStock = rows.filter((r) => r.stock_qty <= r.reorder_level);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createInventory(form);
    } catch (e) {
      return toast.error(e instanceof Error ? e.message : "Failed");
    }
    toast.success("Item added");
    setOpen(false);
    load();
    setForm({ sku: "", name: "", category: "", stock_qty: 0, unit_price: 0, reorder_level: 5 });
  };

  const adjust = async (id: string, delta: number) => {
    const item = rows.find((r) => r.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.stock_qty + delta);
    try {
      await api.adjustInventory(id, delta);
      load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KCard label="Total Items" value={rows.length} />
        <KCard label="Inventory Value" value={`₹${totalValue.toLocaleString("en-IN")}`} />
        <KCard label="Low Stock Alerts" value={lowStock.length} warn={lowStock.length > 0} />
      </div>

      <Panel
        title="Inventory & Spare Parts"
        actions={
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-[11px] text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" /> Add Item
          </button>
        }
      >
        <table className="crm-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Reorder</th>
              <th>Unit ₹</th>
              <th>Total ₹</th>
              <th>Adjust</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const low = r.stock_qty <= r.reorder_level;
              return (
                <tr key={r.id} className={low ? "bg-destructive/5" : ""}>
                  <td className="font-mono text-[11px]">{r.sku}</td>
                  <td className="font-medium">{r.name}</td>
                  <td>{r.category}</td>
                  <td className={low ? "font-bold text-destructive" : ""}>
                    {low && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                    {r.stock_qty}
                  </td>
                  <td className="text-muted-foreground">{r.reorder_level}</td>
                  <td>₹{Number(r.unit_price).toLocaleString("en-IN")}</td>
                  <td className="font-medium">
                    ₹{(r.stock_qty * Number(r.unit_price)).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => adjust(r.id, 1)}
                        className="rounded border border-success/30 bg-success/10 px-1.5 text-[11px] text-success"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => adjust(r.id, -1)}
                        className="rounded border border-destructive/30 bg-destructive/10 px-1.5 text-[11px] text-destructive"
                      >
                        -1
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={create} className="w-full max-w-md rounded bg-card shadow-xl">
            <div className="crm-panel-header">New Inventory Item</div>
            <div className="grid grid-cols-2 gap-3 p-4 text-xs">
              <F label="SKU">
                <input
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="i"
                />
              </F>
              <F label="Category">
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="i"
                />
              </F>
              <F label="Name" full>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="i"
                />
              </F>
              <F label="Stock Qty">
                <input
                  type="number"
                  required
                  value={form.stock_qty}
                  onChange={(e) => setForm({ ...form, stock_qty: +e.target.value })}
                  className="i"
                />
              </F>
              <F label="Reorder Lvl">
                <input
                  type="number"
                  required
                  value={form.reorder_level}
                  onChange={(e) => setForm({ ...form, reorder_level: +e.target.value })}
                  className="i"
                />
              </F>
              <F label="Unit Price ₹" full>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: +e.target.value })}
                  className="i"
                />
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
                Add
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`.i{width:100%;border:1px solid var(--color-input);padding:4px 6px;border-radius:4px;font-size:12px;background:var(--color-background)}.i:focus{outline:none;border-color:var(--color-ring)}`}</style>
    </div>
  );
}

function KCard({ label, value, warn }: { label: string; value: any; warn?: boolean }) {
  return (
    <div className={`crm-panel p-3 ${warn ? "border-destructive/40 bg-destructive/5" : ""}`}>
      <div className="text-[11px] uppercase text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold ${warn ? "text-destructive" : "text-foreground"}`}>
        {value}
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
