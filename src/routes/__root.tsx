import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouterState,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { PaymentTestModeBanner } from "../components/PaymentTestModeBanner";
import { ProgramQuiz } from "../components/ProgramQuiz";
import { AutoTranslator } from "../i18n/AutoTranslator";
import { LanguageSplash } from "../components/LanguageSplash";
// TranslationGate removed, i18n resources are bundled and switch instantly.
import { useSyncTranslations } from "../i18n/useSyncTranslations";
import { AiCoachBubble } from "../components/AiCoachBubble";
import { BottomTabBar } from "../components/BottomTabBar";
import { NameCapture } from "../components/NameCapture";
import { useAccess } from "@/hooks/useAccess";
// Single-session enforcement disabled, allow multiple concurrent devices.

function NotFoundComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname.replace(/\/$/, "") === "/quiz") {
    return <ProgramQuiz />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-electric">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50 transition-colors hover:bg-electric-glow"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50 transition-colors hover:bg-electric-glow"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-border bg-onyx-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-onyx-200">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" },
      { title: "Onyx Elevate - Free Exercise Library" },
      { name: "description", content: "Onyx Elevate - a premium, free exercise database with step-by-step instructions, anatomy, pro tips, and training programs." },
      { name: "author", content: "Onyx Elevate" },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:title", content: "Onyx Elevate - Free Exercise Library" },
      { property: "og:description", content: "Onyx Elevate - a premium, free exercise database with step-by-step instructions, anatomy, pro tips, and training programs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Onyx Elevate - Free Exercise Library" },
      { name: "twitter:description", content: "Onyx Elevate - a premium, free exercise database with step-by-step instructions, anatomy, pro tips, and training programs." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c93cdbd-52dd-4f63-bc8e-1f8393606480/id-preview-35c53357--b0f8a6aa-2d69-4211-afa3-414eb72f8277.lovable.app-1782868692634.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c93cdbd-52dd-4f63-bc8e-1f8393606480/id-preview-35c53357--b0f8a6aa-2d69-4211-afa3-414eb72f8277.lovable.app-1782868692634.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/app-icon-512.png" },
      { rel: "icon", type: "image/png", href: "/app-icon-512.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head suppressHydrationWarning><HeadContent /></head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
  const hasPaymentBanner = !clientToken || clientToken.startsWith("pk_test_");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalizedPath = pathname.replace(/\/$/, "");
  const hideFooterOnMobile =
    [
      "/my-library",
      "/my-nutrition",
      "/groups",
      "/builder",
      "/yoga-mobility",
      "/programs",
      "/exercises",
      "/coaches",
      "/challenges",
      "/meal-plans",
      "/recipes",
      "/nutrition",
      "/quick-workouts",
      "/articles",
      "/train",
      "/app",
      "/quiz",
    ].includes(normalizedPath) || normalizedPath.startsWith("/builder/") || normalizedPath.startsWith("/challenges/");
  // Full-screen detail pages on mobile: hide top header + bottom tab bar so
  // the card content opens like a native modal (matches recipe dialog UX).
  const detailPrefixes = [
    "/programs/",
    "/challenges/",
    "/recipes/",
    "/articles/",
    "/exercises/",
    "/coaches/",
    "/meal-plans/",
    "/quick-workouts/",
    "/builder/",
    "/training/",
  ];

  const isDetailPage = detailPrefixes.some(
    (p) => pathname.startsWith(p) && pathname.replace(/\/$/, "").length > p.length - 1,
  );
  // Profile and quiz are treated as full-screen mobile pages: hide the top
  // category header so only the bottom tab bar remains for navigation.
  const isFullscreenMobilePage =
    pathname.replace(/\/$/, "") === "/my-library" ||
    pathname.replace(/\/$/, "") === "/quiz";
  useSyncTranslations();
  // useSingleSession(); // disabled, multiple devices allowed
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AutoTranslator />
        <LanguageSplash />
        {/* TranslationGate removed, instant switch, no loading screen */}
        <div className="h-dvh flex flex-col overflow-hidden pt-[env(safe-area-inset-top)]">
          <div className={`shrink-0 z-50 ${isDetailPage || isFullscreenMobilePage ? "hidden md:block" : ""}`}>
            <PaymentTestModeBanner />
            <SiteHeader />
          </div>
          <ScrollManager isDetailPage={isDetailPage}>
            <Outlet />
            <div className={hideFooterOnMobile ? "hidden md:block" : ""}>
              <SiteFooter />
            </div>
          </ScrollManager>
          <AiCoachBubble />
          <NameCapture />
          <div className={isDetailPage && !normalizedPath.startsWith("/builder/") ? "hidden md:block" : ""}>
            <BottomTabBar />
          </div>
        </div>

      </LanguageProvider>
    </QueryClientProvider>
  );
}

/**
 * Manages scroll position for the main scroll container.
 * - On a new navigation (push), scrolls to top so pages open at their header.
 * - On back/forward (pop), restores the saved scroll position.
 * Native scrollRestoration does not work here because scrolling happens
 * inside <main>, not on window.
 */
function ScrollManager({ children, isDetailPage }: { children: ReactNode; isDetailPage: boolean }) {
  const ref = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const href = useRouterState({ select: (s) => s.location.href });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const normalizedScrollPath = pathname.replace(/\/$/, "");
  const access = useAccess();
  const hasBuilderAccess = access.hasBundle || access.hasSubscription;
  // Only lock scrolling on the builder landing page for members already inside
  // the builder. Guests / free users see the marketing + pricing paywall which
  // needs to scroll so they can read all the info and reach the plans.
  const isLockedPage = normalizedScrollPath === "/builder" && hasBuilderAccess;
  const positions = useRef<Map<number, number>>(new Map());
  const lastIndex = useRef<number | null>(null);
  const lastHref = useRef<string | null>(null);
  const pendingAction = useRef<"PUSH" | "REPLACE" | "BACK" | "FORWARD" | "GO" | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const action = pendingAction.current;
    const isBackForward = action === "BACK" || action === "FORWARD" || action === "GO";
    if (isBackForward) return;

    // This runs after React commits the new route but before the browser
    // paints it, so category swaps never show the old scroll position.
    el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    el.scrollTop = 0;
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [href]);

  // Global "checkout=success" handler so returning from Stripe on ANY route
  // (builder, my-nutrition, checkout success) refreshes the access cache
  // without needing a manual reload. Polls a few times so we catch the
  // subscription/purchase row after the webhook writes it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!href.includes("checkout=success") && !href.includes("/checkout/success")) return;
    import("@/hooks/useAccess").then(({ refreshAccess }) => {
      refreshAccess();
      [1500, 4000, 8000, 15000].forEach((ms) => window.setTimeout(refreshAccess, ms));
    });
  }, [href]);


  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      try { window.history.scrollRestoration = "manual"; } catch {}
    }

    const getIndex = (): number => {
      const s = router.state.location.state as { __TSR_index?: number } | undefined;
      return typeof s?.__TSR_index === "number" ? s.__TSR_index : 0;
    };

    // Track history action type (PUSH, BACK, FORWARD, ...) alongside router events.
    const unsubHistory = router.history.subscribe(({ action }: { action: { type?: string } | string }) => {
      const actionType = typeof action === "string" ? action : action.type;
      // Save scroll of the entry we're leaving.
      if (lastIndex.current !== null) {
        positions.current.set(lastIndex.current, el.scrollTop);
      }
      pendingAction.current = actionType as typeof pendingAction.current;

      // For normal category taps, clear the old scroll offset immediately,
      // before the next route renders. Waiting for onResolved can show the
      // incoming page at the previous scroll depth for one frame.
      if (actionType === "PUSH" || actionType === "REPLACE") {
        el.scrollTo({ top: 0, left: 0, behavior: "auto" });
        el.scrollTop = 0;
      }
    });

    const unsubResolved = router.subscribe("onResolved", () => {
      const idx = getIndex();
      const action = pendingAction.current;
      const href = router.state.location.href;
      const isSameLocation = lastHref.current === href;
      if (isSameLocation && action === null) return;
      const isBackForward = action === "BACK" || action === "FORWARD" || action === "GO";
      const saved = positions.current.get(idx);
      const target = isBackForward && typeof saved === "number" ? saved : 0;
      // Reset synchronously before the new page paints to avoid a flash
      // at the previous scroll offset. Re-apply after paint in case layout
      // shifts (images, fonts) push content back.
      el.scrollTop = target;
      requestAnimationFrame(() => {
        el.scrollTop = target;
      });
      lastIndex.current = idx;
      lastHref.current = href;
      pendingAction.current = null;
    });

    lastIndex.current = getIndex();
    lastHref.current = router.state.location.href;

    return () => {
      unsubHistory();
      unsubResolved();
    };
  }, [router]);

  return (
    <main
      id="app-scroll-container"
      ref={ref}
      className={`flex-1 overflow-x-hidden overscroll-y-none relative ${
        isLockedPage
          ? "overflow-hidden pb-0"
          : isDetailPage
            ? "overflow-y-auto pb-0"
            : "overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0"
      }`}
    >
      {children}
    </main>
  );
}


