import { y as createLucideIcon, m as useBackend, D as useAuth, a as useTranslation, r as reactExports, R as RequestStatus, j as jsxRuntimeExports, o as Button, q as CircleAlert, b as Link, E as Skeleton } from "./index-Cru0WlOf.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { R as RefreshCw, M as MapView } from "./MapView-Bcbg0Bzn.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { S as StatusBadge } from "./StatusBadge-Bizm4PBs.js";
import { u as useGeolocation } from "./use-geolocation-ogvJ4kWm.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode);
const STATUS_PIN_CLASS = {
  [RequestStatus.open]: "bg-accent",
  [RequestStatus.claimed]: "bg-chart-2",
  [RequestStatus.inTransit]: "bg-chart-2",
  [RequestStatus.delivered]: "bg-secondary"
};
function UserMapPage() {
  var _a;
  const { actor, isFetching } = useBackend();
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const {
    data: requests,
    isLoading: loadingReq,
    refetch,
    dataUpdatedAt
  } = useQuery({
    queryKey: ["user-requests-map", (_a = userProfile == null ? void 0 : userProfile.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getRequestsByUser(userProfile.id);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 6e4
  });
  const { data: nearbyNGOs, isLoading: loadingNGO } = useQuery({
    queryKey: [
      "nearby-ngos-map",
      userProfile == null ? void 0 : userProfile.location.lat,
      userProfile == null ? void 0 : userProfile.location.lng
    ],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getNearbyNGOs(userProfile.location, 50);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 6e4
  });
  const geo = useGeolocation();
  const center = reactExports.useMemo(
    () => ({
      lat: !geo.loading && geo.lat !== null ? geo.lat : (userProfile == null ? void 0 : userProfile.location.lat) ?? 20.5937,
      lng: !geo.loading && geo.lng !== null ? geo.lng : (userProfile == null ? void 0 : userProfile.location.lng) ?? 78.9629
    }),
    [
      geo.loading,
      geo.lat,
      geo.lng,
      userProfile == null ? void 0 : userProfile.location.lat,
      userProfile == null ? void 0 : userProfile.location.lng
    ]
  );
  const requestPins = reactExports.useMemo(
    () => (requests ?? []).map((r) => ({
      request: r,
      colorMode: "status"
    })),
    [requests]
  );
  const ngoPins = reactExports.useMemo(
    () => (nearbyNGOs ?? []).map((ngo) => ({
      ngo,
      showRadius: false
    })),
    [nearbyNGOs]
  );
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  }) : null;
  const activeRequests = (requests == null ? void 0 : requests.filter((r) => r.status !== RequestStatus.delivered)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-lg mx-auto", "data-ocid": "user_map.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: t("shared.map") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("nav.citizen.map") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
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
            "data-ocid": "user_map.refresh_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 }),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    !geo.lat && !geo.lng && !(userProfile == null ? void 0 : userProfile.location) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center gap-3 p-8 text-center",
        "data-ocid": "user_map.no_location_state",
        style: { height: 300 },
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
        zoom: 13,
        requestPins,
        ngoPins,
        viewerRole: "user",
        height: "380px",
        showLegend: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
      {
        label: t("adminDashboard.stats.openRequests"),
        count: activeRequests.length,
        dot: "bg-accent"
      },
      {
        label: t("adminNGOs.title"),
        count: (nearbyNGOs == null ? void 0 : nearbyNGOs.length) ?? 0,
        dot: "bg-primary"
      },
      {
        label: t("userDashboard.stats.delivered"),
        count: (requests == null ? void 0 : requests.filter((r) => r.status === RequestStatus.delivered).length) ?? 0,
        dot: "bg-secondary"
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg bg-card border border-border px-3 py-2.5 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5 mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${stat.dot}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: stat.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-display", children: stat.count })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("userDashboard.allRequests") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 gap-1 text-xs text-primary",
            "data-ocid": "user_map.new_request_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 12 }),
              t("userDashboard.newRequest")
            ]
          }
        ) })
      ] }),
      loadingReq || loadingNGO ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, i)) }) : requests && requests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: requests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border",
          "data-ocid": `user_map.request.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${STATUS_PIN_CLASS[req.status]}/10`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium capitalize", children: [
                req.resourceType,
                " Aid"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  req.userLocation.lat.toFixed(3),
                  ",",
                  " ",
                  req.userLocation.lng.toFixed(3)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" })
          ]
        },
        req.id.toString()
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 rounded-xl bg-muted/30 border border-border",
          "data-ocid": "user_map.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 24, className: "mx-auto text-muted-foreground mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("userDashboard.noRequests") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "mt-3 gap-1.5 text-xs",
                "data-ocid": "user_map.create_first_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 12 }),
                  t("userDashboard.submitFirst")
                ]
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
export {
  UserMapPage as default
};
