import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Check, ArrowRight, Sparkles, Flame, Beef, Wheat, Droplet } from "lucide-react";
import { useAccess } from "@/hooks/useAccess";
import { useAuth } from "@/hooks/useAuth";
import { MembershipModal } from "@/components/MembershipModal";
import { ShimmerButton } from "@/components/ShimmerButton";
import { useT } from "@/i18n/LanguageProvider";
import nutritionPreview from "@/assets/nutrition-preview.png.asset.json";

export const Route = createFileRoute("/nutrition/")({
  head: () => ({
    meta: [
      { title: "Nutrition Tracker, Log Meals, AI Food Scan & Macros · Onyx Elevate" },
      { name: "description", content: "The Onyx nutrition tracker: log every meal, snap your plate for AI calorie & macro scanning, hit your goals and track weight. Included with any Onyx membership." },
      { property: "og:title", content: "Onyx Nutrition, Food diary, AI photo scan & macro tracker" },
      { property: "og:description", content: "Log meals, scan your plate with AI, track calories, macros & weight, included with any Onyx membership." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Something went wrong.</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">Try again</button>
    </div>
  ),
  notFoundComponent: () => <div className="container-onyx py-24">Not found.</div>,
  component: NutritionIntroPage,
});

function NutritionIntroPage() {
  const t = useT();
  const { user } = useAuth();
  const access = useAccess();
  const hasAccess = access.loading || access.hasSubscription || access.hasBundle;

  // Member view: keep the shortcut banner
  if (hasAccess) {
    return (
      <div className="min-h-screen bg-onyx-50">
        <div className="border-b border-electric/30 bg-gradient-to-r from-electric/15 via-electric/5 to-transparent">
          <div className="container-onyx py-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm">
              <span className="font-semibold text-electric">{t("nutrition.gate.memberBanner.title")}</span>{" "}
              <span className="text-muted-foreground">{t("nutrition.gate.memberBanner.sub")}</span>
            </p>
            <Link
              to="/my-nutrition"
              className="inline-flex items-center gap-1.5 rounded-md bg-electric px-4 py-2 text-sm font-bold text-onyx-50 hover:bg-electric-glow shadow-electric"
            >
              {t("nutrition.gate.openMyNutrition")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="container-onyx py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-onyx-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric">
            <Sparkles className="h-3.5 w-3.5" /> {t("nutrition.gate.included")}
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
            {t("nutrition.gate.title")}
          </h1>
        </div>
      </div>
    );
  }

  // Non-member: magazine gate matching /builder
  const features = [
    { title: t("nutrition.gate.f1.title"), desc: t("nutrition.gate.f1.desc") },
    { title: t("nutrition.gate.f2.title"), desc: t("nutrition.gate.f2.desc") },
    { title: t("nutrition.gate.f3.title"), desc: t("nutrition.gate.f3.desc") },
    { title: t("nutrition.gate.f4.title"), desc: t("nutrition.gate.f4.desc") },
    { title: t("nutrition.gate.f5.title"), desc: t("nutrition.gate.f5.desc") },
    { title: t("nutrition.gate.f6.title"), desc: t("nutrition.gate.f6.desc") },
    { title: t("nutrition.gate.f7.title"), desc: t("nutrition.gate.f7.desc") },
    { title: t("nutrition.gate.f8.title"), desc: t("nutrition.gate.f8.desc") },
  ];

  return (
    <div className="bg-onyx-50">
      <div className="mx-auto w-full max-w-[560px] px-6">
        {/* Magazine hero */}
        <div className="relative -mx-6 md:mx-0 md:rounded-2xl overflow-hidden border-b md:border border-white/5 mb-6 bg-gradient-to-b from-electric/15 via-onyx-100 to-onyx-50">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-electric/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-electric/10 blur-3xl pointer-events-none" />

          {/* Macro strip */}
          <div className="relative pt-12 px-6">
            <div className="grid grid-cols-4 gap-2 rounded-xl border border-white/10 bg-onyx-100/60 backdrop-blur px-3 py-2.5">
              {[
                { icon: Flame, label: "KCAL", val: "2 480" },
                { icon: Beef, label: "PROTEIN", val: "186g" },
                { icon: Wheat, label: "CARBS", val: "245g" },
                { icon: Droplet, label: "FAT", val: "72g" },
              ].map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center">
                  <m.icon className="h-3 w-3 text-electric mb-1" strokeWidth={2.5} />
                  <span className="text-[9px] font-bold tracking-widest text-muted-foreground">{m.label}</span>
                  <span className="text-[11px] font-extrabold text-foreground tabular-nums">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-6 px-6 pt-6 pb-8">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold tracking-[0.25em] text-electric uppercase">{t("nutrition.gate.eyebrow")}</span>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-none mt-1">
                NUTRITION<span className="text-electric">+</span>
              </h1>
              <p className="mt-2 text-[11px] text-muted-foreground leading-snug max-w-[180px]">
                {t("nutrition.gate.pull")}
              </p>
              <div className="mt-4">
                <MembershipModal
                  trigger={
                    <ShimmerButton className="inline-flex items-center px-4 py-2 text-xs font-semibold">
                      {t("Become a member")}
                    </ShimmerButton>
                  }
                />
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex-none relative">
              <div className="relative w-[130px] md:w-[160px] aspect-[9/19.5] rounded-[1.6rem] border-[6px] border-onyx-100 bg-onyx-100 shadow-[0_20px_60px_-15px_rgba(0,180,255,0.45)] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-3 w-14 rounded-b-xl bg-onyx-100" />
                <img
                  src={nutritionPreview.url}
                  alt="Onyx nutrition tracker preview"
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="absolute left-6 top-4 flex items-center gap-2 rounded-full border border-electric/40 bg-onyx-50/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric backdrop-blur">
            <Lock className="h-3 w-3" /> {t("nutrition.gate.membersOnly")}
          </div>
        </div>




        {/* 01 — Intro */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[10px] font-mono font-bold text-muted-foreground/70 tracking-tighter uppercase italic">{t("nutrition.gate.section1Label")}</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <p className="font-display text-xl md:text-2xl font-light italic leading-snug text-foreground/85">
            {t("nutrition.gate.intro1")}{" "}
            <span className="not-italic font-bold text-foreground">{t("nutrition.gate.introBrand")}</span>{t("nutrition.gate.intro2")}
          </p>
        </section>

        {/* 02 — Blueprint */}
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] font-mono font-bold text-muted-foreground/70 tracking-tighter uppercase italic">{t("nutrition.gate.section2Label")}</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-none w-7 h-7 rounded-full border border-electric/40 bg-electric/10 grid place-items-center">
              <Check className="w-3.5 h-3.5 text-electric" strokeWidth={3} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground uppercase tracking-tight">{features[0].title}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{features[0].desc}</p>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-y-4">
            {features.slice(1).map((f) => (
              <li key={f.title} className="flex items-center gap-4">
                <Check className="w-4 h-4 text-electric/70 flex-none" strokeWidth={3} />
                <span className="text-xs font-semibold text-foreground/85 tracking-wide uppercase">{f.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Editorial pull-quote */}
        <aside className="relative border-l-2 border-electric bg-onyx-100/40 p-6">
          <span className="text-[9px] font-bold text-electric uppercase tracking-widest block mb-2">{t("nutrition.gate.pullEyebrow")}</span>
          <p className="font-display text-base md:text-lg italic text-foreground/80 leading-relaxed">
            "{t("nutrition.gate.pull")}"
          </p>
        </aside>

        {!user && (
          <div className="mt-6 mb-8 text-center">
            <Link to="/auth" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
              {t("nutrition.gate.alreadyMember")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
