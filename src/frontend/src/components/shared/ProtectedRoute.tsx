import { Navigate } from "@tanstack/react-router";
import { getSession } from "../../hooks/use-auth";
import type { UserRole } from "../../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: NonNullable<UserRole>;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  // Read session synchronously — no async, no loading screen, no race conditions
  const session = getSession();

  // Not authenticated → redirect to login immediately
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Wrong role for this route → redirect to the correct dashboard
  if (requiredRole && session.role !== requiredRole) {
    const roleMap: Record<NonNullable<UserRole>, string> = {
      citizen: "/user/dashboard",
      ngo: "/ngo/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={roleMap[session.role]} />;
  }

  return <>{children}</>;
}
