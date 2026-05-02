import { r as reactExports } from "./index-CiAbU5FG.js";
let cachedPosition = null;
let fetchPromise = null;
function isCacheValid() {
  return cachedPosition !== null && cachedPosition.lat !== 0 && cachedPosition.lng !== 0;
}
function fetchPosition() {
  if (isCacheValid()) return Promise.resolve(cachedPosition);
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
          accuracy: Math.round(pos.coords.accuracy)
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
      { enableHighAccuracy: true, timeout: 15e3, maximumAge: 6e4 }
    );
  });
  return fetchPromise;
}
async function queryPermission() {
  try {
    if (!navigator.permissions) return "unknown";
    const result = await navigator.permissions.query({
      name: "geolocation"
    });
    return result.state;
  } catch {
    return "unknown";
  }
}
function useGeolocation() {
  const [state, setState] = reactExports.useState({
    lat: isCacheValid() ? cachedPosition.lat : null,
    lng: isCacheValid() ? cachedPosition.lng : null,
    accuracy: isCacheValid() ? cachedPosition.accuracy : null,
    loading: !isCacheValid() && typeof navigator !== "undefined" && !!navigator.geolocation,
    error: null,
    permission: "unknown"
  });
  reactExports.useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
        permission: "denied"
      }));
      return;
    }
    if (isCacheValid()) {
      setState((s) => ({
        ...s,
        lat: cachedPosition.lat,
        lng: cachedPosition.lng,
        accuracy: cachedPosition.accuracy,
        loading: false,
        error: null
      }));
      queryPermission().then((permission) => {
        setState((s) => ({ ...s, permission }));
      });
      return;
    }
    let cancelled = false;
    queryPermission().then((permission) => {
      if (!cancelled) setState((s) => ({ ...s, permission }));
    });
    fetchPosition().then(({ lat, lng, accuracy }) => {
      if (cancelled) return;
      setState((s) => ({
        ...s,
        lat,
        lng,
        accuracy,
        loading: false,
        error: null,
        permission: "granted"
      }));
    }).catch((err) => {
      if (cancelled) return;
      const geoErr = err;
      const permission = (geoErr == null ? void 0 : geoErr.code) === 1 ? "denied" : "prompt";
      setState((s) => ({
        ...s,
        loading: false,
        error: null,
        permission
      }));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
export {
  useGeolocation as u
};
