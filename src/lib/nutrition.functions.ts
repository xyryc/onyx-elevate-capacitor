import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types ----------
export interface FoodRow {
  id: string;
  name: string;
  brand: string | null;
  serving_size_g: number | null;
  serving_label: string | null;
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  category: string | null;
  is_custom?: boolean;
}

export interface FoodLogEntry {
  id: string;
  logged_date: string;
  meal_slot: string;
  name: string;
  grams: number | null;
  servings: number | null;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  source: string | null;
  source_ref: string | null;
  created_at: string;
}

export interface NutritionTargets {
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
}

// ---------- Search foods (public + user's custom) ----------
const searchInput = z.object({
  query: z.string().max(100),
  lang: z.enum(["en", "no", "es", "pt-BR"]).optional(),
  category: z.string().max(40).optional(),
});
export const searchFoods = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => searchInput.parse(d))
  .handler(async ({ data, context }): Promise<FoodRow[]> => {
    const q = data.query.trim();
    const lang = data.lang ?? "en";
    const { supabase, userId } = context;
    const publicQ = supabase
      .from("foods")
      .select(
        "id,name,name_no,name_es,name_pt,brand,serving_size_g,serving_label,kcal_per_100g,protein_g_per_100g,carbs_g_per_100g,fat_g_per_100g,category",
      )
      .limit(2000);
    const customQ = supabase
      .from("custom_foods")
      .select(
        "id,name,serving_size_g,kcal_per_100g,protein_g_per_100g,carbs_g_per_100g,fat_g_per_100g",
      )
      .eq("user_id", userId)
      .limit(50);
    if (q) {
      const like = `%${q.replace(/[%_,]/g, "")}%`;
      publicQ.or(
        `name.ilike.${like},name_no.ilike.${like},name_es.ilike.${like},name_pt.ilike.${like}`,
      );
      customQ.ilike("name", `%${q}%`);
    } else {
      publicQ.order("name", { ascending: true });
    }
    if (data.category) publicQ.eq("category", data.category);
    const [pub, cus] = await Promise.all([publicQ, customQ]);
    if (pub.error) throw pub.error;
    if (cus.error) throw cus.error;
    const custom: FoodRow[] = (cus.data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      brand: null,
      serving_size_g: r.serving_size_g,
      serving_label: null,
      kcal_per_100g: Number(r.kcal_per_100g),
      protein_g_per_100g: Number(r.protein_g_per_100g),
      carbs_g_per_100g: Number(r.carbs_g_per_100g),
      fat_g_per_100g: Number(r.fat_g_per_100g),
      category: "my food",
      is_custom: true,
    }));
    const pick = (r: {
      name: string;
      name_no?: string | null;
      name_es?: string | null;
      name_pt?: string | null;
    }) => {
      if (lang === "no") return r.name_no || r.name;
      if (lang === "es") return r.name_es || r.name;
      if (lang === "pt-BR") return r.name_pt || r.name;
      return r.name;
    };
    const publics: FoodRow[] = (pub.data ?? []).map((r) => ({
      id: r.id,
      name: pick(r),
      brand: r.brand,
      serving_size_g: r.serving_size_g,
      serving_label: r.serving_label,
      category: r.category,
      kcal_per_100g: Number(r.kcal_per_100g),
      protein_g_per_100g: Number(r.protein_g_per_100g),
      carbs_g_per_100g: Number(r.carbs_g_per_100g),
      fat_g_per_100g: Number(r.fat_g_per_100g),
    }));
    return [...custom, ...publics];
  });

// ---------- Day log ----------
export const listDayLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) => z.object({ date: z.string() }).parse(d))
  .handler(async ({ data, context }): Promise<FoodLogEntry[]> => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("food_log_entries")
      .select(
        "id,logged_date,meal_slot,name,grams,servings,kcal,protein_g,carbs_g,fat_g,source,source_ref,created_at",
      )
      .eq("user_id", userId)
      .eq("logged_date", data.date)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (rows ?? []).map((r) => ({
      ...r,
      grams: r.grams != null ? Number(r.grams) : null,
      servings: r.servings != null ? Number(r.servings) : null,
      kcal: Number(r.kcal),
      protein_g: Number(r.protein_g),
      carbs_g: Number(r.carbs_g),
      fat_g: Number(r.fat_g),
    }));
  });

