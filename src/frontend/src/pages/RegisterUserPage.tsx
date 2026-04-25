import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MapPin,
  UserCircle,
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
  name: string;
  phone: string;
  aadhaarDeclared: boolean;
  panDeclared: boolean;
};

function validateForm(
  values: FormValues,
  t: (key: string) => string,
): Partial<Record<keyof FormValues, string>> {
  const errs: Partial<Record<keyof FormValues, string>> = {};
  if (values.name.length < 2) errs.name = t("registerUser.errorNameMin");
  if (!/^\+?[0-9]{10,15}$/.test(values.phone))
    errs.phone = t("registerUser.errorPhone");
  return errs;
}

export default function RegisterUserPage() {
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      phone: "",
      aadhaarDeclared: false,
      panDeclared: false,
    },
  });

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
      setServerError(t("registerUser.errorConnectionNotReady"));
      return;
    }

    try {
      const result = await actor.registerUser({
        name: values.name,
        phone: values.phone,
        aadhaarDeclared: values.aadhaarDeclared,
        panDeclared: values.panDeclared,
        location: finalLocation,
      });

      if (result.__kind__ === "err") {
        setServerError(result.err);
        return;
      }

      saveSession({
        role: "citizen",
        userProfile: result.ok,
        ngoProfile: null,
        adminProfile: null,
      });
      toast.success(t("registerUser.successMessage"));
      navigate({ to: "/user/dashboard" });
    } catch (error) {
      console.error("[RegisterUserPage] registerUser error:", error);
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError
          ? t("registerUser.errorNetwork")
          : t("registerUser.errorGeneral"),
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
          data-ocid="register_user.retry_button"
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
            data-ocid="register_user.back_button"
          >
            <ArrowLeft size={15} />
            {t("registerUser.chooseRole")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 border-b border-border flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 25 / 0.08), oklch(0.58 0.17 145 / 0.06))",
            }}
          >
            <UserCircle size={28} className="text-primary shrink-0" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {t("registerUser.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("registerUser.subtitle")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("registerUser.nameLabel")}</Label>
              <Input
                id="name"
                placeholder={t("registerUser.namePlaceholder")}
                autoComplete="name"
                {...register("name")}
                data-ocid="register_user.name_input"
              />
              {errors.name && (
                <p
                  className="text-xs text-accent flex items-center gap-1"
                  data-ocid="register_user.name_field_error"
                >
                  <AlertCircle size={12} />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("registerUser.phoneLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("registerUser.phonePlaceholder")}
                autoComplete="tel"
                {...register("phone")}
                data-ocid="register_user.phone_input"
              />
              {errors.phone && (
                <p
                  className="text-xs text-accent flex items-center gap-1"
                  data-ocid="register_user.phone_field_error"
                >
                  <AlertCircle size={12} />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>{t("registerUser.locationLabel")}</Label>
              {location ? (
                <div
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
                  data-ocid="register_user.location_detected"
                >
                  <MapPin size={14} className="text-primary shrink-0" />
                  <span className="text-foreground font-medium">
                    {t("registerUser.locationDetected")}
                  </span>
                  <span className="text-muted-foreground text-xs ml-auto tabular-nums">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground"
                  data-ocid="register_user.location_pending"
                >
                  <MapPin size={14} className="animate-pulse shrink-0" />
                  <span>{t("registerUser.locationPending")}</span>
                </div>
              )}
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
              <p className="text-xs font-medium text-foreground">
                {t("registerUser.identityTitle")}{" "}
                <span className="text-muted-foreground font-normal">
                  {t("registerUser.identityOptional")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t("registerUser.identityDesc")}
              </p>
              <Controller
                name="aadhaarDeclared"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="aadhaar"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-ocid="register_user.aadhaar_checkbox"
                    />
                    <Label
                      htmlFor="aadhaar"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t("registerUser.aadhaarLabel")}
                    </Label>
                  </div>
                )}
              />
              <Controller
                name="panDeclared"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="pan"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-ocid="register_user.pan_checkbox"
                    />
                    <Label
                      htmlFor="pan"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t("registerUser.panLabel")}
                    </Label>
                  </div>
                )}
              />
            </div>

            {serverError && (
              <div
                className="flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="register_user.error_state"
              >
                <AlertCircle size={15} />
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isSubmitting}
              data-ocid="register_user.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("registerUser.registering")}
                </>
              ) : (
                t("registerUser.submitButton")
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
