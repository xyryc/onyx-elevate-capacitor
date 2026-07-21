import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearAllUnlocks } from "@/lib/nutritionAccess";
import { rcConfigure, rcLogIn, rcLogOut } from "@/lib/revenuecat";

// ─── Module-level RC init guard ───────────────────────────────────────────────
// useAuth can be mounted in many components at once. We want rcConfigure and
// the initial rcLogIn to fire exactly once per app lifecycle, not once per mount.
let _rcInitDone = false;
let _rcLastUserId: string | null = null;

function rcInitOnce(userId: string | null) {
  if (!_rcInitDone) {
    _rcInitDone = true;
    rcConfigure(); // no-op on web; guarded internally for repeated calls
  }
  if (userId && userId !== _rcLastUserId) {
    _rcLastUserId = userId;
    rcLogIn(userId);
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      rcInitOnce(currentUser?.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      rcInitOnce(currentUser?.id ?? null);

      if (evt === "SIGNED_OUT") {
        // Prevent a shared browser from showing a previous user's unlocks.
        clearAllUnlocks();
        _rcLastUserId = null;
        rcLogOut();
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    signOut: async () => {
      clearAllUnlocks();
      _rcLastUserId = null;
      await rcLogOut();
      // Reset the language splash so the next visit starts fresh:
      // pick language → sign in, just like a brand-new visitor.
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("onyx.languageSplash.done");
          window.localStorage.removeItem("onyx.splash.dismissed");
          window.localStorage.removeItem("onyx.lang");
          window.localStorage.removeItem("onyx.pending.lang");
          window.localStorage.removeItem("onyx.access.cache.v1");
          window.sessionStorage.removeItem("onyx.access.cache.v1");
        } catch {
          /* noop */
        }
      }
      // Also clear from native Capacitor Preferences so the splash resets properly
      import("@capacitor/preferences")
        .then(({ Preferences }) => {
          void Preferences.remove({ key: "onyx.languageSplash.done" });
          void Preferences.remove({ key: "onyx.lang" });
        })
        .catch(() => {});
      await supabase.auth.signOut();
    },
  };
}
