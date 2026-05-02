import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Activity, MapPin, RefreshCw, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapView,
  type NGOPin,
  type RequestPin,
} from "../../components/shared/MapView";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { REQUEST_STATUSES, RESOURCE_TYPES } from "../../constants";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type { NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus, type ResourceType } from "../../types";

export default function AdminMapPage() {
  const { actor, isFetching } = useBackend();
  const geo = useGeolocation();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");

  const {
    data: requests,
    isLoading: loadingReq,
    refetch,
    dataUpdatedAt,
  } = useQuery<ReliefRequest[]>({
    queryKey: ["all-requests-admin-map"],
    queryFn: async () => (actor ? actor.getAllRequestsForAdmin() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  const { data: ngos, isLoading: loadingNGO } = useQuery<NGOProfile[]>({
    queryKey: ["all-ngos-admin-map"],
    queryFn: async () => (actor ? actor.getAllNGOs() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  const mapCenter = useMemo(() => {
    if (!geo.loading && geo.lat !== null && geo.lng !== null) {
      return { lat: geo.lat, lng: geo.lng };
    }
    if (ngos && ngos.length > 0) {
      return { lat: ngos[0].location.lat, lng: ngos[0].location.lng };
    }
    if (requests && requests.length > 0) {
      return {
        lat: requests[0].userLocation.lat,
        lng: requests[0].userLocation.lng,
      };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [geo.loading, geo.lat, geo.lng, ngos, requests]);

  const filteredRequests = useMemo(
    () =>
      (requests ?? []).filter(
        (r) =>
          (statusFilter === "all" || r.status === statusFilter) &&
          (typeFilter === "all" || r.resourceType === typeFilter),
      ),
    [requests, statusFilter, typeFilter],
  );

  const requestPins: RequestPin[] = useMemo(
    () =>
      filteredRequests.map((r) => ({
        request: r,
        colorMode: "status" as const,
      })),
    [filteredRequests],
  );

  const ngoPins: NGOPin[] = useMemo(
    () => (ngos ?? []).map((ngo) => ({ ngo, showRadius: true })),
    [ngos],
  );

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const counts = useMemo(() => {
    const all = requests ?? [];
    return {
      total: all.length,
      open: all.filter((r) => r.status === RequestStatus.open).length,
      claimed: all.filter((r) => r.status === RequestStatus.claimed).length,
      inTransit: all.filter((r) => r.status === RequestStatus.inTransit).length,
      delivered: all.filter((r) => r.status === RequestStatus.delivered).length,
    };
  }, [requests]);

  return (
    <div className="space-y-5" data-ocid="admin_map.page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-display font-bold">
            {t("nav.admin.map")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All requests and NGO locations — refreshes every 60s
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              Updated {lastUpdated}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => refetch()}
            data-ocid="admin_map.refresh_button"
          >
            <RefreshCw size={12} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats overlay row — flex on lg for full-row display */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 lg:flex lg:flex-wrap lg:gap-3">
        {[
          {
            label: t("adminAnalytics.totalRequests"),
            value: counts.total,
            color: "bg-foreground/10",
          },
          {
            label: t("adminDashboard.stats.openRequests"),
            value: counts.open,
            color: "bg-accent/10 text-accent",
          },
          {
            label: t("adminDashboard.stats.claimed"),
            value: counts.claimed,
            color: "",
          },
          {
            label: t("adminDashboard.stats.inTransit"),
            value: counts.inTransit,
            color: "",
          },
          {
            label: t("adminDashboard.stats.delivered"),
            value: counts.delivered,
            color: "bg-secondary/10 text-secondary",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-lg border border-border px-3 py-2 text-center lg:flex-1 lg:min-w-[8rem] ${s.color || "bg-card"}`}
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold font-display">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter controls */}
      <div
        className="flex items-center gap-2 flex-wrap"
        data-ocid="admin_map.filters"
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
          <Activity size={12} />
          <span>Filters:</span>
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as RequestStatus | "all")}
        >
          <SelectTrigger
            className="h-8 text-xs w-36"
            data-ocid="admin_map.status_filter.select"
          >
            <SelectValue placeholder={t("adminRequests.filterAll")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("adminRequests.filterAll")}</SelectItem>
            {REQUEST_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {t(s.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as ResourceType | "all")}
        >
          <SelectTrigger
            className="h-8 text-xs w-36"
            data-ocid="admin_map.type_filter.select"
          >
            <SelectValue placeholder={t("adminRequests.filterAll")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("adminRequests.filterAll")}</SelectItem>
            {RESOURCE_TYPES.map((tt) => (
              <SelectItem key={tt.value} value={tt.value}>
                {tt.icon} {t(tt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="outline" className="text-xs ml-auto">
          {filteredRequests.length} / {counts.total} shown
        </Badge>
      </div>

      {/* Map — taller on desktop */}
      {loadingReq || loadingNGO ? (
        <Skeleton className="w-full rounded-xl" style={{ height: 460 }} />
      ) : (
        <MapView
          center={mapCenter}
          zoom={11}
          requestPins={requestPins}
          ngoPins={ngoPins}
          viewerRole="admin"
          height="460px"
          showLegend
        />
      )}

      {/* Two-column list: requests + NGOs — lg:gap-8 */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
        {/* Requests list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <MapPin size={13} className="text-muted-foreground" />
              {t("adminRequests.title")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {filteredRequests.length} total
            </span>
          </div>

          {loadingReq ? (
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-1.5 max-h-72 lg:max-h-96 overflow-y-auto pr-1">
              {filteredRequests.map((req, i) => (
                <div
                  key={req.id.toString()}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card border border-border"
                  data-ocid={`admin_map.request.item.${i + 1}`}
                >
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <ResourceIcon type={req.resourceType} size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium capitalize truncate">
                      {req.resourceType} Aid
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      {req.userLocation.lat.toFixed(3)},{" "}
                      {req.userLocation.lng.toFixed(3)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 rounded-lg bg-muted/30 border border-border"
              data-ocid="admin_map.requests.empty_state"
            >
              <p className="text-xs text-muted-foreground">
                {t("adminRequests.noRequests")}
              </p>
            </div>
          )}
        </div>

        {/* NGO list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Users size={13} className="text-muted-foreground" />
              {t("adminNGOs.title")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {ngos?.length ?? 0} registered
            </span>
          </div>

          {loadingNGO ? (
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : ngos && ngos.length > 0 ? (
            <div className="space-y-1.5 max-h-72 lg:max-h-96 overflow-y-auto pr-1">
              {ngos.map((ngo, i) => (
                <div
                  key={ngo.id.toString()}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card border border-border"
                  data-ocid={`admin_map.ngo.item.${i + 1}`}
                >
                  <div className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 bg-primary text-primary-foreground">
                    {ngo.orgName.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {ngo.orgName}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">
                      {ngo.location.lat.toFixed(3)},{" "}
                      {ngo.location.lng.toFixed(3)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 shrink-0"
                  >
                    {ngo.serviceRadius}km
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 rounded-lg bg-muted/30 border border-border"
              data-ocid="admin_map.ngos.empty_state"
            >
              <p className="text-xs text-muted-foreground">
                {t("adminNGOs.noNGOs")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
