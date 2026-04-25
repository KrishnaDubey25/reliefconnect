import { useEffect, useState } from "react";

export type GeolocationPermission = "granted" | "denied" | "prompt" | "unknown";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  permission: GeolocationPermission;
}

// Module-level cache — fetched at most once per browser session
let cachedPosition: { lat: number; lng: number; accuracy: number } | null =
  null;
let fetchPromise: Promise<{
  lat: number;
  lng: number;
  accuracy: number;
}> | null = null;

/** Returns true only if the cached position has valid, non-zero coordinates */
function isCacheValid(): boolean {
  return (
    cachedPosition !== null &&
    cachedPosition.lat !== 0 &&
    cachedPosition.lng !== 0
  );
}

function fetchPosition(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
}> {
  // Only use cache if it has real coordinates
  if (isCacheValid()) return Promise.resolve(cachedPosition!);

  // Reuse in-flight request
  if (fetchPromise) return fetchPromise;

  fetchPromise = new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      fetchPromise = null;
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const result = {
          lat: Number.parseFloat(pos.coords.latitude.toFixed(6)),
          lng: Number.parseFloat(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        };
        cachedPosition = result;
        fetchPromise = null;
        resolve(result);
      },
      (err) => {
        fetchPromise = null;
        reject(err);
      },
      // Increased timeout to 15s for mobile GPS; keep high accuracy
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });

  return fetchPromise;
}

/** Query Permissions API if available — fully optional, never blocks location fetch */
async function queryPermission(): Promise<GeolocationPermission> {
  try {
    if (!navigator.permissions) return "unknown";
    const result = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return result.state as GeolocationPermission;
  } catch {
    // Permissions API not supported (e.g. iOS Safari) — treat as unknown
    return "unknown";
  }
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: isCacheValid() ? cachedPosition!.lat : null,
    lng: isCacheValid() ? cachedPosition!.lng : null,
    accuracy: isCacheValid() ? cachedPosition!.accuracy : null,
    loading:
      !isCacheValid() &&
      typeof navigator !== "undefined" &&
      !!navigator.geolocation,
    error: null,
    permission: "unknown",
  });

  useEffect(() => {
    // No geolocation API available — silently fall back
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
        permission: "denied",
      }));
      return;
    }

    // Already have a valid cached result — sync state and query permission
    if (isCacheValid()) {
      setState((s) => ({
        ...s,
        lat: cachedPosition!.lat,
        lng: cachedPosition!.lng,
        accuracy: cachedPosition!.accuracy,
        loading: false,
        error: null,
      }));
      // Permission query is fire-and-forget — does not gate location
      queryPermission().then((permission) => {
        setState((s) => ({ ...s, permission }));
      });
      return;
    }

    let cancelled = false;

    // Query permission in parallel — NEVER await it before calling getCurrentPosition.
    // This ensures we always request location regardless of Permissions API support.
    queryPermission().then((permission) => {
      if (!cancelled) setState((s) => ({ ...s, permission }));
    });

    // Always call getCurrentPosition eagerly — do not gate on permission query result
    fetchPosition()
      .then(({ lat, lng, accuracy }) => {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          lat,
          lng,
          accuracy,
          loading: false,
          error: null,
          permission: "granted",
        }));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // Treat all geolocation errors as silent fallback — never expose
        // browser error messages to the user. Permission denial is a user
        // choice, not an error condition.
        const geoErr = err as GeolocationPositionError;
        const permission =
          geoErr?.code === 1 /* PERMISSION_DENIED */ ? "denied" : "prompt";
        setState((s) => ({
          ...s,
          loading: false,
          error: null,
          permission,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
