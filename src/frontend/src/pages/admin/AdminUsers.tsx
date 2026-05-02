import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBackend } from "../../hooks/use-backend";
import type { UserProfile, VerificationCounts } from "../../types";

function VerifBadge({ declared }: { declared: boolean }) {
  const { t } = useTranslation();
  return declared ? (
    <Badge
      className="text-[10px] gap-1 bg-secondary/10 text-secondary border border-secondary/20 font-medium"
      variant="outline"
    >
      <ShieldCheck size={10} />
      {t("adminUsers.declared")}
    </Badge>
  ) : (
    <Badge
      className="text-[10px] bg-muted text-muted-foreground border border-border font-medium"
      variant="outline"
    >
      {t("adminUsers.pending")}
    </Badge>
  );
}

export default function AdminUsers() {
  const { actor, isFetching } = useBackend();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const { data: users, isLoading: loadingUsers } = useQuery<UserProfile[]>({
    queryKey: ["admin-all-users"],
    queryFn: () => actor!.getAllUsers(),
    enabled: !!actor && !isFetching,
  });

  const { data: verification, isLoading: loadingVerification } =
    useQuery<VerificationCounts>({
      queryKey: ["admin-verification-counts"],
      queryFn: () => actor!.getVerificationCounts(),
      enabled: !!actor && !isFetching,
    });

  const sorted = [...(users ?? [])]
    .sort((a, b) => Number(b.registeredAt - a.registeredAt))
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search),
    );

  return (
    <div className="space-y-6" data-ocid="admin_users.page">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("adminUsers.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("adminUsers.subtitle")}
        </p>
      </div>

      {/* Verification Summary */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6"
        data-ocid="admin_users.verification_summary.section"
      >
        {loadingVerification
          ? ["a", "b", "c", "d"].map((k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ))
          : [
              {
                label: t("adminDashboard.verification.totalUsers"),
                value: verification?.totalUsers ?? 0n,
                icon: Users,
                colorClass: "text-primary",
              },
              {
                label: t("adminDashboard.verification.bothDeclared"),
                value: verification?.bothDeclared ?? 0n,
                icon: ShieldCheck,
                colorClass: "text-secondary",
              },
              {
                label: t("adminDashboard.verification.aadhaarDeclared"),
                value: verification?.aadhaarDeclared ?? 0n,
                icon: ShieldCheck,
                colorClass: "text-primary",
              },
              {
                label: t("adminDashboard.verification.panDeclared"),
                value: verification?.panDeclared ?? 0n,
                icon: ShieldCheck,
                colorClass: "text-chart-5",
              },
            ].map(({ label, value, icon: Icon, colorClass }, i) => (
              <Card
                key={label}
                className="border-border"
                data-ocid={`admin_users.verification_summary.item.${i + 1}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon size={18} className={`${colorClass} shrink-0`} />
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {value.toString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Search + Table */}
      <Card className="border-border" data-ocid="admin_users.table.section">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-semibold">
              {t("adminUsers.title")}
            </CardTitle>
            <div className="relative w-56 lg:w-96">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder={t("adminUsers.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
                data-ocid="admin_users.search_input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingUsers ? (
            <div className="p-4 space-y-2">
              {["a", "b", "c", "d", "e", "f"].map((k) => (
                <Skeleton key={k} className="h-12 w-full" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="admin_users.empty_state"
            >
              {search ? t("adminUsers.noUsers") : t("adminUsers.noUsers")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      t("adminUsers.name"),
                      t("adminUsers.phone"),
                      t("adminUsers.location"),
                      t("adminUsers.aadhaar"),
                      t("adminUsers.pan"),
                      "Registered",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${
                          [
                            t("adminUsers.aadhaar"),
                            t("adminUsers.pan"),
                          ].includes(h)
                            ? "text-center"
                            : h === "Registered"
                              ? "text-right"
                              : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((user, i) => (
                    <tr
                      key={user.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      data-ocid={`admin_users.table.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {user.phone}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {user.location.lat.toFixed(3)},{" "}
                          {user.location.lng.toFixed(3)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <VerifBadge declared={user.aadhaarDeclared} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <VerifBadge declared={user.panDeclared} />
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                        {new Date(
                          Number(user.registeredAt) / 1_000_000,
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
    </div>
  );
}
