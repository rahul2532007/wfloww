import { createFileRoute, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const { loading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      navigate({ to: "/login", replace: true });
      return;
    }
    // Owners without an active/approved business must stay on pending-activation.
    if (profile.role !== "admin" && !profile.business_active) {
      if (location.pathname !== "/pending-activation") {
        navigate({ to: "/pending-activation", replace: true });
      }
    }
  }, [loading, profile, navigate, location.pathname]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-warm-5" />
      </div>
    );
  }
  if (profile.role !== "admin" && !profile.business_active && location.pathname !== "/pending-activation") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-warm-5" />
      </div>
    );
  }
  return <Outlet />;
}
