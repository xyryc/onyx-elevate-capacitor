// Client hook: resolves whether the current user has access to bundles/programs/plans.
// Priority: active subscription (Onyx Pro / All Access) OR a purchase row in DB OR
// a localStorage unlock flag from a prior one-time purchase.
// On iOS, RevenueCat entitlement is used as an instant fallback so access unlocks
// immediately after Apple IAP — before the RC webhook writes to Supabase.
// When signed out: everything is locked. Local flags from a previous session are
// ignored (see nutritionAccess.clearAllUnlocks() called on sign-out in root).
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isIOSNative, rcCheckEntitlement } from "@/lib/revenuecat";
import {
  BUNDLE_KEY,
  isBundleUnlocked as localBundle,
  isPlanUnlocked as localPlan,
  isProgramUnlocked as localProgram,
} from "@/lib/nutritionAccess";

interface AccessState {
  loading: boolean;
  hasBundle: boolean;
  hasSubscription: boolean;
  programSlugs: Set<string>;
  planSlugs: Set<string>;
}

const empty: AccessState = {
  loading: true,
  hasBundle: false,
  hasSubscription: false,
  programSlugs: new Set(),
  planSlugs: new Set(),
};

const CACHE_KEY = "onyx.access.cache.v1";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type CachedAccess = {
  userId: string;
  cachedAt?: number;
  hasBundle: boolean;
  hasSubscription: boolean;
  programSlugs: string[];
  planSlugs: string[];
};

function readCache(userId: string | undefined): AccessState | null {
  if (!userId || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY) ?? window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedAccess;
    if (parsed.userId !== userId) return null;
    if (parsed.cachedAt && Date.now() - parsed.cachedAt > CACHE_MAX_AGE_MS) return null;
    return {
      loading: false,
      hasBundle: parsed.hasBundle,
      hasSubscription: parsed.hasSubscription,
      programSlugs: new Set(parsed.programSlugs),
      planSlugs: new Set(parsed.planSlugs),
    };
  } catch {
    return null;
  }
}

function writeCache(userId: string, s: AccessState) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedAccess = {
      userId,
      cachedAt: Date.now(),
      hasBundle: s.hasBundle,
      hasSubscription: s.hasSubscription,
      programSlugs: Array.from(s.programSlugs),
      planSlugs: Array.from(s.planSlugs),
    };
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

const ACCESS_REFRESH_EVENT = "onyx:access:refresh";

/** Call after a successful checkout to force useAccess to re-fetch. */
export function refreshAccess() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CACHE_KEY);
    window.sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* noop */
  }
  window.dispatchEvent(new Event(ACCESS_REFRESH_EVENT));
}

export function useAccess(): AccessState & {
  hasProgram: (slug: string) => boolean;
  hasPlan: (slug: string) => boolean;
} {
  const { user, loading: authLoading } = useAuth();
  // Seed from sessionStorage synchronously so client navigations don't flash
  // the "no access" state before Supabase responds.
  const [state, setState] = useState<AccessState>(() => readCache(user?.id) ?? empty);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onRefresh = () => setRefreshTick((n) => n + 1);
    window.addEventListener(ACCESS_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(ACCESS_REFRESH_EVENT, onRefresh);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // While auth is still resolving, keep loading=true so callers don't
      // briefly render a "signed out / no access" state.
      if (authLoading) {
        if (!cancelled) setState((s) => ({ ...s, loading: true }));
        return;
      }
      if (!user) {
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.removeItem(CACHE_KEY);
            window.localStorage.removeItem(CACHE_KEY);
          } catch {
            /* noop */
          }
        }
        if (!cancelled) setState({ ...empty, loading: false });
        return;
      }
      const cached = readCache(user.id);
      if (cached && !cancelled) setState(cached);
      const [subRes, purRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("status,current_period_end,price_id,product_id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("purchases").select("product_kind,product_slug").eq("user_id", user.id),
      ]);
      const now = new Date();
      let hasSubscription = (subRes.data ?? []).some((s: any) => {
        if (!s) return false;
        const active = s.status === "active" || s.status === "trialing";
        const endOk = !s.current_period_end || new Date(s.current_period_end) > now;
        const cancelledButStillPaid =
          s.status === "canceled" && s.current_period_end && new Date(s.current_period_end) > now;
        return (active && endOk) || cancelledButStillPaid;
      });
      // iOS fallback: check the local RevenueCat entitlement cache instantly.
      // Grants access right after Apple IAP, before the RC webhook writes to Supabase.
      if (!hasSubscription && isIOSNative()) {
        hasSubscription = await rcCheckEntitlement();
      }
      const programSlugs = new Set<string>();
      const planSlugs = new Set<string>();
      let hasBundle = false;
      for (const p of purRes.data ?? []) {
        if (p.product_kind === "bundle") hasBundle = true;
        else if (p.product_kind === "program" && p.product_slug) programSlugs.add(p.product_slug);
        else if (p.product_kind === "plan" && p.product_slug) planSlugs.add(p.product_slug);
      }
      if (localBundle()) hasBundle = true;
      if (!cancelled) {
        const next: AccessState = {
          loading: false,
          hasBundle,
          hasSubscription,
          programSlugs,
          planSlugs,
        };
        setState(next);
        writeCache(user.id, next);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading, refreshTick]);

  const bundleOrSub = state.hasBundle || state.hasSubscription;
  return {
    ...state,
    hasProgram: (slug: string) =>
      bundleOrSub || state.programSlugs.has(slug) || (Boolean(user) && localProgram(slug)),
    hasPlan: (slug: string) =>
      bundleOrSub || state.planSlugs.has(slug) || (Boolean(user) && localPlan(slug)),
  };
}

// re-export the bundle key for callers that need it
export { BUNDLE_KEY };
