import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crosshair, Info, Layers, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus, ResourceType, UrgencyLevel } from "../../types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RequestPin {
  request: ReliefRequest;
  colorMode: "status" | "urgency";
}

export interface NGOPin {
  ngo: NGOProfile;
  showRadius?: boolean;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

interface TooltipData {
  x: number;
  y: number;
  request?: ReliefRequest;
  ngo?: NGOProfile;
}

interface MapViewProps {
  center: MapCenter;
  zoom?: number;
  requestPins?: RequestPin[];
  ngoPins?: NGOPin[];
  viewerRole?: "user" | "ngo" | "admin";
  onClaimRequest?: (req: ReliefRequest) => void;
  claimingId?: bigint | null;
  showLegend?: boolean;
  height?: string;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<RequestStatus, string> = {
  [RequestStatus.open]: "oklch(0.58 0.24 30)",
  [RequestStatus.claimed]: "oklch(0.72 0.19 62)",
  [RequestStatus.inTransit]: "oklch(0.72 0.19 62)",
  [RequestStatus.delivered]: "oklch(0.68 0.21 151)",
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.open]: "Open",
  [RequestStatus.claimed]: "Claimed",
  [RequestStatus.inTransit]: "In Transit",
  [RequestStatus.delivered]: "Delivered",
};

const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  [UrgencyLevel.high]: "oklch(0.58 0.24 30)",
  [UrgencyLevel.medium]: "oklch(0.72 0.19 62)",
  [UrgencyLevel.low]: "oklch(0.68 0.21 151)",
};

const RESOURCE_EMOJI: Record<ResourceType, string> = {
  [ResourceType.food]: "🍱",
  [ResourceType.water]: "💧",
  [ResourceType.medical]: "🏥",
  [ResourceType.other]: "📦",
};

const NGO_COLOR = "oklch(0.55 0.22 25)";

// ─── Geo math helpers ─────────────────────────────────────────────────────────

function buildTileCoords(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const xtile = Math.floor(((lng + 180) / 360) * n);
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const ytile = Math.floor(
    ((1 - Math.log((1 + sinLat) / (1 - sinLat)) / (2 * Math.PI)) / 2) * n,
  );
  return { xtile, ytile };
}

function latLngToPixel(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  containerW: number,
  containerH: number,
): { x: number; y: number } {
  const TILE = 256;
  const n = 2 ** zoom;

  const toGx = (lo: number) => ((lo + 180) / 360) * n * TILE;
  const toGy = (la: number) => {
    const s = Math.sin((la * Math.PI) / 180);
    return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n * TILE;
  };

  return {
    x: containerW / 2 + (toGx(lng) - toGx(centerLng)),
    y: containerH / 2 + (toGy(lat) - toGy(centerLat)),
  };
}

function kmToPixels(km: number, lat: number, zoom: number): number {
  const mpp = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / 2 ** zoom;
  return (km * 1000) / mpp;
}

// ─── OSM tile grid ────────────────────────────────────────────────────────────

