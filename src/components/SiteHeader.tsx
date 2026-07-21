import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import onyxLogo from "@/assets/onyx-logo.png";
import { useT, useLang } from "@/i18n/LanguageProvider";
import { LANGUAGES, type Lang } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile, updateMyProfile } from "@/lib/purchases.functions";
import { looksLikeRealName } from "@/lib/displayName";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

export function SiteHeader() {
  const t = useT();
  const { lang, setLang } = useLang();
  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  function pickLang(code: Lang) {
    if (code === lang) return;
    setLang(code);
    void updateMyProfile({ data: { preferred_language: code } }).catch(() => {});
  }
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, signOut } = useAuth();
  const compactAppHeader = false;

  useEffect(() => {
    const routes: Array<string> = [
      "/",
      "/exercises",
      "/recipes",
      "/programs",
      "/meal-plans",
      "/challenges",
      "/yoga-mobility",
      "/builder",
      "/nutrition",
    ];
    if (user) routes.push("/my-nutrition", "/groups", "/app");
    for (const to of routes) {
      void router.preloadRoute({ to: to as any }).catch(() => {});
    }
  }, [router, user]);

  const resetScrollablePage = () => {
    if (typeof document === "undefined") return;
    const scroller = document.getElementById("app-scroll-container");
    scroller?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (scroller) scroller.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: !!user,
  });

  const metaName = (user?.user_metadata as any)?.full_name as string | undefined;
  const displayName = looksLikeRealName(profile?.display_name)
    ? profile!.display_name!
    : looksLikeRealName(metaName)
      ? metaName!
      : user?.email && !/privaterelay|appleid/i.test(user.email)
        ? user.email.split("@")[0]
        : "";
  const firstName = displayName ? displayName.split(" ")[0] : "You";
  const initials = (displayName || firstName || "?")
    .split(/\s+/)
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navLinks: Array<{ to: string; label: string; exact?: boolean }> = [
    { to: "/", label: t("nav.home"), exact: true },
    { to: "/exercises", label: t("nav.exercises") },
    { to: "/recipes", label: t("nav.recipes") },
    { to: "/programs", label: t("nav.programs") },
    { to: "/meal-plans", label: t("nav.mealPlans") },
    {
      to: user ? "/my-nutrition" : "/nutrition",
      label: user ? t("nav.myNutrition") : t("nav.nutrition"),
    },
    { to: "/challenges", label: t("nav.challenges") },
    ...(user ? [{ to: "/groups", label: t("nav.groups") }] : []),

    { to: "/yoga-mobility", label: t("nav.yogaMobility") },
    { to: "/builder", label: t("nav.createWorkout") },
  ];

  return (
    <div>
      <header>
        <div className="border-b border-border bg-onyx-100/95 backdrop-blur-xl shadow-[0_1px_0_0_oklch(1_0_0_/_6%)_inset]">
          <div
            className={`container-onyx grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:grid-cols-[auto_1fr_auto] md:gap-3 ${compactAppHeader ? "h-14" : "h-16"}`}
          >
            <Link to="/" className="flex min-w-0 items-center gap-2.5 group">
              <div
                className={`${compactAppHeader ? "h-8 w-8" : "h-9 w-9"} grid shrink-0 place-items-center overflow-hidden rounded-full bg-onyx-100 ring-2 ring-electric shadow-electric`}
              >
                <img
                  src={onyxLogo}
                  alt="Onyx Elevate"
                  className={`${compactAppHeader ? "h-5 w-5" : "h-6 w-6"} object-contain`}
                />
              </div>
              <span
                className={`truncate font-display font-bold tracking-tight ${compactAppHeader ? "text-sm" : "text-base md:text-lg"}`}
              >
                ONYX<span className="text-electric mx-1">·</span>Elevate
              </span>
            </Link>
            <nav className="hidden md:flex items-center justify-center gap-6 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={resetScrollablePage}
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={l.exact ? { exact: true } : undefined}
                  className="hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 justify-self-end">
              {!user && (
                <Link
                  to="/auth"
                  className="hidden sm:inline-flex items-center justify-center rounded-md border border-border bg-onyx-100 px-3.5 py-2 text-sm font-semibold hover:border-electric/60 transition-all"
                >
                  {t("auth.signIn")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="md:hidden border-b border-border bg-onyx-100/95 backdrop-blur-xl shadow-[0_1px_0_0_oklch(1_0_0_/_6%)_inset]">
        <nav
          className="flex items-center gap-1 overflow-x-auto px-3 py-2 text-xs whitespace-nowrap"
          style={{ scrollbarWidth: "none" }}
        >
          {navLinks
            .filter(
              (l) =>
                ![
                  "/",
                  "/exercises",
                  "/my-nutrition",
                  "/nutrition",
                  "/my-library",
                  "/builder",
                ].includes(l.to),
            )
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                preload="render"
                onClick={resetScrollablePage}
                activeProps={{ className: "bg-electric/15 text-electric border-electric/40" }}
                activeOptions={l.exact ? { exact: true } : undefined}
                className="shrink-0 rounded-full border border-border bg-onyx-100 px-3 py-1.5 font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
        </nav>
      </div>
    </div>
  );
}
