import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const faqGroups = [
  {
    title: "Getting started",
    items: [
      { q: "Is the exercise library really free?", a: "Yes - 500+ exercises with full step-by-step instructions, pro tips and common mistakes are free forever. No login, no paywall." },
      { q: "Do I need to download the app?", a: "No. The full library, programs library and articles work in the browser. The Onyx app (coming soon) adds workout tracking, video logging and coach messaging." },
      { q: "What gear do I need to follow Onyx programs?", a: "Most programs are written for a standard commercial gym. We also publish home-gym variants that need only a barbell, plates and a rack - or in some cases just dumbbells and bands." },
    ],
  },
  {
    title: "Programs & pricing",
    items: [
      { q: "How much do premium programs cost?", a: "Every premium program is a one-time R$ 29,99. No subscription, no auto-renew. You own it forever." },
      { q: "What is the free 1-week sampler?", a: "Most premium programs come with a free 1-week sample so you can train through Week 1 before paying. If you like the structure and intensity, the full plan unlocks for R$ 29,99." },
      { q: "Can I switch programs mid-way?", a: "Yes. Finish the week you're on, deload 3–5 days, then start the new plan. We have a one-page 'how to transition' guide inside every program." },
    ],
  },
  {
    title: "Coaching",
    items: [
      { q: "What is 1-on-1 coaching?", a: "Custom programming written for you by an Onyx coach with weekly check-ins, video form review on every main lift and unlimited messaging. Prices range R$ 249–349/month depending on the coach." },
      { q: "How do I apply for coaching?", a: "Pick a coach on the home page, hit 'Apply for coaching' and fill the short intake form. We reply within 48 hours and only take on athletes we can actually help." },
      { q: "What if my coach and I aren't a fit?", a: "We move you to a different Onyx coach at no extra cost in the first 30 days. After that, we'll prorate any unused time." },
    ],
  },
  {
    title: "The Onyx App",
    items: [
      { q: "When does the app launch?", a: "Soft launch is rolling out now in waves. Join the waitlist on the App page to get early access plus the founder pricing locked for life." },
      { q: "What platforms is it on?", a: "iOS and Android at launch. A lightweight web companion is available for desktop logging and program purchases." },
      { q: "Will the free library stay free in the app?", a: "Yes. The full exercise library, all articles and recipes stay free in-app. Premium programs and coaching remain the only paid items." },
    ],
  },
  {
    title: "Billing & refunds",
    items: [
      { q: "What payment methods do you accept?", a: "Credit / debit cards, Pix (Brazil) and Apple/Google Pay through the app. Receipts are emailed automatically." },
      { q: "What's your refund policy?", a: "Programs: 7-day full refund, no questions asked. Coaching: prorated refund of any unused weeks in your first month." },
    ],
  },
];


export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ – Onyx Elevate" },
      { name: "description", content: "Answers to the most common questions about Onyx programs, coaching, the app and pricing." },
      { property: "og:title", content: "Onyx Elevate – FAQ" },
      { property: "og:description", content: "Everything you need to know about training with Onyx." },
      { property: "og:url", content: "https://onyxperformance.app/faq" },
    ],
    links: [{ rel: "canonical", href: "https://onyxperformance.app/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqGroups.flatMap(g => g.items).map(i => ({
          "@type": "Question", name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a }
        }))
      })
    }]
  }),
  component: FAQPage,
});




function FAQPage() {
  return (
    <section className="container-onyx py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">FAQ</p>
        <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05]">Frequently asked questions.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Quick, honest answers. If you can't find what you need, <Link to="/contact" className="text-electric underline">message the team</Link>.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block sticky top-24 h-fit">
          <p className="text-xs uppercase tracking-wider text-electric font-semibold mb-3">Categories</p>
          <ul className="space-y-2 text-sm">
            {faqGroups.map((g) => (
              <li key={g.title}><a href={`#${g.title.toLowerCase().replace(/\s+/g, "-")}`} className="text-muted-foreground hover:text-electric">{g.title}</a></li>
            ))}
          </ul>
        </aside>
        <div className="space-y-12">
          {faqGroups.map((g) => (
            <div key={g.title} id={g.title.toLowerCase().replace(/\s+/g, "-")}>
              <h2 className="font-display text-2xl font-bold mb-4">{g.title}</h2>
              <Accordion type="single" collapsible className="surface-card rounded-xl divide-y divide-border">
                {g.items.map((it, i) => (
                  <AccordionItem key={i} value={`${g.title}-${i}`} className="border-0 px-5">
                    <AccordionTrigger className="text-left hover:no-underline hover:text-electric">{it.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
