import { y as createLucideIcon, r as reactExports, j as jsxRuntimeExports, N as UrgencyLevel, R as RequestStatus, M as ResourceType, ab as X, B as Badge, o as Button } from "./index-Cru0WlOf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12", key: "l9bcsi" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12", key: "13hhkx" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2", key: "10w3f3" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18", key: "15g9kq" }]
];
const Crosshair = createLucideIcon("crosshair", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$2);
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
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
const STATUS_COLOR = {
  [RequestStatus.open]: "oklch(0.58 0.24 30)",
  [RequestStatus.claimed]: "oklch(0.72 0.19 62)",
  [RequestStatus.inTransit]: "oklch(0.72 0.19 62)",
  [RequestStatus.delivered]: "oklch(0.68 0.21 151)"
};
const STATUS_LABEL = {
  [RequestStatus.open]: "Open",
  [RequestStatus.claimed]: "Claimed",
  [RequestStatus.inTransit]: "In Transit",
  [RequestStatus.delivered]: "Delivered"
};
const URGENCY_COLOR = {
  [UrgencyLevel.high]: "oklch(0.58 0.24 30)",
  [UrgencyLevel.medium]: "oklch(0.72 0.19 62)",
  [UrgencyLevel.low]: "oklch(0.68 0.21 151)"
};
const RESOURCE_EMOJI = {
  [ResourceType.food]: "🍱",
  [ResourceType.water]: "💧",
  [ResourceType.medical]: "🏥",
  [ResourceType.other]: "📦"
};
const NGO_COLOR = "oklch(0.55 0.22 25)";
function buildTileCoords(lat, lng, zoom) {
  const n = 2 ** zoom;
  const xtile = Math.floor((lng + 180) / 360 * n);
  const sinLat = Math.sin(lat * Math.PI / 180);
  const ytile = Math.floor(
    (1 - Math.log((1 + sinLat) / (1 - sinLat)) / (2 * Math.PI)) / 2 * n
  );
  return { xtile, ytile };
}
function latLngToPixel(lat, lng, centerLat, centerLng, zoom, containerW, containerH) {
  const TILE = 256;
  const n = 2 ** zoom;
  const toGx = (lo) => (lo + 180) / 360 * n * TILE;
  const toGy = (la) => {
    const s = Math.sin(la * Math.PI / 180);
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n * TILE;
  };
  return {
    x: containerW / 2 + (toGx(lng) - toGx(centerLng)),
    y: containerH / 2 + (toGy(lat) - toGy(centerLat))
  };
}
function kmToPixels(km, lat, zoom) {
  const mpp = 156543.03392 * Math.cos(lat * Math.PI / 180) / 2 ** zoom;
  return km * 1e3 / mpp;
}
function OSMTileGrid({
  centerLat,
  centerLng,
  zoom,
  width,
  height
}) {
  const TILE = 256;
  const { xtile, ytile } = buildTileCoords(centerLat, centerLng, zoom);
  const tilesX = Math.ceil(width / TILE) + 2;
  const tilesY = Math.ceil(height / TILE) + 2;
  const startX = xtile - Math.floor(tilesX / 2);
  const startY = ytile - Math.floor(tilesY / 2);
  const maxTile = 2 ** zoom - 1;
  const n = 2 ** zoom;
  const fracX = ((centerLng + 180) / 360 * n - xtile) * TILE;
  const sinLat = Math.sin(centerLat * Math.PI / 180);
  const globalY = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * n * TILE;
  const fracY = (globalY / TILE - ytile) * TILE;
  const offsetX = width / 2 - (Math.floor(tilesX / 2) * TILE + fracX);
  const offsetY = height / 2 - (Math.floor(tilesY / 2) * TILE + fracY);
  const tiles = [];
  for (let dy = 0; dy < tilesY; dy++) {
    for (let dx = 0; dx < tilesX; dx++) {
      const tx = startX + dx;
      const ty = startY + dy;
      if (tx < 0 || ty < 0 || tx > maxTile || ty > maxTile) continue;
      tiles.push(
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`,
            alt: `Map tile ${tx},${ty}`,
            style: {
              position: "absolute",
              left: offsetX + dx * TILE,
              top: offsetY + dy * TILE,
              width: TILE,
              height: TILE
            },
            crossOrigin: "anonymous"
          },
          `${zoom}-${tx}-${ty}`
        )
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tiles });
}
function MapView({
  center,
  zoom = 13,
  requestPins = [],
  ngoPins = [],
  viewerRole = "user",
  onClaimRequest,
  claimingId,
  showLegend = true,
  height = "420px"
}) {
  const containerRef = reactExports.useRef(null);
  const [dims, setDims] = reactExports.useState({ w: 640, h: 420 });
  const [tooltip, setTooltip] = reactExports.useState(null);
  const [currentCenter, setCurrentCenter] = reactExports.useState(center);
  const [geoLoading, setGeoLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setCurrentCenter(center);
  }, [center]);
  reactExports.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height: h } = entries[0].contentRect;
      setDims({ w: Math.round(width), h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  function handleRecenter() {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
      },
      { timeout: 8e3 }
    );
  }
  const reqPixels = requestPins.map((rp) => ({
    ...rp,
    px: latLngToPixel(
      rp.request.userLocation.lat,
      rp.request.userLocation.lng,
      currentCenter.lat,
      currentCenter.lng,
      zoom,
      dims.w,
      dims.h
    ),
    color: rp.colorMode === "urgency" ? URGENCY_COLOR[rp.request.urgency] : STATUS_COLOR[rp.request.status]
  }));
  const ngoPixels = ngoPins.map((np) => ({
    ...np,
    px: latLngToPixel(
      np.ngo.location.lat,
      np.ngo.location.lng,
      currentCenter.lat,
      currentCenter.lng,
      zoom,
      dims.w,
      dims.h
    ),
    radiusPx: np.showRadius ? kmToPixels(np.ngo.serviceRadius, np.ngo.location.lat, zoom) : 0
  }));
  const hasGeo = typeof navigator !== "undefined" && "geolocation" in navigator;
  function handlePinClick(e, data) {
    var _a;
    const rect = (_a = containerRef.current) == null ? void 0 : _a.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, ...data });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full rounded-xl overflow-hidden border border-border shadow-sm",
      style: { height },
      "data-ocid": "mapview.container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: containerRef,
            className: "absolute inset-0",
            style: { background: "oklch(0.92 0.005 60)" },
            children: dims.w > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              OSMTileGrid,
              {
                centerLat: currentCenter.lat,
                centerLng: currentCenter.lng,
                zoom,
                width: dims.w,
                height: dims.h
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "absolute inset-0 pointer-events-none",
            width: dims.w,
            height: dims.h,
            style: { overflow: "visible" },
            "aria-hidden": "true",
            children: ngoPixels.map(
              (np) => np.showRadius && np.radiusPx > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: np.px.x,
                  cy: np.px.y,
                  r: np.radiusPx,
                  fill: "none",
                  stroke: NGO_COLOR,
                  strokeWidth: 1.5,
                  strokeDasharray: "6 4",
                  opacity: 0.55
                },
                `radius-${np.ngo.id.toString()}`
              ) : null
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
          ngoPixels.map((np, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              style: { left: np.px.x - 14, top: np.px.y - 14, zIndex: 20 },
              "aria-label": `NGO: ${np.ngo.orgName}`,
              "data-ocid": `mapview.ngo_pin.${i + 1}`,
              onClick: (e) => handlePinClick(e, { ngo: np.ngo }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-background text-[10px] font-bold text-background transition-smooth hover:scale-110",
                  style: { background: NGO_COLOR },
                  children: np.ngo.orgName.slice(0, 1).toUpperCase()
                }
              )
            },
            `ngo-pin-${np.ngo.id.toString()}`
          )),
          reqPixels.map((rp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              style: { left: rp.px.x - 12, top: rp.px.y - 30, zIndex: 30 },
              "aria-label": `${rp.request.resourceType} request — ${STATUS_LABEL[rp.request.status]}`,
              "data-ocid": `mapview.request_pin.${i + 1}`,
              onClick: (e) => handlePinClick(e, { request: rp.request }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "svg",
                {
                  width: "24",
                  height: "32",
                  viewBox: "0 0 24 32",
                  className: "hover:scale-110 transition-smooth drop-shadow-sm",
                  style: { overflow: "visible" },
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "path",
                      {
                        d: "M12 0C7.13 0 3 4.13 3 9c0 6.75 9 23 9 23s9-16.25 9-23C21 4.13 16.87 0 12 0z",
                        fill: rp.color,
                        stroke: "white",
                        strokeWidth: "1.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "text",
                      {
                        x: "12",
                        y: "12",
                        textAnchor: "middle",
                        dominantBaseline: "middle",
                        fontSize: "9",
                        fill: "white",
                        children: RESOURCE_EMOJI[rp.request.resourceType]
                      }
                    )
                  ]
                }
              )
            },
            `req-pin-${rp.request.id.toString()}`
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute pointer-events-none",
              style: { left: dims.w / 2 - 8, top: dims.h / 2 - 8, zIndex: 25 },
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-4 h-4 rounded-full border-2 border-background shadow-md",
                    style: { background: NGO_COLOR }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 rounded-full animate-ping opacity-40",
                    style: { background: NGO_COLOR }
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1 right-1 z-40 text-[9px] text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded pointer-events-auto", children: [
          "©",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://www.openstreetmap.org/copyright",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline",
              children: "OpenStreetMap"
            }
          )
        ] }),
        hasGeo && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute bottom-8 right-2 z-40 w-9 h-9 rounded-lg bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-smooth",
            onClick: handleRecenter,
            disabled: geoLoading,
            "aria-label": "Re-center on my location",
            "data-ocid": "mapview.recenter_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Crosshair,
              {
                size: 16,
                className: `text-foreground ${geoLoading ? "animate-spin" : ""}`
              }
            )
          }
        ),
        showLegend && /* @__PURE__ */ jsxRuntimeExports.jsx(MapLegend, { role: viewerRole }),
        tooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MapTooltip,
          {
            tooltip,
            role: viewerRole,
            onClose: () => setTooltip(null),
            onClaim: onClaimRequest,
            claimingId,
            containerW: dims.w
          }
        )
      ]
    }
  );
}
function MapLegend({ role: viewerRole }) {
  const [open, setOpen] = reactExports.useState(false);
  const items = viewerRole === "ngo" ? [
    { color: URGENCY_COLOR[UrgencyLevel.high], label: "High urgency" },
    {
      color: URGENCY_COLOR[UrgencyLevel.medium],
      label: "Medium urgency"
    },
    { color: URGENCY_COLOR[UrgencyLevel.low], label: "Low urgency" }
  ] : viewerRole === "user" ? [
    { color: STATUS_COLOR[RequestStatus.open], label: "Open" },
    {
      color: STATUS_COLOR[RequestStatus.claimed],
      label: "Claimed / In-Transit"
    },
    {
      color: STATUS_COLOR[RequestStatus.delivered],
      label: "Delivered"
    }
  ] : [
    { color: STATUS_COLOR[RequestStatus.open], label: "Open" },
    { color: STATUS_COLOR[RequestStatus.claimed], label: "Claimed" },
    {
      color: STATUS_COLOR[RequestStatus.inTransit],
      label: "In Transit"
    },
    {
      color: STATUS_COLOR[RequestStatus.delivered],
      label: "Delivered"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 z-40", "data-ocid": "mapview.legend", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border shadow px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card transition-smooth",
        onClick: () => setOpen((o) => !o),
        "data-ocid": "mapview.legend_toggle",
        "aria-label": "Toggle map legend",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 12 }),
          "Legend"
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 bg-card/95 backdrop-blur-sm border border-border shadow-md rounded-lg p-3 min-w-[160px] space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Requests" }),
        items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-xs text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-3 h-3 rounded-full shrink-0",
                  style: { background: item.color }
                }
              ),
              item.label
            ]
          },
          item.label
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-2 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: "NGOs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-3 h-3 rounded-full shrink-0",
              style: { background: NGO_COLOR }
            }
          ),
          "NGO location"
        ] }),
        viewerRole !== "user" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-3 h-3 rounded border border-dashed shrink-0 opacity-60",
              style: { borderColor: NGO_COLOR }
            }
          ),
          "Service radius"
        ] })
      ] })
    ] })
  ] });
}
function MapTooltip({
  tooltip,
  role: viewerRole,
  onClose,
  onClaim,
  claimingId,
  containerW
}) {
  const W = 220;
  const H = 160;
  const x = Math.min(Math.max(tooltip.x + 12, 8), containerW - W - 8);
  const y = Math.max(tooltip.y - H - 12, 8);
  if (tooltip.ngo) {
    const ngo = tooltip.ngo;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute z-50 bg-card border border-border shadow-lg rounded-xl p-3 text-xs",
        style: { left: x, top: y, width: W },
        "data-ocid": "mapview.ngo_tooltip",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0",
                  style: { background: NGO_COLOR, color: "white" },
                  children: ngo.orgName.slice(0, 1)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: ngo.orgName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close tooltip",
                className: "text-muted-foreground hover:text-foreground shrink-0",
                "data-ocid": "mapview.tooltip.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "📞 ",
              ngo.contactPhone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "🎯 Radius: ",
              ngo.serviceRadius,
              " km"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px]", children: [
              ngo.location.lat.toFixed(4),
              ", ",
              ngo.location.lng.toFixed(4)
            ] })
          ] })
        ]
      }
    );
  }
  if (tooltip.request) {
    const req = tooltip.request;
    const canClaim = viewerRole === "ngo" && req.status === RequestStatus.open && !!onClaim;
    const isClaiming = claimingId === req.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute z-50 bg-card border border-border shadow-lg rounded-xl p-3 text-xs",
        style: { left: x, top: y, width: W },
        "data-ocid": "mapview.request_tooltip",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: RESOURCE_EMOJI[req.resourceType] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground capitalize truncate", children: [
                req.resourceType,
                " Aid"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close tooltip",
                className: "text-muted-foreground hover:text-foreground shrink-0",
                "data-ocid": "mapview.tooltip.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-muted-foreground mb-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[10px]",
                  style: { background: STATUS_COLOR[req.status], color: "white" },
                  children: STATUS_LABEL[req.status]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] px-1.5 py-0 capitalize h-auto",
                  children: req.urgency
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Qty: ",
              req.quantity.toString()
            ] }),
            req.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-[10px]", children: req.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px]", children: [
              req.userLocation.lat.toFixed(4),
              ", ",
              req.userLocation.lng.toFixed(4)
            ] })
          ] }),
          canClaim && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "w-full h-7 text-xs",
              disabled: isClaiming,
              onClick: () => {
                onClaim(req);
                onClose();
              },
              "data-ocid": "mapview.tooltip.claim_button",
              children: isClaiming ? "Claiming…" : "Claim Request"
            }
          ),
          viewerRole === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 10 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: "Admin view" })
          ] })
        ]
      }
    );
  }
  return null;
}
export {
  MapView as M,
  RefreshCw as R
};
