// Weekly progression timeline for glute programs. Renders a grid where each
// row is a main lift and each column is a training week, showing the target
// RPE (or DELOAD) for that week. Kept in sync with the reps strings on the
// main lifts inside src/data/programs.ts.

import { useState } from "react";
import { WeightSuggestionRow } from "./WeightSuggestion";

type WeekCell = {
  label: string; // "RPE 7", "RPE 8", "RPE 9", "DELOAD"
  note?: string; // "groove", "peak", "60% load"
  deload?: boolean;
  targetRpe?: number; // numeric RPE for the weight calculator
};

type LiftRow = {
  name: string;
  workingReps: string; // "4 × 8", "4 × 8 → 6"
  weeks: WeekCell[];
};

type Timeline = {
  lifts: LiftRow[];
  legend: string;
};

export const TIMELINES: Record<string, Timeline> = {
  "free-glute-1-week": {
    legend:
      "1-week on-ramp. One week at RPE 7 to groove the pattern and squeeze hard at the top. No deload needed on a 1-week block, the full 8-week specialization runs the deload wave.",
    lifts: [
      {
        name: "Barbell Back Squat",
        workingReps: "4 × 8",
        weeks: [{ label: "RPE 7", note: "groove · 3 reps in reserve" }],
      },
      {
        name: "Barbell Glute Hip Thrusts on Bench",
        workingReps: "4 × 8",
        weeks: [{ label: "RPE 7", note: "2-sec squeeze at top" }],
      },
      {
        name: "Barbell Glute Hip Thrusts (pump)",
        workingReps: "4 × 12",
        weeks: [{ label: "RPE 7", note: "3-sec eccentric" }],
      },
    ],
  },
  "glute-specialization-8-week": {
    legend:
      "Two identical 4-week waves. Each wave ramps RPE 7 → 8 → 9, then Week 4 deloads at 60% load to lock in the gains. Wave 2 (Weeks 5-8) repeats the ladder but starts 2.5-5 kg heavier on every main lift.",
    lifts: [
      {
        name: "Barbell Hip Thrust",
        workingReps: "4 × 8 (Wk3: 4 × 6)",
        weeks: [
          { label: "RPE 7", note: "groove" },
          { label: "RPE 8", note: "build" },
          { label: "RPE 9", note: "peak · -2 reps" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
          { label: "RPE 7", note: "+2.5-5 kg" },
          { label: "RPE 8", note: "heavier build" },
          { label: "RPE 9", note: "new PR peak" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
        ],
      },
      {
        name: "Smith Machine Squats",
        workingReps: "4 × 8 (Wk3: 4 × 6)",
        weeks: [
          { label: "RPE 7", note: "groove" },
          { label: "RPE 8", note: "build" },
          { label: "RPE 9", note: "peak · -2 reps" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
          { label: "RPE 7", note: "+2.5-5 kg" },
          { label: "RPE 8", note: "heavier build" },
          { label: "RPE 9", note: "new PR peak" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
        ],
      },
      {
        name: "Smith Machine Reverse Lunge",
        workingReps: "4 × 12/leg (Wk3: 4 × 10/leg)",
        weeks: [
          { label: "RPE 7", note: "long stride" },
          { label: "RPE 8", note: "heel drive" },
          { label: "RPE 9", note: "peak · -2 reps/leg" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
          { label: "RPE 7", note: "+2.5-5 kg" },
          { label: "RPE 8", note: "heavier build" },
          { label: "RPE 9", note: "new PR peak" },
          { label: "DELOAD", note: "60% · RPE 5", deload: true },
        ],
      },
    ],
  },
};

export function hasProgressionTimeline(slug: string): boolean {
  return slug in TIMELINES;
}

function parseTargetRpe(label: string): number {
  const m = label.match(/RPE\s*(\d+(?:\.\d+)?)/i);
  return m ? parseFloat(m[1]) : 8;
}

export function GluteProgressionTimeline({ slug }: { slug: string }) {
  const timeline = TIMELINES[slug];
  const weekCount = timeline?.lifts[0]?.weeks.length ?? 0;
  const [activeWeek, setActiveWeek] = useState(1);
  if (!timeline) return null;

  return (
    <div className="mt-6 surface-card rounded-2xl border border-electric/20 overflow-hidden">
      <div className="px-5 py-4 md:px-6 md:py-5 border-b border-border bg-onyx-100/40">
        <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">
          Weekly progression timeline
        </p>
        <h3 className="mt-1 font-display text-lg md:text-xl font-bold">
          RPE + deload ladder for every main lift
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{timeline.legend}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-onyx-100 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-semibold min-w-[220px] sticky left-0 bg-onyx-100 z-10">
                Main lift
              </th>
              {Array.from({ length: weekCount }).map((_, i) => (
                <th
                  key={i}
                  className={`text-left px-3 py-3 font-semibold min-w-[112px] ${
                    i + 1 === activeWeek ? "text-electric" : ""
                  }`}
                >
                  Week {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {timeline.lifts.map((lift) => (
              <tr key={lift.name} className="align-top">
                <td className="px-4 py-3 sticky left-0 bg-background z-10">
                  <div className="font-semibold text-foreground" data-no-translate>
                    {lift.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{lift.workingReps}</div>
                </td>
                {lift.weeks.map((wk, i) => {
                  const isActive = i + 1 === activeWeek;
                  return (
                    <td key={i} className={`px-3 py-3 ${isActive ? "bg-electric/5" : ""}`}>
                      <div
                        className={`rounded-lg border px-2.5 py-2 ${
                          wk.deload
                            ? "border-amber-500/40 bg-amber-500/10"
                            : isActive
                              ? "border-electric bg-electric/10"
                              : "border-electric/30 bg-electric/5"
                        }`}
                      >
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider ${
                            wk.deload ? "text-amber-400" : "text-electric"
                          }`}
                        >
                          {wk.label}
                        </div>
                        {wk.note && (
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                            {wk.note}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border px-5 py-5 md:px-6 md:py-6 bg-onyx-100/20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">
              Weight suggestion helper
            </p>
            <h4 className="mt-1 font-display text-base md:text-lg font-bold">
              Log last week's weight + RPE → next-week load
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Uses ~3% load change per RPE point, rounds to the nearest 2.5 kg / 5 lb plate. Saved
              on this device.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              I'm on
            </span>
            <select
              value={activeWeek}
              onChange={(e) => setActiveWeek(parseInt(e.target.value, 10))}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-semibold focus:border-electric focus:outline-none"
            >
              {Array.from({ length: weekCount }).map((_, i) => (
                <option key={i} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {timeline.lifts.map((lift) => {
            const wk = lift.weeks[activeWeek - 1];
            return (
              <WeightSuggestionRow
                key={lift.name}
                programSlug={slug}
                lift={lift.name}
                suggestedTargetRpe={parseTargetRpe(wk?.label ?? "RPE 8")}
                isDeloadWeek={!!wk?.deload}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
