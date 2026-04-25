import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RESOURCE_TYPES } from "../../constants";
import { useBackend } from "../../hooks/use-backend";
import type {
  AnalyticsSummary,
  ReliefRequest,
  VerificationCounts,
} from "../../types";
import { ResourceType } from "../../types";

function BarRow({
  label,
  value,
  max,
  icon,
  colorStyle,
}: {
  label: string;
  value: number;
  max: number;
  icon: string;
  colorStyle: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {value}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: colorStyle }}
          />
        </div>
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}

function VerifBreakdown({
  both,
  aadhaarOnly,
  panOnly,
  neither,
  total,
}: {
  both: number;
  aadhaarOnly: number;
  panOnly: number;
  neither: number;
  total: number;
}) {
  const { t } = useTranslation();
  if (total === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground text-xs">
        No data
      </div>
    );
  }
  const segments = [
    {
      label: t("adminDashboard.verification.bothDeclared"),
      value: both,
      colorStyle: "oklch(0.68 0.21 151)",
    },
    {
      label: t("adminDashboard.verification.aadhaarDeclared"),
      value: aadhaarOnly,
      colorStyle: "oklch(0.55 0.22 25)",
    },
    {
      label: t("adminDashboard.verification.panDeclared"),
      value: panOnly,
      colorStyle: "oklch(0.62 0.18 50)",
    },
    { label: "Neither", value: neither, colorStyle: "oklch(0.72 0.01 0)" },
  ];
  return (
    <div className="space-y-3">
      {segments.map((seg) => {
        const pct = Math.round((seg.value / total) * 100);
        return (
          <div key={seg.label} className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: seg.colorStyle }}
            />
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: seg.colorStyle }}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0 w-32">
              <span className="text-xs font-bold text-foreground tabular-nums w-8">
                {pct}%
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {seg.label}
              </span>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground w-6 text-right shrink-0">
              {seg.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalytics() {
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();

  const { data: analytics, isLoading: loadingAnalytics } =
    useQuery<AnalyticsSummary>({
      queryKey: ["admin-analytics-summary"],
      queryFn: () => actor!.getAnalyticsSummary(),
      enabled: !!actor && !isFetching,
    });

  const { data: verification, isLoading: loadingVerification } =
    useQuery<VerificationCounts>({
      queryKey: ["admin-verification-counts"],
      queryFn: () => actor!.getVerificationCounts(),
      enabled: !!actor && !isFetching,
    });

  const { data: allRequests, isLoading: loadingRequests } = useQuery<
    ReliefRequest[]
  >({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor!.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching,
  });

  const totalRequests = Number(analytics?.totalRequests ?? 0n);
  const delivered = Number(analytics?.deliveredRequests ?? 0n);
  const fulfillmentRate =
    totalRequests > 0 ? Math.round((delivered / totalRequests) * 100) : 0;

  const resourceCounts: Record<ResourceType, number> = {
    [ResourceType.food]: 0,
    [ResourceType.water]: 0,
    [ResourceType.medical]: 0,
    [ResourceType.other]: 0,
  };
  for (const r of allRequests ?? []) {
    resourceCounts[r.resourceType] = (resourceCounts[r.resourceType] ?? 0) + 1;
  }
  const maxResourceCount = Math.max(...Object.values(resourceCounts), 1);

  let avgPerDay = 0;
  if (allRequests && allRequests.length > 1) {
    const timestamps = allRequests.map((r) => Number(r.createdAt) / 1_000_000);
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (Math.max(...timestamps) - Math.min(...timestamps)) / 86_400_000,
      ),
    );
    avgPerDay = Math.round((allRequests.length / daysDiff) * 10) / 10;
  }

  const bothDeclared = Number(verification?.bothDeclared ?? 0n);
  const aadhaarDeclared = Number(verification?.aadhaarDeclared ?? 0n);
  const panDeclared = Number(verification?.panDeclared ?? 0n);
  const totalUsers = Number(verification?.totalUsers ?? 0n);
  const aadhaarOnly = Math.max(0, aadhaarDeclared - bothDeclared);
  const panOnly = Math.max(0, panDeclared - bothDeclared);
  const neither = Math.max(
    0,
    totalUsers - aadhaarDeclared - panDeclared + bothDeclared,
  );

  const isLoading = loadingAnalytics || loadingRequests || loadingVerification;

  return (
    <div className="space-y-6" data-ocid="admin_analytics.page">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("adminAnalytics.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("adminAnalytics.subtitle")}
        </p>
      </div>

      {/* Top-line metrics */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-ocid="admin_analytics.metrics.section"
      >
        {isLoading
          ? ["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-24 rounded-xl" />
            ))
          : [
              {
                label: t("adminAnalytics.totalRequests"),
                value: totalRequests.toString(),
                icon: BarChart3,
                colorStyle: "oklch(0.58 0.24 30)",
              },
              {
                label: t("adminAnalytics.deliveryRate"),
                value: `${fulfillmentRate}%`,
                icon: CheckCircle2,
                colorStyle: "oklch(0.68 0.21 151)",
              },
              {
                label: t("adminAnalytics.avgResponseTime"),
                value: avgPerDay.toString(),
                icon: TrendingUp,
                colorStyle: "oklch(0.72 0.19 62)",
              },
              {
                label: t("adminDashboard.stats.totalUsers"),
                value: (analytics?.totalUsers ?? 0n).toString(),
                icon: Users,
                colorStyle: "oklch(0.55 0.22 25)",
              },
            ].map(({ label, value, icon: Icon, colorStyle }, i) => (
              <Card
                key={label}
                className="border-border"
                data-ocid={`admin_analytics.metrics.item.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: colorStyle.replace(")", " / 0.12)") }}
                  >
                    <Icon size={16} style={{ color: colorStyle }} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Resource Distribution */}
        <Card
          className="border-border"
          data-ocid="admin_analytics.resource_distribution.section"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 size={14} className="text-primary" />
              {t("adminAnalytics.requestsByType")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRequests ? (
              <div className="space-y-3">
                {["a", "b", "c", "d"].map((k) => (
                  <Skeleton key={k} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {RESOURCE_TYPES.map((rt, i) => (
                  <BarRow
                    key={rt.value}
                    label={t(rt.labelKey)}
                    value={resourceCounts[rt.value] ?? 0}
                    max={maxResourceCount}
                    icon={rt.icon}
                    colorStyle={
                      [
                        "oklch(0.55 0.22 25)",
                        "oklch(0.60 0.20 35)",
                        "oklch(0.58 0.17 145)",
                        "oklch(0.72 0.01 0)",
                      ][i]
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Status Breakdown */}
        <Card
          className="border-border"
          data-ocid="admin_analytics.status_breakdown.section"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} className="text-secondary" />
              {t("adminAnalytics.requestsByStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <div className="space-y-3">
                {["a", "b", "c", "d"].map((k) => (
                  <Skeleton key={k} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    label: t("status.open"),
                    value: Number(analytics?.openRequests ?? 0n),
                    colorStyle: "oklch(0.58 0.24 30)",
                  },
                  {
                    label: t("status.claimed"),
                    value: Number(analytics?.claimedRequests ?? 0n),
                    colorStyle: "oklch(0.72 0.19 62)",
                  },
                  {
                    label: t("status.inTransit"),
                    value: Number(analytics?.inTransitRequests ?? 0n),
                    colorStyle: "oklch(0.62 0.18 50)",
                  },
                  {
                    label: t("status.delivered"),
                    value: Number(analytics?.deliveredRequests ?? 0n),
                    colorStyle: "oklch(0.58 0.17 145)",
                  },
                ].map((row) => {
                  const pct =
                    totalRequests > 0
                      ? Math.round((row.value / totalRequests) * 100)
                      : 0;
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="text-xs font-medium w-16 shrink-0 text-foreground">
                        {row.label}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: row.colorStyle,
                          }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground w-16 text-right shrink-0">
                        {row.value} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Identity Verification Breakdown */}
        <Card
          className="border-border md:col-span-2"
          data-ocid="admin_analytics.verification_pie.section"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users size={14} className="text-primary" />
              {t("adminDashboard.verification.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingVerification ? (
              <div className="space-y-3">
                {["a", "b", "c", "d"].map((k) => (
                  <Skeleton key={k} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="max-w-lg">
                <VerifBreakdown
                  both={bothDeclared}
                  aadhaarOnly={aadhaarOnly}
                  panOnly={panOnly}
                  neither={neither}
                  total={totalUsers}
                />
                <p className="text-xs text-muted-foreground mt-4">
                  Based on {totalUsers} registered users
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
