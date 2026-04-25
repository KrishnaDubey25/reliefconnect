import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  LayoutDashboard,
  LogOut,
  MapIcon,
  Menu,
  Package,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_NAME } from "../../constants";
import { useAuth } from "../../hooks/use-auth";
import type { UserRole } from "../../types";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { ThemeSwitcher } from "../shared/ThemeSwitcher";

interface NavItem {
  href: string;
  labelKey: string;
  ocidKey: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CITIZEN_NAV: NavItem[] = [
  {
    href: "/user/dashboard",
    labelKey: "nav.citizen.dashboard",
    ocidKey: "my_reports",
    icon: LayoutDashboard,
  },
  {
    href: "/user/new-request",
    labelKey: "nav.citizen.newRequest",
    ocidKey: "new_request",
    icon: FilePlus,
  },
  {
    href: "/user/map",
    labelKey: "nav.citizen.map",
    ocidKey: "map_view",
    icon: MapIcon,
  },
];

const NGO_NAV: NavItem[] = [
  {
    href: "/ngo/dashboard",
    labelKey: "nav.ngo.dashboard",
    ocidKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/ngo/requests",
    labelKey: "nav.ngo.requests",
    ocidKey: "open_requests",
    icon: FilePlus,
  },
  {
    href: "/ngo/inventory",
    labelKey: "nav.ngo.inventory",
    ocidKey: "inventory",
    icon: Package,
  },
  {
    href: "/ngo/map",
    labelKey: "nav.ngo.map",
    ocidKey: "map_view",
    icon: MapIcon,
  },
];

const ADMIN_NAV: NavItem[] = [
  {
    href: "/admin/dashboard",
    labelKey: "nav.admin.dashboard",
    ocidKey: "overview",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    labelKey: "nav.admin.users",
    ocidKey: "users",
    icon: Users,
  },
  {
    href: "/admin/ngos",
    labelKey: "nav.admin.ngos",
    ocidKey: "ngos",
    icon: Shield,
  },
  {
    href: "/admin/requests",
    labelKey: "nav.admin.requests",
    ocidKey: "all_requests",
    icon: FilePlus,
  },
  {
    href: "/admin/analytics",
    labelKey: "nav.admin.analytics",
    ocidKey: "analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/map",
    labelKey: "nav.admin.map",
    ocidKey: "map_view",
    icon: MapIcon,
  },
];

const ROLE_LABEL_KEYS: Record<NonNullable<UserRole>, string> = {
  citizen: "nav.roles.citizen",
  ngo: "nav.roles.ngo",
  admin: "nav.roles.admin",
};

const ROLE_COLORS: Record<NonNullable<UserRole>, string> = {
  citizen: "bg-primary/10 text-primary border-primary/30",
  ngo: "bg-secondary/10 text-secondary border-secondary/30",
  admin: "bg-accent/10 text-accent border-accent/30",
};

function getNavItems(role: UserRole): NavItem[] {
  if (role === "citizen") return CITIZEN_NAV;
  if (role === "ngo") return NGO_NAV;
  if (role === "admin") return ADMIN_NAV;
  return [];
}

function HistoryNav({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go back"
        onClick={() => router.history.back()}
        className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-200"
        data-ocid="nav.back_button"
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go forward"
        onClick={() => router.history.forward()}
        className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-200"
        data-ocid="nav.forward_button"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}

export function Navigation() {
  const { role, logout, userProfile, ngoProfile, adminProfile } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const navItems = getNavItems(role);
  const displayName =
    userProfile?.name ??
    ngoProfile?.orgName ??
    (adminProfile ? t("nav.roles.admin") : undefined) ??
    "User";

  function handleLogout() {
    logout();
    setMobileOpen(false);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-card border-r border-border shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Shield size={14} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${role ? ROLE_COLORS[role] : ""}`}
              >
                {role ? t(ROLE_LABEL_KEYS[role]) : ""}
              </span>
              <span className="text-xs text-muted-foreground truncate min-w-0">
                {displayName}
              </span>
            </div>
            <HistoryNav className="shrink-0" />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            const label = t(item.labelKey);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-smooth ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-ocid={`nav.${item.ocidKey}`}
              >
                <item.icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            data-ocid="nav.logout_button"
          >
            <LogOut size={15} />
            {t("nav.signOut")}
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-card border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Shield size={14} className="text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm truncate">
            {APP_NAME}
          </span>
          {role && (
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 shrink-0 ${ROLE_COLORS[role]}`}
            >
              {t(ROLE_LABEL_KEYS[role])}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <HistoryNav />
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("nav.menuOpen")}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-8 w-8"
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label={t("nav.menuClose")}
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
          <aside className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border flex flex-col shadow-lg">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {role ? t(ROLE_LABEL_KEYS[role]) : ""} {t("nav.account")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile_close_button"
              >
                <X size={18} />
              </Button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = location.pathname === item.href;
                const label = t(item.labelKey);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-smooth ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    data-ocid={`nav.mobile.${item.ocidKey}`}
                  >
                    <item.icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-border space-y-1">
              <div className="flex items-center justify-between px-1">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-muted-foreground"
                data-ocid="nav.mobile_logout_button"
              >
                <LogOut size={15} />
                {t("nav.signOut")}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
