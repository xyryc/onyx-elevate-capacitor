import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Dumbbell, Apple, PlusCircle, User } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";

export function BottomTabBar() {
  const t = useT();
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const tabs: Array<{ to: string; label: string; icon: typeof Home; exact?: boolean }> = [
    { to: "/", label: t("nav.home"), icon: Home, exact: true },
    { to: "/exercises", label: t("nav.exercises"), icon: Dumbbell },
    {
      to: user ? "/my-nutrition" : "/nutrition",
      label: t("nav.nutrition"),
      icon: Apple,
    },
    { to: "/builder", label: t("nav.createProgram"), icon: PlusCircle },
    {
      to: user ? "/my-library" : "/auth",
      label: user ? t("profile.myProfile") : t("auth.signIn"),
      icon: User,
    },
  ];

  const norm = (p: string) => p.replace(/\/$/, "") || "/";
  const current = norm(pathname);
  const resetScrollablePage = () => {
    if (typeof document === "undefined") return;
    const scroller = document.getElementById("app-scroll-container");
    scroller?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (scroller) scroller.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-onyx-100/95 backdrop-blur-xl shadow-[0_-1px_0_0_oklch(1_0_0_/_6%)_inset] [body.hide-bottom-tabbar_&]:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) * 0.5)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.exact
            ? current === "/"
            : current === norm(tab.to) || current.startsWith(norm(tab.to) + "/");
          const Icon = tab.icon;
          const isLoginTab = !user && tab.to === "/auth";
          const className = `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
            active ? "text-electric" : "text-muted-foreground hover:text-foreground"
          }`;
          return (
            <li key={tab.to}>
              {isLoginTab ? (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.sessionStorage.setItem("onyx.loginSplash.forceOpen", "1");
                    } catch {}
                    window.dispatchEvent(new CustomEvent("onyx:open-login-splash"));
                  }}
                  className={`w-full ${className}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span className="truncate max-w-[56px]">{tab.label}</span>
                </button>
              ) : (
                <Link to={tab.to as any} onClick={resetScrollablePage} className={className}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  <span className="truncate max-w-[56px]">{tab.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
