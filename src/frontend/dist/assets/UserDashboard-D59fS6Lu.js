import { y as createLucideIcon, r as reactExports, j as jsxRuntimeExports, z as Primitive, l as cn, m as useBackend, D as useAuth, a as useTranslation, b as Link, F as FilePlus, E as Skeleton, o as Button, G as Phone, B as Badge, U as User, R as RequestStatus, d as ArrowRight } from "./index-CiAbU5FG.js";
import { C as Card, a as CardContent } from "./card-BqmZtv4m.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { R as ResourceIcon } from "./ResourceIcon-Deu_qixK.js";
import { S as StatusBadge } from "./StatusBadge-DR__gOmG.js";
import { U as UrgencyBadge } from "./UrgencyBadge-Dj1HLlV4.js";
import { u as useGeolocation } from "./use-geolocation-ByrQj-A_.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
import { m as motion } from "./proxy-D5o2QNSn.js";
import { S as ShieldCheck } from "./shield-check-CckCqLqA.js";
import { T as Truck } from "./truck-BcCElR9f.js";
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1e3)} m`;
  return `${km.toFixed(1)} km`;
}
function ProfileCard({
  userProfile
}) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border overflow-hidden",
      "data-ocid": "user_dashboard.profile_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-1.5 w-full",
            style: { background: "oklch(var(--primary))" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 lg:p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 lg:gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-12 w-12 lg:h-14 lg:w-14 rounded-full flex items-center justify-center shrink-0 text-primary-foreground font-bold text-lg lg:text-xl font-display",
                style: { background: "oklch(var(--primary))" },
                children: userProfile.name.charAt(0).toUpperCase()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground font-display truncate lg:text-base", children: userProfile.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: userProfile.phone })
              ] }),
              userProfile.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  userProfile.location.lat.toFixed(4),
                  ",",
                  " ",
                  userProfile.location.lng.toFixed(4)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: t("userDashboard.verification") }),
            userProfile.aadhaarDeclared ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1 text-xs",
                style: {
                  color: "oklch(var(--secondary))",
                  borderColor: "oklch(var(--secondary) / 0.4)",
                  background: "oklch(var(--secondary) / 0.08)"
                },
                "data-ocid": "user_dashboard.aadhaar_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
                  t("userDashboard.aadhaar")
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1 text-xs text-muted-foreground",
                "data-ocid": "user_dashboard.aadhaar_unverified_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 11 }),
                  t("userDashboard.aadhaarPending")
                ]
              }
            ),
            userProfile.panDeclared ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1 text-xs",
                style: {
                  color: "oklch(var(--secondary))",
                  borderColor: "oklch(var(--secondary) / 0.4)",
                  background: "oklch(var(--secondary) / 0.08)"
                },
                "data-ocid": "user_dashboard.pan_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 11 }),
                  t("userDashboard.pan")
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1 text-xs text-muted-foreground",
                "data-ocid": "user_dashboard.pan_unverified_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 11 }),
                  t("userDashboard.panPending")
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-2 mt-3 pt-3 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/map", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full gap-1.5 text-xs",
                "data-ocid": "user_dashboard.profile_map_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13 }),
                  "View Map"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "w-full gap-1.5 text-xs",
                "data-ocid": "user_dashboard.profile_request_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { size: 13 }),
                  "New Request"
                ]
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function StatBand({
  requests
}) {
  const { t } = useTranslation();
  const total = (requests == null ? void 0 : requests.length) ?? 0;
  const active = (requests == null ? void 0 : requests.filter(
    (r) => r.status === RequestStatus.open || r.status === RequestStatus.claimed || r.status === RequestStatus.inTransit
  ).length) ?? 0;
  const delivered = (requests == null ? void 0 : requests.filter((r) => r.status === RequestStatus.delivered).length) ?? 0;
  const stats = [
    {
      label: t("userDashboard.stats.total"),
      value: total,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { size: 14 }),
      color: "text-foreground",
      ocid: "user_dashboard.stat_total"
    },
    {
      label: t("userDashboard.stats.active"),
      value: active,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14 }),
      color: "text-accent",
      ocid: "user_dashboard.stat_active"
    },
    {
      label: t("userDashboard.stats.delivered"),
      value: delivered,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }),
      color: "text-secondary",
      ocid: "user_dashboard.stat_delivered"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2.5", children: stats.map(({ label, value, icon, color, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-3 lg:py-6 text-center space-y-1",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl lg:text-3xl font-bold font-display ${color}`, children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-center gap-1 text-xs ${color} opacity-80`,
            children: [
              icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
            ]
          }
        )
      ]
    },
    label
  )) });
}
function NewRequestHeroCTA() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/user/new-request",
          "data-ocid": "user_dashboard.new_request_hero_link",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative overflow-hidden rounded-2xl cursor-pointer group",
              style: {
                background: "linear-gradient(135deg, oklch(0.55 0.22 30) 0%, oklch(0.50 0.24 20) 60%, oklch(0.45 0.20 10) 100%)"
              },
              "data-ocid": "user_dashboard.new_request_hero_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-30",
                    style: {
                      background: "radial-gradient(circle, oklch(0.75 0.20 60) 0%, transparent 70%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full opacity-20",
                    style: {
                      background: "radial-gradient(circle, oklch(0.65 0.18 50) 0%, transparent 70%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-5 py-5 lg:px-7 lg:py-6 flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "shrink-0 h-14 w-14 lg:h-16 lg:w-16 rounded-xl flex items-center justify-center shadow-lg",
                        style: { background: "oklch(0.65 0.22 50 / 0.35)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Zap,
                            {
                              size: 28,
                              className: "lg:hidden",
                              style: { color: "oklch(0.97 0.04 60)" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Zap,
                            {
                              size: 34,
                              className: "hidden lg:block",
                              style: { color: "oklch(0.97 0.04 60)" }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-lg lg:text-xl font-display font-bold leading-tight",
                          style: { color: "oklch(0.98 0.02 60)" },
                          children: t("userDashboard.requestReliefNow")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs lg:text-sm mt-1 leading-relaxed",
                          style: { color: "oklch(0.90 0.05 40)" },
                          children: t("userDashboard.resourceTypes")
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs lg:text-sm mt-0.5",
                          style: { color: "oklch(0.82 0.06 35)" },
                          children: t("userDashboard.ngoResponse")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:translate-x-1",
                      style: { background: "oklch(0.97 0.04 60 / 0.20)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ArrowRight,
                          {
                            size: 20,
                            className: "lg:hidden",
                            style: { color: "oklch(0.97 0.04 60)" }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ArrowRight,
                          {
                            size: 24,
                            className: "hidden lg:block",
                            style: { color: "oklch(0.97 0.04 60)" }
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-5 lg:px-7 py-2 flex items-center gap-2 border-t",
                    style: {
                      borderColor: "oklch(0.97 0.04 60 / 0.15)",
                      background: "oklch(0.40 0.20 15 / 0.40)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12, style: { color: "oklch(0.90 0.12 60)" } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs lg:text-sm font-medium",
                          style: { color: "oklch(0.90 0.08 55)" },
                          children: t("userDashboard.emergencyNote")
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        }
      )
    }
  );
}
function RequestCard({
  req,
  index,
  ngoMap,
  distanceKm
}) {
  const { t } = useTranslation();
  const createdMs = Number(req.createdAt) / 1e6;
  const diffMin = Math.floor((Date.now() - createdMs) / 6e4);
  const timeAgo = diffMin < 60 ? `${diffMin}m ago` : diffMin < 1440 ? `${Math.floor(diffMin / 60)}h ago` : `${Math.floor(diffMin / 1440)}d ago`;
  const ngo = req.claimedBy != null ? ngoMap.get(req.claimedBy.toString()) : void 0;
  const isActive = req.status === RequestStatus.open || req.status === RequestStatus.claimed || req.status === RequestStatus.inTransit;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.25, delay: index * 0.05 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: `border-border transition-smooth ${isActive ? "shadow-sm" : ""}`,
          "data-ocid": `user_dashboard.request.item.${index}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center shrink-0",
                style: { background: "oklch(var(--muted))" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 lg:flex lg:items-start lg:gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 lg:block", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm lg:text-base text-foreground capitalize", children: t(`resources.${req.resourceType}`, {
                      defaultValue: req.resourceType.charAt(0).toUpperCase() + req.resourceType.slice(1)
                    }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                      req.quantity.toString(),
                      " ",
                      t("userDashboard.units"),
                      " ·",
                      " ",
                      timeAgo
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5 shrink-0 lg:hidden", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UrgencyBadge, { urgency: req.urgency, size: "sm" })
                  ] })
                ] }),
                distanceKm !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
                    style: {
                      background: "oklch(var(--primary) / 0.08)",
                      borderColor: "oklch(var(--primary) / 0.25)",
                      color: "oklch(var(--primary))"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        formatDistance(distanceKm),
                        " ",
                        t("userDashboard.unitsAway")
                      ] })
                    ]
                  }
                ) }),
                ngo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 11, className: "text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: ngo.orgName }),
                    " ",
                    t("userDashboard.handlingRequest")
                  ] })
                ] }),
                req.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-xs text-muted-foreground line-clamp-2 italic", children: [
                  '"',
                  req.description,
                  '"'
                ] }),
                req.deliveredAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11, className: "text-secondary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    t("userDashboard.delivered"),
                    " ",
                    new Date(
                      Number(req.deliveredAt) / 1e6
                    ).toLocaleDateString()
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col items-end gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(UrgencyBadge, { urgency: req.urgency, size: "sm" })
              ] })
            ] })
          ] }) })
        }
      )
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-xl shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
    ] })
  ] }) }) });
}
function UserDashboard() {
  var _a;
  const { actor, isFetching } = useBackend();
  const { userProfile } = useAuth();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();
  const hasGps = lat !== null && lng !== null && lat !== 0 && lng !== 0;
  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["user-requests", (_a = userProfile == null ? void 0 : userProfile.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getRequestsByUser(userProfile.id);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 3e4
  });
  const claimedNgoIds = [
    ...new Set(
      (requests ?? []).filter((r) => r.claimedBy != null).map((r) => r.claimedBy.toString())
    )
  ];
  const { data: ngos } = useQuery({
    queryKey: ["ngo-profiles-for-user", claimedNgoIds.join(",")],
    queryFn: async () => {
      if (!actor || claimedNgoIds.length === 0) return [];
      const results = await Promise.all(
        claimedNgoIds.map(
          (id) => actor.getNGOProfile(BigInt(id)).catch(() => null)
        )
      );
      return results.filter((n) => n !== null);
    },
    enabled: !!actor && claimedNgoIds.length > 0,
    staleTime: 6e4
  });
  const ngoMap = new Map(
    (ngos ?? []).map((n) => [n.id.toString(), n])
  );
  const sortedRequests = [...requests ?? []].sort((a, b) => {
    if (hasGps && a.userLocation && b.userLocation) {
      const distA = calcDistance(
        lat,
        lng,
        a.userLocation.lat,
        a.userLocation.lng
      );
      const distB = calcDistance(
        lat,
        lng,
        b.userLocation.lat,
        b.userLocation.lng
      );
      return distA - distB;
    }
    return Number(b.createdAt) - Number(a.createdAt);
  });
  const isLoading = requestsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto pb-8",
      "data-ocid": "user_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl lg:text-2xl font-display font-bold text-foreground leading-tight", children: t("userDashboard.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("userDashboard.subtitle") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            geoLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs text-muted-foreground animate-pulse hidden sm:inline",
                "data-ocid": "user_dashboard.geo_loading_state",
                children: t("app.detectingLocation")
              }
            ),
            !geoLoading && permission === "granted" && hasGps && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1.5 bg-green-900/50 text-green-400 border border-green-700 rounded-full px-3 py-1 text-xs font-medium",
                "data-ocid": "user_dashboard.geo_badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("app.locationDetected") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "GPS" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "inline-flex items-center gap-1.5 h-8 lg:h-9 px-3 lg:px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors",
                "data-ocid": "user_dashboard.new_request_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { size: 14 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t("userDashboard.newRequest") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 lg:w-0 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden", children: [
              userProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCard, { userProfile }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-12 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
                ] })
              ] }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatBand, { requests }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(NewRequestHeroCTA, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm lg:text-base font-semibold text-foreground", children: t("userDashboard.allRequests") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  hasGps && !isLoading && sortedRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10, className: "text-primary" }),
                    t("userDashboard.nearestFirst")
                  ] }),
                  !isLoading && sortedRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    sortedRequests.length,
                    " ",
                    t("userDashboard.total")
                  ] })
                ] })
              ] }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-3",
                  "data-ocid": "user_dashboard.loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {})
                  ]
                }
              ) : sortedRequests.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "space-y-3",
                  "data-ocid": "user_dashboard.request.list",
                  children: sortedRequests.map((req, i) => {
                    const distanceKm = hasGps && req.userLocation ? calcDistance(
                      lat,
                      lng,
                      req.userLocation.lat,
                      req.userLocation.lng
                    ) : void 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RequestCard,
                      {
                        req,
                        index: i + 1,
                        ngoMap,
                        distanceKm
                      },
                      req.id.toString()
                    );
                  })
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.97 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.3 },
                  className: "rounded-2xl border border-dashed border-border bg-card/50 py-14 text-center space-y-4",
                  "data-ocid": "user_dashboard.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mx-auto h-14 w-14 rounded-full flex items-center justify-center",
                        style: { background: "oklch(var(--muted))" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 24, className: "text-muted-foreground" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("userDashboard.noRequests") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-8", children: t("userDashboard.noRequestsDesc") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        className: "gap-1.5 mt-1",
                        "data-ocid": "user_dashboard.empty_cta",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { size: 14 }),
                          t("userDashboard.submitFirst")
                        ]
                      }
                    ) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-5 shrink-0", children: [
            userProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCard, { userProfile }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-12 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
              ] })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatBand, { requests }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border",
                "data-ocid": "user_dashboard.quick_actions_card",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Quick Actions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/new-request", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "w-full gap-2 justify-start",
                      "data-ocid": "user_dashboard.quick_new_request_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16 }),
                        "Request Relief Now"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/map", className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "w-full gap-2 justify-start",
                      "data-ocid": "user_dashboard.quick_map_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
                        "View on Map"
                      ]
                    }
                  ) })
                ] })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  UserDashboard as default
};
