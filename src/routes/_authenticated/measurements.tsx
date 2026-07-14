import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listMeasurements, addMeasurement, deleteMeasurement } from "@/lib/engagement-extra";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingDown, TrendingUp, Minus, Ruler } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { BmiCalculator } from "@/components/BmiCalculator";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/_authenticated/measurements")({
  component: MeasurementsPage,
  head: () => ({
    meta: [{ title: "Body Measurements · Onyx Elevate" }],
  }),
});

function MeasurementsPage() {
  const t = useT();
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["measurements"],
    queryFn: listMeasurements,
  });

  const [form, setForm] = useState({
    measured_on: new Date().toISOString().slice(0, 10),
    weight_kg: "",
    body_fat_pct: "",
    waist_cm: "",
    chest_cm: "",
    arms_cm: "",
    thighs_cm: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await addMeasurement({
        measured_on: form.measured_on,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        body_fat_pct: form.body_fat_pct ? Number(form.body_fat_pct) : null,
        waist_cm: form.waist_cm ? Number(form.waist_cm) : null,
        chest_cm: form.chest_cm ? Number(form.chest_cm) : null,
        arms_cm: form.arms_cm ? Number(form.arms_cm) : null,
        thighs_cm: form.thighs_cm ? Number(form.thighs_cm) : null,
        notes: form.notes || null,
      });
      setForm({ ...form, weight_kg: "", body_fat_pct: "", waist_cm: "", chest_cm: "", arms_cm: "", thighs_cm: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["measurements"] });
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    await deleteMeasurement(id);
    qc.invalidateQueries({ queryKey: ["measurements"] });
  }

  const latest = rows[0];
  const previous = rows[1];
  const weightDelta = latest?.weight_kg != null && previous?.weight_kg != null
    ? Number((latest.weight_kg - previous.weight_kg).toFixed(2))
    : null;

  return (
    <div className="container-onyx py-10 lg:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">{t("measurements.eyebrow")}</div>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl font-bold">
          {t("measurements.title")}<span className="text-electric">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("measurements.subtitle")}
        </p>

        {/* BMI helper */}
        <div className="mt-6">
          <BmiCalculator
            onApply={(bmi) =>
              setForm((f) => ({
                ...f,
                notes: (f.notes ? f.notes + " · " : "") + `BMI ${bmi}`,
              }))
            }
          />
        </div>

        {/* How to measure body fat guide */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="group mt-4 w-full text-left rounded-lg border border-electric/30 bg-electric/5 hover:bg-electric/10 transition-all p-4 flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-md bg-electric/15 grid place-items-center text-electric">
                <Ruler className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{t("measurements.guide.eyebrow")}</div>
                <div className="mt-0.5 font-semibold text-sm">{t("measurements.guide.title")}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t("measurements.guide.desc")}</div>
              </div>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-onyx-100 border-border max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {t("measurements.guide.title")}<span className="text-electric">.</span>
              </DialogTitle>
              <DialogDescription>
                {t("measurements.guide.desc")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <MethodCard
                title={t("measurements.m1.title")}
                difficulty={t("measurements.m1.diff")}
                steps={[
                  t("measurements.m1.s1"),
                  t("measurements.m1.s2"),
                  t("measurements.m1.s3"),
                  t("measurements.m1.s4"),
                ]}
                accuracy={t("measurements.m1.acc")}
                accuracyLabel={t("measurements.accuracy")}
              />
              <MethodCard
                title={t("measurements.m2.title")}
                difficulty={t("measurements.m2.diff")}
                steps={[
                  t("measurements.m2.s1"),
                  t("measurements.m2.s2"),
                  t("measurements.m2.s3"),
                  t("measurements.m2.s4"),
                ]}
                accuracy={t("measurements.m2.acc")}
                accuracyLabel={t("measurements.accuracy")}
              />
              <MethodCard
                title={t("measurements.m3.title")}
                difficulty={t("measurements.m3.diff")}
                steps={[
                  t("measurements.m3.s1"),
                  t("measurements.m3.s2"),
                  t("measurements.m3.s3"),
                  t("measurements.m3.s4"),
                ]}
                accuracy={t("measurements.m3.acc")}
                accuracyLabel={t("measurements.accuracy")}
              />
              <MethodCard
                title={t("measurements.m4.title")}
                difficulty={t("measurements.m4.diff")}
                steps={[
                  t("measurements.m4.s1"),
                  t("measurements.m4.s2"),
                  t("measurements.m4.s3"),
                  t("measurements.m4.s4"),
                ]}
                accuracy={t("measurements.m4.acc")}
                accuracyLabel={t("measurements.accuracy")}
              />
            </div>

            <div className="mt-4 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <span className="font-bold text-amber-400">{t("measurements.proTip")}:</span> {t("measurements.proTipBody")}
            </div>
          </DialogContent>
        </Dialog>


        {latest && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label={t("measurements.stat.weight")} value={fmt(latest.weight_kg, "kg")} delta={weightDelta} unit="kg" />
            <Stat label={t("measurements.stat.bodyFat")} value={fmt(latest.body_fat_pct, "%")} />
            <Stat label={t("measurements.stat.waist")} value={fmt(latest.waist_cm, "cm")} />
            <Stat label={t("measurements.stat.logs")} value={String(rows.length)} />
          </div>
        )}

        <form onSubmit={save} className="mt-10 rounded-lg border border-border bg-onyx-100/60 p-5">
          <h2 className="font-display text-xl font-bold mb-4">{t("measurements.log.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Field label={t("measurements.field.date")} type="date" value={form.measured_on} onChange={(v) => setForm({ ...form, measured_on: v })} />
            <Field label={t("measurements.field.weight")} value={form.weight_kg} onChange={(v) => setForm({ ...form, weight_kg: v })} />
            <Field label={t("measurements.field.bodyFat")} value={form.body_fat_pct} onChange={(v) => setForm({ ...form, body_fat_pct: v })} />
            <Field label={t("measurements.field.waist")} value={form.waist_cm} onChange={(v) => setForm({ ...form, waist_cm: v })} />
            <Field label={t("measurements.field.chest")} value={form.chest_cm} onChange={(v) => setForm({ ...form, chest_cm: v })} />
            <Field label={t("measurements.field.arms")} value={form.arms_cm} onChange={(v) => setForm({ ...form, arms_cm: v })} />
            <Field label={t("measurements.field.thighs")} value={form.thighs_cm} onChange={(v) => setForm({ ...form, thighs_cm: v })} />
            <div className="flex items-end">
              <Button type="submit" disabled={busy} className="w-full bg-electric text-onyx-50 hover:bg-electric-glow font-bold">
                {busy ? t("measurements.saving") : t("measurements.saveEntry")}
              </Button>
            </div>
          </div>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t("measurements.notesPlaceholder")}
            rows={2}
            className="mt-3 w-full rounded-md border border-border bg-onyx-200/50 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
          />
        </form>

        <h2 className="mt-10 font-display text-xl font-bold">{t("measurements.history")}</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-onyx-100 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left p-3">{t("measurements.field.date")}</th>
                <th className="text-right p-3">{t("measurements.stat.weight")}</th>
                <th className="text-right p-3">{t("measurements.bfShort")}</th>
                <th className="text-right p-3">{t("measurements.stat.waist")}</th>
                <th className="text-right p-3">{t("measurements.field.chestShort")}</th>
                <th className="text-right p-3">{t("measurements.field.armsShort")}</th>
                <th className="text-right p-3">{t("measurements.field.thighsShort")}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">{t("common.loading")}</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">{t("measurements.empty")}</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/60 hover:bg-onyx-100/40">
                  <td className="p-3 font-medium">{r.measured_on}</td>
                  <td className="p-3 text-right">{fmt(r.weight_kg)}</td>
                  <td className="p-3 text-right">{fmt(r.body_fat_pct)}</td>
                  <td className="p-3 text-right">{fmt(r.waist_cm)}</td>
                  <td className="p-3 text-right">{fmt(r.chest_cm)}</td>
                  <td className="p-3 text-right">{fmt(r.arms_cm)}</td>
                  <td className="p-3 text-right">{fmt(r.thighs_cm)}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "number" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block min-w-0">
      <span className="block truncate text-xs text-muted-foreground font-semibold uppercase tracking-wide">{label}</span>
      <input
        type={type}
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-border bg-onyx-200/50 px-3 py-2 text-sm focus:outline-none focus:border-electric/60"
      />
    </label>
  );
}

