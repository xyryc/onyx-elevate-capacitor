import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Onyx Elevate – Built by Athletes" },
      { name: "description", content: "The Onyx mission, our coaches and how the platform was built by competing athletes." },
      { property: "og:title", content: "About Onyx Elevate" },
      { property: "og:description", content: "Built by competing athletes to give everyone access to elite-level training." },
      { property: "og:url", content: "https://onyxperformance.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://onyxperformance.app/about" }],
  }),
  component: AboutPage,
});

const values = [
  { title: "Real coaches. Real platforms.", body: "Every Onyx program is written by athletes who actively compete or train alongside competitors - strongman, powerlifting, bodybuilding, boxing, running. No marketers in disguise." },
  { title: "Free where it should be free.", body: "The exercise library, articles and recipes are free forever. We only charge for programming and coaching - the work that genuinely takes our time." },
  { title: "Sustainable over flashy.", body: "We don't sell 6-week shreds or magic supplements. We build the boring, consistent training and nutrition systems that compound for decades." },
  { title: "Train hard. Live well.", body: "Performance is the point - but only because a strong, healthy body lets you show up better everywhere else in your life." },
];

const milestones = [
  { year: "2024", title: "The idea", body: "Simen sketches the first version of Onyx after years of paying for templates that didn't fit his strongman training." },
  { year: "2025", title: "Coaches join", body: "Lars, Thiago, Trym and Michael come on board - every discipline covered from one team." },
  { year: "2026", title: "Public launch", body: "Free exercise library, recipes, articles and the first wave of premium programs go live. App in soft launch." },
  { year: "Next", title: "The Onyx app", body: "Full workout tracking, video logging and coach messaging - coming soon to iOS and Android." },
];

function AboutPage() {
  return (
    <>
      <section className="container-onyx py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">About</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
            Built by athletes. <br /><span className="text-gradient-electric">For everyone who trains.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Onyx Elevate exists because elite-level programming, coaching and education should not be locked behind a $200/month subscription or a private DM to an influencer. We're a team of competing athletes building the platform we wished we'd had when we started.
          </p>
        </div>
      </section>

      <section className="border-y border-border/60 bg-onyx-100/30">
        <div className="container-onyx py-16">
          <h2 className="font-display text-3xl font-bold">What we believe</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="surface-card rounded-xl p-6">
                <h3 className="font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-onyx py-16">
        <h2 className="font-display text-3xl font-bold">The story so far</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {milestones.map((m) => (
            <div key={m.year} className="surface-card rounded-xl p-5">
              <div className="text-electric font-display text-2xl font-bold">{m.year}</div>
              <h3 className="mt-2 font-semibold">{m.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-onyx pb-20">
        <div className="surface-card rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto">
          <h3 className="font-display text-2xl md:text-3xl font-bold">Want to train with us?</h3>
          <p className="mt-3 text-muted-foreground">Browse programs, meet a coach, or just dig into the free library.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/programs" className="rounded-md bg-electric px-5 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow">Browse programs</Link>
            <Link to="/contact" className="rounded-md border border-border bg-onyx-100/60 px-5 py-3 text-sm font-semibold hover:bg-onyx-200">Contact the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
