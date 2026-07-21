import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";

import { findQuickWorkout, quickWorkouts, type QuickWorkout } from "@/data/quickWorkouts";
import { findExercise } from "@/data/exercises";
import { useAccess } from "@/hooks/useAccess";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n/LanguageProvider";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { ArrowLeft, Clock, Dumbbell, Lock, Play } from "lucide-react";
import { GlossaryText } from "@/components/GlossaryText";

export const Route = createFileRoute("/quick-workouts/$slug")({
  loader: ({ params }) => {
    const workout = findQuickWorkout(params.slug);
    if (!workout) throw notFound();
    return { workout };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.workout.title ?? "Quick Workout"}, Onyx Elevate` },
      { name: "description", content: loaderData?.workout.intro ?? "" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => <NotFoundBlock />,
  errorComponent: ({ error }) => <ErrorBlock message={error.message} />,

  component: QuickWorkoutPage,
});

function QuickWorkoutPage() {
  const { workout } = Route.useLoaderData() as { workout: QuickWorkout };
  const access = useAccess();
  const { user, loading: authLoading } = useAuth();

  const router = useRouter();
  const t = useT();
  const hasMembership = access.hasBundle || access.hasSubscription;
  const stillResolving = access.loading || authLoading;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/programs" });
    }
  };

  if (stillResolving) {
    return (
      <div className="container-onyx py-24 text-center text-muted-foreground text-sm">
        {t("Loading…") || "Loading…"}
      </div>
    );
  }

  // Guests and non-members both see the purchase gate. Guests can sign in from there.
  if (!user || !hasMembership) {
    return <LockedGate slug={workout.slug} title={workout.title} signedIn={!!user} />;
  }

  const totalExercises = workout.blocks.reduce((n, b) => n + b.exercises.length, 0);
  // Store quick-workout favorites under the "program" type so we don't need a
  // DB migration; slug prefix keeps them from colliding with real programs.
  const favSlug = `qw-${workout.slug}`;

  return (
    <div className="pb-24">
      {/* Back bar */}
      <div className="container-onyx pt-6">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-onyx-100/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-electric hover:text-electric transition"
          aria-label="Go back"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back") || "Go back"}
        </button>
      </div>

      {/* Hero */}
      <section className="border-b border-border/60 bg-[radial-gradient(ellipse_at_top,_oklch(0.7_0.22_240/0.18),_transparent_60%)]">
        <div className="container-onyx py-6 md:py-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">
            {t("programs.quick.title")} · {t("programs.quick.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">
            {t(`programs.quick.item.${workout.slug}.title`) || workout.title}
          </h1>
          <p className="mt-3 text-base text-foreground/85 max-w-2xl">{t(workout.intro)}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-onyx-100 px-2.5 py-1">
              <Clock className="h-3.5 w-3.5 text-electric" /> {workout.minutes}{" "}
              {t("programs.quick.min")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-onyx-100 px-2.5 py-1">
              <Dumbbell className="h-3.5 w-3.5 text-electric" /> {workout.equipment}
            </span>
            <span className="rounded-full border border-border bg-onyx-100 px-2.5 py-1 uppercase tracking-wider">
              {t(`programs.quick.tag.${workout.tag}`)}
            </span>
            <span className="rounded-full border border-border bg-onyx-100 px-2.5 py-1">
              {totalExercises} {t("program.table.exercise")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const first = document.getElementById("qw-blocks");
                first?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all shadow-[0_0_24px_rgba(0,180,255,0.35)]"
            >
              {t("programs.quick.start") || "Start workout"} →
            </button>
            <ShareToChatButton
              variant="outline"
              size="sm"
              target={{
                url: `/quick-workouts/${workout.slug}`,
                title: t(`programs.quick.item.${workout.slug}.title`) || workout.title,
                subtitle: `${workout.minutes} min · ${t(`programs.quick.tag.${workout.tag}`)}`,
                kind: "program",
              }}
            />
            <FavoriteButton type="program" slug={favSlug} />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {t("programs.quick.saveHint") ||
              "Save this workout to My Library, you can find it any time under favorites."}
          </p>
        </div>
      </section>

      {/* One combined workout card */}
      <div id="qw-blocks" className="container-onyx pt-8">
        <section className="rounded-2xl border border-border bg-onyx-100 overflow-hidden">
          <header className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 border-b border-border/70 bg-onyx-50">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-electric">
                {t("programs.quick.title")}
              </p>
              <h2 className="font-display text-lg font-bold truncate">
                {t(`programs.quick.item.${workout.slug}.title`) || workout.title}
              </h2>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {workout.minutes} {t("programs.quick.min")} ·{" "}
              {totalExercises} {t("program.table.exercise")}
            </span>
          </header>

          <ul className="divide-y divide-border/60">
            {workout.blocks.flatMap((block, bi) => [
              // Phase divider, small heading inside the same card
              <li key={`phase-${bi}`} className="bg-electric/5 px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">
                  {t(block.title)} · ~{block.minutes} {t("programs.quick.min")}
                </p>
                {block.note && (
                  <p className="text-[11px] text-muted-foreground italic mt-1">
                    <GlossaryText>{t(block.note)}</GlossaryText>
                  </p>
                )}
              </li>,
              // Exercises for this phase
              ...block.exercises.map((ex, j) => {
                const slug = ex.slug && findExercise(ex.slug) ? ex.slug : undefined;
                const NameEl = slug ? (
                  <Link
                    to="/exercises/$slug"
                    params={{ slug }}
                    className="group inline-flex items-center gap-2 text-foreground hover:text-electric transition-colors min-w-0"
                    title={t("program.watchDemo") || "Watch demo video"}
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/15 border border-electric/30 group-hover:bg-electric/30 transition-colors shrink-0">
                      <Play
                        className="h-3 w-3 text-electric translate-x-[1px]"
                        fill="currentColor"
                      />
                    </span>
                    <span className="truncate font-semibold">{t(ex.name)}</span>
                  </Link>
                ) : (
                  <span className="font-semibold truncate">{t(ex.name)}</span>
                );
                return (
                  <li key={`ex-${bi}-${j}`} className="px-4 py-3">
                    <div className="min-w-0">{NameEl}</div>
                    {ex.note && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        <GlossaryText>{t(ex.note)}</GlossaryText>
                      </p>
                    )}
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                      <div className="rounded-md bg-onyx-50/60 border border-border/60 px-2 py-1.5">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {t("program.table.sets")}
                        </p>
                        <p className="text-foreground font-semibold">
                          <GlossaryText>{String(ex.sets)}</GlossaryText>
                        </p>
                      </div>
                      <div className="rounded-md bg-onyx-50/60 border border-border/60 px-2 py-1.5">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {t("program.table.reps")}
                        </p>
                        <p className="text-foreground font-semibold">
                          <GlossaryText>{String(ex.reps)}</GlossaryText>
                        </p>
                      </div>
                      <div className="rounded-md bg-onyx-50/60 border border-border/60 px-2 py-1.5">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {t("program.table.rest")}
                        </p>
                        <p className="text-foreground font-semibold">
                          <GlossaryText>{String(ex.rest)}</GlossaryText>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }),
            ])}
          </ul>
        </section>

        {/* More quick workouts */}
        <div className="pt-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">
            {t("programs.quick.more") || "More quick workouts"}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickWorkouts
              .filter((w) => w.slug !== workout.slug)
              .slice(0, 6)
              .map((w) => (
                <Link
                  key={w.slug}
                  to="/quick-workouts/$slug"
                  params={{ slug: w.slug }}
                  className="rounded-lg border border-border bg-onyx-100 p-3 hover:border-electric/50 transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t(`programs.quick.tag.${w.tag}`)} · {w.minutes} {t("programs.quick.min")}
                  </p>
                  <p className="text-sm font-semibold mt-1 truncate">
                    {t(`programs.quick.item.${w.slug}.title`) || w.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedGate({
  slug,
  title,
  signedIn = true,
}: {
  slug: string;
  title: string;
  signedIn?: boolean;
}) {
  const t = useT();
  return (
    <div className="container-onyx py-16 max-w-xl text-center">
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-onyx-100 border border-border">
        <Lock className="h-6 w-6 text-electric" />
      </div>
      <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold">
        {title} {t("is a member workout")}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {t(
          "Quick Workouts are part of your Onyx membership. Unlock any plan, monthly, yearly or lifetime, to open every workout.",
        )}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/programs"
          hash="all-access"
          className="rounded-md bg-electric px-6 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow"
        >
          {t("See membership →")}
        </Link>
        {!signedIn && (
          <Link
            to="/auth"
            search={{ redirect: `/quick-workouts/${slug}` }}
            className="rounded-md border border-electric bg-onyx-100 px-6 py-3 text-sm font-bold text-electric"
          >
            {t("Sign in")}
          </Link>
        )}
        <Link
          to="/programs"
          className="rounded-md border border-border bg-onyx-100 px-6 py-3 text-sm font-bold"
        >
          {t("Back to programs")}
        </Link>
      </div>
      <p className="mt-6 text-[11px] text-muted-foreground">
        {t("Workout:")} {slug}
      </p>
    </div>
  );
}

function NotFoundBlock() {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{t("Workout not found")}</h1>
      <Link to="/programs" className="text-electric font-semibold mt-4 inline-block">
        ← {t("Back to programs")}
      </Link>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  const t = useT();
  return (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{t("Something went wrong")}</h1>
      <p className="text-sm text-muted-foreground mt-2">{message}</p>
      <Link to="/programs" className="text-electric font-semibold mt-4 inline-block">
        ← {t("Back to programs")}
      </Link>
    </div>
  );
}
