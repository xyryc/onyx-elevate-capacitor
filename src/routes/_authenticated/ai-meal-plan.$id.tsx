import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2, Trash2, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import {
  getAiMealPlan,
  deleteAiMealPlan,
  logAiMealPlanDay,
} from "@/lib/ai-meal-plans.functions";

export const Route = createFileRoute("/_authenticated/ai-meal-plan/$id")({
  component: AiMealPlanPage,
  head: () => ({
    meta: [
      { title: "AI meal plan, Onyx Elevate" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const SLOT_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

function AiMealPlanPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const getFn = useServerFn(getAiMealPlan);
  const deleteFn = useServerFn(deleteAiMealPlan);
  const logFn = useServerFn(logAiMealPlanDay);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const { data: plan, isLoading } = useQuery({
    queryKey: ["ai-meal-plan", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const logMut = useMutation({
    mutationFn: (dayIndex: number) => logFn({ data: { id, dayIndex, date } }),
    onSuccess: (r) => {
      toast.success(`Logged ${r.inserted} meals to ${date}`);
      qc.invalidateQueries({ queryKey: ["food-log", date] });
      qc.invalidateQueries({ queryKey: ["food-log"] });
    },
    onError: (e: any) => toast.error(e?.message || "Could not log day"),
  });

  const delMut = useMutation({
    mutationFn: () => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Removed from your library");
      qc.invalidateQueries({ queryKey: ["ai-meal-plans"] });
      router.navigate({ to: "/my-library" });
    },
    onError: (e: any) => toast.error(e?.message || "Could not remove"),
  });

  if (isLoading) {
    return (
      <div className="container-onyx py-16 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-electric" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container-onyx py-16 text-center space-y-3">
        <h1 className="font-display text-2xl font-bold">Meal plan not found</h1>
        <p className="text-sm text-muted-foreground">This plan may have been deleted.</p>
        <Link to="/my-library" className="inline-flex items-center gap-1.5 text-electric underline">Go to My Library</Link>
      </div>
    );
  }

  return (
    <div className="container-onyx py-8 max-w-3xl">
      <button
        onClick={() => router.history.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-electric font-semibold">AI meal plan</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">{plan.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {plan.days.length} day{plan.days.length === 1 ? "" : "s"} ·{" "}
            {plan.days.reduce((n, d) => n + d.meals.length, 0)} meals
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to take it away?")) delMut.mutate();
          }}
          disabled={delMut.isPending}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-destructive/60"
        >
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-border bg-onyx-100 p-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium">Log to date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
        <span className="text-xs text-muted-foreground">
          Pick a date, then tap "Log this day" on any day below to insert its meals into your nutrition log.
        </span>
      </div>

      <div className="space-y-4">
        {plan.days.map((d, di) => {
          const totals = d.meals.reduce(
            (acc, m) => ({
              kcal: acc.kcal + m.kcal,
              protein_g: acc.protein_g + m.protein_g,
              carbs_g: acc.carbs_g + m.carbs_g,
              fat_g: acc.fat_g + m.fat_g,
            }),
            { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
          );
          return (
            <div key={di} className="rounded-xl border border-border bg-onyx-100 p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-display text-lg font-bold">{d.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {totals.kcal} kcal · P {totals.protein_g}g · C {totals.carbs_g}g · F {totals.fat_g}g
                  </div>
                </div>
                <button
                  onClick={() => logMut.mutate(di)}
                  disabled={logMut.isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-electric px-3 py-2 text-sm font-semibold text-onyx-50 hover:bg-electric-glow disabled:opacity-50"
                >
                  {logMut.isPending && logMut.variables === di ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarPlus className="h-4 w-4" />
                  )}
                  Log this day
                </button>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {d.meals.map((m, mi) => (
                  <li key={mi} className="py-2 flex items-start justify-between gap-3 text-sm">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-electric">
                        {SLOT_LABEL[m.slot] ?? m.slot}
                      </div>
                      <div className="font-medium">{m.name}</div>
                      {m.notes && <div className="text-xs text-muted-foreground mt-0.5">{m.notes}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground text-right shrink-0">
                      {m.kcal} kcal
                      <div>P {m.protein_g} · C {m.carbs_g} · F {m.fat_g}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
