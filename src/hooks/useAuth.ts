import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearAllUnlocks } from "@/lib/nutritionAccess";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      setUser(session?.user ?? null);
      if (evt === "SIGNED_OUT") {
        // Prevent a shared browser from showing a previous user's unlocks.
        clearAllUnlocks();
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
        } catch { /* noop */ }
      }
      await supabase.auth.signOut();
    },
  };
}

