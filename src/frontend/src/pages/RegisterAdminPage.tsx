import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Shield,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LanguageSwitcher } from "../components/shared/LanguageSwitcher";
import { saveSession } from "../hooks/use-auth";
import { useBackend } from "../hooks/use-backend";

type FormValues = {
  secretKey: string;
};

export default function RegisterAdminPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { t } = useTranslation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { secretKey: "" } });

  async function onSubmit(values: FormValues) {
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
        adminProfile: result.ok,
      });
      toast.success(t("registerAdmin.successMessage"));
      navigate({ to: "/admin/dashboard" });
    } catch (error) {
      console.error("[RegisterAdminPage] registerAdmin error:", error);
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("fetch") ||
          error.message.includes("network") ||
          error.message.includes("Failed to fetch"));
      setServerError(
        isNetworkError
          ? t("registerUser.errorNetwork")
          : t("registerAdmin.errorGeneral"),
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
          data-ocid="register_admin.retry_button"
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
            data-ocid="register_admin.back_button"
          >
            <ArrowLeft size={15} />
            {t("registerAdmin.chooseRole")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 border-b border-border flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.60 0.20 35 / 0.08), oklch(0.55 0.22 25 / 0.06))",
            }}
          >
            <Shield size={28} className="text-accent shrink-0" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {t("registerAdmin.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("registerAdmin.subtitle")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-start gap-2.5">
              <KeyRound size={15} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("login.admin.restricted")}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secretKey">
                {t("registerAdmin.secretKeyLabel")}
              </Label>
              <Input
                id="secretKey"
                type="password"
                placeholder={t("registerAdmin.secretKeyPlaceholder")}
                autoComplete="current-password"
                {...register("secretKey", {
                  required: t("login.admin.secretKeyRequired"),
                  minLength: {
                    value: 1,
                    message: t("login.admin.secretKeyRequired"),
                  },
                })}
                data-ocid="register_admin.secret_key_input"
              />
              {errors.secretKey && (
                <p
                  className="text-xs text-accent flex items-center gap-1"
                  data-ocid="register_admin.secret_key_field_error"
                >
                  <AlertCircle size={12} />
                  {errors.secretKey.message}
                </p>
              )}
            </div>

            {alreadyExists && (
              <div
                className="flex items-start gap-2 text-sm bg-secondary/10 border border-secondary/30 rounded-lg px-3 py-3"
                data-ocid="register_admin.already_exists_state"
              >
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <div>
                  <p className="font-medium text-foreground">
                    Admin account already exists
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("login.alreadyRegistered")}{" "}
                    <Link
                      to="/login"
                      className="text-primary font-medium hover:underline"
                      data-ocid="register_admin.go_to_login_link"
                    >
                      {t("login.signIn")}
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {serverError && (
              <div
                className="flex items-center gap-2 text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2"
                data-ocid="register_admin.error_state"
              >
                <AlertCircle size={15} />
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={isSubmitting}
              data-ocid="register_admin.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  {t("registerAdmin.registering")}
                </>
              ) : (
                t("registerAdmin.submitButton")
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t("login.alreadyRegistered")}{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
                data-ocid="register_admin.login_link"
              >
                {t("login.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
