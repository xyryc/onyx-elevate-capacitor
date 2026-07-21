import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy - Onyx Elevate" },
      {
        name: "description",
        content: "Our 30-day money-back guarantee for Onyx Elevate purchases.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  const t = useT();
  return (
    <section className="container-onyx py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
        {t("legal.eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">{t("refund.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("legal.lastUpdated")}</p>

      <div className="mt-10 space-y-8 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("refund.s1.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("refund.s1.body") }} />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("refund.s2.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("refund.s2.intro") }} />
          <ul className="list-disc pl-6 space-y-1">
            <li dangerouslySetInnerHTML={{ __html: t("refund.s2.li1") }} />
            <li dangerouslySetInnerHTML={{ __html: t("refund.s2.li2") }} />
          </ul>
          <p>{t("refund.s2.outro")}</p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("refund.s3.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("refund.s3.body") }} />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("refund.s4.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("refund.s4.body") }} />
        </div>
      </div>
    </section>
  );
}