// Return the set of dates on which the given source_ref (e.g. plan slug + day
// id) has already been logged OR is pending as a draft. Used to show a
// "already logged" checkmark on the date picker so users can't add the same
// plan day twice.
export const listSourceRefDates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { source_ref: string }) =>
    z.object({ source_ref: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }): Promise<{ logged: string[]; drafted: string[] }> => {
    const { supabase, userId } = context;
    const [entries, drafts] = await Promise.all([
      supabase
        .from("food_log_entries")
        .select("logged_date")
        .eq("user_id", userId)
        .eq("source_ref", data.source_ref),
      supabase
        .from("food_log_drafts")
        .select("logged_date")
        .eq("user_id", userId)
        .eq("source_ref", data.source_ref),
    ]);
    if (entries.error) throw entries.error;
    if (drafts.error) throw drafts.error;
    const uniq = (rows: { logged_date: string }[] | null) =>
      Array.from(new Set((rows ?? []).map((r) => r.logged_date)));
    return { logged: uniq(entries.data), drafted: uniq(drafts.data) };
  });

// ---------- Week log ----------
export const listWeekLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { startDate: string; endDate: string }) =>
    z.object({ startDate: z.string(), endDate: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("food_log_entries")
      .select("logged_date,kcal,protein_g,carbs_g,fat_g")
      .eq("user_id", userId)
      .gte("logged_date", data.startDate)
      .lte("logged_date", data.endDate);
    if (error) throw error;
    return (rows ?? []).map((r) => ({
      logged_date: r.logged_date,
      kcal: Number(r.kcal),
      protein_g: Number(r.protein_g),
      carbs_g: Number(r.carbs_g),
      fat_g: Number(r.fat_g),
    }));
  });

// ---------- Log a food ----------
const logInput = z.object({
  date: z.string(),
  meal_slot: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  name: z.string().min(1).max(200),
  food_id: z.string().uuid().optional(),
  food_kind: z.enum(["public", "custom"]).optional(),
  grams: z.number().positive().nullable().optional(),
  servings: z.number().positive().nullable().optional(),
  kcal: z.number().min(0),
  protein_g: z.number().min(0).default(0),
  carbs_g: z.number().min(0).default(0),
  fat_g: z.number().min(0).default(0),
  source: z.string().max(40).optional(),
  source_ref: z.string().max(200).optional(),
});
export const logFood = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => logInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("food_log_entries").insert({
      user_id: userId,
      logged_date: data.date,
      meal_slot: data.meal_slot,
      food_id: data.food_id ?? null,
      food_kind: data.food_kind ?? null,
      name: data.name,
      grams: data.grams ?? null,
      servings: data.servings ?? null,
      kcal: data.kcal,
      protein_g: data.protein_g,
      carbs_g: data.carbs_g,
      fat_g: data.fat_g,
      source: data.source ?? "manual",
      source_ref: data.source_ref ?? null,
    });
    if (error) throw error;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { data: todayLog } = await supabase
      .from("activity_events")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", "program_day")
      .gte("created_at", startOfToday.toISOString())
      .limit(1)
      .maybeSingle();
    if (!todayLog) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      await supabase.from("activity_events").insert({
        user_id: userId,
        display_name: prof?.display_name ?? "Athlete",
        avatar_url: prof?.avatar_url ?? null,
        kind: "program_day",
        title: "Nutrition logged",
        detail: data.name,
        item_slug: "nutrition",
      });
    }
    return { ok: true };
  });

// ---------- Batch log (log a whole meal-plan day at once) ----------
const logBatchInput = z.object({
  date: z.string(),
  source: z.string().max(40).optional(),
  source_ref: z.string().max(200).optional(),
  items: z
    .array(
      z.object({
        meal_slot: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        name: z.string().min(1).max(200),
        kcal: z.number().min(0),
        protein_g: z.number().min(0).default(0),
        carbs_g: z.number().min(0).default(0),
        fat_g: z.number().min(0).default(0),
      }),
    )
    .min(1)
    .max(20),
});
export const logFoodBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => logBatchInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const rows = data.items.map((it) => ({
      user_id: userId,
      logged_date: data.date,
      meal_slot: it.meal_slot,
      name: it.name,
      servings: 1,
      kcal: it.kcal,
      protein_g: it.protein_g,
      carbs_g: it.carbs_g,
      fat_g: it.fat_g,
      source: data.source ?? "meal-plan",
      source_ref: data.source_ref ?? null,
    }));
    const { error } = await supabase.from("food_log_entries").insert(rows);
    if (error) throw error;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { data: todayLog } = await supabase
      .from("activity_events")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", "program_day")
      .gte("created_at", startOfToday.toISOString())
      .limit(1)
      .maybeSingle();
    if (!todayLog) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      await supabase.from("activity_events").insert({
        user_id: userId,
        display_name: prof?.display_name ?? "Athlete",
        avatar_url: prof?.avatar_url ?? null,
        kind: "program_day",
        title: "Nutrition day logged",
        detail: `${rows.length} meals`,
        item_slug: "nutrition",
      });
    }
    return { ok: true, inserted: rows.length };
  });

