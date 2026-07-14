import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { X, Clock, Dumbbell, Lock, Play, Check, Zap } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { QuickWorkout } from "@/data/quickWorkouts";
import { findExercise } from "@/data/exercises";
import { useAccess } from "@/hooks/useAccess";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n/LanguageProvider";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { GlossaryText } from "@/components/GlossaryText";
import { MembershipModal } from "@/components/MembershipModal";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { LiveWorkoutPlayer } from "@/components/LiveWorkoutPlayer";
import { todayISO } from "@/components/DatePickerRow";
import { getLoggedTrainingToday, markSingleTrainingDayComplete } from "@/lib/engagement";

// Enable live workout player for all quick workouts.

/**
 * Opens a quick workout in a full-screen dialog matching the recipe/program
 * dialog design. Members see the full workout; guests / non-members see a
 * membership gate identical to the standalone route.
 */
export function QuickWorkoutDialog({
  workout,
  children,
}: {
  workout: QuickWorkout;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <QuickWorkoutDialogBody workout={workout} />
      </DialogContent>
    </Dialog>
  );
}

function QuickWorkoutDialogBody({ workout }: { workout: QuickWorkout }) {
  const t = useT();
  const access = useAccess();
  const { user, loading: authLoading } = useAuth();
  const hasMembership = access.hasBundle || access.hasSubscription;
  const stillResolving = access.loading || authLoading;
  const title = t(`programs.quick.item.${workout.slug}.title`) || workout.title;

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-gradient-to-br from-electric/30 via-onyx-100 to-onyx-50 border-b border-border/60">
        {workout.image && (
          <img
            src={workout.image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
        <span className="absolute top-3 left-3 rounded-md bg-onyx-50/90 border border-border/60 text-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
          {t(`programs.quick.tag.${workout.tag}`)}
        </span>
      </div>

      <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
        <DialogHeader className="text-left">
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">
            {t("programs.quick.title")}
          </p>
          <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t(workout.intro)}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-onyx-100 px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-electric" /> {workout.minutes} {t("programs.quick.min")}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-onyx-100 px-2.5 py-1">
            <Dumbbell className="h-3.5 w-3.5 text-electric" /> {workout.equipment}
          </span>
        </div>

        {stillResolving ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">{t("Loading…") || "Loading…"}</p>
        ) : !user || !hasMembership ? (
          <LockedInline slug={workout.slug} signedIn={!!user} />
        ) : (
          <UnlockedBody workout={workout} />
        )}
      </div>
    </>
  );
}

