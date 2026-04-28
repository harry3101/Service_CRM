import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Panel from "@/components/Panel";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({ component: Settings });

function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [roles, setRoles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, r] = await Promise.all([api.getProfile(), api.getMyRoles()]);
        setProfile({ full_name: p.full_name ?? "", phone: p.phone ?? "" });
        setRoles(r.roles);
      } catch {
        /* ignore */
      }
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.updateProfile(profile);
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
    setBusy(false);
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Panel title="My Profile">
        <form onSubmit={save} className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground">Email</label>
            <input value={user?.email ?? ""} disabled className="w-full rounded border border-input bg-secondary px-2 py-1.5" />
          </div>
          <div>
            <label className="mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground">Full Name</label>
            <input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full rounded border border-input bg-background px-2 py-1.5 focus:outline-none focus:border-ring" />
          </div>
          <div>
            <label className="mb-1 block text-[10.5px] font-medium uppercase text-muted-foreground">Phone</label>
            <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full rounded border border-input bg-background px-2 py-1.5 focus:outline-none focus:border-ring" />
          </div>
          <button disabled={busy} className="rounded bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {busy ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </Panel>

      <Panel title="Account & Permissions">
        <div className="space-y-2 text-xs">
          <Row k="User ID" v={<code className="text-[10px]">{user?.id}</code>} />
          <Row k="Roles" v={
            <div className="flex flex-wrap gap-1">
              {roles.length === 0 ? <span className="text-muted-foreground">No roles</span> :
                roles.map(r => <span key={r} className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10.5px] uppercase text-primary">{r}</span>)}
            </div>
          } />
          <Row k="Plan" v="Standard" />
          <Row k="Region" v="Asia / IN" />
          <p className="pt-2 text-[11px] text-muted-foreground">
            Roles control who can create, update or delete CRM records. Contact a workspace admin to change roles.
          </p>
        </div>
      </Panel>

      <Panel title="System" className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
          <Stat label="Application" value="DEMO CRM v1.0" />
          <Stat label="Build" value="2026.04.28" />
          <Stat label="Database" value="Connected" />
          <Stat label="Support" value="support@democrm.app" />
        </div>
      </Panel>
    </div>
  );
}
function Row({ k, v }: { k: string; v: any }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-border bg-secondary/40 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
