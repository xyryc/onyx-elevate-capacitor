import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at Onyx Elevate" },
      {
        name: "description",
        content: "Join Onyx Elevate - we hire competing athletes, coaches and engineers who train.",
      },
    ],
  }),
  component: CareersPage,
});

const roles = [
  {
    title: "Coach - Strength & Hypertrophy",
    type: "Contract · Remote",
    desc: "Bring 5+ athletes through a full block. Weekly check-ins, video form reviews, programming via the Onyx app.",
  },
  {
    title: "Coach - Endurance / Hybrid",
    type: "Contract · Remote",
    desc: "Running, hybrid and conditioning programming. HR/pace zone fluency required.",
  },
  {
    title: "Mobile Engineer (iOS / Android)",
    type: "Full-time · Remote",
    desc: "Ship the Onyx app. Native or React Native experience, fitness product background a plus.",
  },
  {
    title: "Content Producer",
    type: "Part-time · Remote",
    desc: "Film, edit and publish exercise demos and short-form athlete content. You train. Hard.",
  },
];

function CareersPage() {
  return (
    <section className="container-onyx py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Careers</p>
        <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
          Train. Build. Ship.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We hire competing athletes, coaches who care, and engineers who actually use the gym.
          Remote-first, async-friendly, results-only.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <div key={r.title} className="surface-card rounded-xl p-6 flex flex-col">
            <span className="text-xs uppercase tracking-wider text-electric font-semibold">
              {r.type}
            </span>
            <h3 className="mt-2 font-display text-xl font-bold">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{r.desc}</p>
            <Link
              to="/contact"
              className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-electric hover:text-electric-glow"
            >
              Apply now →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 surface-card rounded-2xl p-8 max-w-2xl">
        <h3 className="font-display text-xl font-bold">Don't see your role?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          If you're elite at what you do and train hard, we want to hear from you. Tell us what
          you'd build.
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-flex rounded-md bg-electric px-5 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow"
        >
          Pitch yourself
        </Link>
      </div>
    </section>
  );
}
