import { y as createLucideIcon, m as useBackend, D as useAuth, J as useQueryClient, a as useTranslation, r as reactExports, N as UrgencyLevel, j as jsxRuntimeExports, o as Button, q as CircleAlert, B as Badge, E as Skeleton, R as RequestStatus } from "./index-Cru0WlOf.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { u as useMutation } from "./useMutation-BseX92Wl.js";
import { u as ue } from "./index-CoiouH4F.js";
import { R as RefreshCw, M as MapView } from "./MapView-Bcbg0Bzn.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { S as StatusBadge } from "./StatusBadge-Bizm4PBs.js";
import { U as UrgencyBadge } from "./UrgencyBadge-DEimiDsW.js";
import { u as useGeolocation } from "./use-geolocation-ogvJ4kWm.js";
import { F as Funnel } from "./funnel-BZEjQXfc.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode);
const URGENCY_ORDER = {
  [UrgencyLevel.high]: 0,
  [UrgencyLevel.medium]: 1,
  [UrgencyLevel.low]: 2
};
function NGOMapPage() {
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [urgencyFilter, setUrgencyFilter] = reactExports.useState(
    "all"
  );
  const {
    data: requests,
    isLoading: loadingReq,
    refetch,
    dataUpdatedAt
  } = useQuery({
    queryKey: ["open-requests-ngo-map"],
    queryFn: async () => actor ? actor.getOpenRequests() : [],
    enabled: !!actor && !isFetching,
    refetchInterval: 6e4
  });
  const { data: allNGOs, isLoading: loadingNGO } = useQuery({
    queryKey: ["all-ngos-ngo-map"],
    queryFn: async () => actor ? actor.getAllNGOs() : [],
    enabled: !!actor && !isFetching,
    refetchInterval: 6e4
  });
  const claimMutation = useMutation({
    mutationFn: (id) => actor.claimRequest(id),
    onSuccess: () => {
      ue.success(t("ngoRequests.claimSuccess"));
      queryClient.invalidateQueries({ queryKey: ["open-requests-ngo-map"] });
      queryClient.invalidateQueries({ queryKey: ["open-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-claimed"] });
    },
    onError: () => ue.error(t("ngoRequests.errorClaim"))
  });
  const geo = useGeolocation();
  const center = reactExports.useMemo(
    () => ({
      lat: !geo.loading && geo.lat !== null ? geo.lat : (ngoProfile == null ? void 0 : ngoProfile.location.lat) ?? 20.5937,
      lng: !geo.loading && geo.lng !== null ? geo.lng : (ngoProfile == null ? void 0 : ngoProfile.location.lng) ?? 78.9629
    }),
    [
      geo.loading,
      geo.lat,
      geo.lng,
      ngoProfile == null ? void 0 : ngoProfile.location.lat,
      ngoProfile == null ? void 0 : ngoProfile.location.lng
    ]
  );
  const filteredRequests = reactExports.useMemo(
    () => (requests ?? []).filter((r) => urgencyFilter === "all" || r.urgency === urgencyFilter).sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]),
    [requests, urgencyFilter]
  );
  const requestPins = reactExports.useMemo(
    () => filteredRequests.map((r) => ({
      request: r,
      colorMode: "urgency"
    })),
    [filteredRequests]
  );
  const ngoPins = reactExports.useMemo(
    () => (allNGOs ?? []).map((ngo) => ({ ngo, showRadius: true })),
    [allNGOs]
  );
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }) : null;
  const urgencyCounts = reactExports.useMemo(() => {
    const all = requests ?? [];
    return {
      high: all.filter((r) => r.urgency === UrgencyLevel.high).length,
      medium: all.filter((r) => r.urgency === UrgencyLevel.medium).length,
      low: all.filter((r) => r.urgency === UrgencyLevel.low).length
    };
  }, [requests]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-2xl mx-auto", "data-ocid": "ngo_map.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: t("shared.map") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("nav.ngo.map") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground hidden sm:inline", children: [
          "Updated ",
          lastUpdated
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "h-8 gap-1.5 text-xs",
            onClick: () => refetch(),
            "data-ocid": "ngo_map.refresh_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 }),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
      {
        level: UrgencyLevel.high,
        label: t("urgency.high"),
        count: urgencyCounts.high,
        color: "oklch(0.58 0.24 30)"
      },
      {
        level: UrgencyLevel.medium,
        label: t("urgency.medium"),
        count: urgencyCounts.medium,
        color: "oklch(0.72 0.19 62)"
      },
      {
        level: UrgencyLevel.low,
        label: t("urgency.low"),
        count: urgencyCounts.low,
        color: "oklch(0.68 0.21 151)"
      }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: `rounded-lg border px-3 py-2.5 text-center transition-smooth cursor-pointer ${urgencyFilter === item.level ? "border-border bg-card shadow-sm" : "border-transparent bg-muted/40 hover:bg-muted/70"}`,
        onClick: () => setUrgencyFilter((f) => f === item.level ? "all" : item.level),
        "data-ocid": `ngo_map.filter.${item.level}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2 h-2 rounded-full shrink-0",
                style: { background: item.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: item.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-display", children: item.count })
        ]
      },
      item.level
    )) }),
    !geo.lat && !geo.lng && !(ngoProfile == null ? void 0 : ngoProfile.location) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center gap-3 p-8 text-center",
        "data-ocid": "ngo_map.no_location_state",
        style: { height: 380 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 28, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: t("shared.locationPermission.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t("shared.locationPermission.desc") })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapView,
      {
        center,
        zoom: 12,
        requestPins,
        ngoPins,
        viewerRole: "ngo",
        onClaimRequest: (req) => claimMutation.mutate(req.id),
        claimingId: claimMutation.isPending ? claimMutation.variables : null,
        height: "420px",
        showLegend: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          t("adminRequests.filterAll"),
          ":"
        ] })
      ] }),
      [
        "all",
        UrgencyLevel.high,
        UrgencyLevel.medium,
        UrgencyLevel.low
      ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `text-xs px-3 py-1 rounded-full border transition-smooth capitalize ${urgencyFilter === f ? "bg-foreground text-background border-foreground" : "bg-muted/50 border-border text-foreground hover:bg-muted"}`,
          onClick: () => setUrgencyFilter(f),
          "data-ocid": `ngo_map.urgency_filter.${f}`,
          children: f === "all" ? t("adminRequests.filterAll") : t(`urgency.${f}`)
        },
        f
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "ml-auto text-xs", children: [
        filteredRequests.length,
        " shown"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("ngoRequests.tabOpen") }),
      loadingReq || loadingNGO ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) }) : filteredRequests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filteredRequests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border",
          "data-ocid": `ngo_map.request.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium capitalize", children: [
                  req.resourceType,
                  " Aid"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(UrgencyBadge, { urgency: req.urgency, size: "sm" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  req.userLocation.lat.toFixed(3),
                  ",",
                  " ",
                  req.userLocation.lng.toFixed(3)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "· Qty ",
                  req.quantity.toString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" }),
              req.status === RequestStatus.open && ngoProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "h-7 gap-1 text-xs",
                  disabled: claimMutation.isPending,
                  onClick: () => claimMutation.mutate(req.id),
                  "data-ocid": `ngo_map.claim_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 11 }),
                    t("ngoRequests.claim")
                  ]
                }
              )
            ] })
          ]
        },
        req.id.toString()
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 rounded-xl bg-muted/30 border border-border",
          "data-ocid": "ngo_map.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 24, className: "mx-auto text-muted-foreground mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: urgencyFilter !== "all" ? `No ${t(`urgency.${urgencyFilter}`)} urgency requests` : t("ngoRequests.noOpen") })
          ]
        }
      )
    ] })
  ] });
}
export {
  NGOMapPage as default
};
