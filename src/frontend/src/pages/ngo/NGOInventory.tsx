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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Minus,
  Package,
  Pencil,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { RESOURCE_TYPES } from "../../constants";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import type { Inventory } from "../../types";
import { ResourceType } from "../../types";

interface EditState {
  resourceType: ResourceType;
  delta: number;
  reason: string;
}

function formatTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ms).toLocaleDateString();
}

interface InventoryCardProps {
  resourceType: ResourceType;
  label: string;
  quantity: number;
  lastUpdated?: bigint;
  index: number;
  onEdit: (resourceType: ResourceType) => void;
}

function InventoryCard({
  resourceType,
  label,
  quantity,
  lastUpdated,
  index,
  onEdit,
}: InventoryCardProps) {
  const { t } = useTranslation();
  const isLow = quantity < 10;
  const isOut = quantity === 0;

  return (
    <Card
      className="border-border bg-card"
      data-ocid={`ngo_inventory.item.${index}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <ResourceIcon type={resourceType} size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{label}</p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {formatTime(lastUpdated)}
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 shrink-0"
            onClick={() => onEdit(resourceType)}
            data-ocid={`ngo_inventory.edit_button.${index}`}
            aria-label={`${t("ngoInventory.update")} ${label}`}
          >
            <Pencil size={13} />
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p
              className={`text-3xl font-bold font-display ${
                isOut
                  ? "text-accent"
                  : isLow
                    ? "text-chart-2"
                    : "text-foreground"
              }`}
            >
              {quantity}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("ngoInventory.quantity")} in stock
            </p>
          </div>
          {isOut && (
            <Badge className="bg-accent/10 text-accent border-accent/20 border text-xs">
              Out of stock
            </Badge>
          )}
          {isLow && !isOut && (
            <Badge
              className="text-xs border"
              style={{
                backgroundColor: "oklch(var(--chart-2) / 0.1)",
                color: "oklch(var(--chart-2))",
                borderColor: "oklch(var(--chart-2) / 0.25)",
              }}
            >
              Low stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NGOInventory() {
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [editState, setEditState] = useState<EditState | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<EditState | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { data: inventory, isLoading } = useQuery<Inventory[]>({
    queryKey: ["ngo-inventory", ngoProfile?.id?.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getNGOInventory(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (args: EditState) =>
      actor!.updateInventory({
        resourceType: args.resourceType,
        delta: BigInt(args.delta),
        reason: args.reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo-inventory"] });
      setEditState(null);
      setConfirmTarget(null);
    },
  });

  const inventoryMap = new Map(
    inventory?.map((inv) => [inv.resourceType, inv]),
  );

  const totalUnits =
    inventory?.reduce((sum, inv) => sum + Number(inv.quantity), 0) ?? 0;
  const outOfStock = RESOURCE_TYPES.filter(
    (rt) => (inventoryMap.get(rt.value)?.quantity ?? 0n) === 0n,
  ).length;

  function openEdit(resourceType: ResourceType) {
    setEditState({ resourceType, delta: 10, reason: "" });
  }

  function handleEditSubmit() {
    if (!editState) return;
    setConfirmTarget(editState);
  }

  return (
    <div
      className="space-y-6 max-w-2xl mx-auto pb-8"
      data-ocid="ngo_inventory.page"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-bold">
          {t("ngoInventory.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("ngoInventory.subtitle")}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalUnits}</p>
          <p className="text-xs text-muted-foreground">
            {t("ngoInventory.quantity")} Units
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p
            className={`text-2xl font-bold ${outOfStock > 0 ? "text-accent" : "text-secondary"}`}
          >
            {outOfStock}
          </p>
          <p className="text-xs text-muted-foreground">Out of Stock</p>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Package size={14} className="text-primary" />
          {t("ngoInventory.resource")} by Category
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RESOURCE_TYPES.map((rt, i) => {
              const inv = inventoryMap.get(rt.value);
              return (
                <InventoryCard
                  key={rt.value}
                  resourceType={rt.value}
                  label={t(rt.labelKey)}
                  quantity={inv ? Number(inv.quantity) : 0}
                  lastUpdated={inv?.lastUpdated}
                  index={i + 1}
                  onEdit={openEdit}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Inventory History Collapsible */}
      <div
        className="border border-border rounded-xl overflow-hidden"
        data-ocid="ngo_inventory.history_section"
      >
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 bg-card text-sm font-semibold hover:bg-muted/30 transition-smooth"
          onClick={() => setHistoryOpen((p) => !p)}
          data-ocid="ngo_inventory.history_toggle"
        >
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" />
            Inventory History
          </span>
          {historyOpen ? (
            <ChevronUp size={15} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={15} className="text-muted-foreground" />
          )}
        </button>

        {historyOpen && (
          <div className="bg-background border-t border-border">
            {inventory && inventory.length > 0 ? (
              <div className="divide-y divide-border">
                {[...inventory]
                  .sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated))
                  .map((inv, i) => {
                    const rt = RESOURCE_TYPES.find(
                      (r) => r.value === inv.resourceType,
                    );
                    return (
                      <div
                        key={`${inv.resourceType}-${i}`}
                        className="flex items-center gap-3 px-4 py-3"
                        data-ocid={`ngo_inventory.history_item.${i + 1}`}
                      >
                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ResourceIcon type={inv.resourceType} size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {rt ? t(rt.labelKey) : rt}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(inv.lastUpdated)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">
                            {Number(inv.quantity)} units
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div
                className="py-8 text-center text-sm text-muted-foreground"
                data-ocid="ngo_inventory.history_empty_state"
              >
                No inventory updates recorded yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog
        open={!!editState}
        onOpenChange={(open) => !open && setEditState(null)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="ngo_inventory.edit_dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ResourceIcon
                type={editState?.resourceType ?? ResourceType.food}
                size={16}
              />
              {t("ngoInventory.updateStock")}{" "}
              {editState &&
              RESOURCE_TYPES.find((r) => r.value === editState.resourceType)
                ? t(
                    RESOURCE_TYPES.find(
                      (r) => r.value === editState.resourceType,
                    )!.labelKey,
                  )
                : ""}
            </DialogTitle>
          </DialogHeader>

          {editState && (
            <div className="space-y-4 pt-1">
              {/* Current qty */}
              <div className="bg-muted/30 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Current Stock
                </p>
                <p className="text-3xl font-bold font-display">
                  {Number(
                    inventoryMap.get(editState.resourceType)?.quantity ?? 0n,
                  )}
                </p>
              </div>

              {/* Delta control */}
              <div>
                <Label className="text-xs mb-2 block">
                  Adjust by (positive = add, negative = remove)
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() =>
                      setEditState((p) =>
                        p ? { ...p, delta: Math.max(-9999, p.delta - 5) } : p,
                      )
                    }
                    data-ocid="ngo_inventory.delta_minus"
                  >
                    <Minus size={14} />
                  </Button>
                  <Input
                    type="number"
                    value={editState.delta}
                    onChange={(e) =>
                      setEditState((p) =>
                        p ? { ...p, delta: Number(e.target.value) } : p,
                      )
                    }
                    className="text-center font-semibold text-base"
                    data-ocid="ngo_inventory.delta_input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() =>
                      setEditState((p) =>
                        p ? { ...p, delta: p.delta + 5 } : p,
                      )
                    }
                    data-ocid="ngo_inventory.delta_plus"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                {/* Preview */}
                <div className="flex items-center gap-1.5 mt-2">
                  {editState.delta >= 0 ? (
                    <TrendingUp size={13} className="text-secondary" />
                  ) : (
                    <TrendingDown size={13} className="text-accent" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    New total:{" "}
                    <strong className="text-foreground">
                      {Math.max(
                        0,
                        Number(
                          inventoryMap.get(editState.resourceType)?.quantity ??
                            0n,
                        ) + editState.delta,
                      )}
                    </strong>{" "}
                    units
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label htmlFor="reason" className="text-xs mb-1.5 block">
                  Reason *
                </Label>
                <Input
                  id="reason"
                  value={editState.reason}
                  onChange={(e) =>
                    setEditState((p) =>
                      p ? { ...p, reason: e.target.value } : p,
                    )
                  }
                  placeholder="e.g. Received donation, Deployed supplies"
                  data-ocid="ngo_inventory.reason_input"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditState(null)}
                  data-ocid="ngo_inventory.edit_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!editState.reason.trim()}
                  onClick={handleEditSubmit}
                  data-ocid="ngo_inventory.edit_confirm_button"
                >
                  {t("ngoInventory.update")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Update Dialog */}
      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
      >
        <AlertDialogContent data-ocid="ngo_inventory.confirm_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("ngoInventory.updateStock")}</AlertDialogTitle>
            <AlertDialogDescription>
              You are {(confirmTarget?.delta ?? 0) >= 0 ? "adding" : "removing"}{" "}
              <strong className="text-foreground">
                {Math.abs(confirmTarget?.delta ?? 0)} units
              </strong>{" "}
              {(confirmTarget?.delta ?? 0) >= 0 ? "to" : "from"}{" "}
              <strong className="text-foreground capitalize">
                {confirmTarget &&
                RESOURCE_TYPES.find(
                  (r) => r.value === confirmTarget.resourceType,
                )
                  ? t(
                      RESOURCE_TYPES.find(
                        (r) => r.value === confirmTarget.resourceType,
                      )!.labelKey,
                    )
                  : ""}
              </strong>{" "}
              stock. Reason: &ldquo;{confirmTarget?.reason}&rdquo;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="ngo_inventory.confirm_cancel_button"
              disabled={updateMutation.isPending}
              onClick={() => setConfirmTarget(null)}
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="ngo_inventory.confirm_submit_button"
              disabled={updateMutation.isPending}
              onClick={() =>
                confirmTarget && updateMutation.mutate(confirmTarget)
              }
            >
              {updateMutation.isPending
                ? t("ngoInventory.saving")
                : t("ngoInventory.save")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
