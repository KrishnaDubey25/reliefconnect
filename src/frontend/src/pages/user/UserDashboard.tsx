import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FilePlus,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { UrgencyBadge } from "../../components/shared/UrgencyBadge";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import type { NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus } from "../../types";

/** Haversine distance in km between two lat/lng points */
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

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function ProfileCard({
  userProfile,
}: {
  userProfile: NonNullable<ReturnType<typeof useAuth>["userProfile"]>;
}) {
  const { t } = useTranslation();
  return (
    <Card
      className="border-border overflow-hidden"
      data-ocid="user_dashboard.profile_card"
    >
      <div
        className="h-1.5 w-full"
        style={{ background: "oklch(var(--primary))" }}
      />
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-start gap-3 lg:gap-4">
          <div
            className="h-12 w-12 lg:h-14 lg:w-14 rounded-full flex items-center justify-center shrink-0 text-primary-foreground font-bold text-lg lg:text-xl font-display"
            style={{ background: "oklch(var(--primary))" }}
          >
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground font-display truncate lg:text-base">
              {userProfile.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
              <Phone size={11} />
              <span>{userProfile.phone}</span>
            </div>
            {userProfile.location && (
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <MapPin size={11} />
                <span>
                  {userProfile.location.lat.toFixed(4)},{" "}
                  {userProfile.location.lng.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-3" />

        {/* Verification badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">
            {t("userDashboard.verification")}
          </span>
          {userProfile.aadhaarDeclared ? (
            <Badge
              variant="outline"
              className="gap-1 text-xs"
              style={{
                color: "oklch(var(--secondary))",
                borderColor: "oklch(var(--secondary) / 0.4)",
                background: "oklch(var(--secondary) / 0.08)",
              }}
              data-ocid="user_dashboard.aadhaar_badge"
            >
              <ShieldCheck size={11} />
              {t("userDashboard.aadhaar")}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 text-xs text-muted-foreground"
              data-ocid="user_dashboard.aadhaar_unverified_badge"
            >
              <User size={11} />
              {t("userDashboard.aadhaarPending")}
            </Badge>
          )}
          {userProfile.panDeclared ? (
            <Badge
              variant="outline"
              className="gap-1 text-xs"
              style={{
                color: "oklch(var(--secondary))",
                borderColor: "oklch(var(--secondary) / 0.4)",
                background: "oklch(var(--secondary) / 0.08)",
              }}
              data-ocid="user_dashboard.pan_badge"
            >
              <ShieldCheck size={11} />
              {t("userDashboard.pan")}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 text-xs text-muted-foreground"
              data-ocid="user_dashboard.pan_unverified_badge"
            >
              <User size={11} />
              {t("userDashboard.panPending")}
            </Badge>
          )}
        </div>

        {/* Desktop: Quick action links */}
        <div className="hidden lg:flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Link to="/user/map" className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 text-xs"
              data-ocid="user_dashboard.profile_map_link"
            >
              <MapPin size={13} />
              View Map
            </Button>
          </Link>
          <Link to="/user/new-request" className="flex-1">
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs"
              data-ocid="user_dashboard.profile_request_link"
            >
              <FilePlus size={13} />
              New Request
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBand({
  requests,
}: {
  requests: ReliefRequest[] | undefined;
}) {
  const { t } = useTranslation();
  const total = requests?.length ?? 0;
  const active =
    requests?.filter(
      (r) =>
        r.status === RequestStatus.open ||
        r.status === RequestStatus.claimed ||
        r.status === RequestStatus.inTransit,
    ).length ?? 0;
  const delivered =
    requests?.filter((r) => r.status === RequestStatus.delivered).length ?? 0;

  const stats = [
    {
      label: t("userDashboard.stats.total"),
      value: total,
      icon: <FilePlus size={14} />,
      color: "text-foreground",
      ocid: "user_dashboard.stat_total",
    },
    {
      label: t("userDashboard.stats.active"),
      value: active,
      icon: <Truck size={14} />,
      color: "text-accent",
      ocid: "user_dashboard.stat_active",
    },
    {
      label: t("userDashboard.stats.delivered"),
      value: delivered,
      icon: <CheckCircle2 size={14} />,
      color: "text-secondary",
      ocid: "user_dashboard.stat_delivered",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map(({ label, value, icon, color, ocid }) => (
        <div
          key={label}
          className="bg-card border border-border rounded-xl p-3 lg:py-6 text-center space-y-1"
          data-ocid={ocid}
        >
          <p className={`text-2xl lg:text-3xl font-bold font-display ${color}`}>
            {value}
          </p>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${color} opacity-80`}
          >
            {icon}
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Prominent hero CTA — the primary way citizens access the New Request form */
function NewRequestHeroCTA() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        to="/user/new-request"
        data-ocid="user_dashboard.new_request_hero_link"
      >
        <div
          className="relative overflow-hidden rounded-2xl cursor-pointer group"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 30) 0%, oklch(0.50 0.24 20) 60%, oklch(0.45 0.20 10) 100%)",
          }}
          data-ocid="user_dashboard.new_request_hero_card"
        >
          {/* Decorative radial glow */}
          <div
            className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.20 60) 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, oklch(0.65 0.18 50) 0%, transparent 70%)",
            }}
          />

          <div className="relative px-5 py-5 lg:px-7 lg:py-6 flex items-center justify-between gap-4">
            {/* Left — icon + text */}
            <div className="flex items-center gap-4 min-w-0">
              {/* Icon bubble */}
              <div
                className="shrink-0 h-14 w-14 lg:h-16 lg:w-16 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "oklch(0.65 0.22 50 / 0.35)" }}
              >
                <Zap
                  size={28}
                  className="lg:hidden"
                  style={{ color: "oklch(0.97 0.04 60)" }}
                />
                <Zap
                  size={34}
                  className="hidden lg:block"
                  style={{ color: "oklch(0.97 0.04 60)" }}
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p
                  className="text-lg lg:text-xl font-display font-bold leading-tight"
                  style={{ color: "oklch(0.98 0.02 60)" }}
                >
                  {t("userDashboard.requestReliefNow")}
                </p>
                <p
                  className="text-xs lg:text-sm mt-1 leading-relaxed"
                  style={{ color: "oklch(0.90 0.05 40)" }}
                >
                  {t("userDashboard.resourceTypes")}
                </p>
                <p
                  className="text-xs lg:text-sm mt-0.5"
                  style={{ color: "oklch(0.82 0.06 35)" }}
                >
                  {t("userDashboard.ngoResponse")}
                </p>
              </div>
            </div>

            {/* Right — arrow button */}
            <div
              className="shrink-0 h-10 w-10 lg:h-12 lg:w-12 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:translate-x-1"
              style={{ background: "oklch(0.97 0.04 60 / 0.20)" }}
            >
              <ArrowRight
                size={20}
                className="lg:hidden"
                style={{ color: "oklch(0.97 0.04 60)" }}
              />
              <ArrowRight
                size={24}
                className="hidden lg:block"
                style={{ color: "oklch(0.97 0.04 60)" }}
              />
            </div>
          </div>

          {/* Bottom urgency strip */}
          <div
            className="px-5 lg:px-7 py-2 flex items-center gap-2 border-t"
            style={{
              borderColor: "oklch(0.97 0.04 60 / 0.15)",
              background: "oklch(0.40 0.20 15 / 0.40)",
            }}
          >
            <AlertTriangle size={12} style={{ color: "oklch(0.90 0.12 60)" }} />
            <span
              className="text-xs lg:text-sm font-medium"
              style={{ color: "oklch(0.90 0.08 55)" }}
            >
              {t("userDashboard.emergencyNote")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function RequestCard({
  req,
  index,
  ngoMap,
  distanceKm,
}: {
  req: ReliefRequest;
  index: number;
  ngoMap: Map<string, NGOProfile>;
  distanceKm?: number;
}) {
  const { t } = useTranslation();
  const createdMs = Number(req.createdAt) / 1_000_000;
  const diffMin = Math.floor((Date.now() - createdMs) / 60_000);
  const timeAgo =
    diffMin < 60
      ? `${diffMin}m ago`
      : diffMin < 1440
        ? `${Math.floor(diffMin / 60)}h ago`
        : `${Math.floor(diffMin / 1440)}d ago`;

  const ngo =
    req.claimedBy != null ? ngoMap.get(req.claimedBy.toString()) : undefined;

  const isActive =
    req.status === RequestStatus.open ||
    req.status === RequestStatus.claimed ||
    req.status === RequestStatus.inTransit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Card
        className={`border-border transition-smooth ${isActive ? "shadow-sm" : ""}`}
        data-ocid={`user_dashboard.request.item.${index}`}
      >
        <CardContent className="p-4">
          {/* Mobile layout: stacked; Desktop layout: flex row */}
          <div className="flex items-start gap-3">
            {/* Resource icon */}
            <div
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(var(--muted))" }}
            >
              <ResourceIcon type={req.resourceType} size={20} />
            </div>

            {/* Info — flex row on desktop */}
            <div className="min-w-0 flex-1 lg:flex lg:items-start lg:gap-6">
              {/* Primary info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2 lg:block">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm lg:text-base text-foreground capitalize">
                      {t(`resources.${req.resourceType}`, {
                        defaultValue:
                          req.resourceType.charAt(0).toUpperCase() +
                          req.resourceType.slice(1),
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {req.quantity.toString()} {t("userDashboard.units")} ·{" "}
                      {timeAgo}
                    </p>
                  </div>
                  {/* Badges — inline on mobile, hidden here for desktop */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0 lg:hidden">
                    <StatusBadge status={req.status} size="sm" />
                    <UrgencyBadge urgency={req.urgency} size="sm" />
                  </div>
                </div>

                {/* Distance badge */}
                {distanceKm !== undefined && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border"
                      style={{
                        background: "oklch(var(--primary) / 0.08)",
                        borderColor: "oklch(var(--primary) / 0.25)",
                        color: "oklch(var(--primary))",
                      }}
                    >
                      <MapPin size={10} />
                      <span>
                        {formatDistance(distanceKm)}{" "}
                        {t("userDashboard.unitsAway")}
                      </span>
                    </div>
                  </div>
                )}

                {/* NGO name if claimed */}
                {ngo && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Truck size={11} className="text-primary" />
                    <span className="truncate">
                      <span className="font-medium text-foreground">
                        {ngo.orgName}
                      </span>{" "}
                      {t("userDashboard.handlingRequest")}
                    </span>
                  </div>
                )}

                {/* Description */}
                {req.description && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 italic">
                    "{req.description}"
                  </p>
                )}

                {/* Delivered at */}
                {req.deliveredAt && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 size={11} className="text-secondary" />
                    <span className="text-muted-foreground">
                      {t("userDashboard.delivered")}{" "}
                      {new Date(
                        Number(req.deliveredAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Desktop: right-side badges column */}
              <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={req.status} size="sm" />
                <UrgencyBadge urgency={req.urgency} size="sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserDashboard() {
  const { actor, isFetching } = useBackend();
  const { userProfile } = useAuth();
  const { lat, lng, loading: geoLoading, permission } = useGeolocation();
  const { t } = useTranslation();

  const hasGps = lat !== null && lng !== null && lat !== 0 && lng !== 0;

  const { data: requests, isLoading: requestsLoading } = useQuery<
    ReliefRequest[]
  >({
    queryKey: ["user-requests", userProfile?.id?.toString()],
    queryFn: async () => {
      if (!actor || !userProfile) return [];
      return actor.getRequestsByUser(userProfile.id);
    },
    enabled: !!actor && !isFetching && !!userProfile,
    refetchInterval: 30_000,
  });

  // Fetch NGO profiles for any claimed requests
  const claimedNgoIds = [
    ...new Set(
      (requests ?? [])
        .filter((r) => r.claimedBy != null)
        .map((r) => r.claimedBy!.toString()),
    ),
  ];

  const { data: ngos } = useQuery<NGOProfile[]>({
    queryKey: ["ngo-profiles-for-user", claimedNgoIds.join(",")],
    queryFn: async () => {
      if (!actor || claimedNgoIds.length === 0) return [];
      const results = await Promise.all(
        claimedNgoIds.map((id) =>
          actor.getNGOProfile(BigInt(id)).catch(() => null),
        ),
      );
      return results.filter((n): n is NGOProfile => n !== null);
    },
    enabled: !!actor && claimedNgoIds.length > 0,
    staleTime: 60_000,
  });

  const ngoMap = new Map<string, NGOProfile>(
    (ngos ?? []).map((n) => [n.id.toString(), n]),
  );

  // Sort by distance when GPS available; otherwise by createdAt desc
  const sortedRequests = [...(requests ?? [])].sort((a, b) => {
    if (hasGps && a.userLocation && b.userLocation) {
      const distA = calcDistance(
        lat!,
        lng!,
        a.userLocation.lat,
        a.userLocation.lng,
      );
      const distB = calcDistance(
        lat!,
        lng!,
        b.userLocation.lat,
        b.userLocation.lng,
      );
      return distA - distB;
    }
    return Number(b.createdAt) - Number(a.createdAt);
  });

  const isLoading = requestsLoading;

  return (
    <div
      className="max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto pb-8"
      data-ocid="user_dashboard.page"
    >
      {/* Page header */}
      <div className="flex items-center justify-between pt-1 mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground leading-tight">
            {t("userDashboard.title")}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("userDashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {geoLoading && (
            <span
              className="text-xs text-muted-foreground animate-pulse hidden sm:inline"
              data-ocid="user_dashboard.geo_loading_state"
            >
              {t("app.detectingLocation")}
            </span>
          )}
          {!geoLoading && permission === "granted" && hasGps && (
            <span
              className="flex items-center gap-1.5 bg-green-900/50 text-green-400 border border-green-700 rounded-full px-3 py-1 text-xs font-medium"
              data-ocid="user_dashboard.geo_badge"
            >
              <MapPin size={11} />
              <span className="hidden sm:inline">
                {t("app.locationDetected")}
              </span>
              <span className="sm:hidden">GPS</span>
            </span>
          )}
          {/* Secondary compact shortcut — primary CTA is the hero card below */}
          <Link to="/user/new-request">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-8 lg:h-9 px-3 lg:px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              data-ocid="user_dashboard.new_request_button"
            >
              <FilePlus size={14} />
              <span className="hidden sm:inline">
                {t("userDashboard.newRequest")}
              </span>
              <span className="sm:hidden">New</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── DESKTOP TWO-COLUMN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN (lg:2/3): Hero CTA + Request list */}
        <div className="flex-1 lg:w-0 space-y-5">
          {/* Stats — mobile only (shown in right column on desktop) */}
          <div className="lg:hidden">
            {userProfile ? (
              <ProfileCard userProfile={userProfile} />
            ) : (
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="mt-5">
              <StatBand requests={requests} />
            </div>
          </div>

          {/* Hero CTA */}
          <NewRequestHeroCTA />

          {/* Request list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm lg:text-base font-semibold text-foreground">
                {t("userDashboard.allRequests")}
              </h2>
              <div className="flex items-center gap-2">
                {hasGps && !isLoading && sortedRequests.length > 0 && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} className="text-primary" />
                    {t("userDashboard.nearestFirst")}
                  </span>
                )}
                {!isLoading && sortedRequests.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {sortedRequests.length} {t("userDashboard.total")}
                  </span>
                )}
              </div>
            </div>

            {isLoading ? (
              <div
                className="space-y-3"
                data-ocid="user_dashboard.loading_state"
              >
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : sortedRequests.length > 0 ? (
              <div
                className="space-y-3"
                data-ocid="user_dashboard.request.list"
              >
                {sortedRequests.map((req, i) => {
                  const distanceKm =
                    hasGps && req.userLocation
                      ? calcDistance(
                          lat!,
                          lng!,
                          req.userLocation.lat,
                          req.userLocation.lng,
                        )
                      : undefined;
                  return (
                    <RequestCard
                      key={req.id.toString()}
                      req={req}
                      index={i + 1}
                      ngoMap={ngoMap}
                      distanceKm={distanceKm}
                    />
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-dashed border-border bg-card/50 py-14 text-center space-y-4"
                data-ocid="user_dashboard.empty_state"
              >
                <div
                  className="mx-auto h-14 w-14 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(var(--muted))" }}
                >
                  <AlertTriangle size={24} className="text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    {t("userDashboard.noRequests")}
                  </p>
                  <p className="text-xs text-muted-foreground px-8">
                    {t("userDashboard.noRequestsDesc")}
                  </p>
                </div>
                <Link to="/user/new-request">
                  <Button
                    size="sm"
                    className="gap-1.5 mt-1"
                    data-ocid="user_dashboard.empty_cta"
                  >
                    <FilePlus size={14} />
                    {t("userDashboard.submitFirst")}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (lg:1/3): Profile + Stats + Quick actions — desktop only */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 xl:w-96 gap-5 shrink-0">
          {/* Profile card */}
          {userProfile ? (
            <ProfileCard userProfile={userProfile} />
          ) : (
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <StatBand requests={requests} />

          {/* Quick actions card */}
          <Card
            className="border-border"
            data-ocid="user_dashboard.quick_actions_card"
          >
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Quick Actions
              </p>
              <Link to="/user/new-request" className="block">
                <Button
                  className="w-full gap-2 justify-start"
                  data-ocid="user_dashboard.quick_new_request_button"
                >
                  <Zap size={16} />
                  Request Relief Now
                </Button>
              </Link>
              <Link to="/user/map" className="block">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start"
                  data-ocid="user_dashboard.quick_map_button"
                >
                  <MapPin size={16} />
                  View on Map
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
