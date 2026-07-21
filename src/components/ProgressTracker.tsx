import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, ChevronDown, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getLoggedTrainingToday,
  getProgress,
  markSingleTrainingDayComplete,
} from "@/lib/engagement";
import { Progress } from "@/components/ui/progress";
import { isProgramUnlocked } from "@/lib/nutritionAccess";
import { toast } from "sonner";

export function ProgressTracker({
  slug,
  dayKeys,
  weekCount = 1,
  freeWeeks = 1,
}: {
  slug: string;
  dayKeys: string[]; // e.g. ["w1-d1","w1-d2",...]
  weekCount?: number;
  /** How many weeks are free to log without a purchase. Default 1. */
  freeWeeks?: number;
}) {
  const { user } = useAuth();
  const [done, setDone] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loggedToday, setLoggedToday] = useState(false);

  useEffect(() => {
    setUnlocked(isProgramUnlocked(slug));
  }, [slug]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let a = true;
    Promise.all([getProgress(slug), getLoggedTrainingToday()])
      .then(([p, todayLog]) => {
        if (!a) return;
        setDone(p?.completed_days ?? []);
        setLoggedToday(Boolean(todayLog));
      })
      .finally(() => {
        if (a) setLoading(false);
      });
    return () => {
      a = false;
    };
  }, [user, slug]);

  const set = useMemo(() => new Set(done), [done]);
  const pct = dayKeys.length ? Math.round((set.size / dayKeys.length) * 100) : 0;
  const nextUnlockKey = useMemo(() => dayKeys.find((k) => !set.has(k)) ?? null, [dayKeys, set]);

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-onyx-100/50 p-4 text-sm text-muted-foreground">
        <Link to="/auth" className="text-electric font-semibold hover:underline">
          Sign in
        </Link>{" "}
        to track your progress through this program.
      </div>
    );
  }

  const weekOf = (k: string) => {
    const m = k.match(/^w(\d+)/i);
    return m ? Number(m[1]) : 1;
  };

  return (
    <div className="rounded-xl border border-electric/30 bg-electric/[0.04] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left p-5 flex items-center justify-between gap-3 hover:bg-electric/[0.06] transition-colors"
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">
            Log your progress
          </p>
          <p className="mt-1 font-display text-xl font-bold truncate">
            {set.size} / {dayKeys.length} days · {pct}%
          </p>
          <div className="mt-2 max-w-[220px]">
            <Progress value={pct} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {weekCount} week{weekCount > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-electric/40 bg-electric/10 px-2.5 py-1.5 text-xs font-semibold text-electric">
            {open ? "Hide" : "Log"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-electric/15">
          {loading ? (
            <p className="mt-4 text-xs text-muted-foreground">Loading your progress…</p>
          ) : (
            <>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {dayKeys.map((k) => {
                  const isDone = set.has(k);
                  const week = weekOf(k);
                  const accessLocked = !unlocked && week > freeWeeks;
                  const sequenceLocked = !isDone && k !== nextUnlockKey;
                  const locked = accessLocked || sequenceLocked;
                  return (
                    <button
                      key={k}
                      onClick={async () => {
                        if (accessLocked) {
                          toast.error(
                            "Free preview ends after week " +
                              freeWeeks +
                              ". Unlock the full program to keep logging.",
                          );
                          return;
                        }
                        if (sequenceLocked) {
                          toast.info("Fullfør forrige dag først.");
                          return;
                        }
                        if (loggedToday && !isDone) {
                          toast.info("Come back tomorrow to log another day.");
                          return;
                        }
                        const result = await markSingleTrainingDayComplete(slug, k);
                        if (result.alreadyLoggedToday) {
                          setLoggedToday(true);
                          toast.info("Come back tomorrow to log another day.");
                          return;
                        }
                        const next = result.completedDays;
                        setLoggedToday(true);
                        setDone(next);
                        toast.success("Day logged");
                      }}
                      disabled={locked}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition-all ${
                        locked
                          ? "border-border/60 bg-onyx-100/40 text-muted-foreground/60 cursor-not-allowed"
                          : isDone
                            ? "border-electric bg-electric/20 text-electric"
                            : "border-border bg-onyx-100 text-muted-foreground hover:border-electric/50"
                      }`}
                      title={
                        accessLocked
                          ? "Unlock the full program to log this day"
                          : sequenceLocked
                            ? "Fullfør forrige dag først"
                            : k
                      }
                    >
                      {locked ? (
                        <Lock className="h-3 w-3" />
                      ) : isDone ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                      {k.replace("w", "W").replace("-d", "·D")}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Tap a day to mark it complete. One check-in per day, syncs to your account.
                {!unlocked && (
                  <> Free preview: weeks 1–{freeWeeks}. Later weeks unlock after purchase.</>
                )}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
