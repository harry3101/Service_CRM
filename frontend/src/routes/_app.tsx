import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import CrmLayout from "@/components/CrmLayout";
import { waitForFirebaseUser } from "@/lib/waitForFirebaseUser";

function RouteLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    if (import.meta.env.SSR) return;
    const user = await waitForFirebaseUser();
    if (!user) throw redirect({ to: "/auth" });
  },
  pendingComponent: RouteLoading,
  component: AppShell,
});

function AppShell() {
  const { user, loading } = useAuth();
  if (loading) return <RouteLoading />;
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <CrmLayout />;
}
