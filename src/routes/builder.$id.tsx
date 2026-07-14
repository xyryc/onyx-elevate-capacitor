import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCustomProgram,
  updateCustomProgram,
  type CustomWeek,
  type CustomDay,
  type CustomExercise,
} from "@/lib/custom-programs.functions";
import { exercises, findExercise } from "@/data/exercises";
import { getProgress, markSingleTrainingDayComplete, getLoggedTrainingToday } from "@/lib/engagement";
import { ArrowLeft, Check, CheckCircle2, Loader2, Plus, Save, Trash2, X, Search } from "lucide-react";
import { ShareToChatButton } from "@/components/ShareToChatButton";

import { toast } from "sonner";
import { useT } from "@/i18n/LanguageProvider";


export const Route = createFileRoute("/builder/$id")({
  component: BuilderEditor,
});

function BuilderEditor() {
  const t = useT();

  const { id } = Route.useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const getFn = useServerFn(getCustomProgram);
  const updateFn = useServerFn(updateCustomProgram);

  const { data: program, isLoading } = useQuery({
    queryKey: ["custom-program", id],
    queryFn: () => getFn({ data: { id } }),
  });

  const [name, setName] = useState("");
  const [weeks, setWeeks] = useState<CustomWeek[]>([]);
  const [pickerFor, setPickerFor] = useState<{ w: number; d: number } | null>(null);

  useEffect(() => {
    if (program) {
      setName(program.name);
      setWeeks(program.weeks.length ? program.weeks : [{ name: "Week 1", days: [{ name: "Day 1", exercises: [] }] }]);
    }
  }, [program]);

  const progressSlug = `custom:${id}`;
  const { data: progress } = useQuery({
    queryKey: ["progress", progressSlug],
    queryFn: () => getProgress(progressSlug),
  });
  const { data: loggedToday } = useQuery({
    queryKey: ["training-logged-today"],
    queryFn: () => getLoggedTrainingToday(),
  });
  const completed = new Set(progress?.completed_days ?? []);

  // Sequential unlock: only the next uncompleted day (in order) is markable.
  const nextUnlockKey = useMemo(() => {
    for (let wi = 0; wi < weeks.length; wi++) {
      for (let di = 0; di < weeks[wi].days.length; di++) {
        const k = `w${wi + 1}-d${di + 1}`;
        if (!completed.has(k)) return k;
      }
    }
    return null;
  }, [weeks, progress]);

  const saveMut = useMutation({
    mutationFn: () => updateFn({ data: { id, name, weeks } }),
    onSuccess: () => {
      toast.success(t("builder.programSaved"));
      qc.invalidateQueries({ queryKey: ["custom-programs"] });
      qc.invalidateQueries({ queryKey: ["custom-program", id] });
      router.navigate({ to: "/my-library", hash: "custom-programs", search: { highlight: id } as any });
    },
    onError: (e: any) => toast.error(e?.message || t("builder.saveFailed")),
  });

  const markMut = useMutation({
    mutationFn: ({ dayKey, title }: { dayKey: string; title: string }) =>
      markSingleTrainingDayComplete(progressSlug, dayKey, title),
    onSuccess: (res) => {
      if (res.alreadyLoggedToday) {
        toast.success(t("builder.dayMarkedDone"), { description: "Streaken teller kun én registrering per dag." });
      } else {
        toast.success(t("builder.dayMarkedDone"));
      }
      qc.invalidateQueries({ queryKey: ["progress", progressSlug] });
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["training-logged-today"] });
    },
    onError: (e: any) => toast.error(e?.message || t("builder.couldNotUpdateDay")),
  });

  // Auto-save: silently persist changes to name/weeks so accidentally leaving
  // the builder never loses work. Debounced so we don't spam the server.
  const hydratedRef = useRef(false);
  const latestRef = useRef({ name, weeks });
  latestRef.current = { name, weeks };
  useEffect(() => {
    if (!program) return;
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      return;
    }
    const handle = setTimeout(() => {
      updateFn({ data: { id, name: latestRef.current.name, weeks: latestRef.current.weeks } })
        .then(() => {
          qc.invalidateQueries({ queryKey: ["custom-programs"] });
        })
        .catch(() => { /* silent — user can still hit Save */ });
    }, 800);
    return () => clearTimeout(handle);
  }, [name, weeks, program, id, updateFn, qc]);

  // Flush on unmount so navigating away commits the latest edits.
  useEffect(() => {
    return () => {
      if (!hydratedRef.current) return;
      updateFn({ data: { id, name: latestRef.current.name, weeks: latestRef.current.weeks } })
        .then(() => qc.invalidateQueries({ queryKey: ["custom-programs"] }))
        .catch(() => { /* noop */ });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (isLoading) {
    return <div className="container-onyx py-20 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-electric" /></div>;
  }
  if (!program) {
    return (
      <div className="container-onyx py-16 text-center">
        <p className="text-sm text-muted-foreground">{t("builder.programNotFound")}</p>
        <Link to="/builder" className="mt-4 inline-flex text-sm text-electric">{t("builder.backToBuilder")}</Link>

      </div>
    );
  }

  const addWeek = () =>
    setWeeks((ws) => {
      const dpw = ws[ws.length - 1]?.days.length ?? 4;
      return [...ws, {
        name: `Week ${ws.length + 1}`,
        days: Array.from({ length: dpw }, (_, di) => ({ name: `Day ${di + 1}`, exercises: [] })),
      }];
    });

  const removeWeek = (i: number) => setWeeks((ws) => ws.filter((_, idx) => idx !== i));

  const addDay = (wi: number) =>
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? { ...w, days: [...w.days, { name: `Day ${w.days.length + 1}`, exercises: [] }] } : w));

  const removeDay = (wi: number, di: number) =>
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? { ...w, days: w.days.filter((_, idx) => idx !== di) } : w));

  const updateDayName = (wi: number, di: number, val: string) =>
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? { ...w, days: w.days.map((d, j) => j === di ? { ...d, name: val } : d) } : w));

  const updateWeekName = (wi: number, val: string) =>
    setWeeks((ws) => ws.map((w, i) => i === wi ? { ...w, name: val } : w));

  const addExerciseToDay = (wi: number, di: number, ex: CustomExercise) => {
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? { ...w, days: w.days.map((d, j) => j === di ? { ...d, exercises: [...d.exercises, ex] } : d) } : w));
  };

  const removeExercise = (wi: number, di: number, ei: number) => {
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? { ...w, days: w.days.map((d, j) => j === di ? { ...d, exercises: d.exercises.filter((_, k) => k !== ei) } : d) } : w));
  };

  const updateExercise = (wi: number, di: number, ei: number, patch: Partial<CustomExercise>) => {
    setWeeks((ws) => ws.map((w, i) =>
      i === wi ? {
        ...w, days: w.days.map((d, j) => j === di ? {
          ...d, exercises: d.exercises.map((e, k) => k === ei ? { ...e, ...patch } : e)
        } : d)
      } : w));
  };

  return (
    <div className="pb-28 md:pb-16">
      <div className="sticky top-0 z-30 -mx-4 md:mx-0 border-b border-white/10 bg-onyx-50/85 backdrop-blur-md">
        <div className="container-onyx flex items-center justify-between gap-2 sm:gap-3 px-4 pr-5 sm:pr-4 py-3">
          <button
            onClick={() => router.navigate({ to: "/builder" })}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-white/20"
          >
            <ArrowLeft className="h-4 w-4" /> {t("builder.back")}
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <ShareToChatButton
              variant="outline"
              size="sm"
              target={{
                url: `/shared-program/${id}`,
                title: name || "My program",
                subtitle: `${weeks.length} ${weeks.length === 1 ? t("builder.week") : t("builder.weeks")}`,
                image: null,
                kind: "custom-program",
              }}
            />
            <button
              onClick={() => saveMut.mutate()}
              disabled={saveMut.isPending}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-electric px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 shadow-[0_2px_10px_-2px_rgba(0,153,255,0.5)]"
            >
              {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t("builder.saveProgram")}
            </button>
          </div>
        </div>
      </div>

      <div className="container-onyx pt-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-8 w-full rounded-md border border-border bg-onyx-50 px-4 py-3 font-display text-2xl font-bold outline-none focus:border-electric"
        />


      <div className="space-y-10">
        {weeks.map((w, wi) => (
          <section key={wi}>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <input
                value={w.name}
                onChange={(e) => updateWeekName(wi, e.target.value)}
                className="flex-1 rounded-md border border-transparent bg-transparent px-1 py-1 font-display text-lg font-semibold outline-none hover:border-border focus:border-electric"
              />
              {weeks.length > 1 && (
                <button
                  onClick={() => { if (confirm(t("builder.confirmRemoveWeek"))) removeWeek(wi); }}
                  className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-red-400"
                  aria-label={t("builder.removeWeekAria")}
                ><Trash2 className="h-4 w-4" /></button>
              )}
            </div>

            <div className="space-y-4">
              {w.days.map((d, di) => (
                <div key={di} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <input
                      value={d.name}
                      onChange={(e) => updateDayName(wi, di, e.target.value)}
                      className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-semibold outline-none hover:border-border focus:border-electric"
                    />
                    <div className="flex items-center gap-2">
                      {(() => {
                        const dayKey = `w${wi + 1}-d${di + 1}`;
                        const done = completed.has(dayKey);
                        const blockedToday = !done && !!loggedToday;
                        const disabled = done || markMut.isPending || d.exercises.length === 0 || blockedToday;
                        return (
                          <button
                            onClick={() => markMut.mutate({ dayKey, title: `${w.name} · ${d.name}` })}
                            disabled={disabled}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                              done
                                ? "border border-emerald-500/60 bg-emerald-500/20 text-emerald-300"
                                : "border border-border bg-onyx-100 hover:border-electric/60 disabled:opacity-40"
                            }`}
                            title={
                              d.exercises.length === 0 ? t("builder.addExercisesFirst")
                              : done ? t("builder.completed")
                              : blockedToday ? "Kom tilbake i morgen for å logge neste dag"
                              : t("builder.markDayComplete")
                            }
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {done ? t("builder.completed") : t("builder.markDone")}
                          </button>
                        );
                      })()}
                      {w.days.length > 1 && (
                        <button onClick={() => { if (confirm(t("builder.confirmRemoveDay"))) removeDay(wi, di); }} className="text-xs text-muted-foreground hover:text-red-400">{t("builder.remove")}</button>
                      )}
                    </div>
                  </div>

                  {d.exercises.length === 0 ? (
                    <p className="mb-3 text-xs text-muted-foreground">{t("builder.noExercisesYet")}</p>
                  ) : (
                    <div className="mb-3 space-y-2">
                      {d.exercises.map((ex, ei) => (
                        <div key={ei} className="rounded-lg bg-white/[0.05] p-3">
                          <div className="mb-2 flex items-start gap-2">
                            <Link
                              to="/exercises/$slug"
                              params={{ slug: ex.exerciseSlug }}
                              className="group flex min-w-0 flex-1 items-center gap-2 text-foreground hover:text-electric"
                              title={t("builder.watchDemo")}
                            >
                              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-electric/30 bg-electric/15 group-hover:bg-electric/30">
                                <svg className="h-3 w-3 translate-x-[1px] text-electric" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                              </span>
                              <span className="min-w-0 flex-1 break-words font-semibold text-sm sm:text-base underline-offset-4 group-hover:underline">{ex.exerciseName}</span>
                            </Link>
                            <button
                              onClick={() => { if (confirm(t("builder.confirmRemoveExercise"))) removeExercise(wi, di, ei); }}
                              className="shrink-0 text-muted-foreground hover:text-red-400"
                              aria-label={t("builder.removeExerciseAria")}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                            {(["sets","reps","rpe","rest","tempo","notes"] as const).map((f) => {
                              const isRpe = f === "rpe";
                              return (
                                <label key={f} className="flex flex-col gap-1">
                                  <span className={`text-[10px] uppercase tracking-wider ${isRpe ? "text-electric" : "text-muted-foreground"}`} title={isRpe ? t("builder.rpeTooltip") : undefined}>
                                    {t(`builder.field.${f}`)}
                                    {isRpe && <span className="ml-1 inline-block text-[9px] opacity-70">ⓘ</span>}
                                  </span>
                                  <input
                                    value={ex[f] ?? ""}
                                    onChange={(e) => updateExercise(wi, di, ei, { [f]: e.target.value } as any)}
                                    placeholder={f === "sets" ? "3" : f === "reps" ? "8-12" : f === "rpe" ? "7" : f === "rest" ? "90s" : f === "tempo" ? "2-0-1" : "-"}
                                    className={`w-full rounded-md border bg-white/[0.06] px-2 py-1.5 text-sm outline-none focus:border-electric ${isRpe ? "border-electric/50" : "border-white/10"}`}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setPickerFor({ w: wi, d: di })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-foreground hover:border-electric/60"
                  >
                    <Plus className="h-3.5 w-3.5" /> {t("builder.addExercise")}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addDay(wi)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-dashed border-white/20 px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-electric/60 hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> {t("builder.addDay")}
            </button>
          </section>
        ))}

        <button
          onClick={addWeek}
          className="w-full rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-4 text-sm font-semibold text-muted-foreground hover:border-electric/60 hover:text-foreground"
        >
          {t("builder.addWeek")}
        </button>


      </div>

      {pickerFor && (
        <ExercisePicker
          onClose={() => setPickerFor(null)}
          onPickMany={(exs) => {
            exs.forEach((ex) => addExerciseToDay(pickerFor.w, pickerFor.d, ex));
            setPickerFor(null);
          }}
        />
      )}

      {saveMut.isPending && <SavingOverlay />}
      </div>
    </div>

  );
}

function SavingOverlay() {
  const t = useT();
  const steps = [
    t("builder.savingStep1"),
    t("builder.savingStep2"),
    t("builder.savingStep3"),
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI((v) => (v + 1) % steps.length), 900);
    return () => clearInterval(iv);
  }, [steps.length]);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-onyx-50/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-electric" />
        <div className="font-display text-xl font-bold">{steps[i]}</div>
        <p className="max-w-xs text-xs text-muted-foreground">{t("builder.savingSubtitle")}</p>
      </div>
    </div>
  );
}



function ExercisePicker({ onClose, onPickMany }: { onClose: () => void; onPickMany: (exs: CustomExercise[]) => void }) {
  const t = useT();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [selected, setSelected] = useState<Record<string, CustomExercise>>({});

  const cats = useMemo(() => Array.from(new Set(exercises.map((e) => e.category))).sort(), []);
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return exercises
      .filter((e) => (cat ? e.category === cat : true))
      .filter((e) => (query ? e.name.toLowerCase().includes(query) : true))
      .slice(0, 200);
  }, [q, cat]);

  const toggle = (e: (typeof exercises)[number]) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[e.slug]) delete next[e.slug];
      else next[e.slug] = {
        exerciseSlug: e.slug,
        exerciseName: e.name,
        sets: "3",
        reps: "8-12",
        rpe: "7",
        rest: "90s",
      };
      return next;
    });
  };

  const count = Object.keys(selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden rounded-none border border-border bg-onyx-50 p-3 sm:h-auto sm:max-h-[85vh] sm:max-w-4xl sm:rounded-2xl sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">{t("builder.pickExercises")}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md border border-border">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-3 space-y-2">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("builder.searchExercises")}
              className="w-full rounded-md border border-border bg-onyx-100 pl-9 pr-3 py-2 text-base sm:text-sm outline-none focus:border-electric"
            />
          </div>
          <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setCat("")}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                cat === "" ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("builder.allCategories")}
            </button>
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  cat === c ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
          {filtered.map((e) => {
            const isSelected = !!selected[e.slug];
            return (
              <li key={e.slug}>
                <button
                  onClick={() => toggle(e)}
                  className={`group relative flex w-full flex-col overflow-hidden rounded-lg border text-left transition hover:-translate-y-0.5 ${
                    isSelected ? "border-emerald-400 bg-emerald-400/10" : "border-border bg-onyx-100 hover:border-electric/60"
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-onyx-200">
                    {e.thumbnailUrl ? (
                      <img
                        src={e.thumbnailUrl}
                        alt={e.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-wider text-muted-foreground">{t("builder.noPreview")}</div>
                    )}
                    {e.videoUrl && !isSelected && (
                      <div className="pointer-events-none absolute inset-0 grid place-items-center">
                        <div className="grid h-8 w-8 place-items-center rounded-full border border-electric/60 bg-electric/20 backdrop-blur-sm transition group-hover:scale-110">
                          <svg className="h-3 w-3 text-electric" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    )}
                    {isSelected && (
                      <div className="pointer-events-none absolute inset-0 bg-emerald-500/25" />
                    )}
                    <div className={`pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border transition ${
                      isSelected ? "border-emerald-400 bg-emerald-500 text-onyx-50" : "border-white/30 bg-black/40 text-transparent"
                    }`}>
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-2.5">
                    <span className="line-clamp-2 text-xs font-semibold">{e.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{e.category}</span>
                  </div>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="col-span-full py-8 text-center text-sm text-muted-foreground">{t("builder.noExercisesMatch")}</li>
          )}
        </ul>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">{count} {t("builder.selected")}</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >{t("builder.cancel")}</button>
            <button
              disabled={count === 0}
              onClick={() => onPickMany(Object.values(selected))}
              className="inline-flex items-center gap-1.5 rounded-md bg-electric px-4 py-2 text-xs font-semibold text-onyx-50 hover:bg-electric-glow disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" /> {t("builder.addExercise")}{count > 0 ? ` (${count})` : ""}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
