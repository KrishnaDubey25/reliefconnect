import { a as useTranslation, am as URGENCY_LEVELS, j as jsxRuntimeExports } from "./index-Cru0WlOf.js";
function UrgencyBadge({ urgency, size = "md" }) {
  const { t } = useTranslation();
  const meta = URGENCY_LEVELS.find((u) => u.value === urgency);
  if (!meta) return null;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${meta.bg} ${meta.color}`,
      "data-ocid": `urgency_badge.${urgency}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${meta.dot}` }),
        t(meta.labelKey)
      ]
    }
  );
}
export {
  UrgencyBadge as U
};
