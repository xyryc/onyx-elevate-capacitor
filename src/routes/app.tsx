import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import programMuscle from "@/assets/program-muscle.jpg";
import programBodybuilding from "@/assets/program-bodybuilding.jpg";
import programFatloss from "@/assets/program-fatloss.jpg";
import programPowerlifting from "@/assets/program-powerlifting.jpg";
import recipeProteinBowl from "@/assets/recipe-protein-bowl.jpg";
import athletePower from "@/assets/athlete-power.jpg";
import athleteConditioning from "@/assets/athlete-conditioning.jpg";
import chPullup from "@/assets/ch-pullup.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Users,
  ChefHat,
  CalendarClock,
  Clock,
  Brain,
  UserCircle,
  Trophy,
  Zap,
  Heart,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { InstallToPhoneCard } from "@/components/InstallToPhoneCard";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "The Onyx App - Coming Soon | Onyx Elevate" },
      {
        name: "description",
        content:
          "The Onyx Elevate app is coming soon. Expert coaching, 200+ recipes, AI-powered programs, and a community built for every athlete.",
      },
      { property: "og:title", content: "The Onyx App - Coming Soon" },
      { property: "og:description", content: "Your entire training ecosystem, in your pocket." },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const t = useT();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const appStats = [
    { value: "500+", label: t("app.stats.exercises") },
    { value: "200+", label: t("app.stats.recipes") },
    { value: "7", label: t("app.stats.coaches") },
    { value: "12+", label: t("app.stats.programs") },
  ];

  const communityItems = [
    t("app.community.item.monthly"),
    t("app.community.item.running"),
    t("app.community.item.strength"),
    t("app.community.item.transformation"),
    t("app.community.item.team"),
    t("app.community.item.rewards"),
  ];

  const communityCards = [
    {
      icon: <Trophy className="w-8 h-8 text-electric mx-auto" />,
      title: t("app.community.card.monthlyTitle"),
      label: t("app.community.card.challenges"),
    },
    {
      icon: <Users className="w-8 h-8 text-electric mx-auto" />,
      title: t("app.community.card.teamTitle"),
      label: t("app.community.card.events"),
    },
    {
      icon: <Target className="w-8 h-8 text-electric mx-auto" />,
      title: t("app.community.card.goalTitle"),
      label: t("app.community.card.tracking"),
    },
    {
      icon: <Heart className="w-8 h-8 text-electric mx-auto" />,
      title: t("app.community.card.supportTitle"),
      label: t("app.community.card.community"),
    },
  ];

  const detailItems = (base: string, count: number) =>
    Array.from({ length: count }, (_, index) => t(`${base}.${index + 1}`));
  const weekRows = (base: string, count: number) =>
    Array.from({ length: count }, (_, index) => ({
      day: t(`${base}.${index + 1}.day`),
      focus: t(`${base}.${index + 1}.focus`),
    }));

  const programCards = [
    {
      key: "beginner",
      icon: <Zap className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 3,
    },
    {
      key: "bodybuilding",
      icon: <Dumbbell className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 6,
    },
    {
      key: "powerlifting",
      icon: <Target className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 4,
    },
    {
      key: "running",
      icon: <ArrowRight className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 5,
    },
    {
      key: "hyrox",
      icon: <CalendarClock className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 5,
    },
    {
      key: "fatLoss",
      icon: <Heart className="w-5 h-5" />,
      youGetCount: 6,
      weekCount: 5,
    },
  ].map((program) => ({
    ...program,
    title: t(`app.program.${program.key}.title`),
    desc: t(`app.program.${program.key}.desc`),
    tagline: t(`app.program.${program.key}.tagline`),
    length: t(`app.program.${program.key}.length`),
    sessions: t(`app.program.${program.key}.sessions`),
    level: t(`app.program.${program.key}.level`),
    equipment: t(`app.program.${program.key}.equipment`),
    overview: t(`app.program.${program.key}.overview`),
    youGet: detailItems(`app.program.${program.key}.youGet`, program.youGetCount),
    weekStructure: weekRows(`app.program.${program.key}.week`, program.weekCount),
    outcome: t(`app.program.${program.key}.outcome`),
  }));

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -m-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-onyx relative py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric">
              <Sparkles className="w-3.5 h-3.5" />
              {t("app.badge.comingSoon")}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("app.hero.eyebrow")}
            </p>
            <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {t("app.hero.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.hero.titleAccent")}</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg">{t("app.hero.description")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center rounded-md bg-electric px-5 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all">
                    {t("app.hero.downloadIos")}
                  </button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center rounded-md border border-border bg-onyx-100 px-5 py-3 text-sm font-semibold hover:bg-onyx-200 transition-colors">
                    {t("app.hero.downloadAndroid")}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-electric" />
                      {t("app.dialog.title")}
                    </DialogTitle>
                    <DialogDescription>{t("app.dialog.description")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">{t("app.dialog.body")}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowComingSoon(false);
                        document
                          .getElementById("install-to-phone-card")
                          ?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all"
                    >
                      {t("app.install.addHomeScreen")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div id="install-to-phone-card" className="mt-4 max-w-md">
              <InstallToPhoneCard />
            </div>
          </div>

          <div className="relative">
            <AppPreviewSlideshow />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-border">
        <div className="container-onyx py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("app.mission.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold leading-tight">
              {t("app.mission.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.mission.titleAccent")}</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {t("app.mission.body1")}
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {t("app.mission.body2")}
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {appStats.map((stat) => (
              <div key={stat.label} className="surface-card rounded-xl p-6 text-center">
                <div className="font-display text-3xl font-bold text-electric">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Will Onyx Include */}
      <section className="border-t border-border">
        <div className="container-onyx py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("app.includes.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
              {t("app.includes.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.includes.titleAccent")}</span>
            </h2>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Expert Coaching */}
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title={t("app.feature.coaching.title")}
              description={t("app.feature.coaching.desc")}
              items={[
                t("app.feature.coaching.item.bodybuilding"),
                t("app.feature.coaching.item.powerlifting"),
                t("app.feature.coaching.item.strength"),
                t("app.feature.coaching.item.running"),
                t("app.feature.coaching.item.hyrox"),
                t("app.feature.coaching.item.fatLoss"),
                t("app.feature.coaching.item.home"),
                t("app.feature.coaching.item.general"),
              ]}
            />

            {/* Recipes */}
            <FeatureCard
              icon={<ChefHat className="w-6 h-6" />}
              title={t("app.feature.recipes.title")}
              description={t("app.feature.recipes.desc")}
              items={[
                t("app.feature.recipes.item.highProtein"),
                t("app.feature.recipes.item.quick"),
                t("app.feature.recipes.item.mealPrep"),
                t("app.feature.recipes.item.muscle"),
                t("app.feature.recipes.item.fatLoss"),
                t("app.feature.recipes.item.snacks"),
                t("app.feature.recipes.item.allDay"),
              ]}
            />

            {/* Programs */}
            <FeatureCard
              icon={<Dumbbell className="w-6 h-6" />}
              title={t("app.feature.programs.title")}
              description={t("app.feature.programs.desc")}
              items={[
                t("app.feature.programs.item.beginner"),
                t("app.feature.programs.item.bodybuilding"),
                t("app.feature.programs.item.powerlifting"),
                t("app.feature.programs.item.running"),
                t("app.feature.programs.item.hyrox"),
                t("app.feature.programs.item.crossfit"),
                t("app.feature.programs.item.fatLoss"),
                t("app.feature.programs.item.homeGym"),
              ]}
            />

            {/* Busy Lives */}
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title={t("app.feature.busy.title")}
              description={t("app.feature.busy.desc")}
              items={[
                t("app.feature.busy.item.fifteen"),
                t("app.feature.busy.item.twenty"),
                t("app.feature.busy.item.home"),
                t("app.feature.busy.item.minimal"),
                t("app.feature.busy.item.flexible"),
                t("app.feature.busy.item.schedules"),
              ]}
            />

            {/* AI-Powered Programming */}
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title={t("app.feature.ai.title")}
              description={t("app.feature.ai.desc")}
              items={[
                t("app.feature.ai.item.generate"),
                t("app.feature.ai.item.adjust"),
                t("app.feature.ai.item.progression"),
                t("app.feature.ai.item.custom"),
                t("app.feature.ai.item.guidance"),
              ]}
            />

            {/* Profile Experience */}
            <FeatureCard
              icon={<UserCircle className="w-6 h-6" />}
              title={t("app.feature.profile.title")}
              description={t("app.feature.profile.desc")}
              items={[
                t("app.feature.profile.item.history"),
                t("app.feature.profile.item.progress"),
                t("app.feature.profile.item.records"),
                t("app.feature.profile.item.challenges"),
                t("app.feature.profile.item.achievements"),
                t("app.feature.profile.item.favorites"),
              ]}
            />
          </div>
        </div>
      </section>

      {/* Challenges & Community */}
      <section className="border-t border-border">
        <div className="container-onyx py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
                {t("app.community.eyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
                {t("app.community.titlePrefix")}{" "}
                <span className="text-gradient-electric">{t("app.community.titleAccent")}</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                {t("app.community.body")}
              </p>
              <ul className="mt-8 space-y-4">
                {communityItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-electric shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {communityCards.map((card) => (
                <div
                  key={`${card.title}-${card.label}`}
                  className="surface-card rounded-xl p-6 text-center"
                >
                  {card.icon}
                  <div className="mt-3 font-display text-2xl font-bold">{card.title}</div>
                  <div className="text-sm text-muted-foreground">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program categories teaser */}
      <section className="border-t border-border">
        <div className="container-onyx py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("app.programs.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
              {t("app.programs.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.programs.titleAccent")}</span>
            </h2>
            <p className="mt-4 text-muted-foreground">{t("app.programs.description")}</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programCards.map((p) => (
              <Dialog key={p.title}>
                <DialogTrigger asChild>
                  <button className="text-left surface-card rounded-xl p-6 flex items-start gap-4 hover:border-electric/40 hover:bg-electric/5 transition-colors group">
                    <div className="mt-0.5 text-electric">{p.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-electric transition-colors">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                      <p className="mt-3 text-xs text-electric font-medium inline-flex items-center gap-1">
                        {t("app.programs.readMore")} <ArrowRight className="w-3 h-3" />
                      </p>
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto surface-card border-border">
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-electric">{p.icon}</div>
                      <Badge variant="outline" className="border-electric/30 text-electric text-xs">
                        {t("app.programs.badge")}
                      </Badge>
                    </div>
                    <DialogTitle className="font-display text-3xl md:text-4xl">
                      {p.title}
                    </DialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">
                      {p.tagline}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {[
                      { label: t("app.programs.length"), value: p.length },
                      { label: t("app.programs.frequency"), value: p.sessions },
                      { label: t("app.programs.level"), value: p.level },
                      { label: t("app.programs.equipment"), value: p.equipment },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-border bg-background/50 p-3"
                      >
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs uppercase tracking-[0.18em] text-electric font-semibold">
                      {t("app.programs.overview")}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {p.overview}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs uppercase tracking-[0.18em] text-electric font-semibold">
                      {t("app.programs.whatYouGet")}
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {p.youGet.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-electric mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs uppercase tracking-[0.18em] text-electric font-semibold">
                      {t("app.programs.sampleWeek")}
                    </h4>
                    <div className="mt-3 rounded-lg border border-border overflow-hidden">
                      {p.weekStructure.map((d, i) => (
                        <div
                          key={d.day}
                          className={`flex items-center gap-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-background/40" : "bg-background/20"}`}
                        >
                          <span className="text-electric font-semibold w-16 shrink-0">{d.day}</span>
                          <span className="text-foreground">{d.focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-electric/30 bg-electric/5 p-4">
                    <h4 className="text-xs uppercase tracking-[0.18em] text-electric font-semibold flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> {t("app.programs.realisticOutcome")}
                    </h4>
                    <p className="mt-2 text-sm text-foreground">{p.outcome}</p>
                  </div>

                  <div className="mt-6 rounded-lg border border-border bg-background/40 p-4 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-electric mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">
                        {t("app.programs.launchingTitle")}
                      </p>
                      <p className="text-muted-foreground mt-1">
                        {t("app.programs.launchingBody")}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Make It / Philosophy */}
      <section className="border-t border-border relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-onyx relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              {t("app.why.eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
              {t("app.why.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.why.titleAccent")}</span>{" "}
              {t("app.why.titleSuffix")}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {t("app.why.body1")}
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {t("app.why.body2")}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border">
        <div className="container-onyx py-20 md:py-28">
          <div className="surface-card rounded-2xl p-8 md:p-16 text-center max-w-4xl mx-auto glow-ring">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric">
              <Sparkles className="w-3.5 h-3.5" />
              {t("app.badge.comingSoon")}
            </div>
            <h2 className="mt-5 font-display text-3xl md:text-5xl font-bold">
              {t("app.final.titlePrefix")}{" "}
              <span className="text-gradient-electric">{t("app.final.titleAccent")}</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("app.final.description")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all">
                <Mail className="w-4 h-4" />
                {t("app.final.notify")}
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-border bg-onyx-100 px-6 py-3 text-sm font-semibold hover:bg-onyx-200 transition-colors">
                {t("app.final.explore")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="surface-card rounded-xl p-6 flex flex-col h-full hover:border-electric/20 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center text-electric">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
            <CheckCircle2 className="w-4 h-4 text-electric shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SLIDES = [
  { src: programBodybuilding, labelKey: "app.slide.premiumPrograms" },
  { src: athletePower, labelKey: "app.slide.formVideos" },
  { src: recipeProteinBowl, labelKey: "app.slide.recipesMacros" },
  { src: programFatloss, labelKey: "app.slide.trackLifts" },
  { src: chPullup, labelKey: "app.slide.dailyChallenges" },
  { src: athleteConditioning, labelKey: "app.slide.conditioningPlans" },
  { src: programPowerlifting, labelKey: "app.slide.strengthLogs" },
  { src: programMuscle, labelKey: "app.slide.prTracking" },
];

function AppPreviewSlideshow() {
  const t = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border surface-card shadow-electric">
      {SLIDES.map((s, idx) => (
        <img
          key={s.src}
          src={s.src}
          alt={t(s.labelKey)}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div className="relative h-12 flex-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">
            {t("app.slide.eyebrow")}
          </div>
          {SLIDES.map((s, idx) => (
            <div
              key={s.src}
              className={`absolute left-0 right-0 top-4 font-display text-lg font-bold transition-opacity duration-1000 ease-in-out ${
                idx === i ? "opacity-100" : "opacity-0"
              }`}
            >
              {t(s.labelKey)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
