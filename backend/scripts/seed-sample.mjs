/**
 * Inserts sample CRM documents so you can confirm MongoDB collections in Atlas or via the UI.
 * Run from backend folder: npm run seed
 * Removes previous sample batch (matched by tag fields) then re-inserts.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../src/db.js";
import { Customer } from "../src/models/Customer.js";
import { Engineer } from "../src/models/Engineer.js";
import { ServiceCall } from "../src/models/ServiceCall.js";
import { CallAllocation } from "../src/models/CallAllocation.js";
import { Inventory } from "../src/models/Inventory.js";
import { InventoryMovement } from "../src/models/InventoryMovement.js";
import { Revenue } from "../src/models/Revenue.js";

const TAG = "sample-seed-v1";

async function main() {
  await connectDb();
  console.log("MongoDB connected. Cleaning old sample data (tagged)…");

  await InventoryMovement.deleteMany({ notes: { $regex: TAG } });
  await CallAllocation.deleteMany({ notes: { $regex: TAG } });
  await Revenue.deleteMany({ invoiceNo: /^INV-2026-SMP-/ });
  await ServiceCall.deleteMany({ issue: { $regex: TAG } });
  await Customer.deleteMany({ email: /@sample\.(symphony|democrm)\.test$/ });
  await Engineer.deleteMany({ email: /@sample\.(symphony|democrm)\.test$/ });
  await Inventory.deleteMany({ sku: /^SMP-/ });

  const c1 = await Customer.create({
    name: "Sample Customer — Acme Repairs",
    phone: "+91 98765 43210",
    email: "acme@sample.democrm.test",
    address: "12 Industrial Area, Phase 2",
    city: "Bengaluru",
  });
  const c2 = await Customer.create({
    name: "Sample Customer — Priya Home",
    phone: "+91 91234 56789",
    email: "priya@sample.democrm.test",
    address: "Plot 4, MG Road",
    city: "Mumbai",
  });
  const c3 = await Customer.create({
    name: "Sample Customer — South Zone Service",
    phone: "+91 90000 11112",
    email: "south@sample.democrm.test",
    address: "88 Residency Road, Sec 5",
    city: "Hyderabad",
  });

  const e1 = await Engineer.create({
    name: "Sample Engineer — Rahul K.",
    phone: "+91 99887 76655",
    email: "rahul.eng@sample.democrm.test",
    specialization: "Washing machines",
    status: "available",
  });
  const e2 = await Engineer.create({
    name: "Sample Engineer — Sneha M.",
    phone: "+91 98700 11223",
    email: "sneha.eng@sample.democrm.test",
    specialization: "Refrigeration",
    status: "on-call",
  });
  const e3 = await Engineer.create({
    name: "Sample Engineer — Vikas P.",
    phone: "+91 95000 44002",
    email: "vikas.eng@sample.democrm.test",
    specialization: "AC / HVAC",
    status: "off-duty",
  });

  const sc1 = await ServiceCall.create({
    ticketNo: "SC-2026-SMP-0001",
    customerId: c1._id,
    product: "Front-load washer",
    serialNo: "WM-SN-778899",
    issue: `Leaking during spin cycle [${TAG}]`,
    priority: "high",
    status: "open",
    scheduledDate: new Date().toISOString().slice(0, 10),
  });
  const sc2 = await ServiceCall.create({
    ticketNo: "SC-2026-SMP-0002",
    customerId: c2._id,
    product: "Double-door fridge",
    serialNo: "RF-334455",
    issue: `Not cooling, odd noise [${TAG}]`,
    priority: "medium",
    status: "allocated",
  });
  const sc3 = await ServiceCall.create({
    ticketNo: "SC-2026-SMP-0003",
    customerId: c1._id,
    product: "Microwave",
    serialNo: "MW-9900",
    issue: `Display dead [${TAG}]`,
    priority: "low",
    status: "closed",
    closedAt: new Date(),
  });
  const sc4 = await ServiceCall.create({
    ticketNo: "SC-2026-SMP-0004",
    customerId: c3._id,
    product: "Split AC 1.5T",
    serialNo: "AC-778812",
    issue: `Water dripping from indoor unit [${TAG}]`,
    priority: "high",
    status: "in-progress",
  });

  await CallAllocation.create({
    callId: sc2._id,
    engineerId: e1._id,
    notes: `Assigned for site visit; parts check [${TAG}]`,
  });
  await CallAllocation.create({
    callId: sc4._id,
    engineerId: e2._id,
    notes: `In progress — ordered drain kit [${TAG}]`,
  });

  const inv1 = await Inventory.create({
    sku: "SMP-SP-001",
    name: "Sample Belt — drive",
    category: "Spares",
    stockQty: 12,
    unitPrice: 450,
    reorderLevel: 3,
  });
  const inv2 = await Inventory.create({
    sku: "SMP-SP-002",
    name: "Sample PCB — control board",
    category: "Electronics",
    stockQty: 1,
    unitPrice: 1200,
    reorderLevel: 5,
  });
  const inv3 = await Inventory.create({
    sku: "SMP-CN-001",
    name: "Sample Drain hose kit",
    category: "AC spares",
    stockQty: 0,
    unitPrice: 320,
    reorderLevel: 2,
  });

  await InventoryMovement.create({
    inventoryId: inv1._id,
    movementType: "in",
    qty: 5,
    notes: TAG,
  });
  await InventoryMovement.create({
    inventoryId: inv2._id,
    movementType: "out",
    qty: 1,
    callId: sc3._id,
    notes: `Issued for ticket SC-2026-SMP-0003 [${TAG}]`,
  });
  await InventoryMovement.create({
    inventoryId: inv3._id,
    movementType: "in",
    qty: 2,
    notes: `PO receipt [${TAG}]`,
  });
  await InventoryMovement.create({
    inventoryId: inv1._id,
    movementType: "out",
    qty: 3,
    callId: sc4._id,
    notes: `Used on in-progress call [${TAG}]`,
  });

  await Revenue.create({
    invoiceNo: "INV-2026-SMP-0001",
    customerId: c2._id,
    callId: sc3._id,
    amount: 2500,
    tax: 450,
    invoiceDate: new Date().toISOString().slice(0, 10),
    status: "paid",
  });
  await Revenue.create({
    invoiceNo: "INV-2026-SMP-0002",
    customerId: c3._id,
    callId: sc4._id,
    amount: 4800,
    tax: 864,
    invoiceDate: new Date().toISOString().slice(0, 10),
    status: "pending",
  });

  const summary = {
    customers: await Customer.countDocuments(),
    engineers: await Engineer.countDocuments(),
    service_calls: await ServiceCall.countDocuments(),
    call_allocations: await CallAllocation.countDocuments(),
    inventory: await Inventory.countDocuments(),
    inventory_movements: await InventoryMovement.countDocuments(),
    revenue: await Revenue.countDocuments(),
  };

  console.log("\nSample data inserted. Collection counts (entire DB):");
  console.log(JSON.stringify(summary, null, 2));
  console.log("\nOpen the CRM (after login) and check Dashboard, Calls, Customers, etc.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
