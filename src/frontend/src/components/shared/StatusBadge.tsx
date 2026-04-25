import { useTranslation } from "react-i18next";
import { REQUEST_STATUSES } from "../../constants";
import type { RequestStatus } from "../../types";

interface StatusBadgeProps {
  status: RequestStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { t } = useTranslation();
  const meta = REQUEST_STATUSES.find((s) => s.value === status);
  if (!meta) return null;

  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${meta.cssClass}`}
      data-ocid={`status_badge.${status}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {t(meta.labelKey)}
    </span>
  );
}
