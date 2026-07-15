import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPurchases, getMyProfile, updateMyProfile } from "@/lib/purchases.functions";
import { findNutritionPlan, nutritionPlans } from "@/data/nutritionPlans";
import { programs as PROGRAMS, getProgram } from "@/data/programs";
import { challenges as CHALLENGES, getChallenge } from "@/data/challenges";
import { findExercise } from "@/data/exercises";
import { getRecipeBySlug } from "@/data/recipes";
import { supabase } from "@/integrations/supabase/client";
import { listAllProgress, listFavorites, listMyChallenges, deleteProgramProgress, toggleFavorite, leaveChallenge } from "@/lib/engagement";
import { listCustomPrograms, deleteCustomProgram, type CustomProgram } from "@/lib/custom-programs.functions";
import { listMyAiMealPlans, deleteAiMealPlan, type AiMealPlan } from "@/lib/ai-meal-plans.functions";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/i18n/LanguageProvider";
import { Heart, Flame, Trophy, Dumbbell, Users, Ruler, X, Utensils, Bookmark } from "lucide-react";
import { TrainingCalendar } from "@/components/TrainingCalendar";
import { ProfileHero } from "@/components/ProfileHero";
import tileChallengesImg from "@/assets/tile-challenges.png";
import tileSavedImg from "@/assets/tile-saved-workout.png";
import builderHeroImg from "@/assets/builder-hero-real.jpg";

import { getMyMembership } from "@/utils/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CustomProgramTrainingDialog } from "@/components/CustomProgramTrainingDialog";
import { Pencil } from "lucide-react";


