import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AiMealPlanMeal = {
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes?: string;
};

export type AiMealPlanDay = {
  name: string;
  meals: AiMealPlanMeal[];
};

export type AiMealPlan = {
  id: string;
  name: string;
  days: AiMealPlanDay[];
  created_at: string;
};

function normalizeDays(input: unknown): AiMealPlanDay[] {
  const arr = Array.isArray(input) ? input : [];
  return arr
    .slice(0, 14)
    .map((d: any, di: number) => ({
      name: String(d?.name ?? `Day ${di + 1}`).slice(0, 60),
      meals: (Array.isArray(d?.meals) ? d.meals : [])
        .slice(0, 8)
        .map((m: any): AiMealPlanMeal | null => {
          const slotRaw = String(m?.slot ?? "snack").toLowerCase();
          const slot: AiMealPlanMeal["slot"] =
            slotRaw === "breakfast" ||
            slotRaw === "lunch" ||
            slotRaw === "dinner" ||
            slotRaw === "snack"
              ? slotRaw
              : "snack";
          const name = String(m?.name ?? "")
            .trim()
            .slice(0, 120);
          if (!name) return null;
          const num = (v: any) => {
            const n = Number(v);
            return Number.isFinite(n) && n >= 0 ? n : 0;
          };
          return {
            slot,
            name,
            kcal: num(m?.kcal),
            protein_g: num(m?.protein_g),
            carbs_g: num(m?.carbs_g),
            fat_g: num(m?.fat_g),
            notes: m?.notes ? String(m.notes).slice(0, 200) : undefined,
          };
        })
        .filter((x: AiMealPlanMeal | null): x is AiMealPlanMeal => x !== null),
    }))
    .filter((d) => d.meals.length > 0);
}

export const listMyAiMealPlans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AiMealPlan[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("ai_meal_plans")
      .select("id, name, days, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      days: normalizeDays(r.days),
      created_at: r.created_at,
    }));
  });

export const getAiMealPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<AiMealPlan | null> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("ai_meal_plans")
      .select("id, name, days, created_at")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      days: normalizeDays(row.days),
      created_at: row.created_at,
    };
  });

export const deleteAiMealPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("ai_meal_plans")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw error;
    return { ok: true as const };
  });

export const logAiMealPlanDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; dayIndex: number; date: string }) =>
    z
      .object({
        id: z.string().uuid(),
        dayIndex: z.number().int().min(0).max(13),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("ai_meal_plans")
      .select("days")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!row) throw new Error("Plan not found");
    const days = normalizeDays(row.days);
    const day = days[data.dayIndex];
    if (!day) throw new Error("Day not found");
    const rows = day.meals.map((m) => ({
      user_id: userId,
      logged_date: data.date,
      meal_slot: m.slot,
      food_id: null,
      food_kind: null,
      name: m.name,
      grams: null,
      servings: 1,
      kcal: m.kcal,
      protein_g: m.protein_g,
      carbs_g: m.carbs_g,
      fat_g: m.fat_g,
      source: "ai-meal-plan",
      source_ref: `${data.id}:${data.dayIndex}`,
    }));
    if (rows.length === 0) return { ok: true as const, inserted: 0 };
    const { error: insErr } = await supabase.from("food_log_entries").insert(rows);
    if (insErr) throw insErr;
    return { ok: true as const, inserted: rows.length };
  });
