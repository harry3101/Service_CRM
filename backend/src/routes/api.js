import { Router } from "express";
import mongoose from "mongoose";
import { Customer } from "../models/Customer.js";
import { Engineer } from "../models/Engineer.js";
import { ServiceCall } from "../models/ServiceCall.js";
import { CallAllocation } from "../models/CallAllocation.js";
import { Inventory } from "../models/Inventory.js";
import { InventoryMovement } from "../models/InventoryMovement.js";
import { Revenue } from "../models/Revenue.js";
import { Profile } from "../models/Profile.js";
import { UserRole } from "../models/UserRole.js";
import { requireAuth, ensureUserRecords } from "../middleware/auth.js";
import * as S from "../serializers.js";

const r = Router();

r.post("/auth/sync", requireAuth, async (req, res) => {
  try {
    await ensureUserRecords(req.user.uid, req.user.email, req.user.name);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

r.get("/me/profile", requireAuth, async (req, res) => {
  try {
    await ensureUserRecords(req.user.uid, req.user.email, req.user.name);
    const p = await Profile.findOne({ userId: req.user.uid });
    res.json({
      full_name: p?.fullName ?? "",
      phone: p?.phone ?? "",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

r.patch("/me/profile", requireAuth, async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    await Profile.findOneAndUpdate(
      { userId: req.user.uid },
      {
        $set: { fullName: full_name ?? "", phone: phone ?? "" },
        $setOnInsert: { userId: req.user.uid },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

r.get("/me/roles", requireAuth, async (req, res) => {
  try {
    await ensureUserRecords(req.user.uid, req.user.email, req.user.name);
    const rows = await UserRole.find({ userId: req.user.uid });
    res.json({ roles: rows.map((x) => x.role) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

r.get("/customers", requireAuth, async (_req, res) => {
  const rows = await Customer.find().sort({ name: 1 });
  res.json(rows.map(S.customerOut));
});

r.post("/customers", requireAuth, async (req, res) => {
  const row = await Customer.create({
    name: req.body.name,
    phone: req.body.phone || "",
    email: req.body.email || "",
    address: req.body.address || "",
    city: req.body.city || "",
  });
  res.status(201).json(S.customerOut(row));
});

r.get("/engineers", requireAuth, async (_req, res) => {
  const rows = await Engineer.find().sort({ name: 1 });
  res.json(rows.map(S.engineerOut));
});

r.post("/engineers", requireAuth, async (req, res) => {
  const row = await Engineer.create({
    name: req.body.name,
    phone: req.body.phone || "",
    email: req.body.email || "",
    specialization: req.body.specialization || "",
    status: req.body.status || "available",
  });
  res.status(201).json(S.engineerOut(row));
});

r.patch("/engineers/:id", requireAuth, async (req, res) => {
  const row = await Engineer.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status } },
    { new: true }
  );
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(S.engineerOut(row));
});

const priorityRank = { high: 0, medium: 1, low: 2 };

r.get("/service-calls", requireAuth, async (_req, res) => {
  const rows = await ServiceCall.find().sort({ createdAt: -1 }).populate("customerId");
  res.json(
    rows.map((doc) => S.serviceCallOut(doc, doc.customerId))
  );
});

r.get("/service-calls/closed-ids", requireAuth, async (_req, res) => {
  const rows = await ServiceCall.find({ status: "closed" })
    .select("ticketNo")
    .lean();
  res.json(
    rows.map((x) => ({
      id: x._id.toString(),
      ticket_no: x.ticketNo,
    }))
  );
});

r.post("/service-calls", requireAuth, async (req, res) => {
  const b = req.body;
  const ticket = b.ticket_no || `SC-${new Date().getFullYear()}-${String((await ServiceCall.countDocuments()) + 1).padStart(4, "0")}`;
  const cust =
    b.customer_id && mongoose.isValidObjectId(b.customer_id) ? b.customer_id : null;
  const row = await ServiceCall.create({
    ticketNo: ticket,
    customerId: cust,
    product: b.product || "",
    serialNo: b.serial_no || "",
    issue: b.issue,
    priority: b.priority || "medium",
    status: b.status || "open",
    scheduledDate: b.scheduled_date || null,
  });
  const populated = await row.populate("customerId");
  res.status(201).json(S.serviceCallOut(populated, populated.customerId));
});

r.patch("/service-calls/:id", requireAuth, async (req, res) => {
  const b = req.body;
  const patch = {};
  if (b.status != null) patch.status = b.status;
  if (b.status === "closed") patch.closedAt = new Date();
  if (b.issue != null) patch.issue = b.issue;
  if (b.priority != null) patch.priority = b.priority;
  if (b.product != null) patch.product = b.product;
  if (b.scheduled_date !== undefined) patch.scheduledDate = b.scheduled_date;
  if (b.customer_id !== undefined) {
    patch.customerId =
      b.customer_id && mongoose.isValidObjectId(b.customer_id) ? b.customer_id : null;
  }
  const row = await ServiceCall.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true }).populate("customerId");
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(S.serviceCallOut(row, row.customerId));
});

r.get("/calls/open", requireAuth, async (_req, res) => {
  const rows = await ServiceCall.find({
    status: { $in: ["open", "allocated", "in-progress"] },
  }).populate("customerId");
  const sorted = rows.sort(
    (a, b) =>
      (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)
  );
  res.json(
    sorted.map((d) => S.serviceCallOut(d, d.customerId))
  );
});

r.get("/call-allocations", requireAuth, async (_req, res) => {
  const rows = await CallAllocation.find()
    .sort({ allocatedAt: -1 })
    .populate("engineerId")
    .populate("callId");
  res.json(rows.map(S.callAllocationOut));
});

r.post("/call-allocations", requireAuth, async (req, res) => {
  const { call_id, engineer_id, notes } = req.body;
  if (!mongoose.isValidObjectId(call_id) || !mongoose.isValidObjectId(engineer_id)) {
    return res.status(400).json({ error: "Invalid call_id or engineer_id" });
  }
  const row = await CallAllocation.create({
    callId: call_id,
    engineerId: engineer_id,
    notes: notes || "",
  });
  await ServiceCall.findByIdAndUpdate(call_id, { $set: { status: "allocated" } });
  const full = await CallAllocation.findById(row._id)
    .populate("engineerId")
    .populate("callId");
  res.status(201).json(S.callAllocationOut(full));
});

r.get("/inventory", requireAuth, async (_req, res) => {
  const rows = await Inventory.find().sort({ name: 1 });
  res.json(rows.map(S.inventoryOut));
});

r.post("/inventory", requireAuth, async (req, res) => {
  const b = req.body;
  const row = await Inventory.create({
    sku: b.sku,
    name: b.name,
    category: b.category || "",
    stockQty: Number(b.stock_qty) || 0,
    unitPrice: Number(b.unit_price) || 0,
    reorderLevel: Number(b.reorder_level) || 0,
  });
  res.status(201).json(S.inventoryOut(row));
});

r.post("/inventory/:id/adjust", requireAuth, async (req, res) => {
  const delta = Number(req.body.delta);
  if (Number.isNaN(delta) || delta === 0) {
    return res.status(400).json({ error: "Invalid delta" });
  }
  const item = await Inventory.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  const newQty = Math.max(0, item.stockQty + delta);
  item.stockQty = newQty;
  await item.save();
  await InventoryMovement.create({
    inventoryId: item._id,
    movementType: delta > 0 ? "in" : "out",
    qty: Math.abs(delta),
  });
  res.json(S.inventoryOut(item));
});

r.get("/revenue", requireAuth, async (_req, res) => {
  const rows = await Revenue.find()
    .sort({ invoiceDate: -1 })
    .populate("customerId")
    .populate("callId");
  res.json(rows.map(S.revenueOut));
});

r.post("/revenue", requireAuth, async (req, res) => {
  const b = req.body;
  const n = (await Revenue.countDocuments()) + 1;
  const inv =
    b.invoice_no ||
    `INV-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`;
  const customerId =
    b.customer_id && mongoose.isValidObjectId(b.customer_id) ? b.customer_id : null;
  const callId = b.call_id && mongoose.isValidObjectId(b.call_id) ? b.call_id : null;
  const row = await Revenue.create({
    invoiceNo: inv,
    customerId,
    callId,
    amount: Number(b.amount) || 0,
    tax: Number(b.tax) || 0,
    invoiceDate: b.invoice_date,
    status: b.status || "paid",
  });
  const full = await Revenue.findById(row._id)
    .populate("customerId")
    .populate("callId");
  res.status(201).json(S.revenueOut(full));
});

r.get("/reports/raw", requireAuth, async (_req, res) => {
  const [revenue, calls, allocations] = await Promise.all([
    Revenue.find()
      .select("amount tax invoiceDate status")
      .lean()
      .then((rows) =>
        rows.map((x) => ({
          amount: x.amount,
          tax: x.tax,
          invoice_date: x.invoiceDate,
          status: x.status,
        }))
      ),
    ServiceCall.find()
      .select("priority status")
      .populate("customerId", "city")
      .lean()
      .then((rows) =>
        rows.map((c) => ({
          priority: c.priority,
          status: c.status,
          customers: c.customerId
            ? { city: c.customerId.city }
            : null,
        }))
      ),
    CallAllocation.find()
      .populate("engineerId", "name")
      .lean()
      .then((rows) =>
        rows.map((a) => ({
          engineers: a.engineerId ? { name: a.engineerId.name } : null,
        }))
      ),
  ]);
  res.json({ revenue, service_calls: calls, call_allocations: allocations });
});

export const apiRouter = r;
