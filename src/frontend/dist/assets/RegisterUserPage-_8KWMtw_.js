import { r as reactExports, j as jsxRuntimeExports, P as Presence, e as Primitive, f as useControllableState, g as useComposedRefs, h as composeEventHandlers, i as useSize, k as createContextScope, l as cn, u as useNavigate, m as useBackend, a as useTranslation, n as LoaderCircle, W as WifiOff, o as Button, b as Link, A as ArrowLeft, L as LanguageSwitcher, C as CircleUser, p as Label, I as Input, q as CircleAlert, s as saveSession } from "./index-Cru0WlOf.js";
import { u as usePrevious } from "./index-DZe1FG5d.js";
import { C as Check } from "./check-t-6FbMUo.js";
import { u as useForm, C as Controller } from "./index.esm-BNz1KdvY.js";
import { u as ue } from "./index-CoiouH4F.js";
import { u as useGeolocation } from "./use-geolocation-ogvJ4kWm.js";
import { M as MapPin } from "./map-pin-Bn6tOGGK.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function validateForm(values, t) {
  const errs = {};
  if (values.name.length < 2) errs.name = t("registerUser.errorNameMin");
  if (!/^\+?[0-9]{10,15}$/.test(values.phone))
    errs.phone = t("registerUser.errorPhone");
  return errs;
}
function RegisterUserPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const [location, setLocation] = reactExports.useState(null);
  const [locationAutoFilled, setLocationAutoFilled] = reactExports.useState(false);
  const [serverError, setServerError] = reactExports.useState(null);
  const { lat, lng } = useGeolocation();
  reactExports.useEffect(() => {
    if (lat !== null && lng !== null && lat !== 0 && lng !== 0 && !locationAutoFilled) {
      setLocation({ lat, lng });
      setLocationAutoFilled(true);
    }
  }, [lat, lng, locationAutoFilled]);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      aadhaarDeclared: false,
      panDeclared: false
    }
  });
  async function onSubmit(values) {
    const errs = validateForm(values, t);
    if (Object.keys(errs).length > 0) {
      for (const [field, msg] of Object.entries(errs)) {
        setError(field, { message: msg });
      }
      return;
    }
    setServerError(null);
    const finalLocation = location ?? { lat: 20.5937, lng: 78.9629 };
    if (!actor) {
      setServerError(t("registerUser.errorConnectionNotReady"));
      return;
    }
    try {
      const result = await actor.registerUser({
        name: values.name,
        phone: values.phone,
        aadhaarDeclared: values.aadhaarDeclared,
        panDeclared: values.panDeclared,
        location: finalLocation
      });
      if (result.__kind__ === "err") {
        setServerError(result.err);
        return;
      }
      saveSession({
        role: "citizen",
        userProfile: result.ok,
        ngoProfile: null,
        adminProfile: null
      });
      ue.success(t("registerUser.successMessage"));
      navigate({ to: "/user/dashboard" });
    } catch (error) {
      console.error("[RegisterUserPage] registerUser error:", error);
      const isNetworkError = error instanceof Error && (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError ? t("registerUser.errorNetwork") : t("registerUser.errorGeneral")
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
          "data-ocid": "register_user.retry_button",
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
          "data-ocid": "register_user.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 15 }),
            t("registerUser.chooseRole")
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
            background: "linear-gradient(135deg, oklch(0.55 0.22 25 / 0.08), oklch(0.58 0.17 145 / 0.06))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 28, className: "text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: t("registerUser.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("registerUser.subtitle") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: t("registerUser.nameLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              placeholder: t("registerUser.namePlaceholder"),
              autoComplete: "name",
              ...register("name"),
              "data-ocid": "register_user.name_input"
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-accent flex items-center gap-1",
              "data-ocid": "register_user.name_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                errors.name.message
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: t("registerUser.phoneLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phone",
              type: "tel",
              placeholder: t("registerUser.phonePlaceholder"),
              autoComplete: "tel",
              ...register("phone"),
              "data-ocid": "register_user.phone_input"
            }
          ),
          errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-accent flex items-center gap-1",
              "data-ocid": "register_user.phone_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                errors.phone.message
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("registerUser.locationLabel") }),
          location ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm",
              "data-ocid": "register_user.location_detected",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: t("registerUser.locationDetected") }),
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
              "data-ocid": "register_user.location_pending",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "animate-pulse shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("registerUser.locationPending") })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-border rounded-xl p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-foreground", children: [
            t("registerUser.identityTitle"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: t("registerUser.identityOptional") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("registerUser.identityDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Controller,
            {
              name: "aadhaarDeclared",
              control,
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    id: "aadhaar",
                    checked: field.value,
                    onCheckedChange: field.onChange,
                    "data-ocid": "register_user.aadhaar_checkbox"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "aadhaar",
                    className: "text-sm font-normal cursor-pointer",
                    children: t("registerUser.aadhaarLabel")
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Controller,
            {
              name: "panDeclared",
              control,
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    id: "pan",
                    checked: field.value,
                    onCheckedChange: field.onChange,
                    "data-ocid": "register_user.pan_checkbox"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "pan",
                    className: "text-sm font-normal cursor-pointer",
                    children: t("registerUser.panLabel")
                  }
                )
              ] })
            }
          )
        ] }),
        serverError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2",
            "data-ocid": "register_user.error_state",
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
            "data-ocid": "register_user.submit_button",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2" }),
              t("registerUser.registering")
            ] }) : t("registerUser.submitButton")
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  RegisterUserPage as default
};
