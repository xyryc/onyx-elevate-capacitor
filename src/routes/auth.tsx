import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s.mode === "signup" ? ("signup" as const) : s.mode === "signin" ? ("signin" as const) : undefined,
  }),
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In · Onyx Elevate" },
      { name: "description", content: "Sign in to access your training programs, meal plans and saved progress." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

// The dedicated /auth page has been replaced by the language + login splash
// overlay (see src/components/LanguageSplash.tsx). This route now just makes
// sure any legacy link to /auth opens the splash and lands the user on home.
function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        navigate({ to: "/", replace: true });
        return;
      }
      try { window.sessionStorage.setItem("onyx.loginSplash.forceOpen", "1"); } catch {}
      window.dispatchEvent(new CustomEvent("onyx:open-login-splash"));
      navigate({ to: "/", replace: true });
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  // Render nothing — the splash overlay handles all UI.
  return <div className="min-h-screen bg-background" />;
}
