import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  Radio,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LanguageSwitcher } from "../components/shared/LanguageSwitcher";
import { saveSession } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";
import { useGeolocation } from "../hooks/use-geolocation";
import type { Location } from "../types";

type FormValues = {
  orgName: string;
  contactPhone: string;
  serviceRadius: number;
};

function validateForm(
  values: FormValues,
  t: (key: string) => string,
): Partial<Record<keyof FormValues, string>> {
  const errs: Partial<Record<keyof FormValues, string>> = {};
  if (values.orgName.length < 2)
    errs.orgName =
      t("registerNGO.orgNameError") ||
      "Organisation name must be at least 2 characters";
  if (!/^\+?[0-9]{10,15}$/.test(values.contactPhone))
    errs.contactPhone = t("registerUser.errorPhone");
  return errs;
}

export default function RegisterNGOPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location | null>(null);
  const [locationAutoFilled, setLocationAutoFilled] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { lat, lng } = useGeolocation();

  useEffect(() => {
    if (
      lat !== null &&
      lng !== null &&
      lat !== 0 &&
      lng !== 0 &&
      !locationAutoFilled
    ) {
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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { orgName: "", contactPhone: "", serviceRadius: 25 },
  });

  const radiusValue = watch("serviceRadius");

  async function onSubmit(values: FormValues) {
    const errs = validateForm(values, t);
    if (Object.keys(errs).length > 0) {
      for (const [field, msg] of Object.entries(errs)) {
        setError(field as keyof FormValues, { message: msg });
      }
      return;
    }
    setServerError(null);

    const finalLocation: Location = location ?? { lat: 20.5937, lng: 78.9629 };

    if (!actor) {
      setServerError(t("registerNGO.errorConnectionNotReady"));
      return;
    }

    try {
      const result = await actor.registerNGO({
        orgName: values.orgName,
        contactPhone: values.contactPhone,
        serviceRadius: values.serviceRadius,
        location: finalLocation,
      });

      if (result.__kind__ === "err") {
        setServerError(result.err);
        return;
      }

      saveSession({
        role: "ngo",
        userProfile: null,
        ngoProfile: result.ok,
        adminProfile: null,
      });
      toast.success(t("registerNGO.successMessage"));
      navigate({ to: "/ngo/dashboard" });
    } catch (error) {
      console.error("[RegisterNGOPage] registerNGO error:", error);
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError
          ? t("registerNGO.errorNetwork")
          : t("registerNGO.errorGeneral"),
      );
    }
  }

  if (!actor && isFetching) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("app.connecting")}</p>
      </div>
    );
  }

  if (!actor && !isFetching) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
          <WifiOff size={26} className="text-accent" />
        </div>
        <div className="text-center max-w-xs">
          <p className="font-semibold text-foreground mb-1">
            {t("app.connectionNotReady")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("app.connectionError")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          data-ocid="register_ngo.retry_button"
        >
          {t("app.refreshPage")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="register_ngo.back_button"
          >
            <ArrowLeft size={15} />
            {t("registerNGO.chooseRole")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 border-b border-border flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.17 145 / 0.08), oklch(0.55 0.22 25 / 0.06))",
            }}
          >
            <Building2 size={28} className="text-secondary shrink-0" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {t("registerNGO.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("registerNGO.subtitle")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="orgName">{t("registerNGO.orgNameLabel")}</Label>
              <Input
                id="orgName"
                placeholder={t("registerNGO.orgNamePlaceholder")}
                {...register("orgName")}
                data-ocid="register_ngo.orgname_input"
              />
              {errors.orgName && (
                <p
                  className="text-xs text-accent flex items-center gap-1"
                  data-ocid="register_ngo.orgname_field_error"
                >
                  <AlertCircle size={12} />
                  {errors.orgName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">
                {t("registerNGO.phoneLabel")}
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder={t("registerNGO.phonePlaceholder")}
                autoComplete="tel"
                {...register("contactPhone")}
                data-ocid="register_ngo.phone_input"
              />
              {errors.contactPhone && (
                <p
                  className="text-xs text-accent flex items-center gap-1"
                  data-ocid="register_ngo.phone_field_error"
                >
                  <AlertCircle size={12} />
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <Radio size={14} className="text-primary" />
                  {t("registerNGO.serviceRadiusLabel")}
                </Label>
                <span className="text-sm font-semibold text-primary tabular-nums">
                  {radiusValue} km
                </span>
              </div>
              <Controller
                name="serviceRadius"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={([val]) => field.onChange(val)}
                    className="w-full"
                    data-ocid="register_ngo.radius_slider"
                  />
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Requests within{" "}
                <span className="font-medium text-foreground">
                  {radiusValue} km
                </span>{" "}
                of your location will appear in your dashboard.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label>{t("registerNGO.locationLabel")}</Label>
              {location ? (
                <div
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
                  data-ocid="register_ngo.location_detected"
                >
                  <MapPin size={14} className="text-secondary shrink-0" />
                  <span className="text-foreground font-medium">
                    {t("registerNGO.locationDetected")}
                  </span>
                  <span className="text-muted-foreground text-xs ml-auto tabular-nums">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground"
                  data-ocid="register_ngo.location_pending"
                >
                  <MapPin size={14} className="animate-pulse shrink-0" />
                  <span>{t("registerNGO.locationPending")}</span>
                </div>
              )}
            </div>

            {serverError && (
              <div
                className="flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="register_ngo.error_state"
              >
                <AlertCircle size={15} />
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isSubmitting}
              data-ocid="register_ngo.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("registerNGO.registering")}
                </>
              ) : (
                t("registerNGO.submitButton")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
