import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { getSupplement, supplements } from "@/data/supplements";

export const Route = createFileRoute("/nutrition/$slug")({
  loader: ({ params }) => {
    const supplement = getSupplement(params.slug);
    if (!supplement) throw notFound();
    return { supplement };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.supplement;
    if (!s) return {};
    return {
      meta: [
        { title: `${s.name} - Onyx Nutrition` },
        { name: "description", content: s.tagline },
        { property: "og:title", content: `${s.name} - Onyx Nutrition` },
        { property: "og:description", content: s.tagline },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-onyx py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Supplement not found</h1>
      <Link to="/" className="mt-6 inline-block text-electric">← Back home</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-onyx py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: SupplementPage,
});

function SupplementPage() {
  const { supplement: s } = Route.useLoaderData() as { supplement: ReturnType<typeof getSupplement> & {} };
  const router = useRouter();
  const related = supplements.filter((x) => x.slug !== s.slug).slice(0, 3);

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/nutrition" });
    }
  };

  return (
    <article className="pb-24">
      {/* HERO */}
      <section className="relative border-b border-border/60">
        <div className="container-onyx grid lg:grid-cols-2 gap-10 py-14 md:py-20 items-center">
          <div className="relative aspect-square rounded-2xl overflow-hidden surface-card order-2 lg:order-1">
            <img src={s.image} alt={s.name} width={1024} height={1024}
              className="h-full w-full object-cover" decoding="async" />
          </div>
          <div className="order-1 lg:order-2">
            <button
              type="button"
              onClick={goBack}
              className="text-xs uppercase tracking-[0.2em] text-electric font-semibold hover:text-electric-glow transition"
            >
              ← Go back
            </button>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              {s.name}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">{s.intro}</p>
          </div>
        </div>
      </section>

      <div className="container-onyx grid lg:grid-cols-[1fr_320px] gap-12 mt-16">
        <div className="space-y-14 max-w-3xl">
          <Section title="What is it?">
            <p className="text-muted-foreground leading-relaxed">{s.whatIsIt}</p>
          </Section>

          <Section title="Benefits">
            <ul className="grid sm:grid-cols-2 gap-3">
              {s.benefits.map((b) => (
                <li key={b} className="flex gap-3 items-start surface-card rounded-lg p-4">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-electric/15 text-electric flex items-center justify-center text-xs">✓</span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="How to use it">
            <ol className="space-y-3">
              {s.howToUse.map((step, i) => (
                <li key={step} className="surface-card rounded-lg p-4 flex gap-4">
                  <span className="font-display text-electric font-bold w-6">{i + 1}.</span>
                  <span className="text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Important information">
            <ul className="space-y-2">
              {s.important.map((i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                  <span className="text-sm text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Frequently asked questions">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden surface-card">
              {s.faqs.map((f) => (
                <details key={f.q} className="group p-5 open:bg-onyx-100/40">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-sm list-none">
                    {f.q}
                    <span className="text-electric transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="surface-card rounded-xl p-6">
            <p className="text-xs uppercase tracking-wider text-electric font-semibold">Onyx App</p>
            <h3 className="mt-2 font-display text-xl font-bold">Train smarter with Onyx.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Programs that work alongside your nutrition stack.
            </p>
            <Link to="/app" className="mt-4 inline-flex w-full justify-center rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow">
              Get the App
            </Link>
          </div>

          <div className="surface-card rounded-xl p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Related</p>
            <ul className="mt-3 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to="/nutrition/$slug" params={{ slug: r.slug }}
                    className="flex gap-3 items-center group">
                    <img src={r.image} alt="" width={56} height={56}
                      className="h-14 w-14 rounded-md object-cover" decoding="async" />
                    <div>
                      <p className="text-sm font-semibold group-hover:text-electric">{r.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{r.tagline}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-5">{title}</h2>
      {children}
    </section>
  );
}