function MethodCard({
  title,
  difficulty,
  steps,
  accuracy,
  accuracyLabel,
}: {
  title: string;
  difficulty: string;
  steps: string[];
  accuracy: string;
  accuracyLabel: string;
}) {
  return (
    <div className="rounded-md border border-border bg-onyx-200/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold">{title}</h4>
        <span className="text-[10px] uppercase tracking-wider text-electric font-bold bg-electric/10 px-2 py-0.5 rounded-full shrink-0">
          {difficulty}
        </span>
      </div>
      <ul className="mt-2 space-y-1">
        {steps.map((s, i) => (
          <li key={i} className="text-xs text-muted-foreground flex gap-2">
            <span className="text-electric font-bold">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-[11px] text-foreground/80 font-medium border-t border-border/40 pt-2">
        {accuracyLabel}: {accuracy}
      </div>
    </div>
  );
}

function Stat({ label, value, delta, unit }: { label: string; value: string; delta?: number | null; unit?: string }) {
  const Icon = delta == null ? Minus : delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : Minus;
  const tone = delta == null || delta === 0 ? "text-muted-foreground" : delta < 0 ? "text-green-400" : "text-amber-400";
  return (
    <div className="rounded-lg border border-border bg-onyx-100/60 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold">{value}</div>
      {delta != null && (
        <div className={`mt-1 text-xs font-semibold inline-flex items-center gap-1 ${tone}`}>
          <Icon className="w-3 h-3" /> {delta > 0 ? "+" : ""}{delta} {unit}
        </div>
      )}
    </div>
  );
}

function fmt(v: number | null | undefined, unit = "") {
  if (v == null) return "-";
  return `${v}${unit ? " " + unit : ""}`;
}
