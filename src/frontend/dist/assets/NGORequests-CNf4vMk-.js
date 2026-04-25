import { r as reactExports, v as useDirection, f as useControllableState, j as jsxRuntimeExports, e as Primitive, Q as useId, T as Root, V as Item, h as composeEventHandlers, P as Presence, X as createRovingFocusGroupScope, k as createContextScope, l as cn, m as useBackend, D as useAuth, J as useQueryClient, a as useTranslation, R as RequestStatus, B as Badge, E as Skeleton, G as Phone, o as Button, Y as ChevronRight } from "./index-Cru0WlOf.js";
import { C as Clock, A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BP8QDndO.js";
import { C as Card, a as CardContent } from "./card-RqapHmT1.js";
import { u as useQuery } from "./useQuery---NWOs32.js";
import { u as useMutation } from "./useMutation-BseX92Wl.js";
import { R as ResourceIcon } from "./ResourceIcon-UivtGk04.js";
import { S as StatusBadge } from "./StatusBadge-Bizm4PBs.js";
import { U as UrgencyBadge } from "./UrgencyBadge-DEimiDsW.js";
import { R as Radio } from "./radio-B5kCj8xe.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
import { C as CircleCheck } from "./circle-check-CDfIVQDZ.js";
import { T as Truck } from "./truck-Bc4rFFTm.js";
import "./index-DQwb_N1H.js";
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function formatTime(ts, t) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return t("ngoRequests.timeJustNow");
  if (diff < 36e5)
    return t("ngoRequests.timeMinAgo", { n: Math.floor(diff / 6e4) });
  if (diff < 864e5)
    return t("ngoRequests.timeHourAgo", { n: Math.floor(diff / 36e5) });
  return t("ngoRequests.timeDayAgo", { n: Math.floor(diff / 864e5) });
}
function RequestCard({
  req,
  index,
  ngoProfile,
  mode,
  userProfiles,
  onClaim,
  onUpdateStatus,
  isPendingClaim,
  isPendingUpdate
}) {
  const { t } = useTranslation();
  const dist = calcDistance(
    ngoProfile.location.lat,
    ngoProfile.location.lng,
    req.userLocation.lat,
    req.userLocation.lng
  );
  const user = userProfiles.get(req.userId.toString());
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border bg-card",
      "data-ocid": `ngo_requests.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: req.resourceType, size: 19 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm capitalize leading-tight", children: [
                req.resourceType,
                " Aid"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Qty: ",
                req.quantity.toString(),
                " · ",
                formatTime(req.createdAt, t)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: req.status, size: "sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(UrgencyBadge, { urgency: req.urgency, size: "sm" })
          ] })
        ] }),
        req.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 bg-muted/30 rounded-lg px-2.5 py-1.5", children: req.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
            t("ngoRequests.kmAway", { km: dist.toFixed(1) })
          ] }),
          user && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
            user.phone
          ] })
        ] }),
        mode === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "w-full gap-1.5 text-xs",
            onClick: () => onClaim == null ? void 0 : onClaim(req),
            disabled: isPendingClaim,
            "data-ocid": `ngo_requests.claim_button.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 }),
              isPendingClaim ? t("ngoRequests.claiming") : t("ngoRequests.claim")
            ]
          }
        ),
        mode === "active" && req.status === RequestStatus.claimed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "w-full gap-1.5 text-xs",
            onClick: () => onUpdateStatus == null ? void 0 : onUpdateStatus(req, RequestStatus.inTransit),
            disabled: isPendingUpdate,
            "data-ocid": `ngo_requests.transit_button.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 14 }),
              isPendingUpdate ? t("ngoRequests.saving") : t("ngoRequests.markInTransit")
            ]
          }
        ),
        mode === "active" && req.status === RequestStatus.inTransit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "w-full gap-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/90",
            onClick: () => onUpdateStatus == null ? void 0 : onUpdateStatus(req, RequestStatus.delivered),
            disabled: isPendingUpdate,
            "data-ocid": `ngo_requests.deliver_button.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }),
              isPendingUpdate ? t("ngoRequests.saving") : t("ngoRequests.markDelivered")
            ]
          }
        )
      ] })
    }
  );
}
function NGORequests() {
  var _a;
  const { actor, isFetching } = useBackend();
  const { ngoProfile } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [claimTarget, setClaimTarget] = reactExports.useState(null);
  const [deliverTarget, setDeliverTarget] = reactExports.useState(
    null
  );
  const { data: openRequests, isLoading: loadingOpen } = useQuery({
    queryKey: ["open-requests"],
    queryFn: async () => actor ? actor.getOpenRequests() : [],
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  const { data: myRequests, isLoading: loadingMine } = useQuery({
    queryKey: ["ngo-requests", (_a = ngoProfile == null ? void 0 : ngoProfile.id) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !ngoProfile) return [];
      return actor.getRequestsByNGO(ngoProfile.id);
    },
    enabled: !!actor && !isFetching && !!ngoProfile,
    refetchInterval: 3e4
  });
  const { data: allUsers } = useQuery({
    queryKey: ["all-users-for-ngo"],
    queryFn: async () => actor ? actor.getAllUsers() : [],
    enabled: !!actor && !isFetching,
    staleTime: 12e4
  });
  const userProfiles = new Map(
    (allUsers == null ? void 0 : allUsers.map((u) => [u.id.toString(), u])) ?? []
  );
  const claimMutation = useMutation({
    mutationFn: (id) => actor.claimRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ngo-requests"] });
      setClaimTarget(null);
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status
    }) => actor.updateRequestStatus({ requestId: id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngo-requests"] });
      setDeliverTarget(null);
    }
  });
  const activeRequests = (myRequests == null ? void 0 : myRequests.filter(
    (r) => r.status === RequestStatus.claimed || r.status === RequestStatus.inTransit
  )) ?? [];
  const sortedOpen = ngoProfile ? [...openRequests ?? []].sort((a, b) => {
    const da = calcDistance(
      ngoProfile.location.lat,
      ngoProfile.location.lng,
      a.userLocation.lat,
      a.userLocation.lng
    );
    const db = calcDistance(
      ngoProfile.location.lat,
      ngoProfile.location.lng,
      b.userLocation.lat,
      b.userLocation.lng
    );
    return da - db;
  }) : openRequests ?? [];
  function handleUpdateStatus(req, next) {
    if (next === RequestStatus.delivered) {
      setDeliverTarget(req);
    } else {
      updateMutation.mutate({ id: req.id, status: next });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-5 max-w-2xl mx-auto pb-8",
      "data-ocid": "ngo_requests.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold", children: t("ngoRequests.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("ngoRequests.subtitle") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "gap-1.5 text-secondary border-secondary/30 bg-secondary/5 shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 10, className: "animate-pulse" }),
                t("ngoDashboard.live")
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "nearby", "data-ocid": "ngo_requests.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "nearby",
                className: "gap-1.5 text-xs sm:text-sm",
                "data-ocid": "ngo_requests.nearby_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13 }),
                  t("ngoRequests.tabOpen"),
                  sortedOpen.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-5 px-1.5 text-xs bg-accent/10 text-accent border-accent/20 border", children: sortedOpen.length })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "active",
                className: "gap-1.5 text-xs sm:text-sm",
                "data-ocid": "ngo_requests.active_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 }),
                  t("ngoRequests.tabMine"),
                  activeRequests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary border-primary/20 border", children: activeRequests.length })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "nearby", className: "mt-4 space-y-3", children: loadingOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" }, i)) }) : sortedOpen.length > 0 ? sortedOpen.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            RequestCard,
            {
              req,
              index: i + 1,
              ngoProfile,
              mode: "open",
              userProfiles,
              onClaim: setClaimTarget,
              isPendingClaim: claimMutation.isPending && claimMutation.variables === req.id
            },
            req.id.toString()
          )) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-14 space-y-2",
              "data-ocid": "ngo_requests.open_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheck,
                  {
                    size: 36,
                    className: "text-muted-foreground mx-auto opacity-40"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: t("ngoRequests.noOpen") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground opacity-70", children: t("ngoRequests.noOpenSubtitle") })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "active", className: "mt-4 space-y-3", children: loadingMine ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" }, i)) }) : activeRequests.length > 0 ? activeRequests.map((req, i) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              RequestCard,
              {
                req,
                index: i + 1,
                ngoProfile,
                mode: "active",
                userProfiles,
                onUpdateStatus: handleUpdateStatus,
                isPendingUpdate: updateMutation.isPending && ((_a2 = updateMutation.variables) == null ? void 0 : _a2.id) === req.id
              },
              req.id.toString()
            );
          }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-14 space-y-2",
              "data-ocid": "ngo_requests.active_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Truck,
                  {
                    size: 36,
                    className: "text-muted-foreground mx-auto opacity-40"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: t("ngoRequests.noMine") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground opacity-70", children: t("ngoRequests.noMineSubtitle") })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!claimTarget,
            onOpenChange: (open) => !open && setClaimTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "ngo_requests.claim_dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
                  t("ngoRequests.claim"),
                  "?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: t("ngoRequests.claimDesc", {
                  resourceType: (claimTarget == null ? void 0 : claimTarget.resourceType) ?? "",
                  qty: (claimTarget == null ? void 0 : claimTarget.quantity.toString()) ?? ""
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    "data-ocid": "ngo_requests.claim_cancel_button",
                    disabled: claimMutation.isPending,
                    children: t("ngoRequests.cancel")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    "data-ocid": "ngo_requests.claim_confirm_button",
                    disabled: claimMutation.isPending,
                    onClick: () => claimTarget && claimMutation.mutate(claimTarget.id),
                    children: claimMutation.isPending ? t("ngoRequests.claiming") : t("ngoRequests.claim")
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialog,
          {
            open: !!deliverTarget,
            onOpenChange: (open) => !open && setDeliverTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "ngo_requests.deliver_dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
                  t("ngoRequests.markDelivered"),
                  "?"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: t("ngoRequests.deliverDesc", {
                  resourceType: (deliverTarget == null ? void 0 : deliverTarget.resourceType) ?? ""
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    "data-ocid": "ngo_requests.deliver_cancel_button",
                    disabled: updateMutation.isPending,
                    children: t("ngoRequests.cancel")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                    "data-ocid": "ngo_requests.deliver_confirm_button",
                    disabled: updateMutation.isPending,
                    onClick: () => deliverTarget && updateMutation.mutate({
                      id: deliverTarget.id,
                      status: RequestStatus.delivered
                    }),
                    children: updateMutation.isPending ? t("ngoRequests.saving") : t("ngoRequests.markDelivered")
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
  NGORequests as default
};