function UnlockedBody({ workout }: { workout: QuickWorkout }) {
  const t = useT();
  const queryClient = useQueryClient();
  const [livePlayerOpen, setLivePlayerOpen] = useState(false);
  const [logging, setLogging] = useState(false);
  const [loggedNow, setLoggedNow] = useState(false);
  const totalExercises = workout.blocks.reduce((n, b) => n + b.exercises.length, 0);
  const favSlug = `qw-${workout.slug}`;
  const title = t(`programs.quick.item.${workout.slug}.title`) || workout.title;
  const liveEnabled = true; // gated at parent: UnlockedBody only renders for members
  const today = todayISO();
  const manualDayKey = `manual-${today}`;
  const progressQuery = useQuery({
    queryKey: ["training-logged-today"],
    queryFn: () => getLoggedTrainingToday(),
  });
  const dailyLocked = Boolean(progressQuery.data);
  const logged = loggedNow || progressQuery.data?.item_slug === favSlug;
  const loggedMessage = `${t("live.dayLoggedPrefix") || "Day logged"}: ${title}`;
  const comeBackMessage = t("live.comeBackTomorrow") || "Come back tomorrow to log another day.";

  async function finishAndLog() {
    if (logging) return;
    if (logged || dailyLocked) {
      toast.info(progressQuery.data?.title ? `${comeBackMessage} ${progressQuery.data.title}` : comeBackMessage);
      return;
    }
    setLogging(true);
    try {
      const result = await markSingleTrainingDayComplete(favSlug, manualDayKey, workout.title);
      if (result.alreadyLoggedToday) {
        queryClient.invalidateQueries({ queryKey: ["training-logged-today"] });
        toast.info(comeBackMessage);
        return;
      }
      setLoggedNow(true);
      queryClient.invalidateQueries({ queryKey: ["training-logged-today"] });
      queryClient.invalidateQueries({ queryKey: ["program-progress"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(loggedMessage);
    } catch (e: any) {
      toast.error(e?.message || "Could not log workout");
    } finally {
      setLogging(false);
    }
  }


  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ShareToChatButton
          variant="outline"
          size="sm"
          target={{
            url: `/quick-workouts/${workout.slug}`,
            title,
            subtitle: `${workout.minutes} min · ${t(`programs.quick.tag.${workout.tag}`)}`,
            kind: "program",
          }}
        />
        <FavoriteButton type="program" slug={favSlug} />
      </div>

      <section className="relative mt-6 rounded-2xl border border-border bg-onyx-100 overflow-hidden">
        <header className="relative flex items-start justify-between gap-4 px-4 py-4 border-b border-border/70 bg-onyx-50">
          {liveEnabled && (
            <button
              type="button"
              onClick={finishAndLog}
              disabled={logging}
              className="absolute top-3 right-3 inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 bg-transparent p-0 transition-colors disabled:opacity-60"
              aria-label={logged ? (t("live.logged") || "Logged") : (t("live.finish") || "Log")}
              title={logged ? comeBackMessage : (t("live.finish") || "Log")}
            >
              <Check
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
                  logged ? "text-emerald-400" : "text-muted-foreground/60 hover:text-electric"
                }`}
                fill="none"
                strokeWidth={logged ? 3 : 2}
              />
            </button>
          )}
          <div className="min-w-0 flex-1 pr-8">
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-electric">
              {t("programs.quick.title")}
            </p>
            <h2 className="font-display text-base sm:text-lg font-bold leading-tight line-clamp-2">{title}</h2>
            <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> {workout.minutes} {t("programs.quick.min")} · {totalExercises} {t("program.table.exercise")}
            </span>
          </div>
          {liveEnabled && (
            <div className="flex flex-col items-stretch gap-2 shrink-0 w-[104px]">
              <button
                type="button"
                onClick={() => setLivePlayerOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-electric px-3 py-1.5 text-[11px] font-bold text-onyx-50 hover:bg-electric-glow shadow-[0_0_16px_rgba(0,180,255,0.35)] whitespace-nowrap"
                aria-label={t("live.start") || "Start live workout"}
              >
                <Zap className="h-3.5 w-3.5" fill="currentColor" /> {t("live.start") || "Live"}
              </button>
            </div>
          )}
        </header>



        <ul className="divide-y divide-border/60">
          {workout.blocks.flatMap((block, bi) => [
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
            ...block.exercises.map((ex, j) => {
              const exObj = ex.slug ? findExercise(ex.slug) : undefined;
              const nameContent = (
                <span className="group inline-flex items-center gap-2 text-foreground hover:text-electric transition-colors min-w-0 cursor-pointer" title={t("program.watchDemo") || "Watch demo video"}>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-electric/15 border border-electric/30 group-hover:bg-electric/30 transition-colors shrink-0">
                    <Play className="h-3 w-3 text-electric translate-x-[1px]" fill="currentColor" />
                  </span>
                  <span className="truncate font-semibold">{t(ex.name)}</span>
                </span>
              );
              const NameEl = exObj ? (
                <ExerciseDialog exercise={exObj}>
                  <button type="button" className="text-left min-w-0">{nameContent}</button>
                </ExerciseDialog>
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
                    <Stat label={t("program.table.sets")} value={String(ex.sets)} />
                    <Stat label={t("program.table.reps")} value={String(ex.reps)} />
                    <Stat label={t("program.table.rest")} value={String(ex.rest)} />
                  </div>
                </li>
              );
            }),
          ])}
        </ul>
      </section>

      {liveEnabled && (
        <LiveWorkoutPlayer workout={workout} open={livePlayerOpen} onOpenChange={setLivePlayerOpen} />
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-onyx-50/60 border border-border/60 px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-foreground font-semibold"><GlossaryText>{value}</GlossaryText></p>
    </div>
  );
}

function LockedInline({ slug, signedIn }: { slug: string; signedIn: boolean }) {
  const t = useT();
  return (
    <div className="mt-6 rounded-xl border border-electric/30 bg-electric/5 p-5 text-center">
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-onyx-100 border border-border">
        <Lock className="h-5 w-5 text-electric" />
      </div>
      <p className="mt-3 text-sm text-foreground/85">
        {t("Quick Workouts are part of your Onyx membership. Unlock any plan, monthly, yearly or lifetime, to open every workout.")}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <MembershipModal
          trigger={
            <button type="button" className="rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-colors">
              {t("See membership →")}
            </button>
          }
        />
        {!signedIn && (
          <Link
            to="/auth"
            search={{ redirect: `/quick-workouts/${slug}` }}
            className="rounded-md border border-electric bg-onyx-100 px-5 py-2.5 text-sm font-bold text-electric"
          >
            {t("Sign in")}
          </Link>
        )}
      </div>
    </div>
  );
}
