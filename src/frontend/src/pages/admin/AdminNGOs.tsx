import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ChevronRight,
  MapPin,
  Package,
  Phone,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { useBackend } from "../../hooks/use-backend";
import type { Inventory, NGOId, NGOProfile, ReliefRequest } from "../../types";
import { RequestStatus } from "../../types";

function InventoryPanel({
  ngo,
  onClose,
}: { ngo: NGOProfile; onClose: () => void }) {
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();

  const { data: inventory, isLoading } = useQuery<Inventory[]>({
    queryKey: ["ngo-inventory", ngo.id.toString()],
    queryFn: () => actor!.getNGOInventory(ngo.id),
    enabled: !!actor && !isFetching,
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md lg:max-w-lg"
        data-ocid="admin_ngos.inventory_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            {ngo.orgName} — {t("ngoInventory.title")}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-3">
            {["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-12 w-full" />
            ))}
          </div>
        ) : !inventory || inventory.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground text-sm"
            data-ocid="admin_ngos.inventory_empty_state"
          >
            {t("adminNGOs.noNGOs")}
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {inventory.map((item) => (
              <div
                key={item.resourceType}
                className="flex items-center gap-3 bg-muted/30 rounded-lg px-3 py-2.5"
              >
                <div className="h-8 w-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                  <ResourceIcon type={item.resourceType} size={15} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">
                    {item.resourceType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated{" "}
                    {new Date(
                      Number(item.lastUpdated) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground tabular-nums">
                  {item.quantity.toString()} units
                </p>
              </div>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={onClose}
          data-ocid="admin_ngos.inventory_dialog.close_button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminNGOs() {
  const { actor, isFetching } = useBackend();
  const [selectedNGO, setSelectedNGO] = useState<NGOProfile | null>(null);
  const { t } = useTranslation();

  const { data: ngos, isLoading: loadingNGOs } = useQuery<NGOProfile[]>({
    queryKey: ["admin-all-ngos"],
    queryFn: () => actor!.getAllNGOs(),
    enabled: !!actor && !isFetching,
  });

  const { data: allRequests } = useQuery<ReliefRequest[]>({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor!.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching,
  });

  function activeCountForNGO(ngoId: NGOId): number {
    if (!allRequests) return 0;
    return allRequests.filter(
      (r) =>
        r.claimedBy?.toString() === ngoId.toString() &&
        r.status !== RequestStatus.delivered,
    ).length;
  }

  return (
    <div className="space-y-6" data-ocid="admin_ngos.page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">
            {t("adminNGOs.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("adminNGOs.subtitle")}
          </p>
        </div>
        {!loadingNGOs && (
          <Badge
            variant="outline"
            className="text-xs"
            data-ocid="admin_ngos.count_badge"
          >
            {ngos?.length ?? 0} NGOs
          </Badge>
        )}
      </div>

      {loadingNGOs ? (
        /* Desktop: 2-col skeleton grid; mobile: list */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !ngos || ngos.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground text-sm bg-muted/30 rounded-2xl"
          data-ocid="admin_ngos.empty_state"
        >
          <Building2 size={32} className="mx-auto mb-3 opacity-30" />
          {t("adminNGOs.noNGOs")}
        </div>
      ) : (
        <>
          {/* Desktop: 2-column card grid */}
          <div
            className="hidden lg:grid lg:grid-cols-2 gap-4"
            data-ocid="admin_ngos.grid.section"
          >
            {ngos.map((ngo, i) => {
              const activeCount = activeCountForNGO(ngo.id);
              return (
                <Card
                  key={ngo.id.toString()}
                  className="border-border hover:shadow-md transition-smooth cursor-pointer"
                  tabIndex={0}
                  onClick={() => setSelectedNGO(ngo)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedNGO(ngo)}
                  data-ocid={`admin_ngos.grid.item.${i + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {ngo.orgName}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Phone size={10} />
                            {ngo.contactPhone}
                          </p>
                        </div>
                      </div>
                      {activeCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                          style={{
                            background: "oklch(0.58 0.24 30 / 0.1)",
                            color: "oklch(0.58 0.24 30)",
                            borderColor: "oklch(0.58 0.24 30 / 0.25)",
                          }}
                        >
                          {activeCount} active
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {ngo.location.lat.toFixed(3)},{" "}
                        {ngo.location.lng.toFixed(3)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Radio size={11} />
                        {ngo.serviceRadius} km
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNGO(ngo);
                        }}
                        data-ocid={`admin_ngos.view_inventory_button.${i + 1}`}
                      >
                        <Package size={12} />
                        {t("ngoInventory.title")}
                        <ChevronRight size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mobile: table layout */}
          <Card
            className="border-border lg:hidden"
            data-ocid="admin_ngos.table.section"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                {t("adminNGOs.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      {[
                        t("adminNGOs.name"),
                        t("adminNGOs.phone"),
                        t("adminNGOs.location"),
                        `${t("adminNGOs.radius")} (${t("adminNGOs.km")})`,
                        "Active",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${
                            ["Active"].includes(h) ? "text-center" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ngos.map((ngo, i) => {
                      const activeCount = activeCountForNGO(ngo.id);
                      return (
                        <tr
                          key={ngo.id.toString()}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          tabIndex={0}
                          onClick={() => setSelectedNGO(ngo)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setSelectedNGO(ngo)
                          }
                          data-ocid={`admin_ngos.table.item.${i + 1}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Building2 size={14} className="text-primary" />
                              </div>
                              <span className="font-medium text-foreground">
                                {ngo.orgName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <Phone size={11} />
                              {ngo.contactPhone}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} />
                              {ngo.location.lat.toFixed(3)},{" "}
                              {ngo.location.lng.toFixed(3)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                              <Radio size={11} />
                              {ngo.serviceRadius}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {activeCount > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-[10px]"
                                style={{
                                  background: "oklch(0.58 0.24 30 / 0.1)",
                                  color: "oklch(0.58 0.24 30)",
                                  borderColor: "oklch(0.58 0.24 30 / 0.25)",
                                }}
                              >
                                {activeCount} active
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 gap-1 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNGO(ngo);
                              }}
                              data-ocid={`admin_ngos.view_inventory_button.${i + 1}`}
                            >
                              <Package size={12} />
                              {t("ngoInventory.title")}
                              <ChevronRight size={12} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedNGO && (
        <InventoryPanel
          ngo={selectedNGO}
          onClose={() => setSelectedNGO(null)}
        />
      )}
    </div>
  );
}
