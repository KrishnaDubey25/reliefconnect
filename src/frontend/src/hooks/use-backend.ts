import { useEffect, useRef, useState } from "react";
import type { Backend, ExternalBlob } from "../backend";
import { createActor } from "../backend";

// Stub upload/download — app doesn't use file storage
async function uploadFile(_file: ExternalBlob): Promise<Uint8Array> {
  return new Uint8Array();
}
async function downloadFile(_bytes: Uint8Array): Promise<ExternalBlob> {
  const { ExternalBlob: EB } = await import("../backend");
  return EB.fromBytes(new Uint8Array());
}

function isValidId(id: string | undefined | null): id is string {
  if (!id || typeof id !== "string") return false;
  const t = id.trim();
  return (
    t.length >= 5 &&
    t !== "undefined" &&
    t !== "null" &&
    t !== "" &&
    !t.startsWith("{{") &&
    !t.startsWith("__")
  );
}

function isValidHost(h: string | undefined | null): h is string {
  if (!h || typeof h !== "string") return false;
  const t = h.trim();
  return t.startsWith("http://") || t.startsWith("https://");
}

interface EnvConfig {
  canisterId: string | null;
  host: string | null;
}

// Check global variables injected by Caffeine platform (window.__ENV__, window.__CANISTER_IDS__)
function checkGlobalEnv(): EnvConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    // window.__ENV__ pattern
    if (w.__ENV__ && typeof w.__ENV__ === "object") {
      const env = w.__ENV__ as Record<string, string>;
      console.info("[ReliefConnect] Found window.__ENV__:", env);
      let host: string | null = null;
      if (isValidHost(env.backend_host)) host = env.backend_host.trim();
      else if (isValidHost(env.BACKEND_HOST)) host = env.BACKEND_HOST.trim();
      for (const key of [
        "backend_canister_id",
        "BACKEND_CANISTER_ID",
        "canister_id_backend",
        "CANISTER_ID_BACKEND",
      ]) {
        if (isValidId(env[key])) {
          console.info(`[ReliefConnect] ✓ window.__ENV__[${key}]`);
          return { canisterId: env[key].trim(), host };
        }
      }
      // Dynamic scan
      for (const [k, v] of Object.entries(env)) {
        if (
          typeof v === "string" &&
          (k.toLowerCase().includes("backend") ||
            k.toLowerCase().includes("canister")) &&
          isValidId(v)
        ) {
          console.info(`[ReliefConnect] ✓ window.__ENV__[${k}] (dynamic scan)`);
          return { canisterId: v.trim(), host };
        }
      }
    }

    // window.__CANISTER_IDS__ pattern (dfx format: { backend: { ic: "..." } })
    if (w.__CANISTER_IDS__ && typeof w.__CANISTER_IDS__ === "object") {
      const ids = w.__CANISTER_IDS__ as Record<string, Record<string, string>>;
      console.info("[ReliefConnect] Found window.__CANISTER_IDS__:", ids);
      const backendObj = ids.backend ?? ids.BACKEND;
      if (backendObj && typeof backendObj === "object") {
        for (const net of ["ic", "mainnet", "playground", "local"]) {
          if (isValidId(backendObj[net])) {
            console.info(
              `[ReliefConnect] ✓ window.__CANISTER_IDS__.backend.${net}`,
            );
            return { canisterId: backendObj[net].trim(), host: null };
          }
        }
      }
    }
  } catch {
    // globals are optional — ignore
  }
  return { canisterId: null, host: null };
}

