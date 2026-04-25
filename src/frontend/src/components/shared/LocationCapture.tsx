import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import type { Location } from "../../types";

interface LocationCaptureProps {
  onCapture: (location: Location) => void;
  value?: Location | null;
  label?: string;
}

type CaptureState = "idle" | "loading" | "success";

export function LocationCapture({
  onCapture,
  value,
  label = "Capture My Location",
}: LocationCaptureProps) {
  const [state, setState] = useState<CaptureState>(value ? "success" : "idle");

  function handleCapture() {
    if (!navigator.geolocation) {
      // No geolocation available — silently do nothing
      return;
    }
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location: Location = {
          lat: Number.parseFloat(pos.coords.latitude.toFixed(6)),
          lng: Number.parseFloat(pos.coords.longitude.toFixed(6)),
        };
        onCapture(location);
        setState("success");
      },
      () => {
        // User denied or position unavailable — silently fall back to idle
        setState("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-2" data-ocid="location_capture">
      <Button
        type="button"
        variant="outline"
        onClick={handleCapture}
        disabled={state === "loading"}
        className="w-full gap-2"
        data-ocid="location_capture.button"
      >
        {state === "loading" && <Loader2 size={16} className="animate-spin" />}
        {state === "success" && (
          <CheckCircle size={16} className="text-secondary" />
        )}
        {state === "idle" && <MapPin size={16} />}
        {state === "loading" ? "Getting location…" : label}
      </Button>

      {state === "success" && value && (
        <p
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          data-ocid="location_capture.coordinates"
        >
          <MapPin size={12} className="text-primary" />
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
