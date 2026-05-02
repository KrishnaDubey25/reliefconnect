import { u as useNavigate, m as useBackend, a as useTranslation, r as reactExports, j as jsxRuntimeExports, n as LoaderCircle, W as WifiOff, o as Button, b as Link, A as ArrowLeft, L as LanguageSwitcher, S as Shield, K as KeyRound, p as Label, I as Input, q as CircleAlert, s as saveSession } from "./index-CiAbU5FG.js";
import { u as useForm } from "./index.esm-C1IGl1cK.js";
import { u as ue } from "./index-DLXgpdSS.js";
import { C as CircleCheck } from "./circle-check-CvLyfbQt.js";
function RegisterAdminPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const [serverError, setServerError] = reactExports.useState(null);
  const [alreadyExists, setAlreadyExists] = reactExports.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { secretKey: "" } });
  async function onSubmit(values) {
    if (!values.secretKey.trim()) return;
    setServerError(null);
    setAlreadyExists(false);
    if (!actor) {
      setServerError(t("registerAdmin.errorConnectionNotReady"));
      return;
    }
    try {
      const result = await actor.registerAdmin({ secretKey: values.secretKey });
      if (result.__kind__ === "err") {
        if (result.err.toLowerCase().includes("already")) {
          setAlreadyExists(true);
          return;
        }
        setServerError(result.err ?? t("registerAdmin.errorGeneral"));
        return;
      }
      saveSession({
        role: "admin",
        userProfile: null,
        ngoProfile: null,
        adminProfile: result.ok
      });
      ue.success(t("registerAdmin.successMessage"));
      navigate({ to: "/admin/dashboard" });
    } catch (error) {
      console.error("[RegisterAdminPage] registerAdmin error:", error);
      const isNetworkError = error instanceof Error && (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError ? t("registerUser.errorNetwork") : t("registerAdmin.errorGeneral")
      );
    }
  }
  if (!actor && isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 32, className: "animate-spin text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("app.connecting") })
    ] });
  }
  if (!actor && !isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 26, className: "text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: t("app.connectionNotReady") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("app.connectionError") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => window.location.reload(),
          "data-ocid": "register_admin.retry_button",
          children: t("app.refreshPage")
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex flex-col items-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/register",
          className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "register_admin.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 15 }),
            t("registerAdmin.chooseRole")
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-6 py-5 border-b border-border flex items-center gap-3",
          style: {
            background: "linear-gradient(135deg, oklch(0.60 0.20 35 / 0.08), oklch(0.55 0.22 25 / 0.06))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 28, className: "text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: t("registerAdmin.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("registerAdmin.subtitle") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-border rounded-xl p-3 flex items-start gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 15, className: "text-primary mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("login.admin.restricted") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "secretKey", children: t("registerAdmin.secretKeyLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "secretKey",
              type: "password",
              placeholder: t("registerAdmin.secretKeyPlaceholder"),
              autoComplete: "current-password",
              ...register("secretKey", {
                required: t("login.admin.secretKeyRequired"),
                minLength: {
                  value: 1,
                  message: t("login.admin.secretKeyRequired")
                }
              }),
              "data-ocid": "register_admin.secret_key_input"
            }
          ),
          errors.secretKey && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-accent flex items-center gap-1",
              "data-ocid": "register_admin.secret_key_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                errors.secretKey.message
              ]
            }
          )
        ] }),
        alreadyExists && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 text-sm bg-secondary/10 border border-secondary/30 rounded-lg px-3 py-3",
            "data-ocid": "register_admin.already_exists_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircleCheck,
                {
                  size: 15,
                  className: "mt-0.5 shrink-0 text-secondary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Admin account already exists" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  t("login.alreadyRegistered"),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/login",
                      className: "text-primary font-medium hover:underline",
                      "data-ocid": "register_admin.go_to_login_link",
                      children: t("login.signIn")
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        serverError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2",
            "data-ocid": "register_admin.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15 }),
              serverError
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full h-11 font-semibold",
            disabled: isSubmitting,
            "data-ocid": "register_admin.submit_button",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2" }),
              t("registerAdmin.registering")
            ] }) : t("registerAdmin.submitButton")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [
          t("login.alreadyRegistered"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/login",
              className: "text-primary font-medium hover:underline",
              "data-ocid": "register_admin.login_link",
              children: t("login.signIn")
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  RegisterAdminPage as default
};
