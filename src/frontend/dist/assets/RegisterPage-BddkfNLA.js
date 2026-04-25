import { u as useNavigate, a as useTranslation, j as jsxRuntimeExports, A as ArrowLeft, L as LanguageSwitcher, b as Link, c as APP_NAME, B as Badge, d as ArrowRight } from "./index-Cru0WlOf.js";
import { C as CircleCheck } from "./circle-check-CDfIVQDZ.js";
const ROLES = [
  {
    id: "user",
    icon: "🧑‍💼",
    titleKey: "register.citizen.title",
    badgeKey: "register.citizen.badge",
    badgeVariant: "default",
    descKey: "register.citizen.desc",
    featureKeys: [
      "register.citizen.features.0",
      "register.citizen.features.1",
      "register.citizen.features.2",
      "register.citizen.features.3"
    ],
    registerButtonKey: "register.citizen.registerButton",
    path: "/register/user",
    borderHover: "hover:border-primary/50"
  },
  {
    id: "ngo",
    icon: "🏢",
    titleKey: "register.ngo.title",
    badgeKey: "register.ngo.badge",
    badgeVariant: "secondary",
    descKey: "register.ngo.desc",
    featureKeys: [
      "register.ngo.features.0",
      "register.ngo.features.1",
      "register.ngo.features.2",
      "register.ngo.features.3"
    ],
    registerButtonKey: "register.ngo.registerButton",
    path: "/register/ngo",
    borderHover: "hover:border-secondary/50"
  },
  {
    id: "admin",
    icon: "🛡️",
    titleKey: "register.admin.title",
    badgeKey: "register.admin.badge",
    badgeVariant: "outline",
    descKey: "register.admin.desc",
    featureKeys: [
      "register.admin.features.0",
      "register.admin.features.1",
      "register.admin.features.2",
      "register.admin.features.3"
    ],
    registerButtonKey: "register.admin.registerButton",
    path: "/register/admin",
    borderHover: "hover:border-accent/50"
  }
];
function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-48 rounded-full opacity-[0.06] blur-3xl",
        style: { background: "oklch(0.55 0.22 25)" }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col flex-1 items-center px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-3xl mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: "/login" }),
            className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
            "data-ocid": "register.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
              t("register.backToLogin")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            t("register.alreadyRegistered"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/login",
                className: "text-primary font-medium hover:underline",
                "data-ocid": "register.login_link",
                children: t("register.signIn")
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground tracking-tight", children: t("register.title", { appName: APP_NAME }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 max-w-md", children: t("register.subtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-5", children: ROLES.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: card.path }),
          className: `group bg-card border border-border rounded-2xl p-6 text-left flex flex-col gap-4 ${card.borderHover} hover:shadow-lg transition-smooth cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
          "data-ocid": `register.role_card.${card.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: card.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: card.badgeVariant, className: "text-xs", children: t(card.badgeKey) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold text-foreground", children: t(card.titleKey) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed", children: t(card.descKey) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-1.5 flex-1", children: card.featureKeys.map((fk) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-2 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 13,
                      className: "mt-0.5 shrink-0 text-secondary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t(fk) })
                ]
              },
              fk
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-auto flex items-center justify-center gap-1.5 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth pointer-events-none", children: [
              t(card.registerButtonKey),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 15 })
            ] })
          ]
        },
        card.id
      )) })
    ] })
  ] });
}
export {
  RegisterPage as default
};
