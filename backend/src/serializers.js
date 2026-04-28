export function idStr(x) {
  if (!x) return null;
  return typeof x === "string" ? x : x.toString();
}

export function customerOut(c) {
  if (!c) return null;
  const o = c.toObject ? c.toObject() : c;
  return {
    id: idStr(o._id),
    name: o.name,
    phone: o.phone ?? null,
    email: o.email ?? null,
    address: o.address ?? null,
    city: o.city ?? null,
    created_at: o.createdAt?.toISOString?.() ?? o.created_at,
    updated_at: o.updatedAt?.toISOString?.() ?? o.updated_at,
  };
}

export function engineerOut(e) {
  if (!e) return null;
  const o = e.toObject ? e.toObject() : e;
  return {
    id: idStr(o._id),
    name: o.name,
    phone: o.phone ?? null,
    email: o.email ?? null,
    specialization: o.specialization ?? null,
    status: o.status,
    created_at: o.createdAt?.toISOString?.() ?? o.created_at,
    updated_at: o.updatedAt?.toISOString?.() ?? o.updated_at,
  };
}

export function serviceCallOut(doc, popCustomer) {
  const o = doc.toObject ? doc.toObject() : doc;
  const c = popCustomer || o.customerId;
  return {
    id: idStr(o._id),
    ticket_no: o.ticketNo,
    customer_id: idStr(o.customerId),
    product: o.product ?? null,
    serial_no: o.serialNo ?? null,
    issue: o.issue,
    priority: o.priority,
    status: o.status,
    scheduled_date: o.scheduledDate ?? null,
    closed_at: o.closedAt ? o.closedAt.toISOString() : null,
    created_at: o.createdAt?.toISOString?.() ?? o.created_at,
    updated_at: o.updatedAt?.toISOString?.() ?? o.updated_at,
    customers: c
      ? {
          name: c.name,
          phone: c.phone,
          city: c.city,
        }
      : null,
  };
}

export function callAllocationOut(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  const eng = o.engineerId;
  const sc = o.callId;
  return {
    id: idStr(o._id),
    call_id: idStr(sc?._id ?? o.callId),
    engineer_id: idStr(eng?._id ?? o.engineerId),
    allocated_at: (o.allocatedAt || o.allocated_at)?.toISOString?.() ?? o.allocated_at,
    notes: o.notes ?? null,
    engineers: eng
      ? { name: eng.name, specialization: eng.specialization }
      : null,
    service_calls: sc
      ? { ticket_no: sc.ticketNo, product: sc.product, status: sc.status }
      : null,
  };
}

export function inventoryOut(i) {
  const o = i.toObject ? i.toObject() : i;
  return {
    id: idStr(o._id),
    sku: o.sku,
    name: o.name,
    category: o.category ?? null,
    stock_qty: o.stockQty,
    unit_price: o.unitPrice,
    reorder_level: o.reorderLevel,
    created_at: o.createdAt?.toISOString?.() ?? o.created_at,
    updated_at: o.updatedAt?.toISOString?.() ?? o.updated_at,
  };
}

export function revenueOut(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  const cust = o.customerId;
  const call = o.callId;
  return {
    id: idStr(o._id),
    invoice_no: o.invoiceNo,
    amount: o.amount,
    tax: o.tax,
    invoice_date: o.invoiceDate,
    status: o.status,
    customer_id: idStr(o.customerId),
    call_id: idStr(o.callId),
    customers: cust ? { name: cust.name } : null,
    service_calls: call ? { ticket_no: call.ticketNo } : null,
  };
}
