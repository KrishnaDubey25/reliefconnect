import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Phone,
  Radio,
  Shield,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { RESOURCE_TYPES } from "../../constants";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type { Inventory, ReliefRequest } from "../../types";
import { RequestStatus } from "../../types";

function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function StatCard({
  label,
  value,
  color,
  ocid,
}: {
  label: string;
  value: number;
  color: string;
  ocid: string;
}) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-3 lg:p-4 text-center"
      data-ocid={ocid}
    >
      <p className={`text-2xl lg:text-3xl font-bold font-display ${color}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
        {label}
      </p>
    </div>
  );
}

export default function NGODashboard() {
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();

  const { data: openRequests, isLoading: loadingOpen } = useQuery<
    ReliefRequest[]
  >({
    queryKey: ["open-requests"],
    queryFn: async () => (actor ? actor.getOpenRequests() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const { data: myRequests, isLoading: loadingMine } = useQuery<
    ReliefRequest[]
  >({
    queryKey: ["ngo-requests", ngoProfile?.id?.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getRequestsByNGO(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile,
    refetchInterval: 30_000,
  });

  const { data: inventory, isLoading: loadingInv } = useQuery<Inventory[]>({
    queryKey: ["ngo-inventory", ngoProfile?.id?.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getNGOInventory(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile,
  });

  const activeRequests =
    myRequests?.filter(
      (r) =>
        r.status === RequestStatus.claimed ||
        r.status === RequestStatus.inTransit,
    ) ?? [];

  const totalInventoryUnits =
    inventory?.reduce((sum, inv) => sum + Number(inv.quantity), 0) ?? 0;

  const nearbyCount = openRequests
    ? ngoProfile
      ? openRequests.filter((r) => {
          const dist = calcDistance(
            ngoProfile.location.lat,
            ngoProfile.location.lng,
            r.userLocation.lat,
            r.userLocation.lng,
          );
          return dist <= ngoProfile.serviceRadius;
        }).length
      : openRequests.length
    : 0;

  const inventoryMap = new Map(
    inventory?.map((inv) => [inv.resourceType, inv]),
  );

  const isLoading = loadingOpen || loadingMine || loadingInv;

  return (
    <div
      className="space-y-6 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto pb-8"
      data-ocid="ngo_dashboard.page"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold leading-tight">
            {t("ngoDashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("ngoDashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {geoLoading && (
            <span
              className="text-xs text-muted-foreground animate-pulse"
              data-ocid="ngo_dashboard.geo_loading_state"
            >
              {t("app.detectingLocation")}
            </span>
          )}
          {!geoLoading &&
            permission === "granted" &&
            lat !== null &&
            lng !== null && (
              <span
                className="flex items-center gap-1.5 bg-green-900/50 text-green-400 border border-green-700 rounded-full px-3 py-1 text-xs font-medium"
                data-ocid="ngo_dashboard.geo_badge"
              >
                <MapPin size={11} />
                {t("app.locationDetected")}
              </span>
            )}
          <Badge
            variant="outline"
            className="gap-1.5 text-secondary border-secondary/30 bg-secondary/5"
          >
            <Radio size={10} className="animate-pulse" />
            {t("ngoDashboard.live")}
          </Badge>
        </div>
      </div>

      {/* Desktop two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Profile, Stats, Nav cards */}
        <div className="lg:w-1/3 space-y-5">
          {/* Profile Card */}
          {ngoProfile ? (
            <Card
              className="border-border bg-card"
              data-ocid="ngo_dashboard.profile_card"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Shield size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-base leading-tight truncate">
                      {ngoProfile.orgName}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={11} />
                        {ngoProfile.location.lat.toFixed(3)},{" "}
                        {ngoProfile.location.lng.toFixed(3)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Radio size={11} />
                        {t("ngoDashboard.kmRadius", {
                          radius: ngoProfile.serviceRadius,
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone size={11} />
                        {ngoProfile.contactPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Skeleton className="h-20 w-full rounded-xl" />
          )}

          {/* Stats */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div
              className="grid grid-cols-3 gap-3 lg:gap-4"
              data-ocid="ngo_dashboard.stats_section"
            >
              <StatCard
                label={t("ngoDashboard.stats.nearbyOpen")}
                value={nearbyCount}
                color="text-accent"
                ocid="ngo_dashboard.stat_open"
              />
              <StatCard
                label={t("ngoDashboard.stats.active")}
                value={activeRequests.length}
                color="text-chart-2"
                ocid="ngo_dashboard.stat_active"
              />
              <StatCard
                label={t("ngoDashboard.stats.inventoryUnits")}
                value={totalInventoryUnits}
                color="text-primary"
                ocid="ngo_dashboard.stat_inventory"
              />
            </div>
          )}

          {/* Nav Link Cards — 2×2 grid on desktop */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
            data-ocid="ngo_dashboard.nav_section"
          >
            <Link to="/ngo/requests" data-ocid="ngo_dashboard.requests_link">
              <Card className="border-border bg-card hover:bg-muted/30 transition-smooth group h-full">
                <CardContent className="p-4 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={20} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {t("ngoDashboard.requests")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {t("ngoDashboard.requestsDesc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 lg:mt-auto lg:self-end">
                    {nearbyCount > 0 && (
                      <Badge className="bg-accent/10 text-accent border-accent/20 border text-xs px-2">
                        {nearbyCount} {t("ngoDashboard.open")}
                      </Badge>
                    )}
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/ngo/inventory" data-ocid="ngo_dashboard.inventory_link">
              <Card className="border-border bg-card hover:bg-muted/30 transition-smooth group h-full">
                <CardContent className="p-4 flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Box size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">
                      {t("ngoDashboard.inventory")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {t("ngoDashboard.inventoryDesc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 lg:mt-auto lg:self-end">
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Inventory Quick View — only on left column (desktop) */}
          <div
            className="space-y-3"
            data-ocid="ngo_dashboard.inventory_section"
          >
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Box size={14} className="text-primary" />
              {t("ngoDashboard.stockOverview")}
            </h2>
            {loadingInv ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {RESOURCE_TYPES.map((rt, i) => {
                  const inv = inventoryMap.get(rt.value);
                  const qty = inv ? Number(inv.quantity) : 0;
                  return (
                    <div
                      key={rt.value}
                      className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                      data-ocid={`ngo_dashboard.stock_item.${i + 1}`}
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ResourceIcon type={rt.value} size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          {t(rt.labelKey)}
                        </p>
                        <p
                          className={`text-lg font-bold ${qty === 0 ? "text-accent" : "text-foreground"}`}
                        >
                          {qty}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Active requests + recent activity */}
        <div className="lg:w-2/3 space-y-5">
          {/* Active Requests Preview */}
          <div className="space-y-3" data-ocid="ngo_dashboard.active_section">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList size={14} className="text-primary" />
                {t("ngoDashboard.activeTasks")}
                {activeRequests.length > 0 && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs px-2">
                    {activeRequests.length}
                  </Badge>
                )}
              </h2>
              {activeRequests.length > 0 && (
                <Link to="/ngo/requests">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 gap-1"
                  >
                    View All <ArrowRight size={12} />
                  </Button>
                </Link>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : activeRequests.length > 0 ? (
              <div className="space-y-3">
                {activeRequests.slice(0, 5).map((req, i) => {
                  const dist = ngoProfile
                    ? calcDistance(
                        ngoProfile.location.lat,
                        ngoProfile.location.lng,
                        req.userLocation.lat,
                        req.userLocation.lng,
                      ).toFixed(1)
                    : null;
                  return (
                    <div
                      key={req.id.toString()}
                      className="flex items-center gap-3 p-3 lg:p-4 bg-card border border-border rounded-xl"
                      data-ocid={`ngo_dashboard.active_item.${i + 1}`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ResourceIcon type={req.resourceType} size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize truncate">
                          {req.resourceType} Aid
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dist
                            ? t("ngoDashboard.awayKm", { dist })
                            : t("ngoDashboard.locationUnknown")}{" "}
                          ·{" "}
                          <span className="capitalize">
                            {req.status.replace("inTransit", "In Transit")}
                          </span>
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {req.status === RequestStatus.inTransit && (
                          <CheckCircle2 size={16} className="text-secondary" />
                        )}
                        <Badge
                          variant="outline"
                          className="text-xs capitalize hidden lg:inline-flex"
                        >
                          {req.status.replace("inTransit", "In Transit")}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {activeRequests.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {t("ngoDashboard.moreTasks", {
                      count: activeRequests.length - 5,
                    })}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl bg-muted/20 border border-border space-y-2">
                <CheckCircle2
                  size={28}
                  className="mx-auto text-muted-foreground opacity-40"
                />
                <p className="text-sm text-muted-foreground">
                  No active tasks right now
                </p>
                <Link to="/ngo/requests">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-1.5 text-xs"
                  >
                    <ClipboardList size={13} />
                    Browse open requests
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Open requests summary on desktop */}
          <div className="space-y-3 hidden lg:block">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <MapPin size={14} className="text-accent" />
                Nearby Open Requests
                {nearbyCount > 0 && (
                  <Badge className="bg-accent/10 text-accent border-accent/20 border text-xs px-2">
                    {nearbyCount}
                  </Badge>
                )}
              </h2>
              <Link to="/ngo/requests">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  View All <ArrowRight size={12} />
                </Button>
              </Link>
            </div>

            {loadingOpen ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : (openRequests ?? []).length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {(openRequests ?? []).slice(0, 4).map((req, i) => {
                  const dist = ngoProfile
                    ? calcDistance(
                        ngoProfile.location.lat,
                        ngoProfile.location.lng,
                        req.userLocation.lat,
                        req.userLocation.lng,
                      ).toFixed(1)
                    : null;
                  return (
                    <div
                      key={req.id.toString()}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
                      data-ocid={`ngo_dashboard.open_item.${i + 1}`}
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ResourceIcon type={req.resourceType} size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium capitalize truncate">
                          {req.resourceType} Aid
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dist ? `${dist} km away` : "Location unknown"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">
                  No open requests in your area
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
