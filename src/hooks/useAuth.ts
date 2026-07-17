import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearAllUnlocks } from "@/lib/nutritionAccess";
import { rcConfigure, rcLogIn, rcLogOut } from "@/lib/revenuecat";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Initialize RevenueCat client natively on iOS
    rcConfigure();

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      
      // If a user session is active on startup, log into RevenueCat
      if (currentUser) {
        rcLogIn(currentUser.id);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        rcLogIn(currentUser.id);
      }

      if (evt === "SIGNED_OUT") {
        // Prevent a shared browser from showing a previous user's unlocks.
        clearAllUnlocks();
        // Log out of RevenueCat
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
      // Log out of RevenueCat
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
        } catch { /* noop */ }
      }
      await supabase.auth.signOut();
    },
  };
}


