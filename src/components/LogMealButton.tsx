import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { UtensilsCrossed, X } from "lucide-react";
import { logFood } from "@/lib/nutrition.functions";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";
import { DatePickerRow, todayISO } from "@/components/DatePickerRow";

interface Props {
  name: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sourceRef?: string;
  className?: string;
}

export function LogMealButton({ name, kcal, protein_g, carbs_g, fat_g, sourceRef, className }: Props) {
  const { user } = useAuth();
  const t = useT();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<string>(() => todayISO());
  const logFn = useServerFn(logFood);

  const mut = useMutation({
    mutationFn: async (slot: "breakfast" | "lunch" | "dinner" | "snack") => {
      await logFn({
        data: {
          date,
          meal_slot: slot,
          name,
          servings: 1,
          kcal,
          protein_g,
          carbs_g,
          fat_g,
          source: "recipe",
          source_ref: sourceRef,
        },
      });
    },
    onSuccess: () => {
      toast.success(t("logMeal.success"));
      setOpen(false);
      navigate({ to: "/my-nutrition" });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : t("logMeal.failed")),
  });

  if (!user) {
    return (
      <Link
        to="/auth"
        className={`inline-flex items-center gap-2 rounded-md border border-electric/40 bg-onyx-100 px-4 py-2 text-sm font-semibold text-electric hover:border-electric transition-all ${className ?? ""}`}
      >
        <UtensilsCrossed className="h-4 w-4" /> {t("logMeal.signInCta")}
      </Link>
    );
  }

  const slots: Array<{ key: "breakfast" | "lunch" | "dinner" | "snack"; label: string }> = [
    { key: "breakfast", label: t("logMeal.breakfast") },
    { key: "lunch", label: t("logMeal.lunch") },
    { key: "dinner", label: t("logMeal.dinner") },
    { key: "snack", label: t("logMeal.snack") },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-md bg-electric px-4 py-2 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all shadow-[0_0_18px_rgba(0,180,255,0.25)] ${className ?? ""}`}
      >
        <UtensilsCrossed className="h-4 w-4" /> {t("logMeal.cta")}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-electric/30 bg-onyx-100 shadow-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">{t("logMeal.whichMeal")}</p>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-3">
              <DatePickerRow value={date} onChange={setDate} label={t("datePicker.logOn")} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <button
                  key={s.key}
                  onClick={() => mut.mutate(s.key)}
                  disabled={mut.isPending}
                  className="text-sm py-3 rounded-md bg-onyx-50 hover:bg-electric hover:text-onyx-50 transition-colors disabled:opacity-60 font-semibold"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
