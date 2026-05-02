import { y as createLucideIcon, j as jsxRuntimeExports, l as cn, m as useBackend, D as useAuth, H as useRouter, J as useQueryClient, a as useTranslation, r as reactExports, M as ResourceType, N as UrgencyLevel, b as Link, o as Button, A as ArrowLeft, O as RESOURCE_TYPES, p as Label, I as Input, q as CircleAlert } from "./index-CiAbU5FG.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BqmZtv4m.js";
import { u as useMutation } from "./useMutation-DBzHxlcE.js";
import { u as ue } from "./index-DLXgpdSS.js";
import { R as ResourceIcon } from "./ResourceIcon-Deu_qixK.js";
import { u as useGeolocation } from "./use-geolocation-ByrQj-A_.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
import { m as motion } from "./proxy-D5o2QNSn.js";
import { C as CircleCheck } from "./circle-check-CvLyfbQt.js";
import { M as Minus, P as Plus } from "./plus-BloLSlN4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const STEPS = [
  { num: 1, label: "Resource" },
  { num: 2, label: "Urgency" },
  { num: 3, label: "Details" },
  { num: 4, label: "Location" }
];
function UserNewRequest() {
  const { actor } = useBackend();
  const { userProfile } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { lat, lng } = useGeolocation();
  const [resourceType, setResourceType] = reactExports.useState(
    ResourceType.food
  );
  const [urgency, setUrgency] = reactExports.useState(UrgencyLevel.medium);
  const [quantity, setQuantity] = reactExports.useState(1);
  const [description, setDescription] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState(
    (userProfile == null ? void 0 : userProfile.location) ?? null
  );
  const [locationFromGps, setLocationFromGps] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (lat !== null && lng !== null && lat !== 0 && lng !== 0 && !locationFromGps) {
      setLocation({ lat, lng });
      setLocationFromGps(true);
    }
  }, [lat, lng, locationFromGps]);
  const URGENCY_META = {
    [UrgencyLevel.high]: {
      label: t("urgency.high"),
      description: t("urgency.highDesc"),
      activeStyle: {
        color: "oklch(var(--accent))",
        background: "oklch(var(--accent) / 0.1)"
      },
      activeBorder: "border-accent"
    },
    [UrgencyLevel.medium]: {
      label: t("urgency.medium"),
      description: t("urgency.mediumDesc"),
      activeStyle: {
        color: "oklch(var(--chart-2))",
        background: "oklch(var(--chart-2) / 0.1)"
      },
      activeBorder: "border-chart-2"
    },
    [UrgencyLevel.low]: {
      label: t("urgency.low"),
      description: t("urgency.lowDesc"),
      activeStyle: {
        color: "oklch(var(--secondary))",
        background: "oklch(var(--secondary) / 0.1)"
      },
      activeBorder: "border-secondary"
    }
  };
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const finalLocation = location ?? {
        lat: 20.5937,
        lng: 78.9629
      };
      return actor.createRequest({
        resourceType,
        urgency,
        quantity: BigInt(quantity),
        description: description.trim() || void 0,
        userLocation: finalLocation
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
      ue.success(t("userNewRequest.successMessage"), {
        description: t("userNewRequest.submit")
      });
      router.navigate({ to: "/user/dashboard" });
    },
    onError: () => {
      ue.error(t("userNewRequest.errorGeneral"));
    }
  });
  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate();
  }
  function adjustQuantity(delta) {
    setQuantity((q) => Math.max(1, q + delta));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-lg lg:max-w-2xl mx-auto pb-10",
      "data-ocid": "user_new_request.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/user/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "aria-label": t("userNewRequest.backToDashboard"),
              className: "h-9 w-9",
              "data-ocid": "user_new_request.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl lg:text-2xl font-display font-bold text-foreground leading-tight", children: t("userNewRequest.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("userNewRequest.subtitle") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex lg:flex-col lg:w-48 xl:w-56 shrink-0 gap-1 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Steps" }),
            STEPS.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-3",
                "data-ocid": `user_new_request.step_indicator.${step.num}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      style: {
                        background: "oklch(var(--primary))",
                        color: "oklch(var(--primary-foreground))"
                      },
                      children: step.num
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: step.label }),
                  idx < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute left-3.5 mt-7 h-5 w-px bg-border",
                      style: {
                        position: "relative",
                        marginLeft: "-calc(100% - 28px)"
                      }
                    }
                  )
                ]
              },
              step.num
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 p-3 rounded-xl bg-muted/40 border border-border space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: resourceType, size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-foreground font-medium", children: t(`resources.${resourceType}`, { defaultValue: resourceType }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Urgency:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium capitalize", children: urgency })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Qty:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: quantity })
              ] }),
              locationFromGps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-secondary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GPS captured" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border",
                "data-ocid": "user_new_request.resource_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold",
                        style: { background: "oklch(var(--primary))" },
                        children: "1"
                      }
                    ),
                    t("userNewRequest.selectResource")
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-2", children: RESOURCE_TYPES.map((rt, idx) => {
                    const isSelected = resourceType === rt.value;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.button,
                      {
                        type: "button",
                        onClick: () => setResourceType(rt.value),
                        whileTap: { scale: 0.97 },
                        className: `flex items-center gap-3 p-3 rounded-xl border text-left transition-smooth ${isSelected ? "border-primary shadow-sm" : "border-border hover:bg-muted/50"}`,
                        style: isSelected ? { background: "oklch(var(--primary) / 0.06)" } : void 0,
                        "data-ocid": `user_new_request.resource_${rt.value}`,
                        initial: { opacity: 0, y: 6 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.2, delay: idx * 0.05 },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: `h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "" : "bg-muted"}`,
                              style: isSelected ? { background: "oklch(var(--primary) / 0.12)" } : void 0,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResourceIcon, { type: rt.value, size: 18 })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: `text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`,
                                children: t(rt.labelKey)
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: t(rt.descKey) })
                          ] }),
                          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            CircleCheck,
                            {
                              size: 15,
                              className: "shrink-0 ml-auto text-primary"
                            }
                          )
                        ]
                      },
                      rt.value
                    );
                  }) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border-border",
                "data-ocid": "user_new_request.urgency_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold",
                        style: { background: "oklch(var(--primary))" },
                        children: "2"
                      }
                    ),
                    t("userNewRequest.selectUrgency")
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col lg:flex-row gap-2", children: [
                    UrgencyLevel.high,
                    UrgencyLevel.medium,
                    UrgencyLevel.low
                  ].map((level) => {
                    const meta = URGENCY_META[level];
                    const isSelected = urgency === level;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setUrgency(level),
                        className: `flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-smooth flex-1 ${isSelected ? `border-2 ${meta.activeBorder}` : "border-border hover:bg-muted/50"}`,
                        style: isSelected ? meta.activeStyle : void 0,
                        "data-ocid": `user_new_request.urgency_${level}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-3 w-3 rounded-full shrink-0",
                              style: isSelected ? { background: "currentColor" } : {
                                background: "oklch(var(--muted-foreground))"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: meta.label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs opacity-75 lg:hidden", children: meta.description }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden lg:block text-xs opacity-75 mt-0.5", children: meta.description })
                          ] }),
                          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15, className: "shrink-0" })
                        ]
                      },
                      level
                    );
                  }) }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold",
                    style: { background: "oklch(var(--primary))" },
                    children: "3"
                  }
                ),
                t("userNewRequest.step3")
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:grid lg:grid-cols-2 lg:gap-6 space-y-4 lg:space-y-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: t("userNewRequest.quantity") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "h-10 w-10 shrink-0",
                        onClick: () => adjustQuantity(-1),
                        disabled: quantity <= 1,
                        "aria-label": t("userNewRequest.back"),
                        "data-ocid": "user_new_request.quantity_decrease",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "quantity",
                        type: "number",
                        min: 1,
                        value: quantity,
                        onChange: (e) => setQuantity(Math.max(1, Number(e.target.value))),
                        className: "text-center text-lg font-bold h-10",
                        "data-ocid": "user_new_request.quantity_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "h-10 w-10 shrink-0",
                        onClick: () => adjustQuantity(1),
                        "aria-label": t("userNewRequest.next"),
                        "data-ocid": "user_new_request.quantity_increase",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "description",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                      children: [
                        t("userNewRequest.description"),
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "normal-case text-muted-foreground/60", children: [
                          "(",
                          t("registerUser.identityOptional"),
                          ")"
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "description",
                      value: description,
                      onChange: (e) => setDescription(e.target.value),
                      placeholder: t("userNewRequest.descriptionPlaceholder"),
                      rows: 3,
                      className: "resize-none text-sm",
                      "data-ocid": "user_new_request.description_textarea"
                    }
                  )
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold",
                    style: { background: "oklch(var(--primary))" },
                    children: "4"
                  }
                ),
                t("userNewRequest.location")
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: locationFromGps ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm",
                  "data-ocid": "user_new_request.location_gps",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: t("userNewRequest.locationDetected") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs ml-auto tabular-nums", children: [
                      location == null ? void 0 : location.lat.toFixed(4),
                      ", ",
                      location == null ? void 0 : location.lng.toFixed(4)
                    ] })
                  ]
                }
              ) : location ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm",
                  "data-ocid": "user_new_request.location_profile",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MapPin,
                      {
                        size: 14,
                        className: "text-muted-foreground shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: t("app.locationDetected") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs ml-auto tabular-nums", children: [
                      location.lat.toFixed(4),
                      ", ",
                      location.lng.toFixed(4)
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground",
                  "data-ocid": "user_new_request.location_detecting",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "animate-pulse shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("userNewRequest.locationPending") })
                  ]
                }
              ) })
            ] }),
            mutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                className: "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
                style: {
                  color: "oklch(var(--accent))",
                  background: "oklch(var(--accent) / 0.08)",
                  borderColor: "oklch(var(--accent) / 0.3)"
                },
                "data-ocid": "user_new_request.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15, className: "shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("userNewRequest.errorGeneral") })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full h-12 text-sm font-semibold gap-2",
                disabled: mutation.isPending,
                "data-ocid": "user_new_request.submit_button",
                children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }),
                  t("userNewRequest.submitting")
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
                  t("userNewRequest.submit")
                ] })
              }
            )
          ] }) })
        ] })
      ]
    }
  );
}
export {
  UserNewRequest as default
};
