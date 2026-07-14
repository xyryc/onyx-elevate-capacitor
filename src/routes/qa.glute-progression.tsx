import { createFileRoute } from "@tanstack/react-router";
import { runGluteProgressionQA } from "@/qa/gluteProgressionQA";

export const Route = createFileRoute("/qa/glute-progression")({
  component: GluteProgressionQAPage,
  head: () => ({
    meta: [
      { title: "Internal QA · Glute Progression" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Internal QA: verifies every glute program's main-lift reps match the intended RPE wave and deload." },
    ],
  }),
});

function GluteProgressionQAPage() {
  const report = runGluteProgressionQA();
  const ok = report.totalIssues === 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-6 md:py-14">
      <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">
        Internal QA
      </p>
      <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold">
        Glute programs · RPE wave + deload check
      </h1>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
        Compares every main-lift reps string in each glute program against the
        wave declared in <code className="text-electric">GluteProgressionTimeline</code>.
        Flags missing weeks, missing RPE targets, missing DELOAD / 60% call-outs,
        and missing wave-2 load bumps.
      </p>

      <div
        className={`mt-6 rounded-xl border px-5 py-4 ${
          ok
            ? "border-electric/40 bg-electric/10"
            : "border-red-500/50 bg-red-500/10"
        }`}
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className={`text-sm font-bold ${ok ? "text-electric" : "text-red-400"}`}>
            {ok ? "PASS" : "FAIL"}
          </span>
          <span className="text-sm text-foreground">
            {report.totalPrograms} program(s) · {report.totalLifts} main lift(s) ·{" "}
            <strong>{report.totalIssues}</strong> issue(s)
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {report.perLift.map((row) => (
          <div
            key={`${row.program}::${row.lift}`}
            className={`rounded-xl border p-5 ${
              row.issues.length === 0
                ? "border-border bg-onyx-100/30"
                : "border-red-500/40 bg-red-500/5"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {row.program}
                </div>
                <div className="font-display text-lg font-bold" data-no-translate>
                  {row.lift}
                </div>
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  row.issues.length === 0 ? "text-electric" : "text-red-400"
                }`}
              >
                {row.issues.length === 0 ? "ok" : `${row.issues.length} issue(s)`}
              </span>
            </div>
            <div className="mt-3 rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground font-mono break-words">
              {row.reps ?? "(no reps string found)"}
            </div>
            {row.issues.length > 0 && (
              <ul className="mt-3 space-y-2">
                {row.issues.map((iss, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-foreground"
                  >
                    <div className="font-semibold text-red-300">
                      {iss.week > 0 ? `Wk${iss.week} · ` : ""}
                      {iss.reason}
                    </div>
                    <div className="mt-0.5 text-muted-foreground">
                      Expected: <span className="text-foreground">{iss.expected}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
