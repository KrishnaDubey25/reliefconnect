import { r as reactExports, f as useControllableState, j as jsxRuntimeExports, h as composeEventHandlers, e as Primitive, g as useComposedRefs, t as createCollection, v as useDirection, i as useSize, k as createContextScope, l as cn, u as useNavigate, m as useBackend, a as useTranslation, n as LoaderCircle, W as WifiOff, o as Button, b as Link, A as ArrowLeft, L as LanguageSwitcher, w as Building2, p as Label, I as Input, q as CircleAlert, s as saveSession } from "./index-CiAbU5FG.js";
import { c as clamp } from "./index-IXOTxK3N.js";
import { u as usePrevious } from "./index-D2EEVvoq.js";
import { u as useForm, C as Controller } from "./index.esm-C1IGl1cK.js";
import { u as ue } from "./index-DLXgpdSS.js";
import { u as useGeolocation } from "./use-geolocation-ByrQj-A_.js";
import { R as Radio } from "./radio-Cdc0W9JI.js";
import { M as MapPin } from "./map-pin-I1-Z29is.js";
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        var _a;
        const thumbs = [...thumbRefs.current];
        (_a = thumbs[valueIndexToChangeRef.current]) == null ? void 0 : _a.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size == null ? void 0 : size[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SliderBubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var SliderBubbleInput = reactExports.forwardRef(
  ({ __scopeSlider, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        style: { display: "none" },
        ...props,
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = reactExports.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (value2, _) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          `${value2}`
        ))
      ]
    }
  );
}
function validateForm(values, t) {
  const errs = {};
  if (values.orgName.length < 2)
    errs.orgName = t("registerNGO.orgNameError") || "Organisation name must be at least 2 characters";
  if (!/^\+?[0-9]{10,15}$/.test(values.contactPhone))
    errs.contactPhone = t("registerUser.errorPhone");
  return errs;
}
function RegisterNGOPage() {
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
    watch,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { orgName: "", contactPhone: "", serviceRadius: 25 }
  });
  const radiusValue = watch("serviceRadius");
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
      setServerError(t("registerNGO.errorConnectionNotReady"));
      return;
    }
    try {
      const result = await actor.registerNGO({
        orgName: values.orgName,
        contactPhone: values.contactPhone,
        serviceRadius: values.serviceRadius,
        location: finalLocation
      });
      if (result.__kind__ === "err") {
        setServerError(result.err);
        return;
      }
      saveSession({
        role: "ngo",
        userProfile: null,
        ngoProfile: result.ok,
        adminProfile: null
      });
      ue.success(t("registerNGO.successMessage"));
      navigate({ to: "/ngo/dashboard" });
    } catch (error) {
      console.error("[RegisterNGOPage] registerNGO error:", error);
      const isNetworkError = error instanceof Error && (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError ? t("registerNGO.errorNetwork") : t("registerNGO.errorGeneral")
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
          "data-ocid": "register_ngo.retry_button",
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
          "data-ocid": "register_ngo.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 15 }),
            t("registerNGO.chooseRole")
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
            background: "linear-gradient(135deg, oklch(0.58 0.17 145 / 0.08), oklch(0.55 0.22 25 / 0.06))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 28, className: "text-secondary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: t("registerNGO.title") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("registerNGO.subtitle") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "p-6 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "orgName", children: t("registerNGO.orgNameLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "orgName",
              placeholder: t("registerNGO.orgNamePlaceholder"),
              ...register("orgName"),
              "data-ocid": "register_ngo.orgname_input"
            }
          ),
          errors.orgName && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-accent flex items-center gap-1",
              "data-ocid": "register_ngo.orgname_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                errors.orgName.message
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contactPhone", children: t("registerNGO.phoneLabel") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "contactPhone",
              type: "tel",
              placeholder: t("registerNGO.phonePlaceholder"),
              autoComplete: "tel",
              ...register("contactPhone"),
              "data-ocid": "register_ngo.phone_input"
            }
          ),
          errors.contactPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-accent flex items-center gap-1",
              "data-ocid": "register_ngo.phone_field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 12 }),
                errors.contactPhone.message
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 14, className: "text-primary" }),
              t("registerNGO.serviceRadiusLabel")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-primary tabular-nums", children: [
              radiusValue,
              " km"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Controller,
            {
              name: "serviceRadius",
              control,
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Slider,
                {
                  min: 5,
                  max: 100,
                  step: 5,
                  value: [field.value],
                  onValueChange: ([val]) => field.onChange(val),
                  className: "w-full",
                  "data-ocid": "register_ngo.radius_slider"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 km" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50 km" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100 km" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Requests within",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
              radiusValue,
              " km"
            ] }),
            " ",
            "of your location will appear in your dashboard."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("registerNGO.locationLabel") }),
          location ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm",
              "data-ocid": "register_ngo.location_detected",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-secondary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: t("registerNGO.locationDetected") }),
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
              "data-ocid": "register_ngo.location_pending",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "animate-pulse shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("registerNGO.locationPending") })
              ]
            }
          )
        ] }),
        serverError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2",
            "data-ocid": "register_ngo.error_state",
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
            "data-ocid": "register_ngo.submit_button",
            children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2" }),
              t("registerNGO.registering")
            ] }) : t("registerNGO.submitButton")
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  RegisterNGOPage as default
};
