import { Link } from "@tanstack/react-router";
import { supplements, type Supplement, type SuppBlock } from "@/data/supplements";

function BlockRenderer({ block }: { block: SuppBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-[1.75] text-foreground/85">{block.text}</p>;
    case "h3":
      return <h3 className="font-display text-xl md:text-2xl font-bold mt-8 text-foreground">{block.text}</h3>;
    case "list":
      return (
        <ul className="space-y-2.5 my-2">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3 text-[16px] leading-relaxed text-foreground/85">
              <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-electric" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <figure className="my-8 relative pl-6 md:pl-8 border-l-2 border-electric">
          <svg className="absolute -left-3 -top-2 h-6 w-6 text-electric/80" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
          <blockquote className="font-display text-xl md:text-2xl font-semibold leading-snug text-foreground italic">
            "{block.text}"
          </blockquote>
          {block.cite && <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-electric font-semibold">- {block.cite}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <aside className="my-6 rounded-xl border border-electric/30 bg-electric/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-bold">{block.title}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{block.text}</p>
        </aside>
      );
  }
}

export function SupplementDetailView({ supplement: s }: { supplement: Supplement }) {
  const related = supplements.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <article className="pb-16">
      {/* HERO */}
      <section className="relative border-b border-border/60">
        <div className="relative aspect-[21/10] md:aspect-[21/8] overflow-hidden">
          <img src={s.image} alt={s.name} width={1600} height={800}
            className="absolute inset-0 h-full w-full object-cover" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/70 to-onyx-50/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-50/70 via-transparent to-transparent" />
        </div>
        <div className="container-onyx -mt-32 md:-mt-44 relative pb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-electric font-bold">Nutrition · Deep dive</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-[1.05] max-w-4xl">{s.name}</h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{s.tagline}</p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-border/60 bg-onyx-100/40">
        <div className="container-onyx py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {s.stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-display text-2xl md:text-3xl font-bold text-electric">{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-onyx py-12 md:py-16 grid lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="lg:col-span-2 max-w-2xl">
          {/* LEAD */}
          <p className="font-display text-xl md:text-2xl leading-relaxed text-foreground/95 mb-10 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:text-electric first-letter:mr-2 first-letter:float-left first-letter:leading-[0.9]">
            {s.lead}
          </p>

          {/* PULL QUOTE */}
          {s.pullQuote && (
            <figure className="my-10 rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/10 to-transparent p-6 md:p-8">
              <svg className="h-8 w-8 text-electric/80 mb-3" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
              <blockquote className="font-display text-2xl md:text-3xl font-semibold leading-[1.2] text-foreground italic">
                "{s.pullQuote.text}"
              </blockquote>
              {s.pullQuote.cite && (
                <figcaption className="mt-4 text-xs uppercase tracking-[0.25em] text-electric font-bold">— {s.pullQuote.cite}</figcaption>
              )}
            </figure>
          )}

          {/* SECTIONS */}
          {s.sections.map((section, idx) => (
            <section key={section.heading} className="mb-12">
              {section.kicker && <p className="text-[11px] uppercase tracking-[0.25em] text-electric font-bold mb-2">— {section.kicker}</p>}
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">
                <span className="text-muted-foreground/50 mr-3">{String(idx + 1).padStart(2, "0")}</span>
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
              </div>
            </section>
          ))}

          {/* HOW TO USE */}
          <section className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-electric font-bold mb-2">— The protocol</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">How to actually use it</h2>
            <ol className="space-y-3">
              {s.howToUse.map((step, i) => (
                <li key={step} className="surface-card rounded-xl p-4 flex gap-4 items-start">
                  <span className="flex-none h-8 w-8 rounded-full bg-electric text-onyx-50 font-bold text-sm grid place-items-center font-display">{i + 1}</span>
                  <span className="pt-1 text-[15px] leading-relaxed text-foreground/90">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* IMPORTANT */}
          <section className="mb-12 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 font-bold">Read before you buy</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">Important information</h2>
            <ul className="mt-5 space-y-3">
              {s.important.map((i) => (
                <li key={i} className="flex gap-3 items-start text-[15px] leading-relaxed text-foreground/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* TAKEAWAYS */}
          <section className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/10 to-transparent p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-electric font-bold">The Cheat Sheet</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">Key takeaways</h2>
            <ul className="mt-5 space-y-3">
              {s.takeaways.map((t, i) => (
                <li key={t} className="flex gap-4 text-[15px]">
                  <span className="flex-none h-7 w-7 rounded-full bg-electric text-onyx-50 font-bold text-sm grid place-items-center">{i + 1}</span>
                  <span className="pt-0.5 text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-electric font-bold mb-2">— Real questions</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">Frequently asked</h2>
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden surface-card">
              {s.faqs.map((f) => (
                <details key={f.q} className="group p-5 open:bg-onyx-100/40">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-[15px] list-none">
                    <span>{f.q}</span>
                    <span className="text-electric text-2xl transition-transform group-open:rotate-45 leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Why it matters</p>
            <h3 className="mt-2 font-display text-lg font-bold">Benefits at a glance</h3>
            <ul className="mt-4 space-y-2.5">
              {s.benefits.map((b) => (
                <li key={b} className="flex gap-2.5 items-start text-sm text-foreground/85">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-electric/15 text-electric flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Apply it</p>
            <h3 className="mt-2 font-display text-lg font-bold">Build the training to match</h3>
            <p className="mt-2 text-sm text-muted-foreground">Supplements support the work — they don't replace it. Pick a program that earns them.</p>
            <Link to="/programs" className="mt-4 inline-flex w-full justify-center rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow">
              Browse programs
            </Link>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold mb-3">More in the stack</p>
            <div className="space-y-3">
              {related.map((r) => (
                <div key={r.slug} className="surface-card rounded-lg overflow-hidden flex gap-3">
                  <img src={r.image} alt="" width={80} height={80}
                    className="h-20 w-20 flex-none object-cover" decoding="async" />
                  <div className="p-3 pr-3">
                    <p className="text-sm font-semibold line-clamp-1">{r.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
