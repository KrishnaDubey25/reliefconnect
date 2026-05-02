import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Activity, Filter, Search, SortDesc, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { UrgencyBadge } from "../../components/shared/UrgencyBadge";
import {
  REQUEST_STATUSES,
  RESOURCE_TYPES,
  URGENCY_LEVELS,
} from "../../constants";
import { useBackend } from "../../hooks/use-backend";
import type { ReliefRequest } from "../../types";

type SearchParams = {
  status?: string;
  resource?: string;
  urgency?: string;
  q?: string;
};

export default function AdminRequests() {
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false }) as SearchParams;
  const sp = rawSearch ?? {};
  const { t } = useTranslation();

  const { data: requests, isLoading } = useQuery<ReliefRequest[]>({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor!.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching,
  });

  function updateFilter(key: keyof SearchParams, value: string | undefined) {
    navigate({
      to: "/admin/requests",
      search: { ...sp, [key]: value || undefined },
    });
  }

  function clearAll() {
    navigate({ to: "/admin/requests", search: {} });
  }

  const activeFilters = Object.values(sp).filter(Boolean).length;

  const filtered = (requests ?? [])
    .filter((r) => {
      if (sp.status && (r.status as string) !== sp.status) return false;
      if (sp.resource && (r.resourceType as string) !== sp.resource)
        return false;
      if (sp.urgency && (r.urgency as string) !== sp.urgency) return false;
      if (sp.q) {
        const q = sp.q.toLowerCase();
        if (
          !r.id.toString().includes(q) &&
          !(r.description ?? "").toLowerCase().includes(q) &&
          !(r.resourceType as string).toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    })
    .sort((a, b) => Number(b.createdAt - a.createdAt));

  return (
    <div className="space-y-6" data-ocid="admin_requests.page">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("adminRequests.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("adminRequests.subtitle")}
        </p>
      </div>

      {/* Filter Bar */}
      <Card
        className="border-border"
        data-ocid="admin_requests.filter_bar.section"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-sm font-semibold">Filters</span>
            {activeFilters > 0 && (
              <Badge className="text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20">
                {activeFilters}
              </Badge>
            )}
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs ml-auto gap-1"
                onClick={clearAll}
                data-ocid="admin_requests.clear_filters_button"
              >
                <X size={11} />
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop: inline filters in a row; mobile: wrapping flex */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap lg:gap-3">
            <div className="relative lg:w-64">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder={t("adminRequests.noRequests")}
                value={sp.q ?? ""}
                onChange={(e) => updateFilter("q", e.target.value)}
                className="pl-8 h-8 text-xs w-full"
                data-ocid="admin_requests.search_input"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {REQUEST_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    updateFilter(
                      "status",
                      sp.status === s.value ? undefined : s.value,
                    )
                  }
                  className={`text-xs px-3 py-1 rounded-full border transition-smooth ${sp.status === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
                  data-ocid={`admin_requests.status_filter.${s.value}`}
                >
                  {t(s.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {RESOURCE_TYPES.map((rt) => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() =>
                    updateFilter(
                      "resource",
                      sp.resource === rt.value ? undefined : rt.value,
                    )
                  }
                  className={`text-xs px-3 py-1 rounded-full border transition-smooth flex items-center gap-1 ${sp.resource === rt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
                  data-ocid={`admin_requests.resource_filter.${rt.value}`}
                >
                  {rt.icon} {t(rt.labelKey)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {URGENCY_LEVELS.map((ul) => (
                <button
                  key={ul.value}
                  type="button"
                  onClick={() =>
                    updateFilter(
                      "urgency",
                      sp.urgency === ul.value ? undefined : ul.value,
                    )
                  }
                  className={`text-xs px-3 py-1 rounded-full border transition-smooth ${sp.urgency === ul.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
                  data-ocid={`admin_requests.urgency_filter.${ul.value}`}
                >
                  {t(ul.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border" data-ocid="admin_requests.table.section">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              {t("adminRequests.title")}
            </CardTitle>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SortDesc size={12} />
              Newest first
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="admin_requests.empty_state"
            >
              {t("adminRequests.noRequests")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {t("adminRequests.resource")}
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Qty
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {t("adminRequests.urgency")}
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {t("adminRequests.status")}
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {t("adminRequests.ngo")}
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      {t("adminRequests.created")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, i) => (
                    <tr
                      key={req.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid={`admin_requests.table.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{req.id.toString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <ResourceIcon type={req.resourceType} size={14} />
                          <span className="capitalize text-foreground font-medium">
                            {req.resourceType}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {req.quantity.toString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <UrgencyBadge urgency={req.urgency} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {req.claimedBy != null ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-muted"
                          >
                            NGO #{req.claimedBy.toString()}
                          </Badge>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {new Date(
                          Number(req.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isLoading && (
        <p
          className="text-xs text-muted-foreground text-right"
          data-ocid="admin_requests.result_count"
        >
          {filtered.length} of {(requests ?? []).length} requests
        </p>
      )}
    </div>
  );
}
