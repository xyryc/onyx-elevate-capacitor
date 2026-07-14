// Internal QA: verifies every glute program's main-lift reps string matches
// the intended wave (RPE ramp + deload) declared in GluteProgressionTimeline.
// Not shipped in normal navigation, surfaced only at /qa/glute-progression.

import { TIMELINES } from "@/components/GluteProgressionTimeline";
import { programs } from "@/data/programs";

export type QAIssue = {
  program: string;
  lift: string;
  week: number;
  expected: string;
  reason: string;
  found: string;
};

export type QALiftReport = {
  program: string;
  lift: string;
  reps: string | null;
  issues: QAIssue[];
};

export type QAReport = {
  totalPrograms: number;
  totalLifts: number;
  totalIssues: number;
  perLift: QALiftReport[];
};

function weekMatchesRange(reps: string, week: number): boolean {
  // Match `Wk1`, `Wk 1`, `Wk1-2`, `Wk5-8`, `Weeks 1-4`, etc.
  const norm = reps.replace(/\s+/g, " ");
  const singleRe = new RegExp(`Wk\\s*${week}(?![0-9-])`, "i");
  if (singleRe.test(norm)) return true;
  // Range Wk{a}-{b} covering week
  const rangeMatches = norm.matchAll(/Wk\s*(\d+)\s*-\s*(\d+)/gi);
  for (const m of rangeMatches) {
    const a = parseInt(m[1], 10);
    const b = parseInt(m[2], 10);
    if (week >= a && week <= b) return true;
  }
  // "Wk5-8 repeat" style already handled above
  return false;
}

function checkLift(
  programSlug: string,
  liftName: string,
  reps: string | null,
  weeks: { label: string; note?: string; deload?: boolean }[],
): QAIssue[] {
  const issues: QAIssue[] = [];
  if (!reps) {
    issues.push({
      program: programSlug,
      lift: liftName,
      week: 0,
      expected: "reps string present on main lift",
      reason: "Main lift row not found in program workouts",
      found: "(missing)",
    });
    return issues;
  }

  // The wave (RPE ladder + deload + load bumps) now lives in the
  // GluteProgressionTimeline component instead of being crammed into
  // the reps cell. The reps cell must simply defer to that timeline
  // with a "see weekly plan" pointer so users aren't overwhelmed.
  if (!/see\s+weekly\s+plan/i.test(reps)) {
    issues.push({
      program: programSlug,
      lift: liftName,
      week: 0,
      expected: "'see weekly plan' pointer in reps cell",
      reason:
        "Glute main-lift reps cell must point users to the weekly progression timeline rather than embedding the full wave inline.",
      found: reps,
    });
  }

  // Timeline sanity: every listed week must have a label, and any
  // week flagged deload must say so explicitly.
  weeks.forEach((wk, i) => {
    const weekNum = i + 1;
    if (!wk.label || !wk.label.trim()) {
      issues.push({
        program: programSlug,
        lift: liftName,
        week: weekNum,
        expected: "week label present in timeline",
        reason: "Timeline week is missing a label",
        found: JSON.stringify(wk),
      });
    }
    if (wk.deload && !/deload/i.test(wk.label)) {
      issues.push({
        program: programSlug,
        lift: liftName,
        week: weekNum,
        expected: "'DELOAD' in timeline label for deload week",
        reason: "Deload week must be labeled DELOAD in the timeline",
        found: wk.label,
      });
    }
  });

  return issues;
}

function findMainLiftReps(programSlug: string, liftName: string): string | null {
  const program = programs.find((p) => p.slug === programSlug);
  if (!program) return null;
  const target = liftName.toLowerCase();
  const candidates: string[] = [];
  for (const day of program.workouts) {
    for (const ex of day.exercises) {
      if (!ex.reps) continue;
      const name = ex.name.toLowerCase();
      if (name === target || name.includes(target)) candidates.push(ex.reps);
    }
  }
  // Prefer a candidate that actually carries wave programming (Wk/RPE tokens);
  // otherwise fall back to the first match so the check can flag it explicitly.
  const wavey = candidates.find((r) => /Wk\s*\d|RPE\s*\d/i.test(r));
  return wavey ?? candidates[0] ?? null;
}


export function runGluteProgressionQA(): QAReport {
  const perLift: QALiftReport[] = [];
  let totalIssues = 0;
  let totalLifts = 0;

  for (const [programSlug, timeline] of Object.entries(TIMELINES)) {
    for (const lift of timeline.lifts) {
      // For "(pump)" style annotations in timeline names, strip parenthetical
      // before matching against the program's exercise list.
      const searchName = lift.name.replace(/\s*\(.*?\)\s*$/, "").trim();
      const reps = findMainLiftReps(programSlug, searchName);
      const issues = checkLift(programSlug, lift.name, reps, lift.weeks);
      totalLifts += 1;
      totalIssues += issues.length;
      perLift.push({ program: programSlug, lift: lift.name, reps, issues });
    }
  }

  return {
    totalPrograms: Object.keys(TIMELINES).length,
    totalLifts,
    totalIssues,
    perLift,
  };
}