// Same shape as logFoodBatch but writes to food_log_drafts (pending),
// used when you "Add day" from a meal plan, the user still has to press
// "Log day" on my-nutrition to commit them to the statistics.
export const logDraftBatch = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => logBatchInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Idempotent: if the user re-adds the same plan day, replace previous
    // drafts for that date+source_ref instead of stacking them (which would
    // otherwise double/triple the kcal shown on the ring).
    if (data.source_ref) {
      await supabase
        .from("food_log_drafts")
        .delete()
        .eq("user_id", userId)
        .eq("logged_date", data.date)
        .eq("source_ref", data.source_ref);
    }
    const rows = data.items.map((it) => ({
      user_id: userId,
      logged_date: data.date,
      meal_slot: it.meal_slot,
      name: it.name,
      servings: 1,
      kcal: it.kcal,
      protein_g: it.protein_g,
      carbs_g: it.carbs_g,
      fat_g: it.fat_g,
      source: data.source ?? "meal-plan",
      source_ref: data.source_ref ?? null,
    }));
    const { error } = await supabase.from("food_log_drafts").insert(rows);
    if (error) throw error;
    return { ok: true, inserted: rows.length };
  });

// Commit every draft for a given date into food_log_entries and clear them.
export const commitDayDrafts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) => z.object({ date: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: drafts, error: getErr } = await supabase
      .from("food_log_drafts")
      .select(
        "logged_date,meal_slot,name,grams,servings,kcal,protein_g,carbs_g,fat_g,source,source_ref",
      )
      .eq("user_id", userId)
      .eq("logged_date", data.date);
    if (getErr) throw getErr;
    if (!drafts || drafts.length === 0) return { ok: true, committed: 0 };
    const rows = drafts.map((d) => ({
      user_id: userId,
      logged_date: d.logged_date,
      meal_slot: d.meal_slot,
      name: d.name,
      grams: d.grams,
      servings: d.servings,
      kcal: d.kcal,
      protein_g: d.protein_g,
      carbs_g: d.carbs_g,
      fat_g: d.fat_g,
      source: d.source ?? "manual",
      source_ref: d.source_ref ?? null,
    }));
    const { error: insErr } = await supabase.from("food_log_entries").insert(rows);
    if (insErr) throw insErr;
    const { error: delErr } = await supabase
      .from("food_log_drafts")
      .delete()
      .eq("user_id", userId)
      .eq("logged_date", data.date);
    if (delErr) throw delErr;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { data: todayLog } = await supabase
      .from("activity_events")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", "program_day")
      .gte("created_at", startOfToday.toISOString())
      .limit(1)
      .maybeSingle();
    if (!todayLog) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      await supabase.from("activity_events").insert({
        user_id: userId,
        display_name: prof?.display_name ?? "Athlete",
        avatar_url: prof?.avatar_url ?? null,
        kind: "program_day",
        title: "Nutrition day logged",
        detail: `${rows.length} meals`,
        item_slug: "nutrition",
      });
    }
    return { ok: true, committed: rows.length };
  });

// ---------- Draft (pending) food entries ----------
export interface FoodDraft {
  id: string;
  logged_date: string;
  meal_slot: string;
  name: string;
  grams: number | null;
  servings: number | null;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  source: string | null;
  source_ref: string | null;
  created_at: string;
}

export const listDayDrafts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) => z.object({ date: z.string() }).parse(d))
  .handler(async ({ data, context }): Promise<FoodDraft[]> => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("food_log_drafts")
      .select(
        "id,logged_date,meal_slot,name,grams,servings,kcal,protein_g,carbs_g,fat_g,source,source_ref,created_at",
      )
      .eq("user_id", userId)
      .eq("logged_date", data.date)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (rows ?? []).map((r) => ({
      ...r,
      grams: r.grams != null ? Number(r.grams) : null,
      servings: r.servings != null ? Number(r.servings) : null,
      kcal: Number(r.kcal),
      protein_g: Number(r.protein_g),
      carbs_g: Number(r.carbs_g),
      fat_g: Number(r.fat_g),
    }));
  });

export const createDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => logInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("food_log_drafts")
      .insert({
        user_id: userId,
        logged_date: data.date,
        meal_slot: data.meal_slot,
        name: data.name,
        grams: data.grams ?? null,
        servings: data.servings ?? null,
        kcal: data.kcal,
        protein_g: data.protein_g,
        carbs_g: data.carbs_g,
        fat_g: data.fat_g,
        source: data.source ?? "manual",
        source_ref: data.source_ref ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row.id };
  });

