import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

export function SiteFooter() {
  const t = useT();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      key: "onyx",
      title: t("footer.onyx"),
      links: [
        { to: "/programs", label: t("footer.programs") },
        { to: "/app", label: t("footer.app") },
        { to: "/coaches/$slug", params: { slug: "simen" }, label: t("footer.coaches") },
        {
          to: "/articles/$slug",
          params: { slug: "progressive-overload-blueprint" },
          label: t("footer.articles"),
        },
        { to: "/guidelines", label: t("footer.guidelines") },
      ],
    },
    {
      key: "library",
      title: t("footer.library"),
      links: [
        { to: "/exercises", label: t("nav.exercises") },
        { to: "/recipes", label: t("nav.recipes") },
        { to: "/programs", label: t("footer.programs") },
      ],
    },
    {
      key: "company",
      title: t("footer.company"),
      links: [
        { to: "/about", label: t("footer.about") },
        { to: "/careers", label: t("footer.careers") },
        { to: "/contact", label: t("footer.contact") },
      ],
    },
    {
      key: "support",
      title: t("footer.support"),
      links: [
        { to: "/faq", label: t("footer.faq") },
        { to: "/contact", label: t("footer.helpCenter") },
        { to: "/privacy", label: t("footer.privacy") },
        { to: "/terms", label: t("footer.terms") },
        { to: "/refund", label: t("footer.refunds") },
      ],
    },
  ];

  return (
    <footer className="relative z-10 bg-onyx-50 border-t border-border/60 mt-6 md:mt-12">
      <div className="container-onyx py-6 md:py-10">
        {/* MOBILE / TABLET ACCORDION, hidden on md+ */}
        <div className="md:hidden space-y-2">
          {/* Brand always visible */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-electric to-electric-glow">
                <span className="font-display text-sm font-bold text-onyx-50">O</span>
              </div>
              <span className="font-display text-lg font-bold">
                ONYX<span className="text-electric">.</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-[260px]">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex gap-2">{/* Social links coming soon */}</div>
          </div>

          {/* Collapsible sections */}
          {sections.map((s) => {
            const isOpen = !!openSections[s.key];
            return (
              <div key={s.key} className="border border-border/60 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(s.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-onyx-100/40"
                >
                  {s.title}
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <ul className="px-4 pb-3 pt-1 space-y-2 text-sm text-muted-foreground">
                    {s.links.map((l) => (
                      <li key={l.to + l.label}>
                        {"params" in l && l.params ? (
                          <Link
                            to={l.to as any}
                            params={l.params as any}
                            className="hover:text-electric"
                          >
                            {l.label}
                          </Link>
                        ) : (
                          <Link to={l.to as any} className="hover:text-electric">
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* DESKTOP GRID, hidden below md */}
        <div className="hidden md:grid gap-8 md:grid-cols-5">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-electric to-electric-glow">
                <span className="font-display text-sm font-bold text-onyx-50">O</span>
              </div>
              <span className="font-display text-lg font-bold">
                ONYX<span className="text-electric">.</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-[200px]">
              {t("footer.tagline")}
            </p>

            {/* SOCIAL, coming soon */}
            <div className="mt-6 flex gap-2" />
          </div>

          {sections.map((s) => (
            <div key={s.key}>
              <h4 className="text-sm font-semibold mb-3">{s.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {s.links.map((l) => (
                  <li key={l.to + l.label}>
                    {"params" in l && l.params ? (
                      <Link
                        to={l.to as any}
                        params={l.params as any}
                        className="hover:text-electric"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <Link to={l.to as any} className="hover:text-electric">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-border/60">
        <div className="container-onyx py-3 md:py-5 flex flex-col md:flex-row gap-2 md:gap-3 items-center justify-between text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Onyx Elevate. {t("footer.rights")}
          </span>
          <div className="flex gap-5 flex-wrap justify-center">
            <Link to="/disclaimer" className="hover:text-electric">
              {t("footer.disclaimer")}
            </Link>
            <Link to="/privacy" className="hover:text-electric">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="hover:text-electric">
              {t("footer.terms")}
            </Link>
            <Link to="/refund" className="hover:text-electric">
              {t("footer.refunds")}
            </Link>
            <Link to="/contact" className="hover:text-electric">
              {t("footer.contact")}
            </Link>
          </div>
          <span>{t("footer.builtFor")}</span>
        </div>
      </div>
    </footer>
  );
}
