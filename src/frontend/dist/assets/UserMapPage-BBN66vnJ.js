import { y as createLucideIcon, m as useBackend, D as useAuth, a as useTranslation, r as reactExports, R as RequestStatus, j as jsxRuntimeExports, o as Button, b as Link, q as CircleAlert, E as Skeleton } from "./index-CiAbU5FG.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { R as RefreshCw, M as MapView } from "./MapView-BW-LRxzF.js";
import { R as ResourceIcon } from "./ResourceIcon-Deu_qixK.js";
import { S as StatusBadge } from "./StatusBadge-DR__gOmG.js";
import { u as useGeolocation } from "./use-geolocation-ByrQj-A_.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
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
  const statChips = [
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
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto",
      "data-ocid": "user_map.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl lg:text-2xl font-display font-bold", children: t("shared.map") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("nav.citizen.map") })
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
                "data-ocid": "user_map.refresh_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 }),
                  "Refresh"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-8 gap-1.5 text-xs",
                "data-ocid": "user_map.header_new_request_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 12 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("userDashboard.newRequest") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
                ]
              }
            ) })
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
        ) : (
          /* Desktop: Map + Legend/List side by side */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MapView,
                {
                  center,
                  zoom: 13,
                  requestPins,
                  ngoPins,
                  viewerRole: "user",
                  height: "380px",
                  showLegend: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mt-3 lg:hidden", children: statChips.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:flex-col lg:w-72 xl:w-80 shrink-0 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: statChips.map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg bg-card border border-border px-2 py-2.5 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mb-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${stat.dot}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground leading-tight", children: stat.label })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold font-display", children: stat.count })
                  ]
                },
                stat.label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl bg-card border border-border p-3",
                  "data-ocid": "user_map.legend_panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Legend" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [
                      { color: "bg-accent", label: "Open Request" },
                      { color: "bg-chart-2", label: "In Progress" },
                      { color: "bg-secondary", label: "Delivered" },
                      { color: "bg-primary", label: "NGO Location" }
                    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-center gap-2 text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `w-2.5 h-2.5 rounded-full ${item.color} shrink-0`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: item.label })
                        ]
                      },
                      item.label
                    )) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: t("userDashboard.allRequests") }) }),
                loadingReq || loadingNGO ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, i)) }) : requests && requests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "user_map.request.list", children: requests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                    className: "text-center py-8 rounded-xl bg-muted/30 border border-border",
                    "data-ocid": "user_map.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MapPin,
                        {
                          size: 24,
                          className: "mx-auto text-muted-foreground mb-2"
                        }
                      ),
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
            ] })
          ] })
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-5 lg:hidden", children: [
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
              "data-ocid": "user_map.mobile_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 24, className: "mx-auto text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("userDashboard.noRequests") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    className: "mt-3 gap-1.5 text-xs",
                    "data-ocid": "user_map.mobile_create_first_button",
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
      ]
    }
  );
}
export {
  UserMapPage as default
};
