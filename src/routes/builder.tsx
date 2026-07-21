import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Loader2, Lock, Check } from "lucide-react";
import builderHero from "@/assets/builder-hero-real.jpg";
import { ShimmerButton } from "@/components/ShimmerButton";
import { MembershipModal } from "@/components/MembershipModal";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n/LanguageProvider";
import { useAccess } from "@/hooks/useAccess";

export const Route = createFileRoute("/builder")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Create Workout, Onyx Elevate" },
      {
        name: "description",
        content:
          "Build your own custom training program: pick exercises, sets, reps, RPE and more.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="container-onyx py-16 text-center">
        <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 inline-flex items-center rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50"
        >
          Try again
        </button>
      </div>
    );
  },
  component: BuilderLayout,
});

function BuilderLayout() {
  const t = useT();
  const { user, loading: authLoading } = useAuth();
  const { hasSubscription, hasBundle, loading: accessLoading } = useAccess();

  if (authLoading || accessLoading) {
    return (
      <div className="container-onyx py-24 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-electric" />
      </div>
    );
  }

  const hasAccess = hasSubscription || hasBundle;

  if (!user || !hasAccess) {
    const features = [
      { title: t("builder.gate.f1.title"), desc: t("builder.gate.f1.desc") },
      { title: t("builder.gate.f2.title"), desc: t("builder.gate.f2.desc") },
      { title: t("builder.gate.f3.title"), desc: t("builder.gate.f3.desc") },
      { title: t("builder.gate.f4.title"), desc: t("builder.gate.f4.desc") },
      { title: t("builder.gate.f5.title"), desc: t("builder.gate.f5.desc") },
      { title: t("builder.gate.f6.title"), desc: t("builder.gate.f6.desc") },
      { title: t("builder.gate.f7.title"), desc: t("builder.gate.f7.desc") },
      { title: t("builder.gate.f8.title"), desc: t("builder.gate.f8.desc") },
    ];

    return (
      <div className="bg-onyx-50">
        <div className="mx-auto w-full max-w-[560px] px-6">
          {/* Magazine hero */}
          <div className="relative -mx-6 md:mx-0 md:rounded-2xl overflow-hidden border-b md:border border-white/5 mb-6">
            <div className="relative aspect-[21/11] w-full">
              <img
                src={builderHero}
                alt="Custom program builder"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
              <span className="text-[10px] font-extrabold tracking-[0.25em] text-electric uppercase">
                {t("builder.gate.eyebrow")}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight leading-none mt-1">
                BUILDER<span className="text-electric">+</span>
              </h1>
            </div>
            <div className="absolute left-6 top-4 flex items-center gap-2 rounded-full border border-electric/40 bg-onyx-50/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric backdrop-blur">
              <Lock className="h-3 w-3" /> {t("builder.gate.membersOnly")}
            </div>
          </div>

          {/* Primary CTA — matches home screen Bli medlem */}
          <div className="mb-7 flex justify-center">
            <MembershipModal
              trigger={
                <ShimmerButton className="inline-flex items-center px-6 py-3 text-sm font-semibold">
                  {t("Become a member")}
                </ShimmerButton>
              }
            />
          </div>

          {/* 01 — Intro */}
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[10px] font-mono font-bold text-muted-foreground/70 tracking-tighter uppercase italic">
                {t("builder.gate.section1Label")}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <p className="font-display text-xl md:text-2xl font-light italic leading-snug text-foreground/85">
              {t("builder.gate.intro1")}{" "}
              <span className="not-italic font-bold text-foreground">
                {t("builder.gate.introBrand")}
              </span>
              {t("builder.gate.intro2")}
            </p>
          </section>

          {/* 02 — Blueprint / Features with checkmarks */}
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-mono font-bold text-muted-foreground/70 tracking-tighter uppercase italic">
                {t("builder.gate.section2Label")}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>

            {/* First feature: emphasized */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-none w-7 h-7 rounded-full border border-electric/40 bg-electric/10 grid place-items-center">
                <Check className="w-3.5 h-3.5 text-electric" strokeWidth={3} />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground uppercase tracking-tight">
                  {features[0].title}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{features[0].desc}</p>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-y-4">
              {features.slice(1).map((f) => (
                <li key={f.title} className="flex items-center gap-4">
                  <Check className="w-4 h-4 text-electric/70 flex-none" strokeWidth={3} />
                  <span className="text-xs font-semibold text-foreground/85 tracking-wide uppercase">
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Editorial pull-quote */}
          <aside className="relative border-l-2 border-electric bg-onyx-100/40 p-6">
            <span className="text-[9px] font-bold text-electric uppercase tracking-widest block mb-2">
              {t("builder.gate.pullEyebrow")}
            </span>
            <p className="font-display text-base md:text-lg italic text-foreground/80 leading-relaxed">
              "{t("builder.gate.pull")}"
            </p>
          </aside>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
