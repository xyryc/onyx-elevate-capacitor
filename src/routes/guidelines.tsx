import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/guidelines")({
  head: () => ({
    meta: [
      { title: "Guidelines - Onyx Elevate" },
      { name: "description", content: "Guidelines for using Onyx Elevate. We provide training and nutrition guidance. You are responsible for your own safety." },
    ],
  }),
  component: GuidelinesPage,
});

function GuidelinesPage() {
  const t = useT();
  return (
    <section className="container-onyx py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("guidelines.eyebrow")}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">{t("guidelines.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("guidelines.lastUpdated")}</p>

      <div className="mt-10 space-y-8 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s1.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("guidelines.s1.body") }} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s2.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("guidelines.s2.body1") }} />
          <p className="mt-3">{t("guidelines.s2.body2")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s3.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("guidelines.s3.body1") }} />
          <p className="mt-3">{t("guidelines.s3.body2")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s4.title")}</h2>
          <p>{t("guidelines.s4.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s5.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("guidelines.s5.body") }} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("guidelines.s6.title")}</h2>
          <p>{t("guidelines.s6.body")}</p>
        </div>
      </div>
    </section>
  );
}
