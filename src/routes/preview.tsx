import { createFileRoute } from "@tanstack/react-router";
import { programs } from "@/data/programs";

export const Route = createFileRoute("/preview")({
  component: PreviewPage,
});

function PreviewPage() {
  return (
    <div className="min-h-screen bg-onyx-50">
      {/* Header */}
      <div className="border-b border-border bg-onyx-50/80 backdrop-blur sticky top-0 z-50">
        <div className="container-onyx py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold">Program Preview</h1>
            <p className="text-xs text-muted-foreground">
              {programs.length} programs · Card + Hero image QA
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-electric text-onyx-50 font-bold">
            QA Mode
          </span>
        </div>
      </div>

      <div className="container-onyx py-8 space-y-16">
        {/* Section 1: Program Cards */}
        <section>
          <h2 className="font-display text-lg font-bold mb-1">Program Cards</h2>
          <p className="text-sm text-muted-foreground mb-6">Compact cards as shown on /programs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {programs.map((p) => (
              <div
                key={p.slug}
                className="surface-card rounded-xl overflow-hidden border border-border"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-onyx-200">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/60 via-transparent to-transparent" />
                  {p.isFree ? (
                    <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/90 text-onyx-50 font-bold">
                      Grátis
                    </span>
                  ) : (
                    <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-electric text-onyx-50 font-bold">
                      R$ 29,99
                    </span>
                  )}
                  <span className="absolute top-1.5 right-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-onyx-50/80 backdrop-blur border border-border">
                    {p.level}
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">
                      {p.duration}
                    </span>
                    <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">
                      {p.daysPerWeek}d/wk
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground truncate">{p.slug}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Hero Images */}
        <section>
          <h2 className="font-display text-lg font-bold mb-1">Hero Images</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Full-width hero banners as shown on detail pages
          </p>
          <div className="space-y-8">
            {programs.map((p) => (
              <div
                key={`hero-${p.slug}`}
                className="surface-card rounded-2xl overflow-hidden border border-border"
              >
                <div className="relative aspect-[21/8]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-onyx-50/10" />
                  <div className="absolute inset-0 flex items-end p-4 md:p-8">
                    <div>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
                        <span className="px-2 py-1 rounded-md bg-electric text-onyx-50 font-bold">
                          {p.category}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">
                          {p.duration}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">
                          {p.daysPerWeek} days/wk
                        </span>
                        <span className="px-2 py-1 rounded-md bg-onyx-50/70 backdrop-blur border border-border">
                          {p.level}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-xl md:text-3xl font-bold">{p.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border">
                  {p.slug}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
