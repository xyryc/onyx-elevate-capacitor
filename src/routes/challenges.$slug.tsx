import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getChallenge, rewardPercentFor, type Challenge } from "@/data/challenges";
import { getLevelsFor, type Level } from "@/data/challengeLevels";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { joinChallenge, leaveChallenge, bumpChallengeProgress } from "@/lib/engagement";
import { claimChallengeReward } from "@/lib/rewards.functions";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { listChallengeLeaderboard } from "@/lib/engagement-extra";
import { AchievementShareCard } from "@/components/AchievementShareCard";
import { useT } from "@/i18n/LanguageProvider";
import { X } from "lucide-react";

export const Route = createFileRoute("/challenges/$slug")({
  loader: ({ params }): { ch: Challenge } => {
    const ch = getChallenge(params.slug);
    if (!ch) throw notFound();
    return { ch };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.ch;
    if (!c) return {};
    return {
      meta: [
        { title: `${c.title} · Onyx Challenge` },
        { name: "description", content: c.tagline },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.tagline },
        { property: "og:image", content: c.image },
      ],
      links: [{ rel: "preload", as: "image" as const, href: c.image }],
    };
  },
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
  component: ChallengeDetail,
});

function NotFoundView() {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">{t("challenges.d.notFound")}</h1>
      <Link to="/challenges" className="mt-6 inline-block text-electric font-semibold">{t("challenges.d.backToChallenges")}</Link>
    </div>
  );
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{t("challenges.d.errorTitle")}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">{t("challenges.d.tryAgain")}</button>
    </div>
  );
}


