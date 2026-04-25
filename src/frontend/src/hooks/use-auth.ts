import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import type { AdminProfile, NGOProfile, UserProfile } from "../backend";
import type { UserRole } from "../types";

// ── Session shape stored in localStorage ────────────────────────────────────
export interface RCSession {
  role: NonNullable<UserRole>;
  userProfile: UserProfile | null;
  ngoProfile: NGOProfile | null;
  adminProfile: AdminProfile | null;
}

const SESSION_KEY = "rc_session";

export function getSession(): RCSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RCSession;
    if (!parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: RCSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ── Auth hook — fully synchronous, no async loading ─────────────────────────
export function useAuth() {
  const navigate = useNavigate();
  const session = getSession();

  const logout = useCallback(() => {
    clearSession();
    navigate({ to: "/login" });
  }, [navigate]);

  // Stub refetchProfile — kept for backward compat with registration pages
  // After registration, those pages store the session directly and navigate
  const refetchProfile = useCallback(async () => {
    // no-op: session is already stored by the login/register flow
  }, []);

  return {
    isAuthenticated: !!session,
    isLoading: false,
    role: session?.role ?? null,
    userProfile: session?.userProfile ?? null,
    ngoProfile: session?.ngoProfile ?? null,
    adminProfile: session?.adminProfile ?? null,
    logout,
    refetchProfile,
  };
}