export const deleteDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("food_log_drafts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw error;
    return { ok: true };
  });

export const commitDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: draft, error: getErr } = await supabase
      .from("food_log_drafts")
      .select(
        "logged_date,meal_slot,name,grams,servings,kcal,protein_g,carbs_g,fat_g,source,source_ref",
      )
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (getErr) throw getErr;
    if (!draft) throw new Error("Draft not found");
    const { error: insErr } = await supabase.from("food_log_entries").insert({
      user_id: userId,
      logged_date: draft.logged_date,
      meal_slot: draft.meal_slot,
      name: draft.name,
      grams: draft.grams,
      servings: draft.servings,
      kcal: draft.kcal,
      protein_g: draft.protein_g,
      carbs_g: draft.carbs_g,
      fat_g: draft.fat_g,
      source: draft.source ?? "manual",
      source_ref: draft.source_ref ?? null,
    });
    if (insErr) throw insErr;
    const { error: delErr } = await supabase
      .from("food_log_drafts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (delErr) throw delErr;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { data: todayLog } = await supabase
      .from("activity_events")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", "program_day")
      .gte("created_at", startOfToday.toISOString())
      .limit(1)
      .maybeSingle();
    if (!todayLog) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      await supabase.from("activity_events").insert({
        user_id: userId,
        display_name: prof?.display_name ?? "Athlete",
        avatar_url: prof?.avatar_url ?? null,
        kind: "program_day",
        title: "Nutrition logged",
        detail: draft.name,
        item_slug: "nutrition",
      });
    }
    return { ok: true };
  });

export const deleteLogEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("food_log_entries")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Custom foods ----------
const customFoodInput = z.object({
  name: z.string().min(1).max(120),
  kcal_per_100g: z.number().min(0),
  protein_g_per_100g: z.number().min(0).default(0),
  carbs_g_per_100g: z.number().min(0).default(0),
  fat_g_per_100g: z.number().min(0).default(0),
  serving_size_g: z.number().positive().nullable().optional(),
});
export const createCustomFood = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => customFoodInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("custom_foods")
      .insert({ ...data, user_id: userId, serving_size_g: data.serving_size_g ?? null })
      .select("id")
      .single();
    if (error) throw error;
    return { id: row.id };
  });

// ---------- Targets ----------
export const getTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<NutritionTargets | null> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("nutrition_targets")
      .select("kcal,protein_g,carbs_g,fat_g")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      kcal: data.kcal != null ? Number(data.kcal) : null,
      protein_g: data.protein_g != null ? Number(data.protein_g) : null,
      carbs_g: data.carbs_g != null ? Number(data.carbs_g) : null,
      fat_g: data.fat_g != null ? Number(data.fat_g) : null,
    };
  });

const targetsInput = z.object({
  kcal: z.number().min(0).nullable(),
  protein_g: z.number().min(0).nullable(),
  carbs_g: z.number().min(0).nullable(),
  fat_g: z.number().min(0).nullable(),
});
export const upsertTargets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => targetsInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("nutrition_targets")
      .upsert(
        { user_id: userId, ...data, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
    if (error) throw error;
    return { ok: true };
  });

// ---------- Per-day target overrides ----------
export const getDayTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) => z.object({ date: z.string() }).parse(d))
  .handler(async ({ data, context }): Promise<NutritionTargets | null> => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("nutrition_targets_daily")
      .select("kcal,protein_g,carbs_g,fat_g")
      .eq("user_id", userId)
      .eq("target_date", data.date)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    return {
      kcal: row.kcal != null ? Number(row.kcal) : null,
      protein_g: row.protein_g != null ? Number(row.protein_g) : null,
      carbs_g: row.carbs_g != null ? Number(row.carbs_g) : null,
      fat_g: row.fat_g != null ? Number(row.fat_g) : null,
    };
  });

const dayTargetsInput = targetsInput.extend({ date: z.string() });
export const upsertDayTargets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => dayTargetsInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("nutrition_targets_daily").upsert(
      {
        user_id: userId,
        target_date: data.date,
        kcal: data.kcal,
        protein_g: data.protein_g,
        carbs_g: data.carbs_g,
        fat_g: data.fat_g,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,target_date" },
    );
    if (error) throw error;
    return { ok: true };
  });

export const deleteDayTargets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string }) => z.object({ date: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("nutrition_targets_daily")
      .delete()
      .eq("user_id", userId)
      .eq("target_date", data.date);
    if (error) throw error;
    return { ok: true };
  });
