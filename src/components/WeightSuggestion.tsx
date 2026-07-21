// Client-side weight suggestion helper. Given the last logged working-set
// weight + RPE for a main lift, it suggests the next week's load based on
// the target RPE from the program's progression ladder. Values persist in
// localStorage per (program slug, lift name) so users can come back next
// session and see what to load without re-typing.

import { useEffect, useMemo, useState } from "react";

type Unit = "kg" | "lb";

const RPE_OPTIONS = [7, 7.5, 8, 8.5, 9, 9.5, 10] as const;

type Stored = {
  unit: Unit;
  lastWeight: string;
  lastRpe: number;
  targetRpe: number;
};

const DEFAULT: Stored = {
  unit: "kg",
  lastWeight: "",
  lastRpe: 7,
  targetRpe: 8,
};

// Round to the nearest usable plate increment (2.5 kg or 5 lb).
function roundToPlate(value: number, unit: Unit): number {
  const step = unit === "kg" ? 2.5 : 5;
  return Math.max(0, Math.round(value / step) * step);
}

// Approx 3% load change per full RPE point (a well-established RPE→%1RM rule
// of thumb for 3-8 rep sets). Positive delta = harder target, add weight.
function suggestNextWeight(
  lastWeight: number,
  lastRpe: number,
  targetRpe: number,
  unit: Unit,
): number {
  if (!Number.isFinite(lastWeight) || lastWeight <= 0) return 0;
  const delta = targetRpe - lastRpe;
  const raw = lastWeight * (1 + delta * 0.03);
  return roundToPlate(raw, unit);
}

function storageKey(programSlug: string, lift: string) {
  return `wsug:${programSlug}:${lift}`;
}

function loadStored(programSlug: string, lift: string): Stored {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(storageKey(programSlug, lift));
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function saveStored(programSlug: string, lift: string, state: Stored) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(programSlug, lift), JSON.stringify(state));
  } catch {
    // storage full or blocked, ignore
  }
}

export function WeightSuggestionRow({
  programSlug,
  lift,
  suggestedTargetRpe,
  isDeloadWeek,
}: {
  programSlug: string;
  lift: string;
  suggestedTargetRpe: number;
  isDeloadWeek?: boolean;
}) {
  const [state, setState] = useState<Stored>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadStored(programSlug, lift));
    setHydrated(true);
  }, [programSlug, lift]);

  // Seed the target RPE from the program's ladder when it changes and the
  // user hasn't manually overridden it this session.
  useEffect(() => {
    if (!hydrated) return;
    if (state.targetRpe !== suggestedTargetRpe) {
      setState((s) => ({ ...s, targetRpe: suggestedTargetRpe }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedTargetRpe, hydrated]);

  useEffect(() => {
    if (hydrated) saveStored(programSlug, lift, state);
  }, [state, programSlug, lift, hydrated]);

  const lastWeightNum = parseFloat(state.lastWeight);
  const suggestion = useMemo(() => {
    if (isDeloadWeek) {
      return roundToPlate(lastWeightNum * 0.6, state.unit);
    }
    return suggestNextWeight(lastWeightNum, state.lastRpe, state.targetRpe, state.unit);
  }, [lastWeightNum, state.lastRpe, state.targetRpe, state.unit, isDeloadWeek]);

  const delta =
    Number.isFinite(lastWeightNum) && lastWeightNum > 0 ? suggestion - lastWeightNum : 0;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-onyx-100/40 p-4">
      <div className="flex items-start justify-between gap-3 mb-3 min-h-[3rem]">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-foreground text-sm line-clamp-2" data-no-translate>
            {lift}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {isDeloadWeek
              ? "Deload week · 60% of last working weight"
              : `Target this week: RPE ${state.targetRpe}`}
          </div>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-[11px] font-semibold shrink-0">
          {(["kg", "lb"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setState((s) => ({ ...s, unit: u }))}
              className={`px-2 py-1 uppercase ${
                state.unit === u
                  ? "bg-electric text-onyx-900"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1 whitespace-nowrap truncate">
            Last weight ({state.unit})
          </span>
          <input
            type="number"
            inputMode="decimal"
            step={state.unit === "kg" ? 2.5 : 5}
            min={0}
            value={state.lastWeight}
            onChange={(e) => setState((s) => ({ ...s, lastWeight: e.target.value }))}
            placeholder={state.unit === "kg" ? "e.g. 60" : "e.g. 135"}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Last RPE
          </span>
          <select
            value={state.lastRpe}
            onChange={(e) => setState((s) => ({ ...s, lastRpe: parseFloat(e.target.value) }))}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none"
          >
            {RPE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                RPE {r}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            Target RPE
          </span>
          <select
            value={state.targetRpe}
            onChange={(e) => setState((s) => ({ ...s, targetRpe: parseFloat(e.target.value) }))}
            disabled={isDeloadWeek}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-electric focus:outline-none disabled:opacity-50"
          >
            {RPE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                RPE {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={`mt-auto rounded-lg border px-4 py-3 flex items-center justify-between gap-3 ${
          isDeloadWeek ? "border-amber-500/40 bg-amber-500/10" : "border-electric/30 bg-electric/5"
        }`}
      >
        <div>
          <div
            className={`text-[10px] uppercase tracking-wider font-bold ${
              isDeloadWeek ? "text-amber-400" : "text-electric"
            }`}
          >
            {isDeloadWeek ? "Deload load" : "Suggested next-set weight"}
          </div>
          <div className="mt-0.5 text-2xl font-display font-bold text-foreground">
            {lastWeightNum > 0 ? `${suggestion} ${state.unit}` : "-"}
          </div>
        </div>
        {lastWeightNum > 0 && delta !== 0 && (
          <div
            className={`text-sm font-semibold ${delta > 0 ? "text-electric" : "text-amber-400"}`}
          >
            {delta > 0 ? "+" : ""}
            {delta} {state.unit}
          </div>
        )}
      </div>
    </div>
  );
}
