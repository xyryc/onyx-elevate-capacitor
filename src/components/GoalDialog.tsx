import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { findExerciseSlugByName } from "@/data/exercises";
import type { Goal } from "@/data/goals";

const RETURN_KEY = "onyx.goalDialogReturn";

function splitLift(raw: string): { name: string; scheme: string } {
  const m = raw.match(/^(.*?)(\s+\d.*)$/);
  if (m) return { name: m[1].trim(), scheme: m[2].trim() };
  return { name: raw, scheme: "" };
}

function GoalDetailView({ g, onClose, goalKey }: { g: Goal; onClose: () => void; goalKey: string }) {
  const saveReturn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const scroller = (e.currentTarget.closest('[data-goal-scroller]') as HTMLElement | null);
    const scrollTop = scroller?.scrollTop ?? 0;
    try {
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({ goalKey, scrollTop }));
    } catch {}
    onClose();
  };
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <img src={g.img} alt="" className="h-full w-full object-cover" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-50/85 via-onyx-50/55 to-onyx-50/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-transparent" />
        </div>
        <div className="container-onyx relative py-16 md:py-24">
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-electric/40 bg-electric/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-electric">{g.tag}</span>
            {g.comingSoon && (
              <span className="rounded-full bg-electric/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">Coming soon</span>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-[1.02] max-w-3xl">{g.title}</h1>
          <p className="mt-4 text-lg md:text-xl text-electric font-semibold">{g.tagline}</p>
          <p className="mt-3 text-muted-foreground max-w-2xl">{g.desc}</p>
          <dl className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {g.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl md:text-3xl font-bold text-electric">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-onyx py-12 md:py-16 space-y-14 min-w-0">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Overview</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">What this is</h2>
          <p className="mt-4 text-foreground/90 leading-relaxed">{g.overview}</p>
          <div className="mt-6 surface-card rounded-xl p-6 border-l-2 border-electric">
            <p className="text-xs uppercase tracking-wider text-electric font-semibold mb-2">Why it works</p>
            <p className="text-foreground/90 leading-relaxed">{g.whyItWorks}</p>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">What's inside</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">Built into every block</h2>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {g.highlights.map((h) => (
              <li key={h} className="surface-card rounded-lg p-4 flex gap-3">
                <svg className="h-5 w-5 mt-0.5 shrink-0 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-sm leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Training structure</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">Block-by-block breakdown</h2>
          <div className="mt-6 space-y-4">
            {g.structure.map((p, i) => (
              <div key={p.name} className="surface-card rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="md:w-48 shrink-0">
                  <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Phase {i + 1}</div>
                  <div className="font-display text-xl font-bold mt-1">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.weeks}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-electric">{p.focus}</div>
                  <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{p.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Sample training week</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">A week in the program</h2>
          <div className="mt-6 surface-card rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {g.sampleWeek.map((s) => (
                <div key={s.day} className="p-5 md:p-6 grid md:grid-cols-[100px_1fr] gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Day</div>
                    <div className="font-display text-xl font-bold text-electric mt-1">{s.day}</div>
                  </div>
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {s.lifts.map((l) => {
                        const { name, scheme } = splitLift(l);
                        const slug = findExerciseSlugByName(name);
                        return (
                          <li key={l} className="text-sm text-foreground/85">
                            {slug ? (
                              <Link
                                to="/exercises/$slug"
                                params={{ slug }}
                                onClick={saveReturn}
                                className="group inline-flex items-start gap-2 hover:text-electric transition-colors"
                              >
                                <span className="grid h-5 w-5 mt-0.5 place-items-center rounded-full bg-electric/15 border border-electric/30 group-hover:bg-electric/30 transition-colors shrink-0">
                                  <svg className="h-2.5 w-2.5 text-electric translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </span>
                                <span className="underline-offset-4 group-hover:underline">
                                  {name}{scheme && <span className="text-muted-foreground"> {scheme}</span>}
                                </span>
                              </Link>
                            ) : (
                              <span className="flex gap-2"><span className="text-electric/70">-</span><span>{l}</span></span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Coaching principles</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">Rules of the road</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {g.principles.map((p) => (
              <div key={p.title} className="surface-card rounded-xl p-5">
                <h3 className="font-display text-lg font-bold text-electric">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="surface-card rounded-xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Nutrition</p>
            <h3 className="mt-2 font-display text-2xl font-bold">Fuel the work</h3>
            <ul className="mt-4 space-y-2.5">
              {g.nutrition.map((n) => (
                <li key={n} className="flex gap-2.5 text-sm">
                  <svg className="h-4 w-4 mt-0.5 shrink-0 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Recovery</p>
            <h3 className="mt-2 font-display text-2xl font-bold">Recover to repeat</h3>
            <ul className="mt-4 space-y-2.5">
              {g.recovery.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm">
                  <svg className="h-4 w-4 mt-0.5 shrink-0 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="surface-card rounded-xl p-6 border-l-2 border-electric">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Who it's for</p>
            <p className="mt-3 text-foreground/90 leading-relaxed">{g.whoFor}</p>
          </div>
          <div className="surface-card rounded-xl p-6 border-l-2 border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Who it's not for</p>
            <p className="mt-3 text-foreground/90 leading-relaxed">{g.notFor}</p>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Frequently asked</p>
          <h2 className="mt-2 font-display text-2xl md:text-4xl font-bold">Answers, fast</h2>
          <Accordion type="single" collapsible className="mt-6">
            {g.faqs.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-border">
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/85 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="relative overflow-hidden rounded-2xl surface-card">
          <img src={g.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-50 via-onyx-50/85 to-onyx-50/40" />
          <div className="relative p-8 md:p-12 max-w-xl">
            <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight">
              Ready to start <span className="text-gradient-electric">{g.title.toLowerCase()}</span>?
            </h2>
            <p className="mt-3 text-muted-foreground">
              {g.comingSoon
                ? "Join the waitlist and we'll match you with a coach the moment a spot opens."
                : "Open the Onyx app and pick the program tier that fits your level."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={g.ctaTo} onClick={onClose} className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric">
                {g.ctaLabel}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/exercises" onClick={onClose} className="inline-flex items-center rounded-md border border-border bg-onyx-100/60 px-5 py-3 text-sm font-semibold hover:bg-onyx-200">
                Browse exercise library
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export function GoalDialog({ goal, children }: { goal: Goal; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollRef = useRef<number | null>(null);
  const goalKey = goal.title;

  // Re-open the dialog on return-navigation if we saved a marker for this goal.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RETURN_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { goalKey: string; scrollTop: number };
      if (data.goalKey !== goalKey) return;
      sessionStorage.removeItem(RETURN_KEY);
      pendingScrollRef.current = data.scrollTop;
      setOpen(true);
    } catch {}
  }, [goalKey]);

  // Restore scroll once content is mounted.
  useLayoutEffect(() => {
    if (!open) return;
    const target = pendingScrollRef.current;
    if (target == null) return;
    const el = contentRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = target;
      pendingScrollRef.current = null;
    });
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent ref={contentRef} data-goal-scroller className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-5xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <VisuallyHidden>
          <DialogTitle>{goal.title}</DialogTitle>
          <DialogDescription>{goal.tagline}</DialogDescription>
        </VisuallyHidden>
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <GoalDetailView g={goal} onClose={() => setOpen(false)} goalKey={goalKey} />
      </DialogContent>
    </Dialog>
  );
}
