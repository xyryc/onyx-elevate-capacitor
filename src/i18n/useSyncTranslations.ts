import { useLayoutEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Runs the AutoTranslator's cached-translation pass synchronously, before the
 * browser paints. Called on every route change so newly-mounted pages/dialogs
 * never flash their English source text when we already have the translation
 * cached.
 */
export function useSyncTranslations() {
  const location = useRouterState({ select: (s) => s.location.pathname });

  useLayoutEffect(() => {
    const applyNow = (window as unknown as { __onyxApplyCachedNow?: () => void }).__onyxApplyCachedNow;
    if (applyNow) {
      try { applyNow(); } catch {}
    }
    // Second pass on the next frame to catch late-mounted subtrees (Suspense,
    // lazy components, images that trigger layout).
    const raf = window.requestAnimationFrame(() => {
      const again = (window as unknown as { __onyxApplyCachedNow?: () => void }).__onyxApplyCachedNow;
      if (again) { try { again(); } catch {} }
    });
    return () => window.cancelAnimationFrame(raf);
  }, [location]);
}
