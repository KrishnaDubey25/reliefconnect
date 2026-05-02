import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Radio,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { UrgencyBadge } from "../../components/shared/UrgencyBadge";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import type { NGOProfile, ReliefRequest, UserProfile } from "../../types";
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

function formatTime(
  ts: bigint,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return t("ngoRequests.timeJustNow");
  if (diff < 3_600_000)
    return t("ngoRequests.timeMinAgo", { n: Math.floor(diff / 60_000) });
  if (diff < 86_400_000)
    return t("ngoRequests.timeHourAgo", { n: Math.floor(diff / 3_600_000) });
  return t("ngoRequests.timeDayAgo", { n: Math.floor(diff / 86_400_000) });
}

interface RequestCardProps {
  req: ReliefRequest;
  index: number;
  ngoProfile: NGOProfile;
  mode: "open" | "active";
  userProfiles: Map<string, UserProfile>;
  onClaim?: (req: ReliefRequest) => void;
  onUpdateStatus?: (req: ReliefRequest, next: RequestStatus) => void;
  isPendingClaim?: boolean;
  isPendingUpdate?: boolean;
  isSelected?: boolean;
  onSelect?: (req: ReliefRequest) => void;
}

function RequestCard({
  req,
  index,
  ngoProfile,
  mode,
  userProfiles,
  onClaim,
  onUpdateStatus,
  isPendingClaim,
  isPendingUpdate,
  isSelected,
  onSelect,
}: RequestCardProps) {
  const { t } = useTranslation();
  const dist = calcDistance(
    ngoProfile.location.lat,
    ngoProfile.location.lng,
    req.userLocation.lat,
    req.userLocation.lng,
  );
  const user = userProfiles.get(req.userId.toString());

  return (
    <Card
      className={`border-border bg-card cursor-pointer transition-smooth ${isSelected ? "ring-2 ring-primary" : "hover:bg-muted/20"}`}
      data-ocid={`ngo_requests.item.${index}`}
      onClick={() => onSelect?.(req)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <ResourceIcon type={req.resourceType} size={19} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm capitalize leading-tight">
                {req.resourceType} Aid
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Qty: {req.quantity.toString()} · {formatTime(req.createdAt, t)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <StatusBadge status={req.status} size="sm" />
            <UrgencyBadge urgency={req.urgency} size="sm" />
          </div>
        </div>

        {/* Description */}
        {req.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/30 rounded-lg px-2.5 py-1.5">
            {req.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={11} />
            {t("ngoRequests.kmAway", { km: dist.toFixed(1) })}
          </span>
          {user && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone size={11} />
              {user.phone}
            </span>
          )}
        </div>

        {/* Actions — shown inline on mobile, hidden on desktop (sidebar handles it) */}
        <div className="lg:hidden">
          {mode === "open" && (
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onClaim?.(req);
              }}
              disabled={isPendingClaim}
              data-ocid={`ngo_requests.claim_button.${index}`}
            >
              <ChevronRight size={14} />
              {isPendingClaim
                ? t("ngoRequests.claiming")
                : t("ngoRequests.claim")}
            </Button>
          )}

          {mode === "active" && req.status === RequestStatus.claimed && (
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus?.(req, RequestStatus.inTransit);
              }}
              disabled={isPendingUpdate}
              data-ocid={`ngo_requests.transit_button.${index}`}
            >
              <Truck size={14} />
              {isPendingUpdate
                ? t("ngoRequests.saving")
                : t("ngoRequests.markInTransit")}
            </Button>
          )}

          {mode === "active" && req.status === RequestStatus.inTransit && (
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus?.(req, RequestStatus.delivered);
              }}
              disabled={isPendingUpdate}
              data-ocid={`ngo_requests.deliver_button.${index}`}
            >
              <CheckCircle2 size={14} />
              {isPendingUpdate
                ? t("ngoRequests.saving")
                : t("ngoRequests.markDelivered")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ActionSidebarProps {
  req: ReliefRequest;
  mode: "open" | "active";
  ngoProfile: NGOProfile;
  userProfiles: Map<string, UserProfile>;
  onClose: () => void;
  onClaim?: (req: ReliefRequest) => void;
  onUpdateStatus?: (req: ReliefRequest, next: RequestStatus) => void;
  isPendingClaim?: boolean;
  isPendingUpdate?: boolean;
}

function ActionSidebar({
  req,
  mode,
  ngoProfile,
  userProfiles,
  onClose,
  onClaim,
  onUpdateStatus,
  isPendingClaim,
  isPendingUpdate,
}: ActionSidebarProps) {
  const { t } = useTranslation();
  const dist = calcDistance(
    ngoProfile.location.lat,
    ngoProfile.location.lng,
    req.userLocation.lat,
    req.userLocation.lng,
  );
  const user = userProfiles.get(req.userId.toString());

  return (
    <div
      className="lg:w-80 shrink-0 bg-card border border-border rounded-xl p-5 space-y-4 self-start sticky top-4"
      data-ocid="ngo_requests.action_sidebar"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Request Details</h3>
        <button
          type="button"
          onClick={onClose}
          className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="ngo_requests.sidebar_close_button"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <ResourceIcon type={req.resourceType} size={22} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base capitalize">
            {req.resourceType} Aid
          </p>
          <p className="text-xs text-muted-foreground">
            Qty: {req.quantity.toString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <StatusBadge status={req.status} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Urgency</span>
          <UrgencyBadge urgency={req.urgency} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Distance</span>
          <span className="text-xs font-medium">{dist.toFixed(1)} km away</span>
        </div>
        {user && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Contact</span>
            <span className="text-xs font-medium flex items-center gap-1">
              <Phone size={10} />
              {user.phone}
            </span>
          </div>
        )}
      </div>

      {req.description && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {req.description}
          </p>
        </div>
      )}

      <div className="pt-1 space-y-2">
        {mode === "open" && (
          <Button
            className="w-full gap-1.5"
            onClick={() => onClaim?.(req)}
            disabled={isPendingClaim}
            data-ocid="ngo_requests.sidebar_claim_button"
          >
            <ChevronRight size={15} />
            {isPendingClaim
              ? t("ngoRequests.claiming")
              : t("ngoRequests.claim")}
          </Button>
        )}

        {mode === "active" && req.status === RequestStatus.claimed && (
          <Button
            className="w-full gap-1.5"
            onClick={() => onUpdateStatus?.(req, RequestStatus.inTransit)}
            disabled={isPendingUpdate}
            data-ocid="ngo_requests.sidebar_transit_button"
          >
            <Truck size={15} />
            {isPendingUpdate
              ? t("ngoRequests.saving")
              : t("ngoRequests.markInTransit")}
          </Button>
        )}

        {mode === "active" && req.status === RequestStatus.inTransit && (
          <Button
            className="w-full gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => onUpdateStatus?.(req, RequestStatus.delivered)}
            disabled={isPendingUpdate}
            data-ocid="ngo_requests.sidebar_deliver_button"
          >
            <CheckCircle2 size={15} />
            {isPendingUpdate
              ? t("ngoRequests.saving")
              : t("ngoRequests.markDelivered")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function NGORequests() {
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [claimTarget, setClaimTarget] = useState<ReliefRequest | null>(null);
  const [deliverTarget, setDeliverTarget] = useState<ReliefRequest | null>(
    null,
  );
  const [selectedReq, setSelectedReq] = useState<ReliefRequest | null>(null);
  const [selectedMode, setSelectedMode] = useState<"open" | "active">("open");

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

  const { data: allUsers } = useQuery<UserProfile[]>({
    queryKey: ["all-users-for-ngo"],
    queryFn: async () => (actor ? actor.getAllUsers() : []),
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });

  const userProfiles = new Map(
    allUsers?.map((u) => [u.id.toString(), u]) ?? [],
  );

  const claimMutation = useMutation({
    mutationFn: (id: bigint) => actor!.claimRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-requests"] });
      setClaimTarget(null);
      setSelectedReq(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: bigint;
      status: RequestStatus;
    }) => actor!.updateRequestStatus({ requestId: id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo-requests"] });
      setDeliverTarget(null);
      setSelectedReq(null);
    },
  });

  const activeRequests =
    myRequests?.filter(
      (r) =>
        r.status === RequestStatus.claimed ||
        r.status === RequestStatus.inTransit,
    ) ?? [];

  // Sort open requests by distance
  const sortedOpen = ngoProfile
    ? [...(openRequests ?? [])].sort((a, b) => {
        const da = calcDistance(
          ngoProfile.location.lat,
          ngoProfile.location.lng,
          a.userLocation.lat,
          a.userLocation.lng,
        );
        const db = calcDistance(
          ngoProfile.location.lat,
          ngoProfile.location.lng,
          b.userLocation.lat,
          b.userLocation.lng,
        );
        return da - db;
      })
    : (openRequests ?? []);

  function handleUpdateStatus(req: ReliefRequest, next: RequestStatus) {
    if (next === RequestStatus.delivered) {
      setDeliverTarget(req);
    } else {
      updateMutation.mutate({ id: req.id, status: next });
    }
  }

  function handleSelectReq(req: ReliefRequest, mode: "open" | "active") {
    setSelectedMode(mode);
    setSelectedReq((prev) =>
      prev?.id.toString() === req.id.toString() ? null : req,
    );
  }

  return (
    <div
      className="space-y-5 max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto pb-8"
      data-ocid="ngo_requests.page"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold">
            {t("ngoRequests.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("ngoRequests.subtitle")}
          </p>
        </div>
        <Badge
          variant="outline"
          className="gap-1.5 text-secondary border-secondary/30 bg-secondary/5 shrink-0"
        >
          <Radio size={10} className="animate-pulse" />
          {t("ngoDashboard.live")}
        </Badge>
      </div>

      <Tabs
        defaultValue="nearby"
        data-ocid="ngo_requests.tabs"
        onValueChange={(v) => {
          setSelectedReq(null);
          setSelectedMode(v as "open" | "active");
        }}
      >
        {/* Desktop: flex row; Mobile: grid 2-col */}
        <TabsList className="w-full grid grid-cols-2 lg:flex lg:w-auto lg:gap-1">
          <TabsTrigger
            value="nearby"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="ngo_requests.nearby_tab"
          >
            <MapPin size={13} />
            {t("ngoRequests.tabOpen")}
            {sortedOpen.length > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs bg-accent/10 text-accent border-accent/20 border">
                {sortedOpen.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="gap-1.5 text-xs sm:text-sm"
            data-ocid="ngo_requests.active_tab"
          >
            <Clock size={13} />
            {t("ngoRequests.tabMine")}
            {activeRequests.length > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary border-primary/20 border">
                {activeRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Nearby Open Requests */}
        <TabsContent value="nearby" className="mt-4">
          <div className="flex gap-4 items-start">
            {/* Card list */}
            <div className="flex-1 min-w-0">
              {loadingOpen ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-xl" />
                  ))}
                </div>
              ) : sortedOpen.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {sortedOpen.map((req, i) => (
                    <RequestCard
                      key={req.id.toString()}
                      req={req}
                      index={i + 1}
                      ngoProfile={ngoProfile!}
                      mode="open"
                      userProfiles={userProfiles}
                      onClaim={setClaimTarget}
                      isPendingClaim={
                        claimMutation.isPending &&
                        claimMutation.variables === req.id
                      }
                      isSelected={
                        selectedReq?.id.toString() === req.id.toString()
                      }
                      onSelect={(r) => handleSelectReq(r, "open")}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-14 space-y-2"
                  data-ocid="ngo_requests.open_empty_state"
                >
                  <CheckCircle2
                    size={36}
                    className="text-muted-foreground mx-auto opacity-40"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("ngoRequests.noOpen")}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-70">
                    {t("ngoRequests.noOpenSubtitle")}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop action sidebar */}
            {selectedReq && selectedMode === "open" && ngoProfile && (
              <div className="hidden lg:block">
                <ActionSidebar
                  req={selectedReq}
                  mode="open"
                  ngoProfile={ngoProfile}
                  userProfiles={userProfiles}
                  onClose={() => setSelectedReq(null)}
                  onClaim={setClaimTarget}
                  isPendingClaim={
                    claimMutation.isPending &&
                    claimMutation.variables === selectedReq.id
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* My Active Requests */}
        <TabsContent value="active" className="mt-4">
          <div className="flex gap-4 items-start">
            {/* Card list */}
            <div className="flex-1 min-w-0">
              {loadingMine ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-xl" />
                  ))}
                </div>
              ) : activeRequests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeRequests.map((req, i) => (
                    <RequestCard
                      key={req.id.toString()}
                      req={req}
                      index={i + 1}
                      ngoProfile={ngoProfile!}
                      mode="active"
                      userProfiles={userProfiles}
                      onUpdateStatus={handleUpdateStatus}
                      isPendingUpdate={
                        updateMutation.isPending &&
                        updateMutation.variables?.id === req.id
                      }
                      isSelected={
                        selectedReq?.id.toString() === req.id.toString()
                      }
                      onSelect={(r) => handleSelectReq(r, "active")}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-14 space-y-2"
                  data-ocid="ngo_requests.active_empty_state"
                >
                  <Truck
                    size={36}
                    className="text-muted-foreground mx-auto opacity-40"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("ngoRequests.noMine")}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-70">
                    {t("ngoRequests.noMineSubtitle")}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop action sidebar */}
            {selectedReq && selectedMode === "active" && ngoProfile && (
              <div className="hidden lg:block">
                <ActionSidebar
                  req={selectedReq}
                  mode="active"
                  ngoProfile={ngoProfile}
                  userProfiles={userProfiles}
                  onClose={() => setSelectedReq(null)}
                  onUpdateStatus={handleUpdateStatus}
                  isPendingUpdate={
                    updateMutation.isPending &&
                    updateMutation.variables?.id === selectedReq.id
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Confirmation Dialog */}
      <AlertDialog
        open={!!claimTarget}
        onOpenChange={(open) => !open && setClaimTarget(null)}
      >
        <AlertDialogContent data-ocid="ngo_requests.claim_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ngoRequests.claim")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("ngoRequests.claimDesc", {
                resourceType: claimTarget?.resourceType ?? "",
                qty: claimTarget?.quantity.toString() ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="ngo_requests.claim_cancel_button"
              disabled={claimMutation.isPending}
            >
              {t("ngoRequests.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="ngo_requests.claim_confirm_button"
              disabled={claimMutation.isPending}
              onClick={() =>
                claimTarget && claimMutation.mutate(claimTarget.id)
              }
            >
              {claimMutation.isPending
                ? t("ngoRequests.claiming")
                : t("ngoRequests.claim")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deliver Confirmation Dialog */}
      <AlertDialog
        open={!!deliverTarget}
        onOpenChange={(open) => !open && setDeliverTarget(null)}
      >
        <AlertDialogContent data-ocid="ngo_requests.deliver_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("ngoRequests.markDelivered")}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("ngoRequests.deliverDesc", {
                resourceType: deliverTarget?.resourceType ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="ngo_requests.deliver_cancel_button"
              disabled={updateMutation.isPending}
            >
              {t("ngoRequests.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-ocid="ngo_requests.deliver_confirm_button"
              disabled={updateMutation.isPending}
              onClick={() =>
                deliverTarget &&
                updateMutation.mutate({
                  id: deliverTarget.id,
                  status: RequestStatus.delivered,
                })
              }
            >
              {updateMutation.isPending
                ? t("ngoRequests.saving")
                : t("ngoRequests.markDelivered")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