// Fetch /env.json at runtime — the Caffeine platform writes the real canister ID
// and backend host there after deployment.
async function fetchEnvConfig(): Promise<EnvConfig> {
  // 0. Check globals first (fastest, no network round-trip)
  const globalResult = checkGlobalEnv();
  if (globalResult.canisterId) return globalResult;

  // 1. Try /env.json (primary Caffeine platform source)
  try {
    const res = await fetch("/env.json", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as Record<string, string>;
      console.info("[ReliefConnect] /env.json contents:", data);

      let host: string | null = null;
      if (isValidHost(data.backend_host)) {
        host = data.backend_host.trim();
      } else if (isValidHost(data.BACKEND_HOST)) {
        host = data.BACKEND_HOST.trim();
      }

      if (host) console.info(`[ReliefConnect] ✓ Got backend host: ${host}`);

      for (const key of [
        "backend_canister_id",
        "BACKEND_CANISTER_ID",
        "canister_id_backend",
        "CANISTER_ID_BACKEND",
      ]) {
        if (isValidId(data[key])) {
          console.info(`[ReliefConnect] ✓ /env.json[${key}]`);
          return { canisterId: data[key].trim(), host };
        }
      }
      // Dynamic scan
      for (const [k, v] of Object.entries(data)) {
        if (
          typeof v === "string" &&
          (k.toLowerCase().includes("backend") ||
            k.toLowerCase().includes("canister")) &&
          isValidId(v)
        ) {
          console.info(`[ReliefConnect] ✓ /env.json[${k}] (dynamic scan)`);
          return { canisterId: v.trim(), host };
        }
      }
      console.warn("[ReliefConnect] /env.json found but no canister ID.", data);
      return { canisterId: null, host };
    }
    console.warn("[ReliefConnect] /env.json not found (HTTP", res.status, ")");
  } catch (err) {
    console.warn("[ReliefConnect] Failed to fetch /env.json:", err);
  }

  // 2. Fallback: try /canister_ids.json
  try {
    const res2 = await fetch("/canister_ids.json", { cache: "no-store" });
    if (res2.ok) {
      const data2 = (await res2.json()) as Record<
        string,
        Record<string, string>
      >;
      console.info("[ReliefConnect] /canister_ids.json:", data2);
      const backendObj = data2.backend ?? data2.BACKEND;
      if (backendObj && typeof backendObj === "object") {
        for (const net of ["ic", "mainnet", "playground", "local"]) {
          if (isValidId(backendObj[net])) {
            console.info(`[ReliefConnect] ✓ /canister_ids.json.backend.${net}`);
            return { canisterId: backendObj[net].trim(), host: null };
          }
        }
      }
    }
  } catch {
    // optional — ignore
  }

  console.error("[ReliefConnect] ✗ Could not resolve backend canister ID.");
  return { canisterId: null, host: null };
}

// ── Singleton with safe reset ──────────────────────────────────────────────────
// IMPORTANT: _initPromise is NEVER permanently set to a resolved-null promise.
// When canister ID is missing, we reset _initPromise so the next caller retries.
let _actorSingleton: Backend | null = null;
let _initPromise: Promise<Backend | null> | null = null;

async function initActor(): Promise<Backend | null> {
  if (_actorSingleton) return _actorSingleton;

  const { canisterId, host } = await fetchEnvConfig();
  if (!canisterId) {
    // Do NOT poison the singleton — reset so next attempt can retry
    return null;
  }

  try {
    const agentOptions = host ? { host } : {};
    _actorSingleton = createActor(canisterId, uploadFile, downloadFile, {
      agentOptions,
    });
    console.info(
      `[ReliefConnect] ✓ Backend actor created. Canister: ${canisterId.slice(0, 12)}… Host: ${host ?? "default (ic0.app)"}`,
    );
    return _actorSingleton;
  } catch (err) {
    console.error("[ReliefConnect] createActor failed:", err);
    return null;
  }
}

// Aggressive retry: up to 15 attempts with 2s between = ~30s total window.
// On each failed attempt, _initPromise is reset so the next try fetches fresh.
const MAX_RETRIES = 15;
const RETRY_DELAY_MS = 2000;

async function initActorWithRetry(): Promise<Backend | null> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const actor = await initActor();
    if (actor) return actor;

    if (attempt < MAX_RETRIES) {
      console.info(
        `[ReliefConnect] Retry ${attempt}/${MAX_RETRIES} in ${RETRY_DELAY_MS}ms…`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      // CRITICAL: Reset so the next attempt fetches fresh env config
      _actorSingleton = null;
      _initPromise = null; // allow a fresh promise to be created next cycle
    }
  }
  console.error("[ReliefConnect] All retries exhausted.");
  return null;
}

// ── Public retry API ───────────────────────────────────────────────────────────
// Called by the UI's "Retry" button — fully resets singleton state and tries again.
export function retryConnection(): Promise<Backend | null> {
  _actorSingleton = null;
  _initPromise = null;
  _initPromise = initActorWithRetry();
  return _initPromise;
}

// ── React hook ────────────────────────────────────────────────────────────────
export function useBackend() {
  const [actor, setActor] = useState<Backend | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!_initPromise) {
      _initPromise = initActorWithRetry();
    }
    _initPromise.then((resolvedActor) => {
      if (!mountedRef.current) return;
      setActor(resolvedActor);
      setIsFetching(false);
      if (!resolvedActor) _initPromise = null;
    });
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = () => {
    setIsFetching(true);
    setActor(null);
    retryConnection().then((resolvedActor) => {
      if (!mountedRef.current) return;
      setActor(resolvedActor);
      setIsFetching(false);
      if (!resolvedActor) _initPromise = null;
    });
  };

  return { actor, isFetching, retry };
}
