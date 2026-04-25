import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResourceIcon } from "../../components/shared/ResourceIcon";
import { RESOURCE_TYPES, URGENCY_LEVELS } from "../../constants";
import { useAuth } from "../../hooks/use-auth";
import { useBackend } from "../../hooks/use-backend";
import { useGeolocation } from "../../hooks/use-geolocation";
import { type Location, ResourceType, UrgencyLevel } from "../../types";

export default function UserNewRequest() {
  const { actor } = useBackend();
  const { userProfile } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // Auto-capture GPS location silently
  const { lat, lng } = useGeolocation();

  const [resourceType, setResourceType] = useState<ResourceType>(
    ResourceType.food,
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(UrgencyLevel.medium);
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  // Location: prefer GPS, fall back to profile, start with profile
  const [location, setLocation] = useState<Location | null>(
    userProfile?.location ?? null,
  );
  const [locationFromGps, setLocationFromGps] = useState(false);

  // When GPS becomes available, upgrade the location automatically
  useEffect(() => {
    if (
      lat !== null &&
      lng !== null &&
      lat !== 0 &&
      lng !== 0 &&
      !locationFromGps
    ) {
      setLocation({ lat, lng });
      setLocationFromGps(true);
    }
  }, [lat, lng, locationFromGps]);

  const URGENCY_META: Record<
    UrgencyLevel,
    {
      label: string;
      description: string;
      activeStyle: React.CSSProperties;
      activeBorder: string;
    }
  > = {
    [UrgencyLevel.high]: {
      label: t("urgency.high"),
      description: t("urgency.highDesc"),
      activeStyle: {
        color: "oklch(var(--accent))",
        background: "oklch(var(--accent) / 0.1)",
      },
      activeBorder: "border-accent",
    },
    [UrgencyLevel.medium]: {
      label: t("urgency.medium"),
      description: t("urgency.mediumDesc"),
      activeStyle: {
        color: "oklch(var(--chart-2))",
        background: "oklch(var(--chart-2) / 0.1)",
      },
      activeBorder: "border-chart-2",
    },
    [UrgencyLevel.low]: {
      label: t("urgency.low"),
      description: t("urgency.lowDesc"),
      activeStyle: {
        color: "oklch(var(--secondary))",
        background: "oklch(var(--secondary) / 0.1)",
      },
      activeBorder: "border-secondary",
    },
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      // Use GPS or profile location; fallback to India national centre
      const finalLocation: Location = location ?? {
        lat: 20.5937,
        lng: 78.9629,
      };
      return actor.createRequest({
        resourceType,
        urgency,
        quantity: BigInt(quantity),
        description: description.trim() || undefined,
        userLocation: finalLocation,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
      toast.success(t("userNewRequest.successMessage"), {
        description: t("userNewRequest.submit"),
      });
      router.navigate({ to: "/user/dashboard" });
    },
    onError: () => {
      toast.error(t("userNewRequest.errorGeneral"));
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  function adjustQuantity(delta: number) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  return (
    <div className="max-w-lg mx-auto pb-10" data-ocid="user_new_request.page">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/user/dashboard">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("userNewRequest.backToDashboard")}
            className="h-9 w-9"
            data-ocid="user_new_request.back_button"
          >
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-foreground leading-tight">
            {t("userNewRequest.title")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("userNewRequest.subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Resource type */}
        <Card
          className="border-border"
          data-ocid="user_new_request.resource_section"
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold"
                style={{ background: "oklch(var(--primary))" }}
              >
                1
              </span>
              {t("userNewRequest.selectResource")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {RESOURCE_TYPES.map((rt, idx) => {
                const isSelected = resourceType === rt.value;
                return (
                  <motion.button
                    key={rt.value}
                    type="button"
                    onClick={() => setResourceType(rt.value)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-smooth ${
                      isSelected
                        ? "border-primary shadow-sm"
                        : "border-border hover:bg-muted/50"
                    }`}
                    style={
                      isSelected
                        ? { background: "oklch(var(--primary) / 0.06)" }
                        : undefined
                    }
                    data-ocid={`user_new_request.resource_${rt.value}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "" : "bg-muted"
                      }`}
                      style={
                        isSelected
                          ? { background: "oklch(var(--primary) / 0.12)" }
                          : undefined
                      }
                    >
                      <ResourceIcon type={rt.value} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                      >
                        {t(rt.labelKey)}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {t(rt.descKey)}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2
                        size={15}
                        className="shrink-0 ml-auto text-primary"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Urgency */}
        <Card
          className="border-border"
          data-ocid="user_new_request.urgency_section"
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold"
                style={{ background: "oklch(var(--primary))" }}
              >
                2
              </span>
              {t("userNewRequest.selectUrgency")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {[UrgencyLevel.high, UrgencyLevel.medium, UrgencyLevel.low].map(
                (level) => {
                  const meta = URGENCY_META[level];
                  const isSelected = urgency === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-smooth ${
                        isSelected
                          ? `border-2 ${meta.activeBorder}`
                          : "border-border hover:bg-muted/50"
                      }`}
                      style={isSelected ? meta.activeStyle : undefined}
                      data-ocid={`user_new_request.urgency_${level}`}
                    >
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={
                          isSelected
                            ? { background: "currentColor" }
                            : {
                                background: "oklch(var(--muted-foreground))",
                              }
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold">
                          {meta.label}
                        </span>
                        <span className="ml-2 text-xs opacity-75">
                          {meta.description}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={15} className="shrink-0" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quantity + Description */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold"
                style={{ background: "oklch(var(--primary))" }}
              >
                3
              </span>
              {t("userNewRequest.step3")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Quantity stepper */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("userNewRequest.quantity")}
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= 1}
                  aria-label={t("userNewRequest.back")}
                  data-ocid="user_new_request.quantity_decrease"
                >
                  <Minus size={16} />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="text-center text-lg font-bold h-10"
                  data-ocid="user_new_request.quantity_input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => adjustQuantity(1)}
                  aria-label={t("userNewRequest.next")}
                  data-ocid="user_new_request.quantity_increase"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {t("userNewRequest.description")}{" "}
                <span className="normal-case text-muted-foreground/60">
                  ({t("registerUser.identityOptional")})
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("userNewRequest.descriptionPlaceholder")}
                rows={3}
                className="resize-none text-sm"
                data-ocid="user_new_request.description_textarea"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location status */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full text-primary-foreground flex items-center justify-center text-xs font-bold"
                style={{ background: "oklch(var(--primary))" }}
              >
                4
              </span>
              {t("userNewRequest.location")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {locationFromGps ? (
              <div
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
                data-ocid="user_new_request.location_gps"
              >
                <MapPin size={14} className="text-primary shrink-0" />
                <span className="text-foreground font-medium">
                  {t("userNewRequest.locationDetected")}
                </span>
                <span className="text-muted-foreground text-xs ml-auto tabular-nums">
                  {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                </span>
              </div>
            ) : location ? (
              <div
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
                data-ocid="user_new_request.location_profile"
              >
                <MapPin size={14} className="text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium">
                  {t("app.locationDetected")}
                </span>
                <span className="text-muted-foreground text-xs ml-auto tabular-nums">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground"
                data-ocid="user_new_request.location_detecting"
              >
                <MapPin size={14} className="animate-pulse shrink-0" />
                <span>{t("userNewRequest.locationPending")}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error */}
        {mutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm"
            style={{
              color: "oklch(var(--accent))",
              background: "oklch(var(--accent) / 0.08)",
              borderColor: "oklch(var(--accent) / 0.3)",
            }}
            data-ocid="user_new_request.error_state"
          >
            <AlertCircle size={15} className="shrink-0" />
            <span>{t("userNewRequest.errorGeneral")}</span>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-12 text-sm font-semibold gap-2"
          disabled={mutation.isPending}
          data-ocid="user_new_request.submit_button"
        >
          {mutation.isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              {t("userNewRequest.submitting")}
            </>
          ) : (
            <>
              <Send size={16} />
              {t("userNewRequest.submit")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
