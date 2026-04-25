import { m as useBackend, a as useTranslation, j as jsxRuntimeExports, B as Badge, E as Skeleton, aa as Users, w as Building2, b as Link, d as ArrowRight } from "./index-Cru0WlOf.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-RqapHmT1.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { S as StatusBadge } from "./StatusBadge-Bizm4PBs.js";
import { u as useGeolocation } from "./use-geolocation-ogvJ4kWm.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
import { A as Activity } from "./activity-DHD5Q7f2.js";
import { C as CircleCheck } from "./circle-check-CDfIVQDZ.js";
import { S as ShieldCheck } from "./shield-check-6Gsh4H_I.js";
function StatCard({
  label,
  value,
  icon: Icon,
  colorStyle,
  href,
  index
}) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border hover:shadow-md transition-smooth cursor-pointer",
      "data-ocid": `admin_dashboard.stat_card.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-9 w-9 rounded-lg flex items-center justify-center",
              style: { background: `${colorStyle.replace(")", " / 0.12)")}` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: colorStyle }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) })
            }
          ),
          href && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ArrowRight,
            {
              size: 14,
              className: "text-muted-foreground opacity-60"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
      ] })
    }
  );
  return href ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: href, children: inner }) : inner;
}
function AdminDashboard() {
  const { actor, isFetching } = useBackend();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["admin-analytics-summary"],
    queryFn: () => actor.getAnalyticsSummary(),
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const { data: verification, isLoading: loadingVerification } = useQuery({
    queryKey: ["admin-verification-counts"],
    queryFn: () => actor.getVerificationCounts(),
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const { data: allRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const recentRequests = allRequests ? [...allRequests].sort((a, b) => Number(b.createdAt - a.createdAt)).slice(0, 10) : [];
  const isLoading = loadingAnalytics || loadingVerification;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: t("adminDashboard.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("adminDashboard.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        geoLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs text-muted-foreground animate-pulse",
            "data-ocid": "admin_dashboard.geo_loading_state",
            children: t("app.detectingLocation")
          }
        ),
        !geoLoading && permission === "granted" && lat !== null && lng !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 bg-secondary/15 text-secondary border border-secondary/30 rounded-full px-3 py-1 text-xs font-medium",
            "data-ocid": "admin_dashboard.geo_badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
              " ",
              t("app.locationDetected")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "text-xs gap-1.5",
            "data-ocid": "admin_dashboard.live_badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" }),
              t("adminDashboard.liveRefresh")
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.totalUsers"),
          value: ((analytics == null ? void 0 : analytics.totalUsers) ?? 0n).toString(),
          icon: Users,
          colorStyle: "oklch(0.55 0.22 25)",
          href: "/admin/users",
          index: 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.totalNGOs"),
          value: ((analytics == null ? void 0 : analytics.totalNGOs) ?? 0n).toString(),
          icon: Building2,
          colorStyle: "oklch(0.58 0.17 145)",
          href: "/admin/ngos",
          index: 2
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.openRequests"),
          value: ((analytics == null ? void 0 : analytics.openRequests) ?? 0n).toString(),
          icon: Activity,
          colorStyle: "oklch(0.58 0.24 30)",
          href: "/admin/requests",
          index: 3
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.claimed"),
          value: ((analytics == null ? void 0 : analytics.claimedRequests) ?? 0n).toString(),
          icon: Activity,
          colorStyle: "oklch(0.72 0.18 62)",
          href: "/admin/requests",
          index: 4
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.inTransit"),
          value: ((analytics == null ? void 0 : analytics.inTransitRequests) ?? 0n).toString(),
          icon: Activity,
          colorStyle: "oklch(0.62 0.18 50)",
          href: "/admin/requests",
          index: 5
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: t("adminDashboard.stats.delivered"),
          value: ((analytics == null ? void 0 : analytics.deliveredRequests) ?? 0n).toString(),
          icon: CircleCheck,
          colorStyle: "oklch(0.58 0.17 145)",
          href: "/admin/requests",
          index: 6
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-border",
        "data-ocid": "admin_dashboard.verification_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 15, className: "text-primary" }),
            t("adminDashboard.verification.title")
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingVerification ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
            {
              label: t("adminDashboard.verification.totalUsers"),
              value: (verification == null ? void 0 : verification.totalUsers) ?? 0n
            },
            {
              label: t("adminDashboard.verification.bothDeclared"),
              value: (verification == null ? void 0 : verification.bothDeclared) ?? 0n
            },
            {
              label: t("adminDashboard.verification.aadhaarDeclared"),
              value: (verification == null ? void 0 : verification.aadhaarDeclared) ?? 0n
            },
            {
              label: t("adminDashboard.verification.panDeclared"),
              value: (verification == null ? void 0 : verification.panDeclared) ?? 0n
            }
          ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: value.toString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
          ] }, label)) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin_dashboard.request_feed.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("adminDashboard.recentRequests") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/admin/requests",
            className: "text-xs text-primary hover:underline flex items-center gap-1",
            "data-ocid": "admin_dashboard.view_all_requests.link",
            children: [
              t("adminDashboard.viewAll"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
            ]
          }
        )
      ] }),
      loadingRequests ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, k)) }) : recentRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl",
          "data-ocid": "admin_dashboard.request_feed.empty_state",
          children: t("adminDashboard.noRequests")
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentRequests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2.5",
          "data-ocid": `admin_dashboard.request_feed.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium capitalize truncate", children: [
                req.resourceType,
                " · ",
                t("adminDashboard.qty"),
                " ",
                req.quantity.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: new Date(
                Number(req.createdAt) / 1e6
              ).toLocaleString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" })
          ]
        },
        req.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 md:grid-cols-4 gap-3",
        "data-ocid": "admin_dashboard.quick_nav.section",
        children: [
          {
            label: t("adminDashboard.quickNav.users"),
            href: "/admin/users",
            icon: Users
          },
          {
            label: t("adminDashboard.quickNav.ngos"),
            href: "/admin/ngos",
            icon: Building2
          },
          {
            label: t("adminDashboard.quickNav.requests"),
            href: "/admin/requests",
            icon: Activity
          },
          {
            label: t("adminDashboard.quickNav.analytics"),
            href: "/admin/analytics",
            icon: ShieldCheck
          }
        ].map(({ label, href, icon: Icon }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: href,
            "data-ocid": `admin_dashboard.quick_nav.item.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border hover:shadow-md transition-smooth cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label })
            ] }) })
          },
          label
        ))
      }
    )
  ] });
}
export {
  AdminDashboard as default
};
