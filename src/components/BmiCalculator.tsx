import { useMemo, useState } from "react";
import { Calculator, Info, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/LanguageProvider";

export function BmiCalculator({
  onApply,
  triggerLabel,
}: {
  onApply?: (bmi: number) => void;
  triggerLabel?: string;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h < 80 || h > 260 || w < 20 || w > 400) return null;
    const m = h / 100;
    return Number((w / (m * m)).toFixed(1));
  }, [height, weight]);

  function classify(bmi: number): { label: string; tone: string; range: string } {
    if (bmi < 18.5) return { label: t("bmi.cat.under"), tone: "text-sky-400", range: "< 18.5" };
    if (bmi < 25) return { label: t("bmi.cat.healthy"), tone: "text-green-400", range: "18.5 – 24.9" };
    if (bmi < 30) return { label: t("bmi.cat.over"), tone: "text-amber-400", range: "25 – 29.9" };
    if (bmi < 35) return { label: t("bmi.cat.obese1"), tone: "text-orange-400", range: "30 – 34.9" };
    if (bmi < 40) return { label: t("bmi.cat.obese2"), tone: "text-red-400", range: "35 – 39.9" };
    return { label: t("bmi.cat.obese3"), tone: "text-red-500", range: "≥ 40" };
  }

  const cat = bmi != null ? classify(bmi) : null;
  const pct = bmi != null ? Math.min(100, Math.max(0, ((bmi - 15) / (40 - 15)) * 100)) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group w-full text-left rounded-lg border border-electric/30 bg-electric/5 hover:bg-electric/10 transition-all p-4 flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-md bg-electric/15 grid place-items-center text-electric">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{t("bmi.eyebrow")}</div>
            <div className="mt-0.5 font-semibold text-sm">{triggerLabel ?? t("bmi.triggerLabel")}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t("bmi.triggerDesc")}</div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-onyx-100 border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {t("bmi.title")}<span className="text-electric">.</span>
          </DialogTitle>
          <DialogDescription>
            {t("bmi.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 flex gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-amber-400">{t("bmi.headsUp")}</span> {t("bmi.warning")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="block truncate text-xs text-muted-foreground font-semibold uppercase tracking-wide">{t("bmi.height")}</span>
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="mt-1 w-full rounded-md border border-border bg-onyx-200/50 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
            />
          </label>
          <label className="block min-w-0">
            <span className="block truncate text-xs text-muted-foreground font-semibold uppercase tracking-wide">{t("bmi.weight")}</span>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="72"
              className="mt-1 w-full rounded-md border border-border bg-onyx-200/50 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
            />
          </label>
        </div>

        {bmi != null && cat && (
          <div className="rounded-lg border border-border bg-onyx-200/40 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{t("bmi.yourBmi")}</div>
                <div className="mt-1 font-display text-4xl font-bold tabular-nums">{bmi}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${cat.tone}`}>{cat.label}</div>
                <div className="text-[11px] text-muted-foreground">{t("bmi.range")} {cat.range}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative h-2 rounded-full overflow-hidden flex">
                <div className="flex-[3.5] bg-sky-500/70" />
                <div className="flex-[6.5] bg-green-500/70" />
                <div className="flex-[5] bg-amber-500/70" />
                <div className="flex-[10] bg-red-500/70" />
              </div>
              <div className="relative">
                <div
                  className="absolute -top-1 h-4 w-0.5 bg-foreground"
                  style={{ left: `calc(${pct}% - 1px)` }}
                  aria-hidden
                />
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-electric shrink-0 mt-0.5" />
              <span>{t("bmi.footnote")}</span>
            </div>

            {onApply && (
              <Button
                type="button"
                onClick={() => { onApply(bmi); setOpen(false); }}
                className="mt-4 w-full bg-electric text-onyx-50 hover:bg-electric-glow font-bold"
              >
                {t("bmi.saveToNotes")}
              </Button>
            )}
          </div>
        )}

        {bmi == null && (height || weight) && (
          <div className="text-xs text-muted-foreground">{t("bmi.invalid")}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
