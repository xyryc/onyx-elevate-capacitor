import { supabase } from "@/integrations/supabase/client";

// ---------- Fasting plan ----------
export interface FastingPlan {
  id: string;
  user_id: string;
  plan_key: string; // "16:8" | "12:12" | "14:10" | "custom"
  fast_hours: number;
  eat_hours: number;
  start_time: string; // HH:MM (fast start)
  end_time: string;   // HH:MM (fast end)
  weekly_days: number[]; // 0=Sun..6=Sat
  reminders_enabled: boolean;
  active: boolean;
}

export async function getFastingPlan(): Promise<FastingPlan | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await supabase
    .from("fasting_plans")
    .select("*")
    .eq("user_id", u.user.id)
    .maybeSingle();
  if (error) throw error;
  return (data as FastingPlan | null) ?? null;
}

export async function upsertFastingPlan(input: Partial<FastingPlan>) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to save your fasting plan.");
  const payload = {
    user_id: u.user.id,
    plan_key: input.plan_key ?? "16:8",
    fast_hours: input.fast_hours ?? 16,
    eat_hours: input.eat_hours ?? 8,
    start_time: input.start_time ?? "20:00",
    end_time: input.end_time ?? "12:00",
    weekly_days: input.weekly_days ?? [0, 1, 2, 3, 4, 5, 6],
    reminders_enabled: input.reminders_enabled ?? true,
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("fasting_plans")
    .upsert(payload, { onConflict: "user_id" });
  if (error) throw error;
}

export async function deleteFastingPlan() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase.from("fasting_plans").delete().eq("user_id", u.user.id);
}

// ---------- Daily notes ----------
export interface DailyNote {
  id: string;
  note_date: string;
  content: string;
}

export async function getDailyNote(date: string): Promise<DailyNote | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await supabase
    .from("daily_notes")
    .select("id,note_date,content")
    .eq("user_id", u.user.id)
    .eq("note_date", date)
    .maybeSingle();
  if (error) throw error;
  return (data as DailyNote | null) ?? null;
}

export async function upsertDailyNote(date: string, content: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to save notes.");
  if (!content.trim()) {
    await supabase.from("daily_notes").delete().eq("user_id", u.user.id).eq("note_date", date);
    return;
  }
  const { error } = await supabase
    .from("daily_notes")
    .upsert(
      { user_id: u.user.id, note_date: date, content, updated_at: new Date().toISOString() },
      { onConflict: "user_id,note_date" },
    );
  if (error) throw error;
}
