import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions - Onyx Elevate" },
      { name: "description", content: "The terms that govern your use of Onyx Elevate." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const t = useT();
  return (
    <section className="container-onyx py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("legal.eyebrow")}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">{t("terms.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("legal.lastUpdated")}</p>

      <div className="mt-10 space-y-8 text-foreground/85 leading-relaxed">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n}>
            <h2 className="font-display text-xl font-bold mb-2">{t(`terms.s${n}.title`)}</h2>
            <p dangerouslySetInnerHTML={{ __html: t(`terms.s${n}.body`) }} />
          </div>
        ))}
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("terms.s8.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("terms.s8.body1") }} />
          <p className="mt-3" dangerouslySetInnerHTML={{ __html: t("terms.s8.body2") }} />
        </div>
        {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((n) => (
          <div key={n}>
            <h2 className="font-display text-xl font-bold mb-2">{t(`terms.s${n}.title`)}</h2>
            <p dangerouslySetInnerHTML={{ __html: t(`terms.s${n}.body`) }} />
          </div>
        ))}
      </div>
    </section>
  );
}
