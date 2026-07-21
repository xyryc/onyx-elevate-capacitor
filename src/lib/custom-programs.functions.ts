import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CustomExercise = {
  exerciseSlug: string;
  exerciseName: string;
  sets?: string;
  reps?: string;
  rpe?: string;
  rest?: string;
  tempo?: string;
  notes?: string;
};

export type CustomDay = {
  name: string;
  exercises: CustomExercise[];
};

export type CustomWeek = {
  name: string;
  days: CustomDay[];
};

export type CustomProgram = {
  id: string;
  name: string;
  weeks: CustomWeek[];
  created_at: string;
  updated_at: string;
};

export const listCustomPrograms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CustomProgram[]> => {
    const { data, error } = await context.supabase
      .from("custom_programs")
      .select("id, name, weeks, created_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.name,
      weeks: (r.weeks ?? []) as CustomWeek[],
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  });

export const getCustomProgram = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }): Promise<CustomProgram | null> => {
    const { data: row, error } = await context.supabase
      .from("custom_programs")
      .select("id, name, weeks, created_at, updated_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    const r: any = row;
    return {
      id: r.id,
      name: r.name,
      weeks: (r.weeks ?? []) as CustomWeek[],
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  });

export const createCustomProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name?: string; daysPerWeek?: number; weeks?: number }) => d)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const dpw = Math.max(1, Math.min(7, data.daysPerWeek ?? 4));
    const wc = Math.max(1, Math.min(24, data.weeks ?? 1));
    const buildWeek = (wi: number): CustomWeek => ({
      name: `Week ${wi + 1}`,
      days: Array.from({ length: dpw }, (_, di) => ({
        name: `Day ${di + 1}`,
        exercises: [],
      })),
    });
    const payload: any = {
      user_id: context.userId,
      name: data.name?.trim() || "Untitled Program",
      weeks: Array.from({ length: wc }, (_, i) => buildWeek(i)),
    };
    const { data: row, error } = await context.supabase
      .from("custom_programs")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    return { id: (row as any).id };
  });

export const updateCustomProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; name: string; weeks: CustomWeek[] }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("custom_programs")
      .update({ name: data.name, weeks: data.weeks as any })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteCustomProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("custom_programs").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// Read a custom program by id ignoring owner RLS, used for chat-shared programs.
// Requires an authenticated (Pro) viewer. Returns name + weeks but NOT user_id.
export const getSharedCustomProgram = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data }): Promise<CustomProgram | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("custom_programs")
      .select("id, name, weeks, created_at, updated_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    const r: any = row;
    return {
      id: r.id,
      name: r.name,
      weeks: (r.weeks ?? []) as CustomWeek[],
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  });

// Clone a shared program into the current user's library.
export const cloneCustomProgram = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: src, error: readErr } = await supabaseAdmin
      .from("custom_programs")
      .select("name, weeks")
      .eq("id", data.id)
      .maybeSingle();
    if (readErr) throw readErr;
    if (!src) throw new Error("Program not found");
    const payload: any = {
      user_id: context.userId,
      name: `${(src as any).name} (copy)`,
      weeks: (src as any).weeks ?? [],
    };
    const { data: row, error } = await context.supabase
      .from("custom_programs")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    return { id: (row as any).id };
  });

export const getBuilderAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({
      context,
    }): Promise<{ hasAccess: boolean; reason: "subscription" | "bundle" | null }> => {
      const nowIso = new Date().toISOString();

      // 1) Active subscription (monthly or yearly) grants access.
      const { data: subs } = await context.supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(5);

      const hasSub = (subs ?? []).some((s: any) => {
        const status = String(s.status ?? "");
        const endsAt = s.current_period_end ? new Date(s.current_period_end).toISOString() : null;
        const stillInPeriod = !endsAt || endsAt > nowIso;
        if (["active", "trialing", "past_due"].includes(status) && stillInPeriod) return true;
        if (status === "canceled" && endsAt && endsAt > nowIso) return true;
        return false;
      });
      if (hasSub) return { hasAccess: true, reason: "subscription" };

      // 2) Lifetime / All-Access bundle one-time purchase grants access.
      const { data: purchases } = await context.supabase
        .from("purchases")
        .select("product_kind, product_slug")
        .eq("user_id", context.userId);

      const hasBundle = (purchases ?? []).some((p: any) => {
        if (p.product_kind === "bundle") return true;
        const slug = String(p.product_slug ?? "").toLowerCase();
        return (
          slug.includes("lifetime") ||
          slug.includes("all_access") ||
          slug.includes("all-access") ||
          slug === "bundle"
        );
      });
      if (hasBundle) return { hasAccess: true, reason: "bundle" };

      return { hasAccess: false, reason: null };
    },
  );
