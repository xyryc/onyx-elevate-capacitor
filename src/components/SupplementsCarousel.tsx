import { supplements } from "@/data/supplements";
import { SupplementDialog } from "@/components/SupplementDialog";
import { useT } from "@/i18n/LanguageProvider";

export function SupplementsCarousel() {
  const t = useT();
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...supplements, ...supplements];

  return (
    <section className="border-y border-border/60 bg-onyx-100/30">
      <div className="container-onyx py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
            {t("Nutrition & Supplements")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">
            {t("Fuel the work.")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("Learn about the most effective supplements for performance, recovery, and overall health.")}
          </p>
        </div>
      </div>

      {/* Mobile: native horizontal swipe scroll with the single list */}
      <div className="md:hidden pb-16">
        <ul
          className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 no-scrollbar"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {supplements.map((s) => (
            <SuppCard key={s.slug} s={s} />
          ))}
          <li aria-hidden className="shrink-0 w-2" />
        </ul>
      </div>

      {/* Desktop: continuous marquee, pauses on hover */}
      <div
        className="hidden md:block group relative overflow-hidden pb-20"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <ul
          className="flex gap-6 px-8 animate-supp-scroll group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ width: "max-content" }}
        >
          {loop.map((s, i) => (
            <SuppCard key={`${s.slug}-${i}`} s={s} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function SuppCard({ s }: { s: (typeof supplements)[number] }) {
  const t = useT();
  return (
    <li className="snap-start shrink-0 w-[230px] sm:w-[250px] md:w-[260px]">
      <SupplementDialog supplement={s}>
        <button
          type="button"
          className="group/card block w-full text-left surface-card rounded-xl overflow-hidden hover:border-electric/50 hover:-translate-y-1 hover:shadow-electric transition-all duration-300"
        >
          <div className="relative aspect-square overflow-hidden bg-onyx-200">
            <img
              src={s.image}
              alt={s.name}
              width={520}
              height={520}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/90 via-onyx-50/10 to-transparent" />
          </div>
          <div className="p-4">
            <h3 className="font-display text-base font-bold leading-tight">{s.name}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{s.tagline}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-electric">
              {t("Learn more")}
              <svg className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </span>
          </div>
        </button>
      </SupplementDialog>
    </li>
  );
}