export const Route = createFileRoute("/_authenticated/my-library")({
  component: MyLibrary,
  head: () => ({ meta: [{ title: "My Library · Onyx Elevate" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    highlight: typeof s.highlight === "string" ? s.highlight : undefined,
  }),
});

function CardRow({ children, count }: { children: ReactNode; count: number }) {
  const scrollable = count > 3;
  if (!scrollable) {
    return <div className="mt-3 grid gap-3 grid-cols-2 lg:grid-cols-3">{children}</div>;
  }
  return (
    <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 snap-x snap-mandatory [scrollbar-width:thin]">
      {Children.map(children, (c) => (
        <div className="min-w-[200px] max-w-[220px] flex-none snap-start">{c}</div>
      ))}
    </div>
  );
}

function SeeAllDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 px-4 py-3 bg-onyx-50/95 backdrop-blur">
          <h2 className="font-display text-lg font-bold">{title}</h2>
        </div>
        <div className="p-4">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MyLibrary() {

  const t = useT();
  const router = useRouter();
  const { highlight } = Route.useSearch();
  const qc = useQueryClient();
  const [seeAll, setSeeAll] = useState<null | "programs" | "custom" | "challenges">(null);
  const scrollBeforeOpenRef = useRef(0);
  const openSeeAll = (which: "programs" | "custom" | "challenges") => {
    const el = document.getElementById("app-scroll-container");
    scrollBeforeOpenRef.current = el?.scrollTop ?? window.scrollY ?? 0;
    setSeeAll(which);
  };
  const closeSeeAll = () => {
    setSeeAll(null);
    requestAnimationFrame(() => {
      const el = document.getElementById("app-scroll-container");
      if (el) el.scrollTop = scrollBeforeOpenRef.current;
      else window.scrollTo(0, scrollBeforeOpenRef.current);
    });
  };
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => getMyProfile() });
  const { data: purchases = [], isLoading } = useQuery({ queryKey: ["purchases"], queryFn: () => getMyPurchases() });
  const { data: progressRows = [] } = useQuery({ queryKey: ["progress"], queryFn: () => listAllProgress() });
  const { data: favs = [] } = useQuery({ queryKey: ["favorites"], queryFn: () => listFavorites() });
  const { data: myChallenges = [] } = useQuery({ queryKey: ["myChallenges"], queryFn: () => listMyChallenges() });
  const { data: customPrograms = [] } = useQuery({ queryKey: ["custom-programs"], queryFn: () => listCustomPrograms() });
  const { data: aiMealPlans = [] } = useQuery({ queryKey: ["ai-meal-plans"], queryFn: () => listMyAiMealPlans() });
  let stripeEnv: "sandbox" | "live" | null = null;
  try { stripeEnv = getStripeEnvironment(); } catch { stripeEnv = null; }
  const { data: membership } = useQuery({
    queryKey: ["membership", stripeEnv],
    queryFn: () => getMyMembership({ data: { environment: stripeEnv! } }),
    enabled: !!stripeEnv,
  });
  const isOnyxMember = (membership?.tier ?? "none") !== "none";

  const hasBundle = purchases.some((p) => p.product_kind === "bundle");
  const ownedPrograms = hasBundle
    ? PROGRAMS.filter((p) => !p.isFree)
    : PROGRAMS.filter((p) => purchases.some((x) => x.product_kind === "program" && x.product_slug === p.slug));
  const ownedPlans = hasBundle
    ? nutritionPlans
    : nutritionPlans.filter((pl) => purchases.some((x) => x.product_kind === "plan" && (x.product_slug === pl.slug || x.product_slug === `plan:${pl.slug}`)));

  const hiddenProgramSlugs = profile?.hidden_program_slugs ?? [];
  const hiddenPlanSlugs = profile?.hidden_plan_slugs ?? [];
  const visibleOwnedPrograms = ownedPrograms.filter((p) => !hiddenProgramSlugs.includes(p.slug));
  // Include favorited meal plans in the My Meal Plans section, merged and deduped with owned plans.
  const favMealPlanSlugs = favs.filter((f) => f.item_type === "meal-plan").map((f) => f.item_slug);
  const savedMealPlans = favMealPlanSlugs
    .map((s) => findNutritionPlan(s))
    .filter((p): p is NonNullable<ReturnType<typeof findNutritionPlan>> => !!p);
  const combinedPlansMap = new Map<string, any>();
  for (const p of ownedPlans) combinedPlansMap.set(p.slug, p);
  for (const p of savedMealPlans) if (!combinedPlansMap.has(p.slug)) combinedPlansMap.set(p.slug, p);
  const visibleOwnedPlans = Array.from(combinedPlansMap.values()).filter((p) => !hiddenPlanSlugs.includes(p.slug));


  // Active programs = either owned + has progress, OR free programs the user has started
  const activePrograms = progressRows
    .map((pr) => {
      const program = getProgram(pr.program_slug);
      if (!program) return null;
      const totalDays = program.daysPerWeek * (Number(program.duration.match(/(\d+)/)?.[1] ?? 1));
      const pct = totalDays ? Math.round((pr.completed_days.length / totalDays) * 100) : 0;
      return { program, progress: pr, pct, totalDays };
    })
    .filter(Boolean) as { program: any; progress: any; pct: number; totalDays: number }[];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }

  // Apple/Google sometimes give us a private relay email or an opaque ID
  // instead of a real name. Only trust display_name if it looks human.
  function looksLikeRealName(v?: string | null): boolean {
    if (!v) return false;
    const s = v.trim();
    if (s.length < 2 || s.length > 40) return false;
    if (s.includes("@")) return false;                    // email
    if (/^[0-9a-f]{8,}$/i.test(s)) return false;          // hex/uuid-ish
    if (/[0-9]{6,}/.test(s)) return false;                // long digit run
    return /[a-zA-ZÀ-ÿ]/.test(s);
  }
  const name = looksLikeRealName(profile?.display_name) ? profile!.display_name! : "Athlete";
  const totalDaysTrained = progressRows.reduce((a, p) => a + (p.completed_days?.length ?? 0), 0);
  const activeChallenges = myChallenges.filter((c) => !c.completed_at).length;
  const completedChallenges = myChallenges.filter((c) => !!c.completed_at).length;

  const recipesTried = favs.filter((f) => f.item_type === "recipe").length;
  const memberTierLabel =
    membership?.tier === "lifetime" ? t("library.memberLifetime")
    : membership?.tier === "yearly" ? t("library.memberYearly")
    : membership?.tier === "monthly" ? t("library.memberMonthly")
    : undefined;

  return (
    <div className="relative">
    <div className="container-onyx pt-0 pb-8 lg:py-12 relative">
      <ProfileHero
        name={name}
        avatarUrl={profile?.avatar_url ?? null}
        isMember={isOnyxMember}
        memberTierLabel={memberTierLabel}
        workoutsCompleted={totalDaysTrained}
        savedItems={favs.length}
        challengesDone={completedChallenges}
        recipesTried={recipesTried}
        activeProgram={activePrograms[0] ?? null}
        onSignOut={handleSignOut}
      />

      {/* Quick tiles */}
      <div className="mt-6 flex justify-center gap-3 pb-2">
        <QuickTile to="/challenges" icon={Trophy} title={t("library.challengesTitle")} subtitle={t("library.tileChallengesSub")} tone="purple" image={tileChallengesImg} />
        <QuickTile
          icon={Bookmark}
          title={t("library.tileSavedTitle")}
          subtitle={t("library.tileSavedSub")}
          tone="orange"
          image={tileSavedImg}
          onClick={() => {
            const el = document.getElementById("saved-library-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />
      </div>

      {/* Training Calendar */}
      <div className="mt-8">
        <TrainingCalendar />
      </div>


      {/* My Programs (with progress) */}
      <section className="mt-8 border-t border-border/40 pt-5">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{t("library.myPrograms")}</h2>
          {(activePrograms.length + visibleOwnedPrograms.filter((p) => !activePrograms.some((ap) => ap.program.slug === p.slug)).length) > 3 && (
            <button onClick={() => openSeeAll("programs")} className="text-xs text-electric font-semibold hover:underline">{t("library.browseAll")}</button>
          )}
        </div>
        {isLoading ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : activePrograms.length === 0 && visibleOwnedPrograms.length === 0 ? (
          <div className="mt-3 rounded-xl border border-border bg-onyx-100 p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("library.noPrograms")}</p>
            <Link to="/programs" className="mt-4 inline-block rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow">{t("library.browsePrograms")}</Link>
          </div>
        ) : (() => {
          const restPrograms = visibleOwnedPrograms.filter((p) => !activePrograms.some((ap) => ap.program.slug === p.slug));
          const total = activePrograms.length + restPrograms.length;
          return (
            <CardRow count={total}>
              {activePrograms.map(({ program, progress, pct, totalDays }) => (
                <ActiveProgramCard key={program.slug} program={program} progress={progress} pct={pct} totalDays={totalDays} />
              ))}
              {restPrograms.map((p) => (
                <OwnedProgramCard key={p.slug} program={p} hiddenSlugs={hiddenProgramSlugs} />
              ))}
            </CardRow>
          );
        })()}
      </section>

      {/* My Custom Programs (Builder) */}
      <section className="mt-8 border-t border-border/40 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{t("library.myCustomPrograms")}</h2>
          {customPrograms.length > 0 && (
            <button onClick={() => openSeeAll("custom")} className="text-xs text-electric font-semibold hover:underline whitespace-nowrap">{t("library.browseAll")}</button>
          )}
        </div>
        {customPrograms.length === 0 ? (
          <div className="mt-3 rounded-xl border border-border bg-onyx-100 p-6 text-sm text-muted-foreground">
            {t("library.noCustomPrograms")} <Link to="/builder" className="text-electric font-semibold">{t("library.buildYourOwn")}</Link>
          </div>
        ) : (
          <CardRow count={customPrograms.length}>
            {customPrograms.map((cp) => (
              <CustomProgramCard key={cp.id} cp={cp} progressRows={progressRows} highlight={highlight === cp.id} />
            ))}
          </CardRow>
        )}
      </section>


      {/* Active Challenges */}
      <section className="mt-8 border-t border-border/40 pt-5">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{t("library.myChallenges")}</h2>
          {myChallenges.length > 0 ? (
            <button onClick={() => openSeeAll("challenges")} className="text-xs text-electric font-semibold hover:underline">{t("library.browseAll")}</button>
          ) : (
            <Link to="/challenges" className="text-xs text-electric font-semibold hover:underline">{t("library.browseAll")}</Link>
          )}
        </div>
        {myChallenges.length === 0 ? (
          <div className="mt-3 rounded-xl border border-border bg-onyx-100 p-6 text-sm text-muted-foreground">
            {t("library.noChallenges")} <Link to="/challenges" className="text-electric font-semibold">{t("library.pickChallenge")}</Link>
          </div>
        ) : (
          <CardRow count={myChallenges.length}>
            {myChallenges.map((c) => (
              <ChallengeCard key={c.challenge_slug} participant={c} />
            ))}
          </CardRow>
        )}
      </section>

      {/* See all fullscreen dialogs */}
      <SeeAllDialog open={seeAll === "programs"} onOpenChange={(v) => !v && closeSeeAll()} title={t("library.myPrograms")}>
        {activePrograms.map(({ program, progress, pct, totalDays }) => (
          <ActiveProgramCard key={program.slug} program={program} progress={progress} pct={pct} totalDays={totalDays} />
        ))}
        {visibleOwnedPrograms.filter((p) => !activePrograms.some((ap) => ap.program.slug === p.slug)).map((p) => (
          <OwnedProgramCard key={p.slug} program={p} hiddenSlugs={hiddenProgramSlugs} />
        ))}
      </SeeAllDialog>
      <SeeAllDialog open={seeAll === "custom"} onOpenChange={(v) => !v && closeSeeAll()} title={t("library.myCustomPrograms")}>
        {customPrograms.map((cp) => (
          <CustomProgramCard key={cp.id} cp={cp} progressRows={progressRows} />
        ))}
      </SeeAllDialog>
      <SeeAllDialog open={seeAll === "challenges"} onOpenChange={(v) => !v && closeSeeAll()} title={t("library.myChallenges")}>
        {myChallenges.map((c: any) => (
          <ChallengeCard key={c.challenge_slug} participant={c} />
        ))}
      </SeeAllDialog>


      {/* Meal plans (owned + AI-generated) */}
      {(visibleOwnedPlans.length > 0 || aiMealPlans.length > 0) && (
        <section className="mt-8 border-t border-border/40 pt-5">
            <h2 className="font-display text-xl font-bold">{t("library.mealPlans")}</h2>
          <CardRow count={visibleOwnedPlans.length + aiMealPlans.length}>
            {visibleOwnedPlans.map((p) => (
              <MealPlanCard key={p.slug} plan={findNutritionPlan(p.slug)!} hiddenSlugs={hiddenPlanSlugs} />
            ))}
            {aiMealPlans.map((p) => (
              <AiMealPlanCard key={p.id} plan={p} />
            ))}
          </CardRow>
        </section>
      )}

      {/* Favorites — everything the user has saved (foods, recipes, programs, meal-plans, etc.) */}
      {(() => {
        const favItems = favs;
        if (favItems.length === 0) return null;
        return (
          <section id="saved-library-section" className="mt-8 border-t border-border/40 pt-5 scroll-mt-24">
            <h2 className="font-display text-xl font-bold">{t("library.savedItems")}</h2>
            <CardRow count={favItems.length}>
              {favItems.map((f) => (
                <RemovableFavorite
                  key={`${f.item_type}:${f.item_slug}`}
                  type={f.item_type}
                  slug={f.item_slug}
                  progressRows={progressRows}
                />
              ))}
            </CardRow>
          </section>
        );
      })()}

    </div>
    </div>
  );
}

// (Rewards/invite and All-Access billing summary intentionally removed from
// the profile page — they now live under the Settings/subscription route.)

function ActiveProgramCard({
  program,
  progress,
  pct,
  totalDays,
}: {
  program: any;
  progress: any;
  pct: number;
  totalDays: number;
}) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      await deleteProgramProgress(program.slug);
      await qc.invalidateQueries({ queryKey: ["progress"] });
      toast.success(t("library.toastRemoved").replace("{{title}}", program.title));
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("library.toastCouldNotRemoveProgram"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="relative group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all overflow-hidden">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        aria-label={t("library.removeFromLibraryTitle").replace("{{title}}", program.title)}
        title={t("library.removeFromLibrary")}
        className="absolute top-2 right-2 z-10 h-7 w-7 grid place-items-center rounded-full bg-onyx-950/70 backdrop-blur text-white/90 hover:text-red-300 transition-colors"
      >
        <X className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <Link to="/training/$slug" params={{ slug: program.slug }} className="block">
        {program.image ? (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img
              src={typeof program.image === "string" ? program.image : program.image?.url ?? program.image}
              alt={program.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        <div className="p-4">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{program.category} · {t("library.inProgress")}</div>
          <div className="mt-1 font-display font-bold group-hover:text-electric transition-colors pr-8 line-clamp-1">{program.title}</div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("library.daysProgress").replace("{{done}}", String(progress.completed_days.length)).replace("{{total}}", String(totalDays))}</span>
              <span className="text-electric font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1.5" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t("library.lastActive").replace("{{date}}", new Date(progress.last_active_at).toLocaleDateString())}</span>
            <span className="text-electric font-bold">{t("library.openTraining")}</span>
          </div>
        </div>
      </Link>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.removeProgramDescriptionStart")} <strong>{program.title}</strong> {t("library.removeProgramDescriptionEnd").replace("{{done}}", String(progress.completed_days.length)).replace("{{total}}", String(totalDays))}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={removing}
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent?: string }) {
  return (
    <div className="surface-card rounded-xl p-4">
      <Icon className="h-4 w-4 text-electric" />
      <div className="mt-2 font-display text-2xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {accent && <div className="mt-1 text-[11px] text-electric font-semibold">{accent}</div>}
    </div>
  );
}

function FavoriteItem({ type, slug, progressRows }: { type: string; slug: string; progressRows?: any[] }) {
  const t = useT();
  if (type === "program") {
    const p = getProgram(slug);
    if (!p) return null;
    const pr = progressRows?.find((r) => r.program_slug === slug);
    const totalDays = (p as any).workouts?.length ?? 0;
    const done = pr?.completed_days?.length ?? 0;
    const pct = totalDays > 0 ? Math.min(100, Math.round((done / totalDays) * 100)) : 0;
    const img = typeof (p as any).image === "string" ? (p as any).image : (p as any).image?.url ?? null;
    return (
      <Link to="/training/$slug" params={{ slug }} className="group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all block overflow-hidden">
        {img && (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img src={img} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.programLabel")} · {p.category}</div>
          <div className="mt-1 font-display font-bold text-sm group-hover:text-electric line-clamp-1">{p.title}</div>
          {totalDays > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                <span>{done}/{totalDays}</span>
                <span className="text-electric">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5 mt-1" />
            </div>
          )}
        </div>
      </Link>
    );
  }
  if (type === "challenge") {
    const c = getChallenge(slug);
    if (!c) return null;
    const img = typeof (c as any).image === "string" ? (c as any).image : (c as any).image?.url ?? null;
    return (
      <Link to="/challenges/$slug" params={{ slug }} className="group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all block overflow-hidden">
        {img && (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img src={img} alt={c.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.challengeLabel")} · {t("library.daysCount").replace("{{count}}", String(c.durationDays))}</div>
          <div className="mt-1 font-display font-bold text-sm group-hover:text-electric line-clamp-1">{c.title}</div>
        </div>
      </Link>
    );
  }
  if (type === "exercise") {
    const e = findExercise(slug);
    if (!e) return null;
    const img = (e as any).thumbnailUrl ?? null;
    return (
      <Link to="/exercises/$slug" params={{ slug }} className="group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all block overflow-hidden">
        {img && (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img src={img} alt={e.name} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.exerciseLabel")}</div>
          <div className="mt-1 font-display font-bold text-sm group-hover:text-electric line-clamp-1">{e.name}</div>
        </div>
      </Link>
    );
  }
  if (type === "recipe") {
    const r = getRecipeBySlug(slug);
    if (!r) return null;
    const img = typeof (r as any).image === "string" ? (r as any).image : (r as any).image?.url ?? (r as any).heroImage ?? null;
    return (
      <Link to="/recipes/$slug" params={{ slug }} className="group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all block overflow-hidden">
        {img && (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img src={img} alt={r.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.recipeLabel")}</div>
          <div className="mt-1 font-display font-bold text-sm group-hover:text-electric line-clamp-1">{r.title}</div>
        </div>
      </Link>
    );
  }
  if (type === "meal-plan") {
    const pl = findNutritionPlan(slug);
    if (!pl) return null;
    const img = typeof (pl as any).image === "string" ? (pl as any).image : (pl as any).image?.url ?? null;
    return (
      <Link to="/meal-plans/$slug" params={{ slug }} className="group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all block overflow-hidden">
        {img && (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img src={img} alt={pl.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" loading="lazy" decoding="async" />
          </div>
        )}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.mealPlanLabel")}</div>
          <div className="mt-1 font-display font-bold text-sm group-hover:text-electric line-clamp-1">{pl.title}</div>
        </div>
      </Link>
    );
  }
  return null;
}

function RemovableFavorite({ type, slug, progressRows }: { type: string; slug: string; progressRows?: any[] }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  async function handleRemove() {
    if (removing) return;
    setRemoving(true);
    try {
      await toggleFavorite(type as any, slug, true);
      await qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(t("library.removedFromSaved") || "Fjernet");
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Kunne ikke fjerne");
    } finally {
      setRemoving(false);
    }
  }
  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        aria-label={t("library.removeFromLibrary") || "Fjern"}
        title={t("library.removeFromLibrary") || "Fjern"}
        className="absolute top-2 right-2 z-10 h-7 w-7 grid place-items-center rounded-full bg-onyx-950/70 backdrop-blur text-white/90 hover:text-red-300 transition-colors"
      >
        <X className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <FavoriteItem type={type} slug={slug} progressRows={progressRows} />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.removeSimpleDescriptionStart")} {t("library.removeSimpleDescriptionEnd")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


function QuickLink({ to, icon: Icon, title, subtitle }: { to: string; icon: any; title: string; subtitle: string }) {
  return (
    <Link to={to as any} className="group flex items-center gap-3 rounded-xl border border-border bg-onyx-100 p-4 hover:border-electric/60 transition-all">
      <div className="w-10 h-10 rounded-lg bg-electric/15 border border-electric/30 flex items-center justify-center">
        <Icon className="w-5 h-5 text-electric" />
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-sm group-hover:text-electric truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>
    </Link>
  );
}
function QuickTile({
  to,
  onClick,
  icon: Icon,
  title,
  subtitle,
  tone,
  image,
}: {
  to?: string;
  onClick?: () => void;
  icon: any;
  title: string;
  subtitle: string;
  tone: "blue" | "green" | "purple" | "orange";
  image?: string;
}) {
  const tones: Record<string, { bg: string; ring: string; icon: string }> = {
    blue: { bg: "bg-[#1d4ed8]/20", ring: "border-[#3b82f6]/40", icon: "text-[#60a5fa]" },
    green: { bg: "bg-[#15803d]/20", ring: "border-[#22c55e]/40", icon: "text-[#4ade80]" },
    purple: { bg: "bg-[#7e22ce]/30", ring: "border-[#a855f7]/50", icon: "text-[#c084fc]" },
    orange: { bg: "bg-[#c2410c]/30", ring: "border-[#f97316]/50", icon: "text-[#fb923c]" },
  };
  const c = tones[tone];
  const bgGradients: Record<string, string> = {
    purple: "bg-gradient-to-br from-[#581c87]/60 via-[#7e22ce]/20 to-[#a855f7]/10",
    orange: "bg-gradient-to-br from-[#9a3412]/60 via-[#c2410c]/20 to-[#f97316]/10",
    blue: "bg-gradient-to-br from-[#1e3a5f]/60 via-[#1d4ed8]/20 to-[#3b82f6]/10",
    green: "bg-gradient-to-br from-[#14532d]/60 via-[#15803d]/20 to-[#22c55e]/10",
  };
  const [imgError, setImgError] = useState(false);
  const inner = (
    <>
      {/* Gradient background — always visible as reliable fallback */}
      <div className={`absolute inset-0 ${bgGradients[tone] || bgGradients.purple}`} />
      {/* Lovable CDN image — loads on top if available (Lovable cloud) */}
      {image && !imgError && (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          onError={() => setImgError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      <div className="relative h-full p-3 flex flex-col">
        <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.ring} flex items-center justify-center backdrop-blur-sm`}>
          <Icon className={`w-4.5 h-4.5 ${c.icon}`} strokeWidth={2.25} />
        </div>
        <div className="mt-auto font-display font-bold text-[13px] leading-tight text-white group-hover:text-electric">
          {title}
        </div>
        <div className="mt-1 text-[11px] leading-snug text-white/75 line-clamp-2">
          {subtitle}
        </div>
      </div>
    </>
  );
  const cls = "group relative shrink-0 w-[168px] h-[132px] overflow-hidden rounded-2xl border border-border bg-onyx-100 hover:border-electric/60 transition-all text-left";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <Link to={to as any} className={cls}>
      {inner}
    </Link>
  );
}



function CustomProgramCard({ cp, progressRows, highlight }: { cp: CustomProgram; progressRows: any[]; highlight?: boolean }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const totalDays = cp.weeks.reduce((a, w) => a + w.days.length, 0);
  const totalEx = cp.weeks.reduce((a, w) => a + w.days.reduce((b, d) => b + d.exercises.length, 0), 0);
  const pr = progressRows.find((p) => p.program_slug === `custom:${cp.id}`);
  const done = pr?.completed_days?.length ?? 0;
  const pct = totalDays ? Math.round((done / totalDays) * 100) : 0;

  async function handleRemove() {
    setRemoving(true);
    try {
      await deleteCustomProgram({ data: { id: cp.id } });
      await qc.invalidateQueries({ queryKey: ["custom-programs"] });
      toast.success(t("library.toastRemovedShort").replace("{{title}}", cp.name));
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("library.toastCouldNotRemoveProgram"));
    } finally {
      setRemoving(false);
    }
  }

  const [trainOpen, setTrainOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!highlight) return;
    const el = rootRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-electric", "ring-offset-2", "ring-offset-onyx-50");
      setTimeout(() => el.classList.remove("ring-2", "ring-electric", "ring-offset-2", "ring-offset-onyx-50"), 2400);
    }, 200);
    return () => clearTimeout(timer);
  }, [highlight]);

  return (
    <div ref={rootRef} id={`custom-program-${cp.id}`} className="relative group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all">

      <button
        type="button"
        onClick={() => setTrainOpen(true)}
        className="flex flex-1 flex-col text-left w-full"
      >
        {/* Image header */}
        <div className="relative h-28 w-full overflow-hidden">
          <img src={builderHeroImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-100 via-onyx-100/40 to-transparent" />
          <div className="absolute top-2 left-2 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] uppercase tracking-widest text-electric font-bold">
            {t("library.customLabel")}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {t(cp.weeks.length === 1 ? "library.weekCountSingular" : "library.weekCountPlural").replace("{{count}}", String(cp.weeks.length))}
          </div>
          <div className="mt-1 font-display font-bold group-hover:text-electric transition-colors line-clamp-2">{cp.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{t("library.customMeta").replace("{{weeks}}", String(cp.weeks.length)).replace("{{days}}", String(totalDays))}</div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("library.loggedProgress").replace("{{done}}", String(done)).replace("{{total}}", String(totalDays))}</span>
              <span className="text-electric font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1.5" />
          </div>
          <div className="mt-auto pt-4 text-xs font-semibold text-electric">{t("library.openProgram")}</div>
        </div>
      </button>

      {/* Edit (builder) */}
      <Link
        to="/builder/$id"
        params={{ id: cp.id }}
        onClick={(e) => e.stopPropagation()}
        aria-label="Edit program"
        title="Edit program"
        className="absolute top-2 right-11 z-10 h-8 w-8 grid place-items-center rounded-full border border-white/20 bg-black/70 backdrop-blur-sm text-white hover:text-electric hover:border-electric/60 transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
      </Link>

      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        aria-label={t("library.removeTitle").replace("{{title}}", cp.name)}
        title={t("library.removeProgram")}
        className="absolute top-2 right-2 z-10 h-8 w-8 grid place-items-center rounded-full border border-white/20 bg-black/70 backdrop-blur-sm text-white hover:text-red-400 hover:border-red-400/60 transition-colors"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>

      <CustomProgramTrainingDialog cp={cp} open={trainOpen} onOpenChange={setTrainOpen} />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.deleteCustomDescriptionStart")} <strong>{cp.name}</strong> {t("library.deleteCustomDescriptionEnd")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


function OwnedProgramCard({ program, hiddenSlugs }: { program: any; hiddenSlugs: string[] }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      const next = [...hiddenSlugs, program.slug];
      await updateMyProfile({ data: { hidden_program_slugs: next } });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success(t("library.toastRemoved").replace("{{title}}", program.title));
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("library.toastCouldNotRemoveProgram"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="relative group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all overflow-hidden">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        aria-label={t("library.removeFromLibraryTitle").replace("{{title}}", program.title)}
        title={t("library.removeFromLibrary")}
        className="absolute top-2 right-2 z-10 h-7 w-7 grid place-items-center rounded-full border border-border bg-onyx-100/90 text-muted-foreground hover:text-red-400 hover:border-red-400/60 transition-colors"
      >
        <X className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <Link to="/training/$slug" params={{ slug: program.slug }} className="block">
        {program.image ? (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img
              src={typeof program.image === "string" ? program.image : program.image?.url ?? program.image}
              alt={program.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{program.category} · {t("library.unlocked")}</div>
          <div className="mt-2 font-display font-bold group-hover:text-electric transition-colors pr-8">{program.title}</div>
          <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{program.tagline}</div>
          <div className="mt-2 text-xs font-semibold text-electric">{t("library.startTraining")}</div>
        </div>
      </Link>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.removeSimpleDescriptionStart")} <strong>{program.title}</strong> {t("library.removeSimpleDescriptionEnd")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MealPlanCard({ plan, hiddenSlugs }: { plan: any; hiddenSlugs: string[] }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    try {
      const next = hiddenSlugs.includes(plan.slug) ? hiddenSlugs : [...hiddenSlugs, plan.slug];
      await updateMyProfile({ data: { hidden_plan_slugs: next } });
      // If it was only in the library because it was favorited, also unfavorite it
      // so it doesn't come back after the hide.
      try {
        await toggleFavorite("meal-plan", plan.slug, false);
      } catch {}
      await qc.invalidateQueries({ queryKey: ["profile"] });
      await qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(t("library.toastRemoved").replace("{{title}}", plan.title));
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("library.toastCouldNotRemovePlan"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="relative group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all overflow-hidden">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        aria-label={t("library.removeTitle").replace("{{title}}", plan.title)}
        title={t("library.removeFromLibrary")}
        className="absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-onyx-900/80 text-electric shadow-lg backdrop-blur hover:bg-red-500/90 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" strokeWidth={3} />
      </button>
      <Link
        to="/meal-plans/$slug"
        params={{ slug: plan.slug }}
        hash="weeks"
        className="block"
      >
        {plan.image ? (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img
              src={typeof plan.image === "string" ? plan.image : plan.image?.url ?? plan.image}
              alt={plan.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{plan.goal}</div>
          <div className="mt-2 font-display font-bold group-hover:text-electric transition-colors pr-8">{plan.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{plan.calorieRange}</div>
          <div className="mt-2 text-xs font-semibold text-electric">{t("library.openPlan")}</div>
        </div>
      </Link>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.removeSimpleDescriptionStart")} <strong>{plan.title}</strong> {t("library.removeSimpleDescriptionEnd")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ChallengeCard({ participant }: { participant: any }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const ch = getChallenge(participant.challenge_slug);
  if (!ch) return null;
  const challengeTitle = ch.title;
  const pct = Math.round((participant.progress / ch.durationDays) * 100);

  async function handleRemove() {
    setRemoving(true);
    try {
      await leaveChallenge(participant.challenge_slug);
      await qc.invalidateQueries({ queryKey: ["myChallenges"] });
      toast.success(t("library.toastLeft").replace("{{title}}", challengeTitle));
      setConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("library.toastCouldNotLeaveChallenge"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="relative group rounded-xl border border-border bg-onyx-100 hover:border-electric/60 transition-all overflow-hidden">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        aria-label={t("library.leaveTitle").replace("{{title}}", ch.title)}
        title={t("library.leaveChallenge")}
        className="absolute top-2 right-2 z-10 h-7 w-7 grid place-items-center rounded-full border border-border bg-onyx-100/90 text-muted-foreground hover:text-red-400 hover:border-red-400/60 transition-colors"
      >
        <X className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <Link to="/challenges/$slug" params={{ slug: participant.challenge_slug }} className="block">
        {ch.image ? (
          <div className="h-24 sm:h-28 w-full overflow-hidden bg-onyx-50">
            <img
              src={typeof ch.image === "string" ? ch.image : (ch.image as any)?.url ?? ch.image}
              alt={ch.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        <div className="p-3">
          <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{ch.category} · {participant.completed_at ? t("library.complete") : t("library.activeStatus")}</div>
          <div className="mt-2 font-display font-bold group-hover:text-electric transition-colors pr-8">{ch.title}</div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("library.dayProgress").replace("{{done}}", String(participant.progress)).replace("{{total}}", String(ch.durationDays))}</span>
              <span className="text-electric font-bold">{pct}%</span>
            </div>
            <Progress value={pct} className="mt-1.5" />
          </div>
        </div>
      </Link>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("library.removeSimpleDescriptionStart")} <strong>{ch.title}</strong> {t("library.removeSimpleDescriptionEnd")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("library.keepIt")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


function AiMealPlanCard({ plan }: { plan: AiMealPlan }) {
  const t = useT();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const totalMeals = plan.days.reduce((n, d) => n + d.meals.length, 0);

  async function handleRemove() {
    setRemoving(true);
    try {
      await deleteAiMealPlan({ data: { id: plan.id } });
      qc.invalidateQueries({ queryKey: ["ai-meal-plans"] });
      toast.success(t("library.removed"));
    } catch (e: any) {
      toast.error(e?.message ?? t("library.couldNotRemove"));
    } finally {
      setRemoving(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("library.removeFromLibrary")}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmOpen(true); }}
        className="absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-onyx-900/80 text-electric shadow-lg backdrop-blur hover:bg-red-500/90 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" strokeWidth={3} />
      </button>
      <Link
        to="/ai-meal-plan/$id"
        params={{ id: plan.id }}
        className="block rounded-xl border border-border bg-onyx-100 p-3 hover:border-electric/60 transition-all"
      >
        <div className="text-[10px] uppercase tracking-widest text-electric font-bold">{t("library.mealPlanLabel")}</div>
        <div className="mt-1 font-display text-sm font-bold line-clamp-1">{plan.name}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t("library.aiMealPlanMeta").replace("{{days}}", String(plan.days.length)).replace("{{meals}}", String(totalMeals))}
        </div>
        <div className="mt-2 text-xs text-electric font-semibold">{t("library.openToLogDay")}</div>
      </Link>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("library.removeMealPlanTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("library.removeConfirmTitle")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction disabled={removing} onClick={handleRemove} className="bg-red-500 hover:bg-red-600 text-white">
              {removing ? t("library.removing") : t("library.yesTakeAway")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
