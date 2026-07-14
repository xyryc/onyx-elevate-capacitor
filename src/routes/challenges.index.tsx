import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Trophy, Users } from "lucide-react";
import { challenges, rewardPercentFor } from "@/data/challenges";
import { useT } from "@/i18n/LanguageProvider";


export const Route = createFileRoute("/challenges/")({
  head: () => ({
    meta: [
      { title: "Onyx Challenges · Pick a fight. Finish it." },
      { name: "description", content: "25+ free Onyx fitness challenges, 10K steps, 75 Hard, push-ups, cold showers, no sugar, handstands and more. Join in one tap, earn a badge." },
      { property: "og:title", content: "Onyx Challenges" },
      { property: "og:description", content: "Free fitness challenges to reset your habits, build a base, and earn a badge." },
    ],
  }),
  component: ChallengesIndex,
});

function ChallengesIndex() {
  const t = useT();

  return (
    <div className="container-onyx challenges-page py-6 lg:py-10">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">{t("challenges.eyebrow")}</div>
        <h1 className="mt-2 font-display text-4xl lg:text-6xl font-bold leading-[1.05]">
          {t("challenges.title1")}<span className="text-electric">.</span>{t("challenges.title2").replace(/^\./, "")}
        </h1>
        <p className="mt-3 text-muted-foreground text-base lg:text-lg max-w-2xl">
          {t("challenges.subtitle").replace("{{count}}", String(challenges.length))}
        </p>
      </div>

      <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {challenges.map((c) => {
          const reward = rewardPercentFor(c);
          return (
            <Link
              key={c.slug}
              to="/challenges/$slug"
              params={{ slug: c.slug }}
              className="group surface-card rounded-xl overflow-hidden hover:border-electric/60 transition-all block focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.image} alt={c.title} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/50 to-transparent" />
                <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-electric text-onyx-50 text-[9px] font-bold uppercase tracking-wider">{c.durationDays}d</span>
                  <span className="px-1.5 py-0.5 rounded bg-onyx-50/80 backdrop-blur border border-border text-[9px] font-semibold hidden sm:inline-block">{c.category}</span>
                </div>
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-full bg-electric/95 px-1.5 py-0.5 text-[9px] font-bold text-onyx-50 shadow-lg">
                  <Trophy className="h-2.5 w-2.5" />
                  {reward >= 100 ? "FREE" : `-${reward}%`}
                </div>
              </div>
              <div className="p-2.5 sm:p-4">
                <h2 className="font-display text-sm sm:text-base font-bold leading-tight group-hover:text-electric transition-colors line-clamp-2">{c.title}</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-2 sm:mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-wider">
                  <span className="inline-flex min-w-0 items-center gap-1 text-muted-foreground">
                    <Flame className="h-3 w-3 shrink-0 text-electric" />
                    <span className="truncate">{c.difficulty}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 justify-self-end text-electric font-semibold">
                    <Users className="h-3 w-3" />
                    {t("challenges.join")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
