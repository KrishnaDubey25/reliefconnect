import { m as useBackend, r as reactExports, a as useTranslation, j as jsxRuntimeExports, E as Skeleton, ab as Users, I as Input, B as Badge } from "./index-CiAbU5FG.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BqmZtv4m.js";
import { u as useQuery } from "./useQuery-oUz82WNj.js";
import { S as ShieldCheck } from "./shield-check-CckCqLqA.js";
import { S as Search } from "./search-DjHBOEAz.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
function VerifBadge({ declared }) {
  const { t } = useTranslation();
  return declared ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: "text-[10px] gap-1 bg-secondary/10 text-secondary border border-secondary/20 font-medium",
      variant: "outline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 10 }),
        t("adminUsers.declared")
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      className: "text-[10px] bg-muted text-muted-foreground border border-border font-medium",
      variant: "outline",
      children: t("adminUsers.pending")
    }
  );
}
function AdminUsers() {
  const { actor, isFetching } = useBackend();
  const [search, setSearch] = reactExports.useState("");
  const { t } = useTranslation();
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => actor.getAllUsers(),
    enabled: !!actor && !isFetching
  });
  const { data: verification, isLoading: loadingVerification } = useQuery({
    queryKey: ["admin-verification-counts"],
    queryFn: () => actor.getVerificationCounts(),
    enabled: !!actor && !isFetching
  });
  const sorted = [...users ?? []].sort((a, b) => Number(b.registeredAt - a.registeredAt)).filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_users.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold", children: t("adminUsers.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: t("adminUsers.subtitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6",
        "data-ocid": "admin_users.verification_summary.section",
        children: loadingVerification ? ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, k)) : [
          {
            label: t("adminDashboard.verification.totalUsers"),
            value: (verification == null ? void 0 : verification.totalUsers) ?? 0n,
            icon: Users,
            colorClass: "text-primary"
          },
          {
            label: t("adminDashboard.verification.bothDeclared"),
            value: (verification == null ? void 0 : verification.bothDeclared) ?? 0n,
            icon: ShieldCheck,
            colorClass: "text-secondary"
          },
          {
            label: t("adminDashboard.verification.aadhaarDeclared"),
            value: (verification == null ? void 0 : verification.aadhaarDeclared) ?? 0n,
            icon: ShieldCheck,
            colorClass: "text-primary"
          },
          {
            label: t("adminDashboard.verification.panDeclared"),
            value: (verification == null ? void 0 : verification.panDeclared) ?? 0n,
            icon: ShieldCheck,
            colorClass: "text-chart-5"
          }
        ].map(({ label, value, icon: Icon, colorClass }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border-border",
            "data-ocid": `admin_users.verification_summary.item.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: `${colorClass} shrink-0` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground", children: value.toString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
              ] })
            ] })
          },
          label
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", "data-ocid": "admin_users.table.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: t("adminUsers.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-56 lg:w-96", children: [
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
              placeholder: t("adminUsers.searchPlaceholder"),
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-8 h-8 text-xs",
              "data-ocid": "admin_users.search_input"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, k)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-12 text-muted-foreground text-sm",
          "data-ocid": "admin_users.empty_state",
          children: search ? t("adminUsers.noUsers") : t("adminUsers.noUsers")
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/40", children: [
          t("adminUsers.name"),
          t("adminUsers.phone"),
          t("adminUsers.location"),
          t("adminUsers.aadhaar"),
          t("adminUsers.pan"),
          "Registered"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: `px-4 py-2.5 text-xs font-medium text-muted-foreground ${[
              t("adminUsers.aadhaar"),
              t("adminUsers.pan")
            ].includes(h) ? "text-center" : h === "Registered" ? "text-right" : "text-left"}`,
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
            "data-ocid": `admin_users.table.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: user.phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 11 }),
                user.location.lat.toFixed(3),
                ",",
                " ",
                user.location.lng.toFixed(3)
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerifBadge, { declared: user.aadhaarDeclared }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerifBadge, { declared: user.panDeclared }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground", children: new Date(
                Number(user.registeredAt) / 1e6
              ).toLocaleDateString() })
            ]
          },
          user.id.toString()
        )) })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminUsers as default
};