function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ChallengeDetail() {
  const { ch } = Route.useLoaderData() as { ch: Challenge };
  const router = useRouter();
  const { user } = useAuth();
  const t = useT();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/challenges" });
    }
  };
  const [joined, setJoined] = useState(false);
  const [progress, setProgress] = useState(0);
  const [participantCount, setParticipantCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [lastLogged, setLastLogged] = useState<string | null>(null);
  const [reward, setReward] = useState<{ code: string; discount_percent: number } | null>(null);
  const [activeLevel, setActiveLevel] = useState<Level["name"]>("Intermediate");
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const claimReward = useServerFn(claimChallengeReward);

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const levels = useMemo(() => getLevelsFor(ch), [ch]);
  const currentLevel = levels?.find((l) => l.name === activeLevel) ?? levels?.[1] ?? null;
  const discountPercent = rewardPercentFor(ch);
  const storageKey = user ? `onyx:challenge:${ch.slug}:${user.id}:lastLog` : null;

  useEffect(() => {
    let a = true;
    supabase
      .rpc("get_challenge_participant_count", { slug: ch.slug })
      .then(({ data }) => { if (a) setParticipantCount((data as number | null) ?? 0); });

    if (user) {
      supabase
        .from("challenge_participants")
        .select("progress")
        .eq("challenge_slug", ch.slug)
        .maybeSingle()
        .then(({ data }) => {
          if (!a) return;
          setJoined(!!data);
          setProgress(data?.progress ?? 0);
        });
      supabase
        .from("challenge_rewards")
        .select("code, discount_percent")
        .eq("challenge_slug", ch.slug)
        .maybeSingle()
        .then(({ data }) => { if (a && data) setReward(data); });
      if (storageKey) {
        try { setLastLogged(localStorage.getItem(storageKey)); } catch { /* ignore */ }
      }
    }
    return () => { a = false; };
  }, [user, ch.slug, storageKey]);

  const pct = Math.round((progress / ch.durationDays) * 100);
  const complete = progress >= ch.durationDays;
  const loggedToday = lastLogged === todayKey();


  return (
    <div>
      {/* Breadcrumb — desktop only */}
      <div className="container-onyx pt-8 hidden md:block">
        <nav className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-foreground">{t("nav.home")}</Link>
          <span className="text-border">/</span>
          <Link to="/challenges" className="hover:text-foreground">{t("nav.challenges")}</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{ch.category}</span>
        </nav>
      </div>

      {/* Hero — image on top, content below (matches recipe-card modal) */}
      <section className="md:container-onyx md:pt-4 md:pb-10">
        <div className="md:surface-card md:rounded-2xl overflow-hidden">
          <div className="relative aspect-[16/9] md:aspect-[21/9] bg-onyx-200">
            <img src={ch.image} alt={ch.title} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="sync" fetchPriority="high" />
            {/* Floating close button — top-right on every screen */}
            <button
              type="button"
              onClick={goBack}
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-onyx-950/70 text-white backdrop-blur border border-white/10 shadow-lg hover:bg-onyx-950/90 transition"
              aria-label={t("challenges.d.goBack")}
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
          </div>

          <div className="p-6 md:p-10">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                <span className="px-2 py-1 rounded-md bg-electric text-onyx-50 font-bold">{t("challenges.d.daysBadge", { count: ch.durationDays })}</span>
                <span className="px-2 py-1 rounded-md bg-onyx-100 border border-border text-muted-foreground">{ch.category}</span>
                <span className="px-2 py-1 rounded-md bg-onyx-100 border border-border text-muted-foreground">{ch.difficulty}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05]">{ch.title}</h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">{ch.tagline}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 px-6 md:px-0">
          <article className="max-w-2xl">
            {/* The mission — editorial lede */}
            <div className="relative">
              <span className="absolute -left-3 top-1 h-full w-[3px] bg-electric rounded-full" />
              <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.mission")}</p>
              <p className="mt-3 font-display text-xl md:text-2xl leading-snug text-foreground/90">
                {ch.summary}
              </p>
            </div>

            {/* Quick facts row — no boxes, just lines */}
            <div className="mt-10 grid grid-cols-2 gap-6 border-y border-border/60 py-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{t("challenges.d.dailyTask")}</p>
                <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{ch.dailyTask}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">{t("challenges.d.when")}</p>
                <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{ch.timing}</p>
              </div>
            </div>

            {/* How to — big numbered editorial list */}
            <section className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.techniqueEyebrow")}</p>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">{t("challenges.d.stepByStep")}<span className="text-electric">.</span></h2>
              <ol className="mt-6 space-y-6">
                {ch.howTo.map((step, i) => (
                  <li key={step} className="flex gap-5">
                    <span className="shrink-0 font-display text-4xl md:text-5xl font-bold text-electric/70 leading-none tabular-nums w-10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1 text-base text-foreground/85 leading-relaxed border-b border-border/40 pb-5 flex-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>


            {levels && (
              <section className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.dayByDay")}</p>
                    <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">{t("challenges.d.yourPlan")}<span className="text-electric">.</span></h2>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md">
                      {t("challenges.d.pickLevel")}
                    </p>
                  </div>
                  <div className="inline-flex rounded-full border border-border bg-onyx-100/60 p-1">
                    {levels.map((l) => (
                      <button
                        key={l.name}
                        type="button"
                        onClick={() => setActiveLevel(l.name)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                          activeLevel === l.name
                            ? "bg-electric text-onyx-50"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                {currentLevel && (
                  <>
                    <p className="mt-4 text-sm text-foreground/75 italic border-l-2 border-electric/40 pl-3">{currentLevel.summary}</p>
                    {(() => {
                      const weeks: { week: number; days: typeof currentLevel.days }[] = [];
                      currentLevel.days.forEach((d) => {
                        const w = Math.ceil(d.day / 7);
                        let bucket = weeks.find((b) => b.week === w);
                        if (!bucket) {
                          bucket = { week: w, days: [] };
                          weeks.push(bucket);
                        }
                        bucket.days.push(d);
                      });

                      return (
                        <div className="mt-8 space-y-10">
                          {weeks.map((wk) => (
                            <div key={wk.week}>
                              <div className="flex items-baseline gap-3 mb-4">
                                <span className="font-display text-3xl font-bold text-electric/80 leading-none">W{wk.week}</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t("challenges.d.weekLabel", { n: wk.week })}</span>
                                <span className="flex-1 h-px bg-border/50" />
                              </div>
                              <div className="divide-y divide-border/40">
                                {wk.days.map((d) => {
                                  const open = openDays.has(d.day);
                                  return (
                                    <div key={d.day}>
                                      <button
                                        type="button"
                                        onClick={() => toggleDay(d.day)}
                                        className="w-full flex items-center gap-4 py-3 text-left hover:bg-onyx-100/30 transition-colors -mx-2 px-2 rounded"
                                      >
                                        <span className="font-display text-lg font-bold text-electric/70 tabular-nums w-10 shrink-0">
                                          {String(d.day).padStart(2, "0")}
                                        </span>
                                        <span className={`flex-1 min-w-0 text-sm truncate ${d.rest ? "text-muted-foreground italic" : "text-foreground/90"}`}>
                                          {d.rest ? t("challenges.d.restDay") : d.title}
                                        </span>
                                        {!d.rest && (
                                          <svg className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                                        )}
                                      </button>
                                      {open && !d.rest && (d.sets?.length || d.note) && (
                                        <div className="pl-14 pb-4 space-y-1.5">
                                          {d.sets?.map((s, i) => (
                                            <p key={i} className="text-xs text-foreground/75 flex gap-2">
                                              <span className="text-electric">•</span>{s}
                                            </p>
                                          ))}
                                          {d.note && (
                                            <p className="text-[11px] text-muted-foreground italic pt-1">{d.note}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
              </section>
            )}

            {!levels && (
              <section className="mt-14 border-l-2 border-electric pl-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.howThisWorksEyebrow")}</p>
                <p className="mt-2 text-base text-foreground/85 leading-relaxed">
                  {t("challenges.d.howThisWorksBody", { days: ch.durationDays })}
                </p>
              </section>
            )}

            {/* Rules & Mistakes — two-column editorial, no cards */}
            <section className="mt-14 grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.rulesEyebrow")}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{t("challenges.d.playFair")}<span className="text-electric">.</span></h3>
                <ul className="mt-4 space-y-3">
                  {ch.rules.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                      <svg className="h-4 w-4 text-electric shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-destructive font-bold">{t("challenges.d.mistakesEyebrow")}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{t("challenges.d.avoidThese")}<span className="text-destructive">.</span></h3>
                <ul className="mt-4 space-y-3">
                  {ch.mistakes.map((m) => (
                    <li key={m} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                      <svg className="h-4 w-4 text-destructive shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Reward — hero banner style, single element */}
            <section className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-electric/20 via-electric/5 to-transparent border border-electric/30 p-6 md:p-8">
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-electric/10 blur-3xl" />
              <div className="relative flex items-start gap-5">
                <div className="hidden md:flex shrink-0 h-20 w-20 rounded-full bg-electric text-onyx-50 items-center justify-center font-display font-bold text-3xl shadow-lg shadow-electric/30">
                  🎟️
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{t("challenges.d.yourRewardEyebrow")}</p>
                  <p className="mt-2 font-display text-3xl md:text-4xl font-bold leading-[1.1]">
                    <span className="text-electric">{t("challenges.d.rewardHeadline1")}</span> {t("challenges.d.rewardHeadline2")}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground max-w-md">
                    <li>• {t("challenges.d.rewardBullet1")}</li>
                    <li>• {t("challenges.d.rewardBullet2")}</li>
                    <li>• {t("challenges.d.rewardBullet3")}</li>
                    <li>• {t("challenges.d.rewardBullet4")}</li>
                  </ul>
                </div>
              </div>
            </section>
          </article>


          <aside>
            <div className="sticky top-24 surface-card rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">{t("challenges.d.yourChallenge")}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t("challenges.d.athletesJoined", { count: participantCount.toLocaleString() })}</p>

              {!user ? (
                <Link to="/auth" className="mt-5 block w-full rounded-md bg-electric px-4 py-3 text-center text-sm font-bold text-onyx-50 hover:bg-electric-glow">
                  {t("challenges.d.signInToJoin")}
                </Link>
              ) : !joined ? (
                <button
                  disabled={busy}
                  onClick={async () => { setBusy(true); try { await joinChallenge(ch.slug); setJoined(true); setParticipantCount((c) => c + 1); } finally { setBusy(false); } }}
                  className="mt-5 block w-full rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50"
                >
                  {t("challenges.d.joinChallenge")}
                </button>
              ) : (
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t("challenges.d.dayOf", { current: progress, total: ch.durationDays })}</span>
                      <span className="text-electric font-bold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-2" />
                  </div>
                  {complete ? (
                    reward ? (
                      <div className="rounded-md border border-electric/50 bg-electric/10 p-4 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{t("challenges.d.rewardCodeLabel", { percent: reward.discount_percent })}</p>
                        <div className="mt-2 font-mono text-sm md:text-base font-bold tracking-wider break-all select-all bg-onyx-50/60 border border-border rounded px-2 py-2">
                          {reward.code}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try { await navigator.clipboard.writeText(reward.code); toast.success(t("challenges.d.codeCopied")); }
                              catch { toast.error(t("challenges.d.copyFailed")); }
                            }}
                            className="flex-1 rounded-md bg-onyx-50 border border-border px-3 py-2 text-xs font-semibold hover:border-electric"
                          >
                            {t("challenges.d.copyCode")}
                          </button>
                          <Link
                            to="/programs"
                            onClick={() => { try { sessionStorage.setItem("onyx:discountCode", reward.code); } catch { /* ignore */ } }}
                            className="flex-1 rounded-md bg-electric px-3 py-2 text-xs font-bold text-onyx-50 hover:bg-electric-glow text-center"
                          >
                            {t("challenges.d.useNow")}
                          </Link>
                        </div>
                        <p className="mt-2 text-[10px] text-muted-foreground">{t("challenges.d.oneTimeUse")}</p>
                      </div>
                    ) : (
                      <button
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          try {
                            const r = await claimReward({
                              data: {
                                challengeSlug: ch.slug,
                              },
                            });
                            setReward({ code: r.code, discount_percent: r.discount_percent });
                            toast.success(t("challenges.d.codeUnlocked", { percent: r.discount_percent }));
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : t("challenges.d.couldNotClaim"));
                          } finally { setBusy(false); }
                        }}
                        className="block w-full rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 animate-pulse"
                      >
                        {discountPercent >= 100 ? t("challenges.d.claimFreeProgram") : t("challenges.d.claimPercent", { percent: discountPercent })}
                      </button>
                    )
                  ) : (
                    <button
                      disabled={busy || loggedToday}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          const next = await bumpChallengeProgress(ch.slug, ch.durationDays, 1);
                          setProgress(next);
                          const k = todayKey();
                          setLastLogged(k);
                          if (storageKey) { try { localStorage.setItem(storageKey, k); } catch { /* ignore */ } }
                        } finally { setBusy(false); }
                      }}
                      className="block w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loggedToday ? t("challenges.d.loggedTomorrow") : t("challenges.d.logToday")}
                    </button>
                  )}

                  <button
                    disabled={busy}
                    onClick={async () => {
                      if (!confirm(t("challenges.d.leaveConfirm"))) return;
                      setBusy(true);
                      try { await leaveChallenge(ch.slug); setJoined(false); setProgress(0); setParticipantCount((c) => Math.max(0, c - 1)); }
                      finally { setBusy(false); }
                    }}
                    className="block w-full rounded-md border border-border bg-onyx-100 px-4 py-2 text-xs font-medium hover:border-destructive hover:text-destructive transition-colors"
                  >
                    {t("challenges.d.leaveChallenge")}
                  </button>
                </div>
              )}

              <div className="mt-4">
                <FavoriteButton type="challenge" slug={ch.slug} className="w-full justify-center" />
              </div>
            </div>
          </aside>
        </div>

        {/* Leaderboard removed to protect participant privacy */}

        {reward && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold mb-4">{t("challenges.d.shareWin")}<span className="text-electric">.</span></h2>
            <AchievementShareCard
              title={ch.title}
              subtitle={t("challenges.d.completedSubtitle", { days: ch.durationDays })}
              metric={`${reward.discount_percent}%`}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function ChallengeLeaderboard({ slug, totalDays }: { slug: string; totalDays: number }) {
  const t = useT();
  const { data: rows = [] } = useQuery({
    queryKey: ["challenge-leaderboard", slug],
    queryFn: () => listChallengeLeaderboard(slug, 25),
    refetchInterval: 60_000,
  });
  if (rows.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-bold mb-4">{t("challenges.d.leaderboard")}<span className="text-electric">.</span></h2>
      <div className="rounded-lg border border-border bg-onyx-100/60 divide-y divide-border/60">
        {rows.map((r: any, i: number) => (
          <div key={r.user_id} className="flex items-center gap-3 p-3">
            <div className={`w-7 text-center font-display font-bold text-sm ${i < 3 ? "text-electric" : "text-muted-foreground"}`}>
              {i + 1}
            </div>
            {r.avatar_url ? (
              <img src={r.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-electric/15 border border-electric/30 flex items-center justify-center text-electric text-xs font-bold">
                {(r.display_name || "A").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{r.display_name || t("challenges.d.onyxAthlete")}</div>
              <div className="text-xs text-muted-foreground">
                {r.completed_at ? t("challenges.d.finished") : t("challenges.d.daysCount", { progress: r.progress, total: totalDays })}
              </div>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-onyx-200 overflow-hidden">
              <div className="h-full bg-electric" style={{ width: `${Math.min(100, (r.progress / totalDays) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
