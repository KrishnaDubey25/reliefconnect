import { y as createLucideIcon, m as useBackend, u as useNavigate, ak as useSearch, a as useTranslation, j as jsxRuntimeExports, B as Badge, o as Button, ab as X, I as Input, al as REQUEST_STATUSES, O as RESOURCE_TYPES, am as URGENCY_LEVELS, E as Skeleton } from "./index-Cru0WlOf.js";
import { C as Card, b as CardHeader, a as CardContent, c as CardTitle } from "./card-RqapHmT1.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { S as StatusBadge } from "./StatusBadge-Bizm4PBs.js";
import { U as UrgencyBadge } from "./UrgencyBadge-DEimiDsW.js";
import { F as Funnel } from "./funnel-BZEjQXfc.js";
import { S as Search } from "./search-DrI__nto.js";
import { A as Activity } from "./activity-DHD5Q7f2.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "M11 4h10", key: "1w87gc" }],
  ["path", { d: "M11 8h7", key: "djye34" }],
  ["path", { d: "M11 12h4", key: "q8tih4" }]
];
const ArrowDownWideNarrow = createLucideIcon("arrow-down-wide-narrow", __iconNode);
function AdminRequests() {
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false });
  const sp = rawSearch ?? {};
  const { t } = useTranslation();
  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching
  });
  function updateFilter(key, value) {
    navigate({
      to: "/admin/requests",
      search: { ...sp, [key]: value || void 0 }
    });
  }
  function clearAll() {
    navigate({ to: "/admin/requests", search: {} });
  }
  const activeFilters = Object.values(sp).filter(Boolean).length;
  const filtered = (requests ?? []).filter((r) => {
    if (sp.status && r.status !== sp.status) return false;
    if (sp.resource && r.resourceType !== sp.resource)
      return false;
    if (sp.urgency && r.urgency !== sp.urgency) return false;
    if (sp.q) {
      const q = sp.q.toLowerCase();
      if (!r.id.toString().includes(q) && !(r.description ?? "").toLowerCase().includes(q) && !r.resourceType.toLowerCase().includes(q))
        return false;
    }
    return true;
  }).sort((a, b) => Number(b.createdAt - a.createdAt));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_requests.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: t("adminRequests.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("adminRequests.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-border",
        "data-ocid": "admin_requests.filter_bar.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 14, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Filters" }),
            activeFilters > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] h-4 px-1.5 bg-primary/10 text-primary border-primary/20", children: activeFilters }),
            activeFilters > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-6 px-2 text-xs ml-auto gap-1",
                onClick: clearAll,
                "data-ocid": "admin_requests.clear_filters_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 }),
                  "Clear all"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  size: 13,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: t("adminRequests.noRequests"),
                  value: sp.q ?? "",
                  onChange: (e) => updateFilter("q", e.target.value),
                  className: "pl-8 h-8 text-xs w-48",
                  "data-ocid": "admin_requests.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: REQUEST_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => updateFilter(
                  "status",
                  sp.status === s.value ? void 0 : s.value
                ),
                className: `text-xs px-3 py-1 rounded-full border transition-smooth ${sp.status === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`,
                "data-ocid": `admin_requests.status_filter.${s.value}`,
                children: t(s.labelKey)
              },
              s.value
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: RESOURCE_TYPES.map((rt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => updateFilter(
                  "resource",
                  sp.resource === rt.value ? void 0 : rt.value
                ),
                className: `text-xs px-3 py-1 rounded-full border transition-smooth flex items-center gap-1 ${sp.resource === rt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`,
                "data-ocid": `admin_requests.resource_filter.${rt.value}`,
                children: [
                  rt.icon,
                  " ",
                  t(rt.labelKey)
                ]
              },
              rt.value
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: URGENCY_LEVELS.map((ul) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => updateFilter(
                  "urgency",
                  sp.urgency === ul.value ? void 0 : ul.value
                ),
                className: `text-xs px-3 py-1 rounded-full border transition-smooth ${sp.urgency === ul.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`,
                "data-ocid": `admin_requests.urgency_filter.${ul.value}`,
                children: t(ul.labelKey)
              },
              ul.value
            )) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "admin_requests.table.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14, className: "text-primary" }),
          t("adminRequests.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownWideNarrow, { size: 12 }),
          "Newest first"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: ["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, k)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-12 text-muted-foreground text-sm",
          "data-ocid": "admin_requests.empty_state",
          children: t("adminRequests.noRequests")
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground", children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 text-xs font-medium text-muted-foreground", children: t("adminRequests.resource") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-medium text-muted-foreground", children: "Qty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-2.5 text-xs font-medium text-muted-foreground", children: t("adminRequests.urgency") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-2.5 text-xs font-medium text-muted-foreground", children: t("adminRequests.status") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-2.5 text-xs font-medium text-muted-foreground", children: t("adminRequests.ngo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 text-xs font-medium text-muted-foreground", children: t("adminRequests.created") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
            "data-ocid": `admin_requests.table.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                req.id.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-foreground font-medium", children: req.resourceType })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums text-muted-foreground", children: req.quantity.toString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UrgencyBadge, { urgency: req.urgency, size: "sm" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-xs text-muted-foreground", children: req.claimedBy != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] bg-muted",
                  children: [
                    "NGO #",
                    req.claimedBy.toString()
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground", children: new Date(
                Number(req.createdAt) / 1e6
              ).toLocaleDateString() })
            ]
          },
          req.id.toString()
        )) })
      ] }) }) })
    ] }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "p",
      {
        className: "text-xs text-muted-foreground text-right",
        "data-ocid": "admin_requests.result_count",
        children: [
          filtered.length,
          " of ",
          (requests ?? []).length,
          " requests"
        ]
      }
    )
  ] });
}
export {
  AdminRequests as default
};
