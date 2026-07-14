import { createFileRoute } from "@tanstack/react-router";
import { coaches } from "@/data/coaches";
import { CoachDialog } from "@/components/CoachDialog";

export const Route = createFileRoute("/coaches/")({
  head: () => ({
    meta: [
      { title: "Coaches – Onyx Elevate" },
      { name: "description", content: "Meet the Onyx Elevate coaches and competitors behind every program." },
      { property: "og:title", content: "Coaches – Onyx Elevate" },
      { property: "og:url", content: "https://onyxperformance.app/coaches" },
    ],
    links: [{ rel: "canonical", href: "https://onyxperformance.app/coaches" }],
  }),
  component: CoachesIndex,
});

function CoachesIndex() {
  const sorted = [...coaches].sort((a, b) => Number(b.competes) - Number(a.competes));
  return (
    <section className="container-onyx py-16">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">The team</span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Onyx coaches</h1>
        <p className="mt-3 text-muted-foreground">Competitors, founders, and specialists behind every Onyx program.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((c) => (
          <CoachDialog key={c.slug} coach={c}>
            <button type="button" className="text-left group surface-card rounded-xl overflow-hidden hover:border-electric/40 transition-all">
              <div className="relative aspect-[4/5]">
                <img src={c.img} alt={`Coach ${c.name}, ${c.role}`} loading="lazy" decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {c.competes && (
                  <span className="absolute top-3 left-3 rounded-full border border-electric/40 bg-onyx-50/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-electric font-semibold backdrop-blur">
                    Competitor
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-lg">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.role}</p>
              </div>
            </button>
          </CoachDialog>
        ))}
      </div>
    </section>
  );
}
