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
      className="bg-card border border-border rounded-xl p-3 text-center"
      data-ocid={ocid}
    >
      <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
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
      className="space-y-6 max-w-2xl mx-auto pb-8"
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
          className="grid grid-cols-3 gap-3"
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

      {/* Active Requests Preview */}
      {activeRequests.length > 0 && (
        <div className="space-y-3" data-ocid="ngo_dashboard.active_section">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <ClipboardList size={14} className="text-primary" />
            {t("ngoDashboard.activeTasks")}
          </h2>
          {activeRequests.slice(0, 3).map((req, i) => {
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
                {req.status === RequestStatus.inTransit && (
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                )}
              </div>
            );
          })}
          {activeRequests.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              {t("ngoDashboard.moreTasks", {
                count: activeRequests.length - 3,
              })}
            </p>
          )}
        </div>
      )}

      {/* Nav Link Cards */}
      <div
        className="grid grid-cols-1 gap-3"
        data-ocid="ngo_dashboard.nav_section"
      >
        <Link to="/ngo/requests" data-ocid="ngo_dashboard.requests_link">
          <Card className="border-border bg-card hover:bg-muted/30 transition-smooth group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <ClipboardList size={20} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">
                  {t("ngoDashboard.requests")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("ngoDashboard.requestsDesc")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
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
          <Card className="border-border bg-card hover:bg-muted/30 transition-smooth group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Box size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">
                  {t("ngoDashboard.inventory")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("ngoDashboard.inventoryDesc")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ArrowRight
                  size={16}
                  className="text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Inventory Quick View */}
      <div className="space-y-3" data-ocid="ngo_dashboard.inventory_section">
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
  );
}
