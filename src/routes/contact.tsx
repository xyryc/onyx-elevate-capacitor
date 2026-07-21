import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Onyx Elevate - Talk to the Team" },
      {
        name: "description",
        content:
          "Get in touch with the Onyx team for coaching, partnerships, press or app support.",
      },
      { property: "og:title", content: "Contact Onyx Elevate" },
      {
        property: "og:description",
        content: "Talk to our team about coaching, partnerships, press or app support.",
      },
    ],
  }),
  component: ContactPage,
});

const reasons = [
  {
    label: "Coaching enquiry",
    desc: "Apply for 1-on-1 programming with an Onyx coach.",
    icon: "💪",
  },
  { label: "App support", desc: "Bugs, feature requests, billing questions.", icon: "📱" },
  { label: "Partnerships", desc: "Brand collabs, gyms, supplements, athletes.", icon: "🤝" },
  { label: "Press & media", desc: "Interviews, quotes, athlete profiles.", icon: "🎙" },
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="container-onyx py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">Contact</p>
        <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
          Talk to the Onyx team.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Real humans, real coaches. We reply within 48 hours - usually faster.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        {/* INFO */}
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r) => (
              <div key={r.label} className="surface-card rounded-xl p-5">
                <div className="text-2xl">{r.icon}</div>
                <p className="mt-3 font-semibold text-sm">{r.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="surface-card rounded-xl p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
              Direct channels
            </p>
            <a
              href="mailto:OnyxPerformanceTeam@hotmail.com"
              className="flex items-center gap-3 text-sm hover:text-electric"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-electric/10 text-electric">
                @
              </span>
              OnyxPerformanceTeam@hotmail.com
            </a>
            <a
              href="https://instagram.com/onyxperformance"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm hover:text-electric"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-electric/10 text-electric">
                IG
              </span>
              @onyxperformance
            </a>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget as HTMLFormElement;
            const data = new FormData(f);
            const name = String(data.get("name") || "").trim();
            const email = String(data.get("email") || "").trim();
            const topic = String(data.get("topic") || "").trim();
            const message = String(data.get("message") || "").trim();
            const subject = `[${topic}] Onyx contact form, ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;
            window.location.href = `mailto:OnyxPerformanceTeam@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setSent(true);
          }}
          className="surface-card rounded-2xl p-6 md:p-8 space-y-4"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="mx-auto h-14 w-14 rounded-full bg-electric/15 grid place-items-center text-2xl text-electric">
                ✓
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">Message ready to send.</h2>
              <p className="mt-2 text-muted-foreground text-sm">
                Your email app just opened with the message pre-filled. Hit send and it lands
                straight in our inbox at OnyxPerformanceTeam@hotmail.com. We reply within 48 hours.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm font-semibold text-electric"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold">Send us a message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Name
                  </span>
                  <input
                    name="name"
                    required
                    maxLength={100}
                    className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Your email
                  </span>
                  <input
                    name="email"
                    required
                    type="email"
                    maxLength={255}
                    className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Topic
                </span>
                <select
                  name="topic"
                  defaultValue="Coaching enquiry"
                  className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:border-electric focus:outline-none"
                >
                  <option>Coaching enquiry</option>
                  <option>App support</option>
                  <option>Partnership</option>
                  <option>Press</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:border-electric focus:outline-none resize-y"
                />
              </label>
              <button className="w-full rounded-md bg-electric px-4 py-3 text-sm font-semibold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all">
                Send message
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                By sending you agree to our{" "}
                <Link to="/privacy" className="underline">
                  privacy policy
                </Link>
                .
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
