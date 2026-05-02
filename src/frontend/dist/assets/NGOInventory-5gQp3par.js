import { y as createLucideIcon, m as useBackend, D as useAuth, J as useQueryClient, a as useTranslation, r as reactExports, O as RESOURCE_TYPES, j as jsxRuntimeExports, _ as Package, E as Skeleton, $ as ChevronUp, a0 as ChevronDown, M as ResourceType, p as Label, o as Button, I as Input, B as Badge } from "./index-CiAbU5FG.js";
import { C as Clock, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-RTPe9jcp.js";
import { C as Card, a as CardContent } from "./card-BqmZtv4m.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-D-eG3bVa.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { u as useMutation } from "./useMutation-DBzHxlcE.js";
import { R as ResourceIcon } from "./ResourceIcon-Deu_qixK.js";
import { M as Minus, P as Plus } from "./plus-BloLSlN4.js";
import { T as TrendingUp } from "./trending-up-BHLHvghb.js";
import "./index-CMDLVgzj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
function formatTime(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return new Date(ms).toLocaleDateString();
}
function InventoryCard({
  resourceType,
  label,
  quantity,
  lastUpdated,
  index,
  onEdit
}) {
  const { t } = useTranslation();
  const isLow = quantity < 10;
  const isOut = quantity === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border bg-card",
      "data-ocid": `ngo_inventory.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: resourceType, size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-tight", children: label }),
              lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                formatTime(lastUpdated)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-8 w-8 p-0 shrink-0",
              onClick: () => onEdit(resourceType),
              "data-ocid": `ngo_inventory.edit_button.${index}`,
              "aria-label": `${t("ngoInventory.update")} ${label}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-3xl font-bold font-display ${isOut ? "text-accent" : isLow ? "text-chart-2" : "text-foreground"}`,
                children: quantity
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              t("ngoInventory.quantity"),
              " in stock"
            ] })
          ] }),
          isOut && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 border text-xs", children: "Out of stock" }),
          isLow && !isOut && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "text-xs border",
              style: {
                backgroundColor: "oklch(var(--chart-2) / 0.1)",
                color: "oklch(var(--chart-2))",
                borderColor: "oklch(var(--chart-2) / 0.25)"
              },
              children: "Low stock"
            }
          )
        ] })
      ] })
    }
  );
}
function NGOInventory() {
  var _a, _b, _c;
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [editState, setEditState] = reactExports.useState(null);
  const [confirmTarget, setConfirmTarget] = reactExports.useState(null);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const { data: inventory, isLoading } = useQuery({
    queryKey: ["ngo-inventory", (_a = ngoProfile == null ? void 0 : ngoProfile.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getNGOInventory(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile
  });
  const updateMutation = useMutation({
    mutationFn: (args) => actor.updateInventory({
      resourceType: args.resourceType,
      delta: BigInt(args.delta),
      reason: args.reason
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo-inventory"] });
      setEditState(null);
      setConfirmTarget(null);
    }
  });
  const inventoryMap = new Map(
    inventory == null ? void 0 : inventory.map((inv) => [inv.resourceType, inv])
  );
  const totalUnits = (inventory == null ? void 0 : inventory.reduce((sum, inv) => sum + Number(inv.quantity), 0)) ?? 0;
  const outOfStock = RESOURCE_TYPES.filter(
    (rt) => {
      var _a2;
      return (((_a2 = inventoryMap.get(rt.value)) == null ? void 0 : _a2.quantity) ?? 0n) === 0n;
    }
  ).length;
  const lowStock = RESOURCE_TYPES.filter((rt) => {
    var _a2;
    const qty = Number(((_a2 = inventoryMap.get(rt.value)) == null ? void 0 : _a2.quantity) ?? 0n);
    return qty > 0 && qty < 10;
  }).length;
  const wellStocked = RESOURCE_TYPES.filter(
    (rt) => {
      var _a2;
      return Number(((_a2 = inventoryMap.get(rt.value)) == null ? void 0 : _a2.quantity) ?? 0n) >= 10;
    }
  ).length;
  function openEdit(resourceType) {
    setEditState({ resourceType, delta: 10, reason: "" });
  }
  function handleEditSubmit() {
    if (!editState) return;
    setConfirmTarget(editState);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-6 max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto pb-8",
      "data-ocid": "ngo_inventory.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: t("ngoInventory.title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("ngoInventory.subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: totalUnits }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total Units" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-bold ${outOfStock > 0 ? "text-accent" : "text-secondary"}`,
                children: outOfStock
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Out of Stock" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center hidden lg:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-2xl font-bold ${lowStock > 0 ? "text-chart-2" : "text-secondary"}`,
                children: lowStock
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Low Stock" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-3 text-center hidden lg:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-secondary", children: wellStocked }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Well Stocked" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 14, className: "text-primary" }),
            t("ngoInventory.resource"),
            " by Category"
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: RESOURCE_TYPES.map((rt, i) => {
            const inv = inventoryMap.get(rt.value);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              InventoryCard,
              {
                resourceType: rt.value,
                label: t(rt.labelKey),
                quantity: inv ? Number(inv.quantity) : 0,
                lastUpdated: inv == null ? void 0 : inv.lastUpdated,
                index: i + 1,
                onEdit: openEdit
              },
              rt.value
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border border-border rounded-xl overflow-hidden",
            "data-ocid": "ngo_inventory.history_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "w-full flex items-center justify-between p-4 bg-card text-sm font-semibold hover:bg-muted/30 transition-smooth",
                  onClick: () => setHistoryOpen((p) => !p),
                  "data-ocid": "ngo_inventory.history_toggle",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 14, className: "text-muted-foreground" }),
                      "Inventory History"
                    ] }),
                    historyOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 15, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 15, className: "text-muted-foreground" })
                  ]
                }
              ),
              historyOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background border-t border-border", children: inventory && inventory.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: [...inventory].sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated)).map((inv, i) => {
                const rt = RESOURCE_TYPES.find(
                  (r) => r.value === inv.resourceType
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-3 px-4 py-3",
                    "data-ocid": `ngo_inventory.history_item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: inv.resourceType, size: 15 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: rt ? t(rt.labelKey) : rt }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatTime(inv.lastUpdated) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground", children: [
                        Number(inv.quantity),
                        " units"
                      ] }) })
                    ]
                  },
                  `${inv.resourceType}-${i}`
                );
              }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "py-8 text-center text-sm text-muted-foreground",
                  "data-ocid": "ngo_inventory.history_empty_state",
                  children: "No inventory updates recorded yet"
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!editState,
            onOpenChange: (open) => !open && setEditState(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "max-w-sm lg:max-w-lg",
                "data-ocid": "ngo_inventory.edit_dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ResourceIcon,
                      {
                        type: (editState == null ? void 0 : editState.resourceType) ?? ResourceType.food,
                        size: 16
                      }
                    ),
                    t("ngoInventory.updateStock"),
                    " ",
                    editState && RESOURCE_TYPES.find((r) => r.value === editState.resourceType) ? t(
                      RESOURCE_TYPES.find(
                        (r) => r.value === editState.resourceType
                      ).labelKey
                    ) : ""
                  ] }) }),
                  editState && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl p-3 text-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Current Stock" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold font-display", children: Number(
                        ((_b = inventoryMap.get(editState.resourceType)) == null ? void 0 : _b.quantity) ?? 0n
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs mb-2 block", children: "Adjust by (positive = add, negative = remove)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            type: "button",
                            variant: "outline",
                            size: "icon",
                            className: "h-9 w-9 shrink-0",
                            onClick: () => setEditState(
                              (p) => p ? { ...p, delta: Math.max(-9999, p.delta - 5) } : p
                            ),
                            "data-ocid": "ngo_inventory.delta_minus",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            type: "number",
                            value: editState.delta,
                            onChange: (e) => setEditState(
                              (p) => p ? { ...p, delta: Number(e.target.value) } : p
                            ),
                            className: "text-center font-semibold text-base",
                            "data-ocid": "ngo_inventory.delta_input"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            type: "button",
                            variant: "outline",
                            size: "icon",
                            className: "h-9 w-9 shrink-0",
                            onClick: () => setEditState(
                              (p) => p ? { ...p, delta: p.delta + 5 } : p
                            ),
                            "data-ocid": "ngo_inventory.delta_plus",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2", children: [
                        editState.delta >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 13, className: "text-secondary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 13, className: "text-accent" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "New total:",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: Math.max(
                            0,
                            Number(
                              ((_c = inventoryMap.get(editState.resourceType)) == null ? void 0 : _c.quantity) ?? 0n
                            ) + editState.delta
                          ) }),
                          " ",
                          "units"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reason", className: "text-xs mb-1.5 block", children: "Reason *" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "reason",
                          value: editState.reason,
                          onChange: (e) => setEditState(
                            (p) => p ? { ...p, reason: e.target.value } : p
                          ),
                          placeholder: "e.g. Received donation, Deployed supplies",
                          "data-ocid": "ngo_inventory.reason_input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          className: "flex-1",
                          onClick: () => setEditState(null),
                          "data-ocid": "ngo_inventory.edit_cancel_button",
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          className: "flex-1",
                          disabled: !editState.reason.trim(),
                          onClick: handleEditSubmit,
                          "data-ocid": "ngo_inventory.edit_confirm_button",
                          children: t("ngoInventory.update")
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!confirmTarget,
            onOpenChange: (open) => !open && setConfirmTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "ngo_inventory.confirm_dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: t("ngoInventory.updateStock") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  "You are ",
                  ((confirmTarget == null ? void 0 : confirmTarget.delta) ?? 0) >= 0 ? "adding" : "removing",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
                    Math.abs((confirmTarget == null ? void 0 : confirmTarget.delta) ?? 0),
                    " units"
                  ] }),
                  " ",
                  ((confirmTarget == null ? void 0 : confirmTarget.delta) ?? 0) >= 0 ? "to" : "from",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground capitalize", children: confirmTarget && RESOURCE_TYPES.find(
                    (r) => r.value === confirmTarget.resourceType
                  ) ? t(
                    RESOURCE_TYPES.find(
                      (r) => r.value === confirmTarget.resourceType
                    ).labelKey
                  ) : "" }),
                  " ",
                  "stock. Reason: “",
                  confirmTarget == null ? void 0 : confirmTarget.reason,
                  "”"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    "data-ocid": "ngo_inventory.confirm_cancel_button",
                    disabled: updateMutation.isPending,
                    onClick: () => setConfirmTarget(null),
                    children: "Go Back"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    "data-ocid": "ngo_inventory.confirm_submit_button",
                    disabled: updateMutation.isPending,
                    onClick: () => confirmTarget && updateMutation.mutate(confirmTarget),
                    children: updateMutation.isPending ? t("ngoInventory.saving") : t("ngoInventory.save")
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  NGOInventory as default
};
