import { useEffect, useState } from "react";
import { Users, Star, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ProgramStats({ slug }: { slug: string }) {
  const [stats, setStats] = useState({ athletes: 0, completions: 0, avgRating: 0, reviews: 0 });

  useEffect(() => {
    let active = true;
    (async () => {
      const [purchases, progress, reviews] = await Promise.all([
        supabase.from("purchases").select("user_id", { count: "exact", head: true }).eq("product_slug", slug),
        supabase.from("program_progress").select("completed_days").eq("program_slug", slug),
        supabase.from("reviews").select("rating").eq("product_kind", "program").eq("product_slug", slug),
      ]);
      if (!active) return;
      const reviewRows = (reviews.data ?? []) as { rating: number }[];
      const progressRows = (progress.data ?? []) as { completed_days: string[] }[];
      const completions = progressRows.filter((p) => (p.completed_days?.length ?? 0) >= 14).length;
      const avg = reviewRows.length ? reviewRows.reduce((a, r) => a + r.rating, 0) / reviewRows.length : 0;
      setStats({
        athletes: (purchases.count ?? 0) + progressRows.length,
        completions,
        avgRating: avg,
        reviews: reviewRows.length,
      });
    })();
    return () => { active = false; };
  }, [slug]);

  const items = [
    { icon: Users, label: "Athletes Training", value: stats.athletes.toLocaleString() },
    { icon: Award, label: "Week 2+ Completions", value: stats.completions.toLocaleString() },
    { icon: Star, label: "Average Rating", value: stats.avgRating ? stats.avgRating.toFixed(1) : "-" },
    { icon: TrendingUp, label: "Reviews", value: stats.reviews.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.label} className="surface-card rounded-xl p-4">
          <it.icon className="h-4 w-4 text-electric" />
          <div className="mt-2 font-display text-xl font-bold">{it.value}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
