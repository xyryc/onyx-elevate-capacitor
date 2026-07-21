import { useMemo } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TrainingBody } from "@/routes/_authenticated/training.$slug";
import { findExercise } from "@/data/exercises";
import type { CustomProgram } from "@/lib/custom-programs.functions";
import type { Program, WorkoutDay } from "@/data/programs";

function customToProgram(cp: CustomProgram): Program {
  const workouts: WorkoutDay[] = [];
  cp.weeks.forEach((w, wi) => {
    w.days.forEach((d, di) => {
      workouts.push({
        day: `Week ${wi + 1}`,
        title: d.name || `Day ${di + 1}`,
        focus: undefined,
        exercises: d.exercises.map((ex) => {
          const canonical = ex.exerciseSlug ? findExercise(ex.exerciseSlug) : undefined;
          return {
            name: canonical?.name || ex.exerciseName,
            sets: ex.sets || "-",
            reps: ex.reps || "-",
            rest: ex.rest || "-",
          };
        }),
      });
    });
  });
  return {
    slug: `custom:${cp.id}`,
    title: cp.name,
    tagline: "",
    category: "Strength" as any,
    level: "Intermediate",
    duration: `${cp.weeks.length} weeks`,
    daysPerWeek: cp.weeks[0]?.days.length ?? 3,
    goal: "",
    image: "",
    reads: "",
    comments: 0,
    summary: "",
    whoItsFor: [],
    whatYouGet: [],
    nutrition: "",
    supplementation: "",
    recovery: "",
    trainingOverview: "",
    progression: "",
    weeklySchedule: [],
    workouts,
    faqs: [],
    isFree: true,
  };
}

export function CustomProgramTrainingDialog({
  cp,
  open,
  onOpenChange,
}: {
  cp: CustomProgram | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const program = useMemo(() => (cp ? customToProgram(cp) : null), [cp]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[95dvh] overflow-y-auto overscroll-contain p-0 pt-[env(safe-area-inset-top,0px)] sm:pt-0 bg-background border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute top-[calc(12px+env(safe-area-inset-top,0px))] sm:top-3 right-3 z-40 h-9 w-9 grid place-items-center rounded-full border border-white/20 bg-black/70 backdrop-blur-sm text-white hover:text-electric hover:border-electric/60 transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
        {program && <TrainingBody program={program} variant="dialog" exactDays />}
      </DialogContent>
    </Dialog>
  );
}
