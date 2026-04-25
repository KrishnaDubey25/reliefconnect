import { Cross, Droplets, Package, Utensils } from "lucide-react";
import type { ResourceType } from "../../types";

interface ResourceIconProps {
  type: ResourceType;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<
  ResourceType,
  {
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    className: string;
  }
> = {
  food: { Icon: Utensils, className: "relief-food" },
  water: { Icon: Droplets, className: "relief-water" },
  medical: { Icon: Cross, className: "relief-medical" },
  other: { Icon: Package, className: "relief-other" },
};

export function ResourceIcon({
  type,
  className = "",
  size = 16,
}: ResourceIconProps) {
  const { Icon, className: colorClass } = ICON_MAP[type] ?? ICON_MAP.other;
  return <Icon size={size} className={`${colorClass} ${className}`} />;
}
