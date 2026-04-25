import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Filter,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  MapView,
  type NGOPin,
  type RequestPin,
} from "../../components/shared/MapView";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { UrgencyBadge } from "../../components/shared/UrgencyBadge";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type { NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus, UrgencyLevel } from "../../types";

const URGENCY_ORDER: Record<UrgencyLevel, number> = {
  [UrgencyLevel.high]: 0,
  [UrgencyLevel.medium]: 1,
  [UrgencyLevel.low]: 2,
};

export default function NGOMapPage() {
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "all">(
    "all",
  );

  const {
    data: requests,
    isLoading: loadingReq,
    refetch,
    dataUpdatedAt,
  } = useQuery<ReliefRequest[]>({
    queryKey: ["open-requests-ngo-map"],
    queryFn: async () => (actor ? actor.getOpenRequests() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  const { data: allNGOs, isLoading: loadingNGO } = useQuery<NGOProfile[]>({
    queryKey: ["all-ngos-ngo-map"],
    queryFn: async () => (actor ? actor.getAllNGOs() : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });

  const claimMutation = useMutation({
    mutationFn: (id: bigint) => actor!.claimRequest(id),
    onSuccess: () => {
      toast.success(t("ngoRequests.claimSuccess"));
      queryClient.invalidateQueries({ queryKey: ["open-requests-ngo-map"] });
      queryClient.invalidateQueries({ queryKey: ["open-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-claimed"] });
    },
    onError: () => toast.error(t("ngoRequests.errorClaim")),
  });

  const geo = useGeolocation();

  const center = useMemo(
    () => ({
      lat:
        !geo.loading && geo.lat !== null
          ? geo.lat
          : (ngoProfile?.location.lat ?? 20.5937),
      lng:
        !geo.loading && geo.lng !== null
          ? geo.lng
          : (ngoProfile?.location.lng ?? 78.9629),
    }),
    [
      geo.loading,
      geo.lat,
      geo.lng,
      ngoProfile?.location.lat,
      ngoProfile?.location.lng,
    ],
  );

  const filteredRequests = useMemo(
    () =>
      (requests ?? [])
        .filter((r) => urgencyFilter === "all" || r.urgency === urgencyFilter)
        .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]),
    [requests, urgencyFilter],
  );

  const requestPins: RequestPin[] = useMemo(
    () =>
      filteredRequests.map((r) => ({
        request: r,
        colorMode: "urgency" as const,
      })),
    [filteredRequests],
  );

  const ngoPins: NGOPin[] = useMemo(
    () => (allNGOs ?? []).map((ngo) => ({ ngo, showRadius: true })),
    [allNGOs],
  );

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const urgencyCounts = useMemo(() => {
    const all = requests ?? [];
    return {
      high: all.filter((r) => r.urgency === UrgencyLevel.high).length,
      medium: all.filter((r) => r.urgency === UrgencyLevel.medium).length,
      low: all.filter((r) => r.urgency === UrgencyLevel.low).length,
    };
  }, [requests]);

  return (
    <div className="space-y-5 max-w-2xl mx-auto" data-ocid="ngo_map.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold">{t("shared.map")}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("nav.ngo.map")}
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
            data-ocid="ngo_map.refresh_button"
          >
            <RefreshCw size={12} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Urgency summary chips */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            level: UrgencyLevel.high,
            label: t("urgency.high"),
            count: urgencyCounts.high,
            color: "oklch(0.58 0.24 30)",
          },
          {
            level: UrgencyLevel.medium,
            label: t("urgency.medium"),
            count: urgencyCounts.medium,
            color: "oklch(0.72 0.19 62)",
          },
          {
            level: UrgencyLevel.low,
            label: t("urgency.low"),
            count: urgencyCounts.low,
            color: "oklch(0.68 0.21 151)",
          },
        ].map((item) => (
          <button
            type="button"
            key={item.level}
            className={`rounded-lg border px-3 py-2.5 text-center transition-smooth cursor-pointer ${
              urgencyFilter === item.level
                ? "border-border bg-card shadow-sm"
                : "border-transparent bg-muted/40 hover:bg-muted/70"
            }`}
            onClick={() =>
              setUrgencyFilter((f) => (f === item.level ? "all" : item.level))
            }
            data-ocid={`ngo_map.filter.${item.level}`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {item.label}
              </span>
            </div>
            <p className="text-lg font-bold font-display">{item.count}</p>
          </button>
        ))}
      </div>

      {/* Map */}
      {!geo.lat && !geo.lng && !ngoProfile?.location ? (
        <div
          className="rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center gap-3 p-8 text-center"
          data-ocid="ngo_map.no_location_state"
          style={{ height: 380 }}
        >
          <AlertCircle size={28} className="text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">
              {t("shared.locationPermission.title")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("shared.locationPermission.desc")}
            </p>
          </div>
        </div>
      ) : (
        <MapView
          center={center}
          zoom={12}
          requestPins={requestPins}
          ngoPins={ngoPins}
          viewerRole="ngo"
          onClaimRequest={(req) => claimMutation.mutate(req.id)}
          claimingId={claimMutation.isPending ? claimMutation.variables : null}
          height="420px"
          showLegend
        />
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Filter size={12} />
          <span>{t("adminRequests.filterAll")}:</span>
        </div>
        {(
          [
            "all",
            UrgencyLevel.high,
            UrgencyLevel.medium,
            UrgencyLevel.low,
          ] as const
        ).map((f) => (
          <button
            type="button"
            key={f}
            className={`text-xs px-3 py-1 rounded-full border transition-smooth capitalize ${
              urgencyFilter === f
                ? "bg-foreground text-background border-foreground"
                : "bg-muted/50 border-border text-foreground hover:bg-muted"
            }`}
            onClick={() => setUrgencyFilter(f)}
            data-ocid={`ngo_map.urgency_filter.${f}`}
          >
            {f === "all" ? t("adminRequests.filterAll") : t(`urgency.${f}`)}
          </button>
        ))}
        <Badge variant="outline" className="ml-auto text-xs">
          {filteredRequests.length} shown
        </Badge>
      </div>

      {/* Request list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">{t("ngoRequests.tabOpen")}</h2>

        {loadingReq || loadingNGO ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-2">
            {filteredRequests.map((req, i) => (
              <div
                key={req.id.toString()}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                data-ocid={`ngo_map.request.item.${i + 1}`}
              >
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ResourceIcon type={req.resourceType} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium capitalize">
                      {req.resourceType} Aid
                    </p>
                    <UrgencyBadge urgency={req.urgency} size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={10} />
                    <span className="font-mono">
                      {req.userLocation.lat.toFixed(3)},{" "}
                      {req.userLocation.lng.toFixed(3)}
                    </span>
                    <span>· Qty {req.quantity.toString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={req.status} size="sm" />
                  {req.status === RequestStatus.open && ngoProfile && (
                    <Button
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      disabled={claimMutation.isPending}
                      onClick={() => claimMutation.mutate(req.id)}
                      data-ocid={`ngo_map.claim_button.${i + 1}`}
                    >
                      <CheckCircle size={11} />
                      {t("ngoRequests.claim")}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-10 rounded-xl bg-muted/30 border border-border"
            data-ocid="ngo_map.empty_state"
          >
            <MapPin size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {urgencyFilter !== "all"
                ? `No ${t(`urgency.${urgencyFilter}`)} urgency requests`
                : t("ngoRequests.noOpen")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
