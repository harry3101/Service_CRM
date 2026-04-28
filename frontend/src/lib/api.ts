import { auth } from "@/lib/firebase";

const base = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function headersWithAuth(): Promise<HeadersInit> {
  const u = auth.currentUser;
  if (!u) throw new Error("Not signed in");
  const token = await u.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function parseError(res: Response): Promise<string> {
  const t = await res.text();
  try {
    const j = JSON.parse(t);
    return j.error || j.message || t;
  } catch {
    return t || res.statusText;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const h = await headersWithAuth();
  const res = await fetch(`${base}/api${path}`, { headers: h });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  const h = await headersWithAuth();
  const res = await fetch(`${base}/api${path}`, {
    method: "POST",
    headers: { ...h, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const h = await headersWithAuth();
  const res = await fetch(`${base}/api${path}`, {
    method: "PATCH",
    headers: { ...h, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export const api = {
  authSync: () => apiPost<{ ok: boolean }>("/auth/sync", {}),
  getProfile: () => apiGet<{ full_name: string; phone: string }>("/me/profile"),
  updateProfile: (body: { full_name: string; phone: string }) =>
    apiPatch<{ ok: boolean }>("/me/profile", body),
  getMyRoles: () => apiGet<{ roles: string[] }>("/me/roles"),
  getCustomers: () => apiGet<unknown[]>("/customers"),
  createCustomer: (body: unknown) => apiPost("/customers", body),
  getEngineers: () => apiGet<unknown[]>("/engineers"),
  createEngineer: (body: unknown) => apiPost("/engineers", body),
  updateEngineer: (id: string, body: { status: string }) => apiPatch(`/engineers/${id}`, body),
  getServiceCalls: () => apiGet<unknown[]>("/service-calls"),
  getOpenCalls: () => apiGet<unknown[]>("/calls/open"),
  createServiceCall: (body: unknown) => apiPost("/service-calls", body),
  updateServiceCall: (id: string, body: unknown) => apiPatch(`/service-calls/${id}`, body),
  getCallAllocations: () => apiGet<unknown[]>("/call-allocations"),
  createCallAllocation: (body: { call_id: string; engineer_id: string; notes?: string }) =>
    apiPost("/call-allocations", body),
  getInventory: () => apiGet<unknown[]>("/inventory"),
  createInventory: (body: unknown) => apiPost("/inventory", body),
  adjustInventory: (id: string, delta: number) => apiPost(`/inventory/${id}/adjust`, { delta }),
  getRevenue: () => apiGet<unknown[]>("/revenue"),
  getClosedServiceCalls: () =>
    apiGet<{ id: string; ticket_no: string }[]>("/service-calls/closed-ids"),
  createRevenue: (body: unknown) => apiPost("/revenue", body),
  getReportsRaw: () =>
    apiGet<{
      revenue: { amount: number; tax: number; invoice_date: string; status: string }[];
      service_calls: { priority: string; status: string; customers: { city?: string } | null }[];
      call_allocations: { engineers: { name?: string } | null }[];
    }>("/reports/raw"),
};
