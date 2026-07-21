import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice - Onyx Elevate" },
      {
        name: "description",
        content: "How Onyx Elevate collects, uses and protects your personal data.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const t = useT();
  return (
    <section className="container-onyx py-16 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
        {t("legal.eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">{t("privacy.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("legal.lastUpdated")}</p>

      <div className="mt-10 space-y-8 text-foreground/85 leading-relaxed">
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s1.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("privacy.s1.body") }} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s2.title")}</h2>
          <ul
            className="list-disc pl-6 space-y-1"
            dangerouslySetInnerHTML={{ __html: t("privacy.s2.body") }}
          />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s3.title")}</h2>
          <ul
            className="list-disc pl-6 space-y-1"
            dangerouslySetInnerHTML={{ __html: t("privacy.s3.body") }}
          />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s4.title")}</h2>
          <p>{t("privacy.s4.intro")}</p>
          <ul
            className="list-disc pl-6 space-y-1"
            dangerouslySetInnerHTML={{ __html: t("privacy.s4.body") }}
          />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s5.title")}</h2>
          <p>{t("privacy.s5.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s6.title")}</h2>
          <p>{t("privacy.s6.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s7.title")}</h2>
          <p>{t("privacy.s7.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s8.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("privacy.s8.body") }} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s9.title")}</h2>
          <p>{t("privacy.s9.intro")}</p>
          <ul
            className="list-disc pl-6 space-y-1"
            dangerouslySetInnerHTML={{ __html: t("privacy.s9.body") }}
          />
          <p dangerouslySetInnerHTML={{ __html: t("privacy.s9.outro") }} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s10.title")}</h2>
          <p>{t("privacy.s10.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s11.title")}</h2>
          <p>{t("privacy.s11.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s12.title")}</h2>
          <p>{t("privacy.s12.body")}</p>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold mb-2">{t("privacy.s13.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: t("privacy.s13.body") }} />
        </div>
      </div>
    </section>
  );
}
