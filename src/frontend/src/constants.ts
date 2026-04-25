import { RequestStatus, ResourceType, UrgencyLevel } from "./types";

export const RESOURCE_TYPES = [
  {
    value: ResourceType.food,
    label: "Food",
    labelKey: "resources.food",
    descKey: "resources.foodDesc",
    icon: "🍱",
    colorClass: "relief-food",
    description: "Meals, rations, packaged food",
  },
  {
    value: ResourceType.water,
    label: "Water",
    labelKey: "resources.water",
    descKey: "resources.waterDesc",
    icon: "💧",
    colorClass: "relief-water",
    description: "Drinking water, purification",
  },
  {
    value: ResourceType.medical,
    label: "Medical Aid",
    labelKey: "resources.medical",
    descKey: "resources.medicalDesc",
    icon: "🏥",
    colorClass: "relief-medical",
    description: "Medicine, first aid, equipment",
  },
  {
    value: ResourceType.other,
    label: "Other",
    labelKey: "resources.other",
    descKey: "resources.otherDesc",
    icon: "📦",
    colorClass: "relief-other",
    description: "Shelter, clothing, supplies",
  },
] as const;

export const URGENCY_LEVELS = [
  {
    value: UrgencyLevel.high,
    label: "High",
    labelKey: "urgency.high",
    descKey: "urgency.highDesc",
    color: "text-accent",
    bg: "bg-accent/10 border border-accent/30",
    dot: "bg-accent",
    description: "Life-threatening, immediate action needed",
  },
  {
    value: UrgencyLevel.medium,
    label: "Medium",
    labelKey: "urgency.medium",
    descKey: "urgency.mediumDesc",
    color: "text-chart-2",
    bg: "bg-chart-2/10 border border-chart-2/30",
    dot: "bg-chart-2",
    description: "Urgent, needs attention soon",
  },
  {
    value: UrgencyLevel.low,
    label: "Low",
    labelKey: "urgency.low",
    descKey: "urgency.lowDesc",
    color: "text-secondary",
    bg: "bg-secondary/10 border border-secondary/30",
    dot: "bg-secondary",
    description: "Non-urgent, can wait",
  },
] as const;

export const REQUEST_STATUSES = [
  {
    value: RequestStatus.open,
    label: "Open",
    labelKey: "status.open",
    descKey: "status.openDesc",
    cssClass: "status-open",
    description: "Awaiting response from NGO",
  },
  {
    value: RequestStatus.claimed,
    label: "Claimed",
    labelKey: "status.claimed",
    descKey: "status.claimedDesc",
    cssClass: "status-claimed",
    description: "NGO is preparing to respond",
  },
  {
    value: RequestStatus.inTransit,
    label: "In Transit",
    labelKey: "status.inTransit",
    descKey: "status.inTransitDesc",
    cssClass: "status-in-transit",
    description: "Resources en route to location",
  },
  {
    value: RequestStatus.delivered,
    label: "Delivered",
    labelKey: "status.delivered",
    descKey: "status.deliveredDesc",
    cssClass: "status-delivered",
    description: "Request fulfilled",
  },
] as const;

export const EMERGENCY_HOTLINE = "1800-180-1253";
export const APP_NAME = "ReliefConnect";

export const ROLE_REDIRECTS = {
  citizen: "/user/dashboard",
  ngo: "/ngo/dashboard",
  admin: "/admin/dashboard",
} as const;
