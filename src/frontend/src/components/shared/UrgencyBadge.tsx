import { useTranslation } from "react-i18next";
import { URGENCY_LEVELS } from "../../constants";
import type { UrgencyLevel } from "../../types";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: "sm" | "md";
}

export function UrgencyBadge({ urgency, size = "md" }: UrgencyBadgeProps) {
  const { t } = useTranslation();
  const meta = URGENCY_LEVELS.find((u) => u.value === urgency);
  if (!meta) return null;

  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${meta.bg} ${meta.color}`}
      data-ocid={`urgency_badge.${urgency}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {t(meta.labelKey)}
    </span>
  );
}
