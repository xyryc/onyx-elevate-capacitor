import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { goals, goalsBySlug, type Goal } from "@/data/goals";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { findExerciseSlugByName } from "@/data/exercises";

// Split a lift label like "Incline DB Press 4×8" or "Walking Lunge 3×12/leg"
// into the exercise name and the scheme portion.
function splitLift(raw: string): { name: string; scheme: string } {
  const m = raw.match(/^(.*?)(\s+\d.*)$/);
  if (m) return { name: m[1].trim(), scheme: m[2].trim() };
  return { name: raw, scheme: "" };
}

export const Route = createFileRoute("/train/$slug")({
  loader: ({ params }) => {
    const goal = goalsBySlug[params.slug];
    if (!goal) throw notFound();
    return { goal };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.goal;
    if (!g) return {};
    return {
      meta: [
        { title: `${g.title} - Onyx Elevate` },
        { name: "description", content: g.tagline },
        { property: "og:title", content: `${g.title} - Onyx Elevate` },
        { property: "og:description", content: g.tagline },
      ],
    };
  },
  component: GoalPage,
  notFoundComponent: () => (
    <div className="container-onyx py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Goal not found</h1>
      <Link to="/" className="mt-4 inline-block text-electric hover:text-electric-glow">← Back home</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-onyx py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Something broke loading this page</h1>
      <Link to="/" className="mt-4 inline-block text-electric hover:text-electric-glow">← Back home</Link>
    </div>
  ),
});

function GoalPage() {
  const { goal: g } = Route.useLoaderData() as { goal: Goal };
  const router = useRouter();
  const related = goals.filter((x) => x.slug !== g.slug);

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <img src={g.img} alt="" className="h-full w-full object-cover opacity-40" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-50 via-onyx-50/85 to-onyx-50/40" />
        </div>
        <div className="container-onyx relative py-16 md:py-24">
          <button
            type="button"
            onClick={goBack}
            className="text-xs uppercase tracking-[0.2em] text-electric hover:text-electric-glow font-semibold transition"
          >
            ← Go back
          </button>
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-electric/40 bg-electric/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-electric">{g.tag}</span>
            {g.comingSoon && (
              <span className="rounded-full bg-electric/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-onyx-50">Coming soon</span>
            )}
          </div>
          <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold leading-[1.02] max-w-3xl">{g.title}</h1>
          <p className="mt-4 text-xl text-electric font-semibold">{g.tagline}</p>
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

      <div className="container-onyx py-16 grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="space-y-16 min-w-0">
          {/* OVERVIEW */}
          <section id="overview">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Overview</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">What this is</h2>
            <p className="mt-4 text-foreground/90 leading-relaxed">{g.overview}</p>
            <div className="mt-6 surface-card rounded-xl p-6 border-l-2 border-electric">
              <p className="text-xs uppercase tracking-wider text-electric font-semibold mb-2">Why it works</p>
              <p className="text-foreground/90 leading-relaxed">{g.whyItWorks}</p>
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <section id="highlights">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">What's inside</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">Built into every block</h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {g.highlights.map((h) => (
                <li key={h} className="surface-card rounded-lg p-4 flex gap-3">
                  <svg className="h-5 w-5 mt-0.5 shrink-0 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  <span className="text-sm leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* STRUCTURE */}
          <section id="structure">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Training structure</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">Block-by-block breakdown</h2>
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

          {/* SAMPLE WEEK */}
          <section id="sample-week">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Sample training week</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">A week in the program</h2>
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
                                  className="group inline-flex items-start gap-2 hover:text-electric transition-colors"
                                  title="Watch demo video"
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

          {/* PRINCIPLES */}
          <section id="principles">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Coaching principles</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">Rules of the road</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {g.principles.map((p) => (
                <div key={p.title} className="surface-card rounded-xl p-5">
                  <h3 className="font-display text-lg font-bold text-electric">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NUTRITION + RECOVERY */}
          <section id="support" className="grid md:grid-cols-2 gap-6">
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

          {/* WHO FOR */}
          <section id="who-for" className="grid md:grid-cols-2 gap-6">
            <div className="surface-card rounded-xl p-6 border-l-2 border-electric">
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Who it's for</p>
              <p className="mt-3 text-foreground/90 leading-relaxed">{g.whoFor}</p>
            </div>
            <div className="surface-card rounded-xl p-6 border-l-2 border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Who it's not for</p>
              <p className="mt-3 text-foreground/90 leading-relaxed">{g.notFor}</p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Frequently asked</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">Answers, fast</h2>
            <Accordion type="single" collapsible className="mt-6">
              {g.faqs.map((f, i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-border">
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/85 leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-2xl surface-card">
            <img src={g.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-onyx-50 via-onyx-50/85 to-onyx-50/40" />
            <div className="relative p-8 md:p-12 max-w-xl">
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Ready to start <span className="text-gradient-electric">{g.title.toLowerCase()}</span>?
              </h2>
              <p className="mt-3 text-muted-foreground">
                {g.comingSoon
                  ? "Join the waitlist and we'll match you with a coach the moment a spot opens."
                  : "Open the Onyx app and pick the program tier that fits your level."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={g.ctaTo} className="inline-flex items-center gap-2 rounded-md bg-electric px-5 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric">
                  {g.ctaLabel}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </Link>
                <Link to="/exercises" className="inline-flex items-center rounded-md border border-border bg-onyx-100/60 px-5 py-3 text-sm font-semibold hover:bg-onyx-200">
                  Browse exercise library
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 surface-card rounded-xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">On this page</p>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              {[
                ["overview", "Overview"],
                ["highlights", "What's inside"],
                ["structure", "Training structure"],
                ["sample-week", "Sample week"],
                ["principles", "Principles"],
                ["support", "Nutrition & recovery"],
                ["who-for", "Who it's for"],
                ["faq", "FAQ"],
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="text-muted-foreground hover:text-electric transition-colors">{label}</a>
              ))}
            </nav>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Other goals</p>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to="/train/$slug" params={{ slug: r.slug }} className="text-sm hover:text-electric transition-colors flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-electric" />
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