function OSMTileGrid({
  centerLat,
  centerLng,
  zoom,
  width,
  height,
}: {
  centerLat: number;
  centerLng: number;
  zoom: number;
  width: number;
  height: number;
}) {
  const TILE = 256;
  const { xtile, ytile } = buildTileCoords(centerLat, centerLng, zoom);
  const tilesX = Math.ceil(width / TILE) + 2;
  const tilesY = Math.ceil(height / TILE) + 2;
  const startX = xtile - Math.floor(tilesX / 2);
  const startY = ytile - Math.floor(tilesY / 2);
  const maxTile = 2 ** zoom - 1;

  const n = 2 ** zoom;
  const fracX = (((centerLng + 180) / 360) * n - xtile) * TILE;
  const sinLat = Math.sin((centerLat * Math.PI) / 180);
  const globalY =
    (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * n * TILE;
  const fracY = (globalY / TILE - ytile) * TILE;

  const offsetX = width / 2 - (Math.floor(tilesX / 2) * TILE + fracX);
  const offsetY = height / 2 - (Math.floor(tilesY / 2) * TILE + fracY);

  const tiles: React.ReactNode[] = [];
  for (let dy = 0; dy < tilesY; dy++) {
    for (let dx = 0; dx < tilesX; dx++) {
      const tx = startX + dx;
      const ty = startY + dy;
      if (tx < 0 || ty < 0 || tx > maxTile || ty > maxTile) continue;
      tiles.push(
        <img
          key={`${zoom}-${tx}-${ty}`}
          src={`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`}
          alt={`Map tile ${tx},${ty}`}
          style={{
            position: "absolute",
            left: offsetX + dx * TILE,
            top: offsetY + dy * TILE,
            width: TILE,
            height: TILE,
          }}
          crossOrigin="anonymous"
        />,
      );
    }
  }
  return <>{tiles}</>;
}

// ─── MapView component ────────────────────────────────────────────────────────

export function MapView({
  center,
  zoom = 13,
  requestPins = [],
  ngoPins = [],
  viewerRole = "user" as const,
  onClaimRequest,
  claimingId,
  showLegend = true,
  height = "420px",
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 640, h: 420 });
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [currentCenter, setCurrentCenter] = useState(center);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    setCurrentCenter(center);
  }, [center]);

  useEffect(() => {
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
          lng: pos.coords.longitude,
        });
        setGeoLoading(false);
      },
      () => {
        // Permission denied or unavailable — silently stop loading, do nothing
        setGeoLoading(false);
      },
      { timeout: 8000 },
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
      dims.h,
    ),
    color:
      rp.colorMode === "urgency"
        ? URGENCY_COLOR[rp.request.urgency]
        : STATUS_COLOR[rp.request.status],
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
      dims.h,
    ),
    radiusPx: np.showRadius
      ? kmToPixels(np.ngo.serviceRadius, np.ngo.location.lat, zoom)
      : 0,
  }));

  const hasGeo = typeof navigator !== "undefined" && "geolocation" in navigator;

  function handlePinClick(
    e: React.MouseEvent,
    data: Omit<TooltipData, "x" | "y">,
  ) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, ...data });
  }

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-border shadow-sm"
      style={{ height }}
      data-ocid="mapview.container"
    >
      {/* Tile grid */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ background: "oklch(0.92 0.005 60)" }}
      >
        {dims.w > 0 && (
          <OSMTileGrid
            centerLat={currentCenter.lat}
            centerLng={currentCenter.lng}
            zoom={zoom}
            width={dims.w}
            height={dims.h}
          />
        )}
      </div>

      {/* SVG radius circles */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={dims.w}
        height={dims.h}
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {ngoPixels.map((np) =>
          np.showRadius && np.radiusPx > 0 ? (
            <circle
              key={`radius-${np.ngo.id.toString()}`}
              cx={np.px.x}
              cy={np.px.y}
              r={np.radiusPx}
              fill="none"
              stroke={NGO_COLOR}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              opacity={0.55}
            />
          ) : null,
        )}
      </svg>

      {/* Interactive pin layer */}
      <div className="absolute inset-0">
        {/* NGO markers */}
        {ngoPixels.map((np, i) => (
          <button
            type="button"
            key={`ngo-pin-${np.ngo.id.toString()}`}
            className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ left: np.px.x - 14, top: np.px.y - 14, zIndex: 20 }}
            aria-label={`NGO: ${np.ngo.orgName}`}
            data-ocid={`mapview.ngo_pin.${i + 1}`}
            onClick={(e) => handlePinClick(e, { ngo: np.ngo })}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-background text-[10px] font-bold text-background transition-smooth hover:scale-110"
              style={{ background: NGO_COLOR }}
            >
              {np.ngo.orgName.slice(0, 1).toUpperCase()}
            </div>
          </button>
        ))}

        {/* Request pins (teardrop) */}
        {reqPixels.map((rp, i) => (
          <button
            type="button"
            key={`req-pin-${rp.request.id.toString()}`}
            className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ left: rp.px.x - 12, top: rp.px.y - 30, zIndex: 30 }}
            aria-label={`${rp.request.resourceType} request — ${STATUS_LABEL[rp.request.status]}`}
            data-ocid={`mapview.request_pin.${i + 1}`}
            onClick={(e) => handlePinClick(e, { request: rp.request })}
          >
            <svg
              width="24"
              height="32"
              viewBox="0 0 24 32"
              className="hover:scale-110 transition-smooth drop-shadow-sm"
              style={{ overflow: "visible" }}
              aria-hidden="true"
            >
              <path
                d="M12 0C7.13 0 3 4.13 3 9c0 6.75 9 23 9 23s9-16.25 9-23C21 4.13 16.87 0 12 0z"
                fill={rp.color}
                stroke="white"
                strokeWidth="1.5"
              />
              <text
                x="12"
                y="12"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="white"
              >
                {RESOURCE_EMOJI[rp.request.resourceType]}
              </text>
            </svg>
          </button>
        ))}

        {/* Center dot (my position) */}
        <div
          className="absolute pointer-events-none"
          style={{ left: dims.w / 2 - 8, top: dims.h / 2 - 8, zIndex: 25 }}
          aria-hidden="true"
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-background shadow-md"
            style={{ background: NGO_COLOR }}
          />
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: NGO_COLOR }}
          />
        </div>
      </div>

      {/* OSM attribution */}
      <div className="absolute bottom-1 right-1 z-40 text-[9px] text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded pointer-events-auto">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>
      </div>

      {/* Geolocation recenter */}
      {hasGeo && (
        <button
          type="button"
          className="absolute bottom-8 right-2 z-40 w-9 h-9 rounded-lg bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-smooth"
          onClick={handleRecenter}
          disabled={geoLoading}
          aria-label="Re-center on my location"
          data-ocid="mapview.recenter_button"
        >
          <Crosshair
            size={16}
            className={`text-foreground ${geoLoading ? "animate-spin" : ""}`}
          />
        </button>
      )}

      {/* Legend */}
      {showLegend && <MapLegend role={viewerRole} />}

      {/* Tooltip overlay */}
      {tooltip && (
        <MapTooltip
          tooltip={tooltip}
          role={viewerRole}
          onClose={() => setTooltip(null)}
          onClaim={onClaimRequest}
          claimingId={claimingId}
          containerW={dims.w}
        />
      )}
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function MapLegend({ role: viewerRole }: { role: "user" | "ngo" | "admin" }) {
  const [open, setOpen] = useState(false);

  const items =
    viewerRole === "ngo"
      ? [
          { color: URGENCY_COLOR[UrgencyLevel.high], label: "High urgency" },
          {
            color: URGENCY_COLOR[UrgencyLevel.medium],
            label: "Medium urgency",
          },
          { color: URGENCY_COLOR[UrgencyLevel.low], label: "Low urgency" },
        ]
      : viewerRole === "user"
        ? [
            { color: STATUS_COLOR[RequestStatus.open], label: "Open" },
            {
              color: STATUS_COLOR[RequestStatus.claimed],
              label: "Claimed / In-Transit",
            },
            {
              color: STATUS_COLOR[RequestStatus.delivered],
              label: "Delivered",
            },
          ]
        : [
            { color: STATUS_COLOR[RequestStatus.open], label: "Open" },
            { color: STATUS_COLOR[RequestStatus.claimed], label: "Claimed" },
            {
              color: STATUS_COLOR[RequestStatus.inTransit],
              label: "In Transit",
            },
            {
              color: STATUS_COLOR[RequestStatus.delivered],
              label: "Delivered",
            },
          ];

  return (
    <div className="absolute top-2 left-2 z-40" data-ocid="mapview.legend">
      <button
        type="button"
        className="flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border shadow px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-card transition-smooth"
        onClick={() => setOpen((o) => !o)}
        data-ocid="mapview.legend_toggle"
        aria-label="Toggle map legend"
      >
        <Layers size={12} />
        Legend
      </button>

      {open && (
        <div className="mt-1.5 bg-card/95 backdrop-blur-sm border border-border shadow-md rounded-lg p-3 min-w-[160px] space-y-2">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Requests
            </p>
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs text-foreground"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-2 space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              NGOs
            </p>
            <div className="flex items-center gap-2 text-xs text-foreground">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: NGO_COLOR }}
              />
              NGO location
            </div>
            {viewerRole !== "user" && (
              <div className="flex items-center gap-2 text-xs text-foreground">
                <span
                  className="w-3 h-3 rounded border border-dashed shrink-0 opacity-60"
                  style={{ borderColor: NGO_COLOR }}
                />
                Service radius
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function MapTooltip({
  tooltip,
  role: viewerRole,
  onClose,
  onClaim,
  claimingId,
  containerW,
}: {
  tooltip: TooltipData;
  role: "user" | "ngo" | "admin";
  onClose: () => void;
  onClaim?: (req: ReliefRequest) => void;
  claimingId?: bigint | null;
  containerW: number;
}) {
  const W = 220;
  const H = 160;
  const x = Math.min(Math.max(tooltip.x + 12, 8), containerW - W - 8);
  const y = Math.max(tooltip.y - H - 12, 8);

  if (tooltip.ngo) {
    const ngo = tooltip.ngo;
    return (
      <div
        className="absolute z-50 bg-card border border-border shadow-lg rounded-xl p-3 text-xs"
        style={{ left: x, top: y, width: W }}
        data-ocid="mapview.ngo_tooltip"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0"
              style={{ background: NGO_COLOR, color: "white" }}
            >
              {ngo.orgName.slice(0, 1)}
            </div>
            <p className="font-semibold text-foreground truncate">
              {ngo.orgName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tooltip"
            className="text-muted-foreground hover:text-foreground shrink-0"
            data-ocid="mapview.tooltip.close_button"
          >
            <X size={13} />
          </button>
        </div>
        <div className="space-y-1 text-muted-foreground">
          <p>📞 {ngo.contactPhone}</p>
          <p>🎯 Radius: {ngo.serviceRadius} km</p>
          <p className="font-mono text-[10px]">
            {ngo.location.lat.toFixed(4)}, {ngo.location.lng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }

  if (tooltip.request) {
    const req = tooltip.request;
    const canClaim =
      viewerRole === "ngo" && req.status === RequestStatus.open && !!onClaim;
    const isClaiming = claimingId === req.id;

    return (
      <div
        className="absolute z-50 bg-card border border-border shadow-lg rounded-xl p-3 text-xs"
        style={{ left: x, top: y, width: W }}
        data-ocid="mapview.request_tooltip"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base">
              {RESOURCE_EMOJI[req.resourceType]}
            </span>
            <p className="font-semibold text-foreground capitalize truncate">
              {req.resourceType} Aid
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tooltip"
            className="text-muted-foreground hover:text-foreground shrink-0"
            data-ocid="mapview.tooltip.close_button"
          >
            <X size={13} />
          </button>
        </div>

        <div className="space-y-1 text-muted-foreground mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[10px]"
              style={{ background: STATUS_COLOR[req.status], color: "white" }}
            >
              {STATUS_LABEL[req.status]}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 capitalize h-auto"
            >
              {req.urgency}
            </Badge>
          </div>
          <p>Qty: {req.quantity.toString()}</p>
          {req.description && (
            <p className="line-clamp-2 text-[10px]">{req.description}</p>
          )}
          <p className="font-mono text-[10px]">
            {req.userLocation.lat.toFixed(4)}, {req.userLocation.lng.toFixed(4)}
          </p>
        </div>

        {canClaim && (
          <Button
            size="sm"
            className="w-full h-7 text-xs"
            disabled={isClaiming}
            onClick={() => {
              onClaim(req);
              onClose();
            }}
            data-ocid="mapview.tooltip.claim_button"
          >
            {isClaiming ? "Claiming…" : "Claim Request"}
          </Button>
        )}

        {viewerRole === "admin" && (
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <Info size={10} />
            <span className="text-[10px]">Admin view</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}
