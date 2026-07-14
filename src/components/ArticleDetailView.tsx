import { Link } from "@tanstack/react-router";
import { articles, type Article, type Block } from "@/data/articles";

function BlockRenderer({ block }: { block: Block }) {
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
    case "image":
      return (
        <figure className="my-8 -mx-2 md:-mx-4">
          <div className="relative overflow-hidden rounded-xl border border-border/60 aspect-[16/9]">
            <img src={block.src} alt={block.caption ?? ""} loading="lazy" decoding="async"
              className="absolute inset-0 h-full w-full object-cover" />
          </div>
          {block.caption && <figcaption className="mt-2 text-xs text-muted-foreground italic px-1">{block.caption}</figcaption>}
        </figure>
      );
  }
}

export function ArticleDetailView({ article }: { article: Article }) {
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const initials = article.author.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <article>
      <section className="relative border-b border-border/60">
        <div className="relative aspect-[21/10] md:aspect-[21/8] overflow-hidden">
          <img src={article.img} alt={article.title} width={1600} height={800}
            className="absolute inset-0 h-full w-full object-cover" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/70 to-onyx-50/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx-50/70 via-transparent to-transparent" />
        </div>
        <div className="container-onyx -mt-32 md:-mt-44 relative pb-8">
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-electric/15 border border-electric/30 px-3 py-1 text-electric font-bold uppercase tracking-wider">{article.category}</span>
            <span className="text-muted-foreground">{article.publishedOn}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{article.readTime}</span>
          </div>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] max-w-4xl">{article.title}</h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{article.excerpt}</p>

          <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border/60 max-w-md">
            {article.authorImg ? (
              <img src={article.authorImg} alt={article.author} className="flex-none h-12 w-12 rounded-full object-cover border-2 border-electric/40" />
            ) : (
              <div className="flex-none h-12 w-12 rounded-full bg-gradient-to-br from-electric to-electric/40 grid place-items-center font-display font-bold text-onyx-50">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{article.author}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{article.authorRole}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-onyx-100/40">
        <div className="container-onyx py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {article.stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="font-display text-2xl md:text-3xl font-bold text-electric">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-onyx py-12 md:py-16 grid lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="lg:col-span-2 max-w-2xl">
          <p className="font-display text-xl md:text-2xl leading-relaxed text-foreground/95 mb-10 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:text-electric first-letter:mr-2 first-letter:float-left first-letter:leading-[0.9]">
            {article.lead}
          </p>

          {article.sections.map((s, idx) => (
            <section key={s.heading} className="mb-12">
              {s.kicker && <p className="text-[11px] uppercase tracking-[0.25em] text-electric font-bold mb-2">- {s.kicker}</p>}
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">
                <span className="text-muted-foreground/50 mr-3">{String(idx + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              <div className="space-y-5">
                {s.blocks.map((b, i) => <BlockRenderer key={i} block={b} />)}
              </div>
            </section>
          ))}

          <section className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/10 to-transparent p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-electric font-bold">The Cheat Sheet</p>
            <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">Key takeaways</h2>
            <ul className="mt-5 space-y-3">
              {article.takeaways.map((t, i) => (
                <li key={t} className="flex gap-4 text-[15px]">
                  <span className="flex-none h-7 w-7 rounded-full bg-electric text-onyx-50 font-bold text-sm grid place-items-center">{i + 1}</span>
                  <span className="pt-0.5 text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 rounded-xl border border-border/60 bg-onyx-100/40 p-6 flex gap-4 items-center">
            {article.authorImg ? (
              <img src={article.authorImg} alt={article.author} className="flex-none h-16 w-16 rounded-full object-cover border-2 border-electric/40" />
            ) : (
              <div className="flex-none h-16 w-16 rounded-full bg-gradient-to-br from-electric to-electric/40 grid place-items-center font-display font-bold text-xl text-onyx-50">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Written by</p>
              <p className="font-display text-lg font-bold">{article.author}</p>
              <p className="text-sm text-muted-foreground">{article.authorRole} · Onyx Elevate</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="surface-card rounded-xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Apply it</p>
            <h3 className="mt-2 font-display text-lg font-bold">Put it into a program</h3>
            <p className="mt-2 text-sm text-muted-foreground">Stop reading, start training. Pick a program built around this principle.</p>
            <Link to="/programs" className="mt-4 inline-flex w-full justify-center rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow">
              Browse programs
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
