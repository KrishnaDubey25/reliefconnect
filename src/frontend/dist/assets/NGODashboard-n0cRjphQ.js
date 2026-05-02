import { y as createLucideIcon, m as useBackend, D as useAuth, a as useTranslation, R as RequestStatus, j as jsxRuntimeExports, B as Badge, S as Shield, G as Phone, E as Skeleton, b as Link, d as ArrowRight, O as RESOURCE_TYPES, o as Button } from "./index-CiAbU5FG.js";
import { C as Card, a as CardContent } from "./card-BqmZtv4m.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { R as ResourceIcon } from "./ResourceIcon-Deu_qixK.js";
import { u as useGeolocation } from "./use-geolocation-ByrQj-A_.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
import { R as Radio } from "./radio-Cdc0W9JI.js";
import { C as CircleCheck } from "./circle-check-CvLyfbQt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      key: "hh9hay"
    }
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
  ["path", { d: "M12 22V12", key: "d0xqtd" }]
];
const Box = createLucideIcon("box", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode);
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function StatCard({
  label,
  value,
  color,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-3 lg:p-4 text-center",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl lg:text-3xl font-bold font-display ${color}`, children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-tight", children: label })
      ]
    }
  );
}
function NGODashboard() {
  var _a, _b;
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();
  const { data: openRequests, isLoading: loadingOpen } = useQuery({
    queryKey: ["open-requests"],
    queryFn: async () => actor ? actor.getOpenRequests() : [],
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const { data: myRequests, isLoading: loadingMine } = useQuery({
    queryKey: ["ngo-requests", (_a = ngoProfile == null ? void 0 : ngoProfile.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getRequestsByNGO(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile,
    refetchInterval: 3e4
  });
  const { data: inventory, isLoading: loadingInv } = useQuery({
    queryKey: ["ngo-inventory", (_b = ngoProfile == null ? void 0 : ngoProfile.id) == null ? void 0 : _b.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getNGOInventory(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile
  });
  const activeRequests = (myRequests == null ? void 0 : myRequests.filter(
    (r) => r.status === RequestStatus.claimed || r.status === RequestStatus.inTransit
  )) ?? [];
  const totalInventoryUnits = (inventory == null ? void 0 : inventory.reduce((sum, inv) => sum + Number(inv.quantity), 0)) ?? 0;
  const nearbyCount = openRequests ? ngoProfile ? openRequests.filter((r) => {
    const dist = calcDistance(
      ngoProfile.location.lat,
      ngoProfile.location.lng,
      r.userLocation.lat,
      r.userLocation.lng
    );
    return dist <= ngoProfile.serviceRadius;
  }).length : openRequests.length : 0;
  const inventoryMap = new Map(
    inventory == null ? void 0 : inventory.map((inv) => [inv.resourceType, inv])
  );
  const isLoading = loadingOpen || loadingMine || loadingInv;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-6 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto pb-8",
      "data-ocid": "ngo_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold leading-tight", children: t("ngoDashboard.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("ngoDashboard.subtitle") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            geoLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs text-muted-foreground animate-pulse",
                "data-ocid": "ngo_dashboard.geo_loading_state",
                children: t("app.detectingLocation")
              }
            ),
            !geoLoading && permission === "granted" && lat !== null && lng !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1.5 bg-green-900/50 text-green-400 border border-green-700 rounded-full px-3 py-1 text-xs font-medium",
                "data-ocid": "ngo_dashboard.geo_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                  t("app.locationDetected")
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1.5 text-secondary border-secondary/30 bg-secondary/5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 10, className: "animate-pulse" }),
                  t("ngoDashboard.live")
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:w-1/3 space-y-5", children: [
            ngoProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border bg-card",
                "data-ocid": "ngo_dashboard.profile_card",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 22, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base leading-tight truncate", children: ngoProfile.orgName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 mt-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                        ngoProfile.location.lat.toFixed(3),
                        ",",
                        " ",
                        ngoProfile.location.lng.toFixed(3)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 11 }),
                        t("ngoDashboard.kmRadius", {
                          radius: ngoProfile.serviceRadius
                        })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                        ngoProfile.contactPhone
                      ] })
                    ] })
                  ] })
                ] }) })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-3 gap-3 lg:gap-4",
                "data-ocid": "ngo_dashboard.stats_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      label: t("ngoDashboard.stats.nearbyOpen"),
                      value: nearbyCount,
                      color: "text-accent",
                      ocid: "ngo_dashboard.stat_open"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      label: t("ngoDashboard.stats.active"),
                      value: activeRequests.length,
                      color: "text-chart-2",
                      ocid: "ngo_dashboard.stat_active"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatCard,
                    {
                      label: t("ngoDashboard.stats.inventoryUnits"),
                      value: totalInventoryUnits,
                      color: "text-primary",
                      ocid: "ngo_dashboard.stat_inventory"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-3",
                "data-ocid": "ngo_dashboard.nav_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ngo/requests", "data-ocid": "ngo_dashboard.requests_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card hover:bg-muted/30 transition-smooth group h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 20, className: "text-accent" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: t("ngoDashboard.requests") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: t("ngoDashboard.requestsDesc") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0 lg:mt-auto lg:self-end", children: [
                      nearbyCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/10 text-accent border-accent/20 border text-xs px-2", children: [
                        nearbyCount,
                        " ",
                        t("ngoDashboard.open")
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ArrowRight,
                        {
                          size: 16,
                          className: "text-muted-foreground group-hover:text-foreground transition-colors"
                        }
                      )
                    ] })
                  ] }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ngo/inventory", "data-ocid": "ngo_dashboard.inventory_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card hover:bg-muted/30 transition-smooth group h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { size: 20, className: "text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: t("ngoDashboard.inventory") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: t("ngoDashboard.inventoryDesc") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0 lg:mt-auto lg:self-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ArrowRight,
                      {
                        size: 16,
                        className: "text-muted-foreground group-hover:text-foreground transition-colors"
                      }
                    ) })
                  ] }) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "ngo_dashboard.inventory_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { size: 14, className: "text-primary" }),
                    t("ngoDashboard.stockOverview")
                  ] }),
                  loadingInv ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: RESOURCE_TYPES.map((rt, i) => {
                    const inv = inventoryMap.get(rt.value);
                    const qty = inv ? Number(inv.quantity) : 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3",
                        "data-ocid": `ngo_dashboard.stock_item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: rt.value, size: 15 }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: t(rt.labelKey) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: `text-lg font-bold ${qty === 0 ? "text-accent" : "text-foreground"}`,
                                children: qty
                              }
                            )
                          ] })
                        ]
                      },
                      rt.value
                    );
                  }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:w-2/3 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "ngo_dashboard.active_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 14, className: "text-primary" }),
                  t("ngoDashboard.activeTasks"),
                  activeRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 border text-xs px-2", children: activeRequests.length })
                ] }),
                activeRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ngo/requests", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs h-7 gap-1",
                    children: [
                      "View All ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
                    ]
                  }
                ) })
              ] }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) }) : activeRequests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                activeRequests.slice(0, 5).map((req, i) => {
                  const dist = ngoProfile ? calcDistance(
                    ngoProfile.location.lat,
                    ngoProfile.location.lng,
                    req.userLocation.lat,
                    req.userLocation.lng
                  ).toFixed(1) : null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 p-3 lg:p-4 bg-card border border-border rounded-xl",
                      "data-ocid": `ngo_dashboard.active_item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 17 }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium capitalize truncate", children: [
                            req.resourceType,
                            " Aid"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            dist ? t("ngoDashboard.awayKm", { dist }) : t("ngoDashboard.locationUnknown"),
                            " ",
                            "·",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: req.status.replace("inTransit", "In Transit") })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex items-center gap-2", children: [
                          req.status === RequestStatus.inTransit && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-secondary" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "outline",
                              className: "text-xs capitalize hidden lg:inline-flex",
                              children: req.status.replace("inTransit", "In Transit")
                            }
                          )
                        ] })
                      ]
                    },
                    req.id.toString()
                  );
                }),
                activeRequests.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: t("ngoDashboard.moreTasks", {
                  count: activeRequests.length - 5
                }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 rounded-xl bg-muted/20 border border-border space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheck,
                  {
                    size: 28,
                    className: "mx-auto text-muted-foreground opacity-40"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No active tasks right now" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ngo/requests", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "mt-2 gap-1.5 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 13 }),
                      "Browse open requests"
                    ]
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 hidden lg:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-accent" }),
                  "Nearby Open Requests",
                  nearbyCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 border text-xs px-2", children: nearbyCount })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/ngo/requests", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-xs h-7 gap-1", children: [
                  "View All ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
                ] }) })
              ] }),
              loadingOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) }) : (openRequests ?? []).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: (openRequests ?? []).slice(0, 4).map((req, i) => {
                const dist = ngoProfile ? calcDistance(
                  ngoProfile.location.lat,
                  ngoProfile.location.lng,
                  req.userLocation.lat,
                  req.userLocation.lng
                ).toFixed(1) : null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-3 p-3 bg-card border border-border rounded-xl",
                    "data-ocid": `ngo_dashboard.open_item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 15 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium capitalize truncate", children: [
                          req.resourceType,
                          " Aid"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: dist ? `${dist} km away` : "Location unknown" })
                      ] })
                    ]
                  },
                  req.id.toString()
                );
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 rounded-xl bg-muted/20 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No open requests in your area" }) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  NGODashboard as default
};
