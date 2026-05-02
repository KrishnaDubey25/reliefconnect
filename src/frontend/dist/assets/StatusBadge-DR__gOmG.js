import { a as useTranslation, al as REQUEST_STATUSES, j as jsxRuntimeExports } from "./index-CiAbU5FG.js";
function StatusBadge({ status, size = "md" }) {
  const { t } = useTranslation();
  const meta = REQUEST_STATUSES.find((s) => s.value === status);
  if (!meta) return null;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${meta.cssClass}`,
      "data-ocid": `status_badge.${status}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-80" }),
        t(meta.labelKey)
      ]
    }
  );
}
export {
  StatusBadge as S
};
