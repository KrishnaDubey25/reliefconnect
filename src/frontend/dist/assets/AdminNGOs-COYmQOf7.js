import { m as useBackend, r as reactExports, a as useTranslation, j as jsxRuntimeExports, B as Badge, E as Skeleton, w as Building2, G as Phone, o as Button, Z as Package, Y as ChevronRight, R as RequestStatus } from "./index-Cru0WlOf.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-RqapHmT1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DNXazXEJ.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
import { R as Radio } from "./radio-B5kCj8xe.js";
import "./index-DQwb_N1H.js";
function InventoryPanel({
  ngo,
  onClose
}) {
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["ngo-inventory", ngo.id.toString()],
    queryFn: () => actor.getNGOInventory(ngo.id),
    enabled: !!actor && !isFetching
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md",
      "data-ocid": "admin_ngos.inventory_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base", children: [
          ngo.orgName,
          " — ",
          t("ngoInventory.title")
        ] }) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, k)) }) : !inventory || inventory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-center py-8 text-muted-foreground text-sm",
            "data-ocid": "admin_ngos.inventory_empty_state",
            children: t("adminNGOs.noNGOs")
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: inventory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 bg-muted/30 rounded-lg px-3 py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-background border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: item.resourceType, size: 15 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium capitalize", children: item.resourceType }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Updated",
                  " ",
                  new Date(
                    Number(item.lastUpdated) / 1e6
                  ).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground tabular-nums", children: [
                item.quantity.toString(),
                " units"
              ] })
            ]
          },
          item.resourceType
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "w-full",
            onClick: onClose,
            "data-ocid": "admin_ngos.inventory_dialog.close_button",
            children: "Close"
          }
        )
      ]
    }
  ) });
}
function AdminNGOs() {
  const { actor, isFetching } = useBackend();
  const [selectedNGO, setSelectedNGO] = reactExports.useState(null);
  const { t } = useTranslation();
  const { data: ngos, isLoading: loadingNGOs } = useQuery({
    queryKey: ["admin-all-ngos"],
    queryFn: () => actor.getAllNGOs(),
    enabled: !!actor && !isFetching
  });
  const { data: allRequests } = useQuery({
    queryKey: ["admin-all-requests"],
    queryFn: () => actor.getAllRequestsForAdmin(),
    enabled: !!actor && !isFetching
  });
  function activeCountForNGO(ngoId) {
    if (!allRequests) return 0;
    return allRequests.filter(
      (r) => {
        var _a;
        return ((_a = r.claimedBy) == null ? void 0 : _a.toString()) === ngoId.toString() && r.status !== RequestStatus.delivered;
      }
    ).length;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_ngos.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: t("adminNGOs.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("adminNGOs.subtitle") })
      ] }),
      !loadingNGOs && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "text-xs",
          "data-ocid": "admin_ngos.count_badge",
          children: [
            (ngos == null ? void 0 : ngos.length) ?? 0,
            " NGOs"
          ]
        }
      )
    ] }),
    loadingNGOs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, k)) }) : !ngos || ngos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground text-sm bg-muted/30 rounded-2xl",
        "data-ocid": "admin_ngos.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 32, className: "mx-auto mb-3 opacity-30" }),
          t("adminNGOs.noNGOs")
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "admin_ngos.table.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: t("adminNGOs.title") }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
          t("adminNGOs.name"),
          t("adminNGOs.phone"),
          t("adminNGOs.location"),
          `${t("adminNGOs.radius")} (${t("adminNGOs.km")})`,
          "Active Requests",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: `px-4 py-2.5 text-xs font-medium text-muted-foreground ${["Active Requests"].includes(h) ? "text-center" : "text-left"}`,
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: ngos.map((ngo, i) => {
          const activeCount = activeCountForNGO(ngo.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
              tabIndex: 0,
              onClick: () => setSelectedNGO(ngo),
              onKeyDown: (e) => e.key === "Enter" && setSelectedNGO(ngo),
              "data-ocid": `admin_ngos.table.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 14, className: "text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: ngo.orgName })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                  ngo.contactPhone
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                  ngo.location.lat.toFixed(3),
                  ",",
                  " ",
                  ngo.location.lng.toFixed(3)
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 11 }),
                  ngo.serviceRadius
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: activeCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px]",
                    style: {
                      background: "oklch(0.58 0.24 30 / 0.1)",
                      color: "oklch(0.58 0.24 30)",
                      borderColor: "oklch(0.58 0.24 30 / 0.25)"
                    },
                    children: [
                      activeCount,
                      " active"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 gap-1 text-xs",
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedNGO(ngo);
                    },
                    "data-ocid": `admin_ngos.view_inventory_button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 12 }),
                      t("ngoInventory.title"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 })
                    ]
                  }
                ) })
              ]
            },
            ngo.id.toString()
          );
        }) })
      ] }) }) })
    ] }),
    selectedNGO && /* @__PURE__ */ jsxRuntimeExports.jsx(
      InventoryPanel,
      {
        ngo: selectedNGO,
        onClose: () => setSelectedNGO(null)
      }
    )
  ] });
}
export {
  AdminNGOs as default
};
