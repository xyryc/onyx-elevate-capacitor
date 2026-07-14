import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { findExercise, exercises, type Exercise } from "@/data/exercises";
import { ProgramsStrip } from "@/components/ProgramsStrip";
import { ExerciseCard } from "@/components/ExerciseCard";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { useAccess } from "@/hooks/useAccess";
import { MembershipModal } from "@/components/MembershipModal";
import { useT } from "@/i18n/LanguageProvider";
import { isFreePreviewExercise } from "@/lib/exercisePreview";


export const Route = createFileRoute("/exercises/$slug")({
  loader: ({ params }): { exercise: Exercise } => {
    const exercise = findExercise(params.slug);
    if (!exercise) throw notFound();
    return { exercise };
  },
  head: ({ loaderData, params }) => {
    const e = loaderData?.exercise;
    if (!e) return {};
    const suffix = " · Onyx";
    const maxNameLen = 60 - suffix.length;
    const trimmedName = e.name.length > maxNameLen ? `${e.name.slice(0, maxNameLen - 1).trimEnd()}…` : e.name;
    const title = `${trimmedName}${suffix}`;
    const desc = e.shortDescription;
    const url = `https://onyxperformance.app/exercises/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [
        { rel: "canonical", href: url },
        ...(e.thumbnailUrl ? [{ rel: "preload", as: "image" as const, href: e.thumbnailUrl }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Exercise not found</h1>
      <p className="text-muted-foreground mt-3">We don't have that one in the library - yet.</p>
      <Link to="/exercises" className="mt-6 inline-block text-electric font-semibold">← Back to library</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this exercise.</h1>
      <p className="text-muted-foreground mt-2 text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">Try again</button>
    </div>
  ),
  component: ExerciseDetail,
});

function ExerciseDetail() {
  const data = Route.useLoaderData() as { exercise: Exercise };
  const e = data.exercise;
  const router = useRouter();
  const t = useT();
  const access = useAccess();
  const locked = !access.loading && !(access.hasBundle || access.hasSubscription) && !isFreePreviewExercise(e);
  const alternatives = e.alternatives
    .map((s: string) => exercises.find((x) => x.slug === s))
    .filter((x): x is Exercise => Boolean(x));

  const goBack = () => {
    // Prefer browser back so scroll restoration returns the user to where they were.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/exercises" });
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-onyx hidden pt-8 md:block">
        <nav className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="text-border">/</span>
          <Link to="/exercises" className="hover:text-foreground">Exercises</Link>
          <span className="text-border">/</span>
          <Link to="/exercises" search={{ muscle: e.primaryMuscle }} className="hover:text-foreground">{e.primaryMuscle}</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{e.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container-onyx pt-3 pb-10 md:pt-4 md:pb-14">
        <div className="md:hidden">
          <button
            type="button"
            onClick={goBack}
            className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-onyx-100/60 px-3 py-1.5 text-xs font-semibold text-foreground"
            aria-label={t("common.back")}
          >
            ← {t("common.back")}
          </button>
          <div className="surface-card rounded-xl overflow-hidden glow-ring">
            <div className="relative aspect-video bg-onyx-200">
              {locked ? (
                <div className="absolute inset-0 grid place-items-center px-4 text-center bg-gradient-to-b from-onyx-200 to-onyx-50">
                  <div className="max-w-sm space-y-3">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-electric/15 border border-electric/50">
                      <Lock className="h-5 w-5 text-electric" />
                    </div>
                    <p className="font-display text-base font-bold">{t("Unlock every video with membership")}</p>
                    <MembershipModal
                      trigger={
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-md bg-electric px-4 py-2 text-xs font-bold text-onyx-50"
                        >
                          <Lock className="h-3.5 w-3.5" /> {t("See plans")}
                        </button>
                      }
                    />
                  </div>
                </div>
              ) : e.videoUrl ? (
                <iframe
                  src={e.videoUrl}
                  title={`${e.name} demonstration`}
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full bg-onyx-200"
                />
              ) : e.thumbnailUrl ? (
                <img
                  src={e.thumbnailUrl}
                  alt={`${e.name} exercise demonstration`}
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Video coming soon</div>
              )}
              <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border z-10">HD video</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={goBack}
          className="mb-3 hidden items-center gap-1.5 rounded-md border border-border bg-onyx-100/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-electric hover:text-electric transition md:inline-flex"
          aria-label={t("common.back")}
        >
          ← {t("common.back")}
        </button>
        <div className="mt-4 max-w-3xl md:mt-0">
          <span className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{e.exerciseType} · {e.mechanics}</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">{e.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{e.shortDescription}</p>
          <div className="mt-5">
            <ShareToChatButton
              variant="outline"
              target={{
                url: `/exercises/${e.slug}`,
                title: e.name,
                subtitle: `${e.exerciseType} · ${e.mechanics}`,
                image: e.thumbnailUrl ?? null,
                kind: "exercise",
              }}
            />
          </div>
        </div>


        {/* Video */}
        <div className="mt-8 hidden surface-card rounded-2xl overflow-hidden glow-ring md:block">
          <div
            className="relative aspect-video bg-onyx-200"
            style={e.thumbnailUrl ? { backgroundImage: `url(${e.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {e.thumbnailUrl && !locked && (
              <img
                src={e.thumbnailUrl}
                alt=""
                aria-hidden="true"
                width={1280}
                height={720}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {locked ? (
              <div className="absolute inset-0 grid place-items-center px-6 text-center bg-gradient-to-b from-onyx-200 to-onyx-50">
                <div className="max-w-md space-y-4">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-electric/15 border border-electric/50">
                    <Lock className="h-6 w-6 text-electric" />
                  </div>
                  <div>
                    <p className="font-display text-xl md:text-2xl font-bold">{t("Unlock every video with membership")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("The full exercise library, programs, quick workouts and nutrition tracker are all included.")}
                    </p>
                  </div>
                  <MembershipModal
                    trigger={
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow shadow-[0_0_20px_rgba(0,180,255,0.35)]"
                      >
                        <Lock className="h-4 w-4" /> {t("See plans")}
                      </button>
                    }
                  />
                </div>
              </div>
            ) : e.videoUrl ? (
              <iframe
                src={e.videoUrl}
                title={`${e.name} demonstration`}
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                className="absolute inset-0 h-full w-full bg-onyx-200"
              />
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, oklch(0.7 0.22 240 / 0.18), transparent 65%)" }} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="flex items-center gap-4 rounded-full border border-border bg-onyx-50/60 backdrop-blur-md px-6 py-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-onyx-100 text-muted-foreground">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    </span>
                    <span className="text-left">
                      <span className="block font-display text-sm font-semibold">Video coming soon</span>
                      <span className="block text-xs text-muted-foreground">Full step-by-step demo on the way</span>
                    </span>
                  </div>
                </div>
              </>
            )}
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border z-10">HD video</span>
          </div>
        </div>

      </section>

      <div className="container-onyx grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <SectionHeader eyebrow="01 · Overview" title="What it is & why it matters" />
            <p className="mt-5 text-base md:text-lg text-foreground/85 leading-relaxed">{e.overview}</p>
          </section>

          {/* Steps */}
          <section>
            <SectionHeader eyebrow="02 · Execution" title="Step-by-step instructions" />
            <ol className="mt-6 space-y-4">
              {e.steps.map((s, i) => (
                <li key={s.title} className="surface-card rounded-xl p-5 flex gap-5 group hover:border-electric/30 transition-colors">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-electric/10 border border-electric/30 font-display font-bold text-electric">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-base">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Pro tips */}
          <section>
            <SectionHeader eyebrow="03 · Coaching" title="Pro tips" />
            <div className="mt-6 surface-card rounded-xl p-6 border-l-2 border-l-electric">
              <ul className="space-y-3">
                {e.proTips.map((tip) => (
                  <li key={tip} className="flex gap-3 text-sm md:text-base">
                    <svg className="h-5 w-5 text-electric shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z"/></svg>
                    <span className="text-foreground/85">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Mistakes */}
          <section>
            <SectionHeader eyebrow="04 · Avoid" title="Common mistakes" />
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {e.commonMistakes.map((m) => (
                <div key={m} className="surface-card rounded-xl p-4 flex gap-3 items-start border-l-2 border-l-destructive/70">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive text-xs font-bold">✕</span>
                  <p className="text-sm text-foreground/85">{m}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: exercise profile */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="surface-card rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Exercise profile</p>
            </div>
            <dl className="divide-y divide-border text-sm">
              <ProfileRow label="Primary muscle" value={
                <Link to="/exercises" search={{ muscle: e.primaryMuscle }} className="text-electric hover:text-electric-glow">{e.primaryMuscle}</Link>
              } />
              <ProfileRow label="Secondary" value={
                <span className="flex flex-wrap gap-1.5 justify-end">
                  {e.secondaryMuscles.map((m) => (
                    <Link key={m} to="/exercises" search={{ muscle: m }} className="rounded border border-border bg-onyx-100 px-1.5 py-0.5 text-xs hover:border-electric/40 hover:text-electric">{m}</Link>
                  ))}
                </span>
              } />
              <ProfileRow label="Type" value={e.exerciseType} />
              <ProfileRow label="Equipment" value={e.equipment} />
              <ProfileRow label="Mechanics" value={e.mechanics} />
              <ProfileRow label="Force" value={e.forceType} />
              <ProfileRow label="Experience" value={e.level} />
            </dl>
          </div>
        </aside>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <section className="container-onyx mt-20">
          <SectionHeader eyebrow="Alternatives" title="Train this pattern differently" />
          <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {alternatives.map((a) => <ExerciseCard key={a.slug} exercise={a} />)}
          </div>
        </section>
      )}

      <div className="container-onyx">
        <ProgramsStrip />
      </div>
    </div>
  );
}


function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">{title}</h2>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-3 px-5 py-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-right">{value}</dd>
    </div>
  );
}

