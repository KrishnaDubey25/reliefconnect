import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AlertCircle, MapPin, PlusCircle, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MapView,
  type NGOPin,
  type RequestPin,
} from "../../components/shared/MapView";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type { NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus } from "../../types";

const STATUS_PIN_CLASS: Record<RequestStatus, string> = {
  [RequestStatus.open]: "bg-accent",
  [RequestStatus.claimed]: "bg-chart-2",
  [RequestStatus.inTransit]: "bg-chart-2",
  [RequestStatus.delivered]: "bg-secondary",
};

export default function UserMapPage() {
  const { actor, isFetching } = useBackend();
  const { userProfile } = useAuth();
  const { t } = useTranslation();

  const {
    data: requests,
    isLoading: loadingReq,
    refetch,
    dataUpdatedAt,
  } = useQuery<ReliefRequest[]>({
    queryKey: ["user-requests-map", userProfile?.id?.toString()],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getRequestsByUser(userProfile.id);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 60_000,
  });

  const { data: nearbyNGOs, isLoading: loadingNGO } = useQuery<NGOProfile[]>({
    queryKey: [
      "nearby-ngos-map",
      userProfile?.location.lat,
      userProfile?.location.lng,
    ],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getNearbyNGOs(userProfile.location, 50);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 60_000,
  });

  const geo = useGeolocation();

  const center = useMemo(
    () => ({
      lat:
        !geo.loading && geo.lat !== null
          ? geo.lat
          : (userProfile?.location.lat ?? 20.5937),
      lng:
        !geo.loading && geo.lng !== null
          ? geo.lng
          : (userProfile?.location.lng ?? 78.9629),
    }),
    [
      geo.loading,
      geo.lat,
      geo.lng,
      userProfile?.location.lat,
      userProfile?.location.lng,
    ],
  );

  const requestPins: RequestPin[] = useMemo(
    () =>
      (requests ?? []).map((r) => ({
        request: r,
        colorMode: "status" as const,
      })),
    [requests],
  );

  const ngoPins: NGOPin[] = useMemo(
    () =>
      (nearbyNGOs ?? []).map((ngo) => ({
        ngo,
        showRadius: false,
      })),
    [nearbyNGOs],
  );

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const activeRequests =
    requests?.filter((r) => r.status !== RequestStatus.delivered) ?? [];

  const statChips = [
    {
      label: t("adminDashboard.stats.openRequests"),
      count: activeRequests.length,
      dot: "bg-accent",
    },
    {
      label: t("adminNGOs.title"),
      count: nearbyNGOs?.length ?? 0,
      dot: "bg-primary",
    },
    {
      label: t("userDashboard.stats.delivered"),
      count:
        requests?.filter((r) => r.status === RequestStatus.delivered).length ??
        0,
      dot: "bg-secondary",
    },
  ];

  return (
    <div
      className="max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto"
      data-ocid="user_map.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold">
            {t("shared.map")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("nav.citizen.map")}
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
            data-ocid="user_map.refresh_button"
          >
            <RefreshCw size={12} />
            Refresh
          </Button>
          <Link to="/user/new-request">
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              data-ocid="user_map.header_new_request_button"
            >
              <PlusCircle size={12} />
              <span className="hidden sm:inline">
                {t("userDashboard.newRequest")}
              </span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* No location fallback */}
      {!geo.lat && !geo.lng && !userProfile?.location ? (
        <div
          className="rounded-xl border border-border bg-muted/40 flex flex-col items-center justify-center gap-3 p-8 text-center"
          data-ocid="user_map.no_location_state"
          style={{ height: 300 }}
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
        /* Desktop: Map + Legend/List side by side */
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Map — full width on mobile, 2/3 on desktop */}
          <div className="flex-1 min-w-0">
            <MapView
              center={center}
              zoom={13}
              requestPins={requestPins}
              ngoPins={ngoPins}
              viewerRole="user"
              height="380px"
              showLegend={false}
            />

            {/* Stat chips below map on mobile */}
            <div className="grid grid-cols-3 gap-2 mt-3 lg:hidden">
              {statChips.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-card border border-border px-3 py-2.5 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
                    <span className="text-[10px] text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold font-display">{stat.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop sidebar: stats + legend + request list */}
          <div className="hidden lg:flex lg:flex-col lg:w-72 xl:w-80 shrink-0 gap-4">
            {/* Stat chips */}
            <div className="grid grid-cols-3 gap-2">
              {statChips.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-card border border-border px-2 py-2.5 text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span className={`w-2 h-2 rounded-full ${stat.dot}`} />
                    <span className="text-[9px] text-muted-foreground leading-tight">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-lg font-bold font-display">{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Map legend */}
            <div
              className="rounded-xl bg-card border border-border p-3"
              data-ocid="user_map.legend_panel"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Legend
              </p>
              <div className="space-y-1.5">
                {[
                  { color: "bg-accent", label: "Open Request" },
                  { color: "bg-chart-2", label: "In Progress" },
                  { color: "bg-secondary", label: "Delivered" },
                  { color: "bg-primary", label: "NGO Location" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}
                    />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request list */}
            <div className="flex-1 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  {t("userDashboard.allRequests")}
                </h2>
              </div>

              {loadingReq || loadingNGO ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : requests && requests.length > 0 ? (
                <div className="space-y-2" data-ocid="user_map.request.list">
                  {requests.map((req, i) => (
                    <div
                      key={req.id.toString()}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                      data-ocid={`user_map.request.item.${i + 1}`}
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${STATUS_PIN_CLASS[req.status]}/10`}
                      >
                        <ResourceIcon type={req.resourceType} size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">
                          {req.resourceType} Aid
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={10} />
                          <span className="font-mono">
                            {req.userLocation.lat.toFixed(3)},{" "}
                            {req.userLocation.lng.toFixed(3)}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-8 rounded-xl bg-muted/30 border border-border"
                  data-ocid="user_map.empty_state"
                >
                  <MapPin
                    size={24}
                    className="mx-auto text-muted-foreground mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("userDashboard.noRequests")}
                  </p>
                  <Link to="/user/new-request">
                    <Button
                      size="sm"
                      className="mt-3 gap-1.5 text-xs"
                      data-ocid="user_map.create_first_button"
                    >
                      <PlusCircle size={12} />
                      {t("userDashboard.submitFirst")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile: request list below map */}
      <div className="space-y-2 mt-5 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {t("userDashboard.allRequests")}
          </h2>
          <Link to="/user/new-request">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs text-primary"
              data-ocid="user_map.new_request_button"
            >
              <PlusCircle size={12} />
              {t("userDashboard.newRequest")}
            </Button>
          </Link>
        </div>

        {loadingReq || loadingNGO ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-2">
            {requests.map((req, i) => (
              <div
                key={req.id.toString()}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                data-ocid={`user_map.request.item.${i + 1}`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${STATUS_PIN_CLASS[req.status]}/10`}
                >
                  <ResourceIcon type={req.resourceType} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">
                    {req.resourceType} Aid
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={10} />
                    <span className="font-mono">
                      {req.userLocation.lat.toFixed(3)},{" "}
                      {req.userLocation.lng.toFixed(3)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={req.status} size="sm" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-10 rounded-xl bg-muted/30 border border-border"
            data-ocid="user_map.mobile_empty_state"
          >
            <MapPin size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t("userDashboard.noRequests")}
            </p>
            <Link to="/user/new-request">
              <Button
                size="sm"
                className="mt-3 gap-1.5 text-xs"
                data-ocid="user_map.mobile_create_first_button"
              >
                <PlusCircle size={12} />
                {t("userDashboard.submitFirst")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
