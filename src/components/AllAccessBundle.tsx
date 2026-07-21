import { useEffect, useState } from "react";
import { isBundleUnlocked } from "@/lib/nutritionAccess";
import { usePrice } from "@/lib/pricing";
import { MembershipModal } from "@/components/MembershipModal";
import { ShimmerButton } from "@/components/ShimmerButton";
import { useT } from "@/i18n/LanguageProvider";
import { Check, Sparkles } from "lucide-react";

interface Props {
  compact?: boolean;
}

export function AllAccessBundle({ compact = false }: Props) {
  const t = useT();
  const [unlocked, setUnlocked] = useState(false);

  const monthlyIntro = usePrice("monthlyIntro");
  const monthly = usePrice("monthly");

  useEffect(() => {
    setUnlocked(isBundleUnlocked());
  }, []);

  // Members already paying: never show the payment CTA anywhere in the app.
  if (unlocked) {
    return (
      <div className="rounded-2xl border border-electric/50 bg-gradient-to-br from-electric/10 via-onyx-100 to-onyx-50 p-6">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-electric">
          ✓ {t("allAccess.unlockedEyebrow")}
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold">{t("allAccess.unlockedTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("allAccess.unlockedDesc")}</p>
      </div>
    );
  }

  const eyebrow = t("allAccess.eyebrow");
  const title = t("allAccess.title");
  const desc = t("allAccess.desc");
  const fromLabel = t("allAccess.from");
  const firstMonthLabel = t("membership.monthly.firstMonth");
  const thenLabel = `${t("membership.monthly.then")} ${monthly}${t("membership.monthly.perMo")}`;
  const cta = t("allAccess.cta");

  const perks = [
    t("membership.f.allPrograms"),
    t("membership.f.nutritionTracker"),
    t("membership.f.quickWorkouts"),
    t("membership.f.aiCoach"),
  ].filter(Boolean);

  const Card = ({ padding }: { padding: string }) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/15 via-onyx-100 to-onyx-50 glow-ring ${padding}`}
    >
      {/* soft decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--electric-glow) 55%, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "color-mix(in oklab, var(--electric) 45%, transparent)" }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/40 bg-electric/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] font-bold text-electric">
            <Sparkles className="h-3 w-3" />
            {eyebrow}
          </div>
          <h3 className="mt-3 font-display text-2xl lg:text-3xl font-bold leading-tight">
            {title}
          </h3>
          <p className="mt-2 text-sm lg:text-[15px] text-foreground/80 leading-relaxed">{desc}</p>

          {perks.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] text-foreground/85">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:items-end lg:shrink-0">
          <div className="rounded-xl border border-electric/30 bg-onyx-50/60 px-4 py-3 backdrop-blur-sm lg:min-w-[220px]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:text-right">
              {fromLabel}
            </div>
            <div className="mt-0.5 flex items-baseline gap-2 lg:justify-end">
              <span className="font-display text-3xl lg:text-4xl font-bold leading-none">
                {monthlyIntro}
              </span>
              <span className="text-[11px] text-muted-foreground">{firstMonthLabel}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground lg:text-right">{thenLabel}</div>
          </div>
          <MembershipModal
            trigger={<ShimmerButton className="w-full lg:w-auto px-6 py-3">{cta}</ShimmerButton>}
          />
        </div>
      </div>
    </div>
  );

  if (compact) return <Card padding="p-5 lg:p-6" />;

  return (
    <div>
      <div className="lg:hidden">
        <Card padding="p-5" />
      </div>
      <div className="hidden lg:block">
        <Card padding="p-8" />
      </div>
    </div>
  );
}
