import { m as useBackend, a as useTranslation, M as ResourceType, j as jsxRuntimeExports, E as Skeleton, an as ChartColumn, ab as Users, O as RESOURCE_TYPES } from "./index-CiAbU5FG.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BqmZtv4m.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { C as CircleCheck } from "./circle-check-CvLyfbQt.js";
import { T as TrendingUp } from "./trending-up-BHLHvghb.js";
function BarRow({
  label,
  value,
  max,
  icon,
  colorStyle
}) {
  const pct = max > 0 ? Math.round(value / max * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base w-6 shrink-0", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tabular-nums text-muted-foreground", children: value })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${pct}%`, background: colorStyle }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-8 text-right shrink-0", children: [
      pct,
      "%"
    ] })
  ] });
}
function VerifBreakdown({
  both,
  aadhaarOnly,
  panOnly,
  neither,
  total
}) {
  const { t } = useTranslation();
  if (total === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-muted-foreground text-xs", children: "No data" });
  }
  const segments = [
    {
      label: t("adminDashboard.verification.bothDeclared"),
      value: both,
      colorStyle: "oklch(0.68 0.21 151)"
    },
    {
      label: t("adminDashboard.verification.aadhaarDeclared"),
      value: aadhaarOnly,
      colorStyle: "oklch(0.55 0.22 25)"
    },
    {
      label: t("adminDashboard.verification.panDeclared"),
      value: panOnly,
      colorStyle: "oklch(0.62 0.18 50)"
    },
    { label: "Neither", value: neither, colorStyle: "oklch(0.72 0.01 0)" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: segments.map((seg) => {
    const pct = Math.round(seg.value / total * 100);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-2.5 w-2.5 rounded-full shrink-0",
          style: { background: seg.colorStyle }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full rounded-full transition-all duration-700",
          style: { width: `${pct}%`, background: seg.colorStyle }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 w-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground tabular-nums w-8", children: [
          pct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: seg.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs tabular-nums text-muted-foreground w-6 text-right shrink-0", children: seg.value })
    ] }, seg.label);
  }) });
}
function AdminAnalytics() {
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["admin-analytics-summary"],
    queryFn: () => actor.getAnalyticsSummary(),
    enabled: !!actor && !isFetching
  });
  const { data: verification, isLoading: loadingVerification } = useQuery({
    queryKey: ["admin-verification-counts"],
    queryFn: () => actor.getVerificationCounts(),
    enabled: !!actor && !isFetching
  });
  const { data: allRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching
  });
  const totalRequests = Number((analytics == null ? void 0 : analytics.totalRequests) ?? 0n);
  const delivered = Number((analytics == null ? void 0 : analytics.deliveredRequests) ?? 0n);
  const fulfillmentRate = totalRequests > 0 ? Math.round(delivered / totalRequests * 100) : 0;
  const resourceCounts = {
    [ResourceType.food]: 0,
    [ResourceType.water]: 0,
    [ResourceType.medical]: 0,
    [ResourceType.other]: 0
  };
  for (const r of allRequests ?? []) {
    resourceCounts[r.resourceType] = (resourceCounts[r.resourceType] ?? 0) + 1;
  }
  const maxResourceCount = Math.max(...Object.values(resourceCounts), 1);
  let avgPerDay = 0;
  if (allRequests && allRequests.length > 1) {
    const timestamps = allRequests.map((r) => Number(r.createdAt) / 1e6);
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (Math.max(...timestamps) - Math.min(...timestamps)) / 864e5
      )
    );
    avgPerDay = Math.round(allRequests.length / daysDiff * 10) / 10;
  }
  const bothDeclared = Number((verification == null ? void 0 : verification.bothDeclared) ?? 0n);
  const aadhaarDeclared = Number((verification == null ? void 0 : verification.aadhaarDeclared) ?? 0n);
  const panDeclared = Number((verification == null ? void 0 : verification.panDeclared) ?? 0n);
  const totalUsers = Number((verification == null ? void 0 : verification.totalUsers) ?? 0n);
  const aadhaarOnly = Math.max(0, aadhaarDeclared - bothDeclared);
  const panOnly = Math.max(0, panDeclared - bothDeclared);
  const neither = Math.max(
    0,
    totalUsers - aadhaarDeclared - panDeclared + bothDeclared
  );
  const isLoading = loadingAnalytics || loadingRequests || loadingVerification;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_analytics.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: t("adminAnalytics.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("adminAnalytics.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6",
        "data-ocid": "admin_analytics.metrics.section",
        children: isLoading ? ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, k)) : [
          {
            label: t("adminAnalytics.totalRequests"),
            value: totalRequests.toString(),
            icon: ChartColumn,
            colorStyle: "oklch(0.58 0.24 30)"
          },
          {
            label: t("adminAnalytics.deliveryRate"),
            value: `${fulfillmentRate}%`,
            icon: CircleCheck,
            colorStyle: "oklch(0.68 0.21 151)"
          },
          {
            label: t("adminAnalytics.avgResponseTime"),
            value: avgPerDay.toString(),
            icon: TrendingUp,
            colorStyle: "oklch(0.72 0.19 62)"
          },
          {
            label: t("adminDashboard.stats.totalUsers"),
            value: ((analytics == null ? void 0 : analytics.totalUsers) ?? 0n).toString(),
            icon: Users,
            colorStyle: "oklch(0.55 0.22 25)"
          }
        ].map(({ label, value, icon: Icon, colorStyle }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border-border",
            "data-ocid": `admin_analytics.metrics.item.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 lg:py-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-8 w-8 rounded-lg flex items-center justify-center mb-3",
                  style: { background: colorStyle.replace(")", " / 0.12)") },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, style: { color: colorStyle } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
            ] })
          },
          label
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6 lg:gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border",
          "data-ocid": "admin_analytics.resource_distribution.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 14, className: "text-primary" }),
              t("adminAnalytics.requestsByType")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingRequests ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 lg:min-h-48", children: RESOURCE_TYPES.map((rt, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              BarRow,
              {
                label: t(rt.labelKey),
                value: resourceCounts[rt.value] ?? 0,
                max: maxResourceCount,
                icon: rt.icon,
                colorStyle: [
                  "oklch(0.55 0.22 25)",
                  "oklch(0.60 0.20 35)",
                  "oklch(0.58 0.17 145)",
                  "oklch(0.72 0.01 0)"
                ][i]
              },
              rt.value
            )) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border",
          "data-ocid": "admin_analytics.status_breakdown.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "text-secondary" }),
              t("adminAnalytics.requestsByStatus")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingAnalytics ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 lg:min-h-48", children: [
              {
                label: t("status.open"),
                value: Number((analytics == null ? void 0 : analytics.openRequests) ?? 0n),
                colorStyle: "oklch(0.58 0.24 30)"
              },
              {
                label: t("status.claimed"),
                value: Number((analytics == null ? void 0 : analytics.claimedRequests) ?? 0n),
                colorStyle: "oklch(0.72 0.19 62)"
              },
              {
                label: t("status.inTransit"),
                value: Number((analytics == null ? void 0 : analytics.inTransitRequests) ?? 0n),
                colorStyle: "oklch(0.62 0.18 50)"
              },
              {
                label: t("status.delivered"),
                value: Number((analytics == null ? void 0 : analytics.deliveredRequests) ?? 0n),
                colorStyle: "oklch(0.58 0.17 145)"
              }
            ].map((row) => {
              const pct = totalRequests > 0 ? Math.round(row.value / totalRequests * 100) : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium w-16 shrink-0 text-foreground", children: row.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-700",
                    style: {
                      width: `${pct}%`,
                      background: row.colorStyle
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground w-16 text-right shrink-0", children: [
                  row.value,
                  " (",
                  pct,
                  "%)"
                ] })
              ] }, row.label);
            }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border-border md:col-span-2",
          "data-ocid": "admin_analytics.verification_pie.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "text-primary" }),
              t("adminDashboard.verification.title")
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingVerification ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:max-w-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VerifBreakdown,
                {
                  both: bothDeclared,
                  aadhaarOnly,
                  panOnly,
                  neither,
                  total: totalUsers
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-4", children: [
                "Based on ",
                totalUsers,
                " registered users"
              ] })
            ] }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  AdminAnalytics as default
};
