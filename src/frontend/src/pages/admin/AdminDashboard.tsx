import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type {
  AnalyticsSummary,
  ReliefRequest,
  VerificationCounts,
} from "../../types";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorStyle: string;
  href?: string;
  index: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorStyle,
  href,
  index,
}: StatCardProps) {
  const inner = (
    <Card
      className="border-border hover:shadow-md transition-smooth cursor-pointer"
      data-ocid={`admin_dashboard.stat_card.item.${index}`}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center"
            style={{ background: `${colorStyle.replace(")", " / 0.12)")}` }}
          >
            <span style={{ color: colorStyle }}>
              <Icon size={18} />
            </span>
          </div>
          {href && (
            <ArrowRight
              size={14}
              className="text-muted-foreground opacity-60"
            />
          )}
        </div>
        <p className="text-2xl font-bold font-display text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
  return href ? <Link to={href}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const { actor, isFetching } = useBackend();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();

  const { data: analytics, isLoading: loadingAnalytics } =
    useQuery<AnalyticsSummary>({
      queryKey: ["admin-analytics-summary"],
      queryFn: () => actor!.getAnalyticsSummary(),
      enabled: !!actor && !isFetching,
      refetchInterval: 30_000,
    });

  const { data: verification, isLoading: loadingVerification } =
    useQuery<VerificationCounts>({
      queryKey: ["admin-verification-counts"],
      queryFn: () => actor!.getVerificationCounts(),
      enabled: !!actor && !isFetching,
      refetchInterval: 30_000,
    });

  const { data: allRequests, isLoading: loadingRequests } = useQuery<
    ReliefRequest[]
  >({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor!.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const recentRequests = allRequests
    ? [...allRequests]
        .sort((a, b) => Number(b.createdAt - a.createdAt))
        .slice(0, 10)
    : [];

  const isLoading = loadingAnalytics || loadingVerification;

  return (
    <div className="space-y-6" data-ocid="admin_dashboard.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">
            {t("adminDashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("adminDashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {geoLoading && (
            <span
              className="text-xs text-muted-foreground animate-pulse"
              data-ocid="admin_dashboard.geo_loading_state"
            >
              {t("app.detectingLocation")}
            </span>
          )}
          {!geoLoading &&
            permission === "granted" &&
            lat !== null &&
            lng !== null && (
              <span
                className="flex items-center gap-1.5 bg-secondary/15 text-secondary border border-secondary/30 rounded-full px-3 py-1 text-xs font-medium"
                data-ocid="admin_dashboard.geo_badge"
              >
                <MapPin size={11} /> {t("app.locationDetected")}
              </span>
            )}
          <Badge
            variant="outline"
            className="text-xs gap-1.5"
            data-ocid="admin_dashboard.live_badge"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            {t("adminDashboard.liveRefresh")}
          </Badge>
        </div>
      </div>

      {/* Key Metrics — all 6 in one row on desktop */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <Skeleton key={k} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label={t("adminDashboard.stats.totalUsers")}
            value={(analytics?.totalUsers ?? 0n).toString()}
            icon={Users}
            colorStyle="oklch(0.55 0.22 25)"
            href="/admin/users"
            index={1}
          />
          <StatCard
            label={t("adminDashboard.stats.totalNGOs")}
            value={(analytics?.totalNGOs ?? 0n).toString()}
            icon={Building2}
            colorStyle="oklch(0.58 0.17 145)"
            href="/admin/ngos"
            index={2}
          />
          <StatCard
            label={t("adminDashboard.stats.openRequests")}
            value={(analytics?.openRequests ?? 0n).toString()}
            icon={Activity}
            colorStyle="oklch(0.58 0.24 30)"
            href="/admin/requests"
            index={3}
          />
          <StatCard
            label={t("adminDashboard.stats.claimed")}
            value={(analytics?.claimedRequests ?? 0n).toString()}
            icon={Activity}
            colorStyle="oklch(0.72 0.18 62)"
            href="/admin/requests"
            index={4}
          />
          <StatCard
            label={t("adminDashboard.stats.inTransit")}
            value={(analytics?.inTransitRequests ?? 0n).toString()}
            icon={Activity}
            colorStyle="oklch(0.62 0.18 50)"
            href="/admin/requests"
            index={5}
          />
          <StatCard
            label={t("adminDashboard.stats.delivered")}
            value={(analytics?.deliveredRequests ?? 0n).toString()}
            icon={CheckCircle2}
            colorStyle="oklch(0.58 0.17 145)"
            href="/admin/requests"
            index={6}
          />
        </div>
      )}

      {/* Verification Summary Strip */}
      <Card
        className="border-border"
        data-ocid="admin_dashboard.verification_panel"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck size={15} className="text-primary" />
            {t("adminDashboard.verification.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingVerification ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[
                {
                  label: t("adminDashboard.verification.totalUsers"),
                  value: verification?.totalUsers ?? 0n,
                },
                {
                  label: t("adminDashboard.verification.bothDeclared"),
                  value: verification?.bothDeclared ?? 0n,
                },
                {
                  label: t("adminDashboard.verification.aadhaarDeclared"),
                  value: verification?.aadhaarDeclared ?? 0n,
                },
                {
                  label: t("adminDashboard.verification.panDeclared"),
                  value: verification?.panDeclared ?? 0n,
                },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-foreground">
                    {value.toString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Request Feed + Quick Stats — two-column on desktop */}
      <div
        className="flex flex-col lg:flex-row gap-6"
        data-ocid="admin_dashboard.main_content.section"
      >
        {/* Left: Recent Requests — wider on desktop */}
        <div
          className="flex-1 min-w-0"
          data-ocid="admin_dashboard.request_feed.section"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">
              {t("adminDashboard.recentRequests")}
            </h2>
            <Link
              to="/admin/requests"
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="admin_dashboard.view_all_requests.link"
            >
              {t("adminDashboard.viewAll")} <ArrowRight size={12} />
            </Link>
          </div>

          {loadingRequests ? (
            <div className="space-y-2">
              {["a", "b", "c", "d", "e"].map((k) => (
                <Skeleton key={k} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : recentRequests.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl"
              data-ocid="admin_dashboard.request_feed.empty_state"
            >
              {t("adminDashboard.noRequests")}
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Desktop table header */}
              <div className="hidden lg:grid lg:grid-cols-[2rem_1fr_6rem_5rem_8rem] gap-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                <span />
                <span>{t("adminRequests.resource")}</span>
                <span className="text-right">Qty</span>
                <span className="text-center">{t("adminRequests.status")}</span>
                <span className="text-right">{t("adminRequests.created")}</span>
              </div>
              {recentRequests.map((req, i) => (
                <div
                  key={req.id.toString()}
                  className="flex items-center gap-3 lg:grid lg:grid-cols-[2rem_1fr_6rem_5rem_8rem] bg-card border border-border rounded-lg px-4 py-2.5 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin_dashboard.request_feed.item.${i + 1}`}
                >
                  <div className="h-7 w-7 lg:h-6 lg:w-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <ResourceIcon type={req.resourceType} size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium capitalize truncate">
                      {req.resourceType}
                      <span className="lg:hidden">
                        {" "}
                        · {t("adminDashboard.qty")} {req.quantity.toString()}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate lg:hidden">
                      {new Date(
                        Number(req.createdAt) / 1_000_000,
                      ).toLocaleString()}
                    </p>
                  </div>
                  <p className="hidden lg:block text-xs tabular-nums text-muted-foreground text-right">
                    {req.quantity.toString()}
                  </p>
                  <div className="hidden lg:flex justify-center">
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <p className="hidden lg:block text-[10px] text-muted-foreground text-right">
                    {new Date(
                      Number(req.createdAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                  <div className="lg:hidden ml-auto">
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar: Quick Stats + Quick Nav — desktop only */}
        <div className="lg:w-72 xl:w-80 space-y-4 shrink-0">
          {/* NGO / Summary card */}
          <Card
            className="border-border"
            data-ocid="admin_dashboard.ngo_summary.section"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 size={14} className="text-primary" />
                {t("adminDashboard.stats.totalNGOs")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      {t("adminDashboard.stats.totalNGOs")}
                    </span>
                    <span className="text-sm font-bold">
                      {(analytics?.totalNGOs ?? 0n).toString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      {t("adminDashboard.stats.totalUsers")}
                    </span>
                    <span className="text-sm font-bold">
                      {(analytics?.totalUsers ?? 0n).toString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      {t("adminDashboard.stats.delivered")}
                    </span>
                    <span className="text-sm font-bold text-secondary">
                      {(analytics?.deliveredRequests ?? 0n).toString()}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Nav */}
          <div data-ocid="admin_dashboard.quick_nav.section">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: t("adminDashboard.quickNav.users"),
                  href: "/admin/users" as const,
                  icon: Users,
                },
                {
                  label: t("adminDashboard.quickNav.ngos"),
                  href: "/admin/ngos" as const,
                  icon: Building2,
                },
                {
                  label: t("adminDashboard.quickNav.requests"),
                  href: "/admin/requests" as const,
                  icon: Activity,
                },
                {
                  label: t("adminDashboard.quickNav.analytics"),
                  href: "/admin/analytics" as const,
                  icon: ShieldCheck,
                },
              ].map(({ label, href, icon: Icon }, i) => (
                <Link
                  key={label}
                  to={href}
                  data-ocid={`admin_dashboard.quick_nav.item.${i + 1}`}
                >
                  <Card className="border-border hover:shadow-md transition-smooth cursor-pointer">
                    <CardContent className="p-3 flex items-center gap-2">
                      <Icon size={14} className="text-primary shrink-0" />
                      <span className="text-xs font-medium truncate">
                        {label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Nav — mobile only (hidden on lg+) */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:hidden"
        data-ocid="admin_dashboard.quick_nav_mobile.section"
      >
        {[
          {
            label: t("adminDashboard.quickNav.users"),
            href: "/admin/users" as const,
            icon: Users,
          },
          {
            label: t("adminDashboard.quickNav.ngos"),
            href: "/admin/ngos" as const,
            icon: Building2,
          },
          {
            label: t("adminDashboard.quickNav.requests"),
            href: "/admin/requests" as const,
            icon: Activity,
          },
          {
            label: t("adminDashboard.quickNav.analytics"),
            href: "/admin/analytics" as const,
            icon: ShieldCheck,
          },
        ].map(({ label, href, icon: Icon }, i) => (
          <Link
            key={label}
            to={href}
            data-ocid={`admin_dashboard.quick_nav_mobile.item.${i + 1}`}
          >
            <Card className="border-border hover:shadow-md transition-smooth cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon size={16} className="text-primary shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
