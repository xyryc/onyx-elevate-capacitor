import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createCustomProgram } from "@/lib/custom-programs.functions";
import { Plus, Loader2 } from "lucide-react";
import builderHero from "@/assets/builder-hero.jpg";
import { toast } from "sonner";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/builder/")({
  component: BuilderIndex,
});

function BuilderIndex() {
  const t = useT();
  const router = useRouter();
  const qc = useQueryClient();
  const createFn = useServerFn(createCustomProgram);
  const [newName, setNewName] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [weeksCount, setWeeksCount] = useState(4);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      if (mq.matches) {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const createMut = useMutation({
    mutationFn: () =>
      createFn({
        data: { name: newName || t("builder.untitled"), daysPerWeek, weeks: weeksCount },
      }),
    onSuccess: (res: { id: string }) => {
      setNewName("");
      qc.invalidateQueries({ queryKey: ["custom-programs"] });
      router.navigate({ to: "/builder/$id", params: { id: res.id } });
    },
    onError: (e: any) => toast.error(e?.message || t("builder.couldntCreate")),
  });

  return (
    <div className="relative h-full overflow-hidden md:min-h-screen md:overflow-visible">
      <img
        src={builderHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background pointer-events-none" />
      <div className="container-onyx relative flex h-full flex-col justify-between gap-2 pt-2 pb-20 md:min-h-screen md:justify-start md:py-8 md:pb-3">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-electric md:text-sm">
            {t("builder.eyebrow")}
          </p>
          <h1 className="mt-1 font-display text-xl font-bold md:text-3xl">{t("builder.title")}</h1>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground md:text-base">
            {t("builder.subtitle")}
          </p>
          <p className="mt-1 max-w-2xl text-xs leading-snug text-foreground md:text-sm">
            {t("builder.introLine")}
          </p>
        </header>

        <div className="rounded-xl border border-electric/20 bg-electric/10 p-2.5 md:p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-electric md:text-sm">
            {t("builder.featuresTitle")}
          </p>
          <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground md:text-sm">
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature1")}
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature2")}
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature3")}
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature4")}
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature5")}
            </li>
            <li className="flex items-start gap-1.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
              {t("builder.feature6")}
            </li>
          </ul>
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-onyx-100 p-3 md:space-y-4 md:p-5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:text-sm">
              {t("builder.programName")}
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("builder.programNamePlaceholder")}
              className="mt-1.5 w-full rounded-md border border-border bg-onyx-50 px-3 py-2 text-sm outline-none focus:border-electric md:text-base"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:text-sm">
                {t("builder.daysPerWeek")}
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDaysPerWeek(n)}
                    className={`h-8 min-w-8 rounded-md border px-2.5 text-xs font-semibold transition ${
                      daysPerWeek === n
                        ? "border-electric bg-electric text-onyx-50"
                        : "border-border bg-onyx-50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:text-sm">
                {t("builder.numberOfWeeks")}
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {[1, 2, 4, 6, 8, 12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setWeeksCount(n)}
                    className={`h-8 min-w-8 rounded-md border px-2.5 text-xs font-semibold transition ${
                      weeksCount === n
                        ? "border-electric bg-electric text-onyx-50"
                        : "border-border bg-onyx-50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => createMut.mutate()}
            disabled={createMut.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50 hover:bg-electric-glow disabled:opacity-50 sm:w-auto md:text-base"
          >
            {createMut.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t("builder.createProgram")}
          </button>
        </div>

        <p className="text-[10px] leading-snug text-muted-foreground md:text-xs">
          {t("builder.quickTip")}
        </p>
      </div>
    </div>
  );
}
