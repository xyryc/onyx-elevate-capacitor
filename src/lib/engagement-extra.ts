import { supabase } from "@/integrations/supabase/client";

// ---------- Activity feed (read-only community) ----------
export type ActivityKind =
  | "program_day"
  | "program_started"
  | "program_complete"
  | "challenge_joined"
  | "challenge_complete"
  | "streak_milestone"
  | "review_posted";

export interface ActivityEvent {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  kind: ActivityKind;
  title: string;
  detail: string | null;
  item_slug: string | null;
  created_at: string;
}

async function currentUserSnapshot() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data: prof } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", u.user.id)
    .maybeSingle();
  return {
    user_id: u.user.id,
    display_name:
      prof?.display_name ??
      (u.user.user_metadata as any)?.full_name ??
      u.user.email?.split("@")[0] ??
      "Athlete",
    avatar_url: prof?.avatar_url ?? (u.user.user_metadata as any)?.avatar_url ?? null,
  };
}

export async function logActivity(input: {
  kind: ActivityKind;
  title: string;
  detail?: string;
  item_slug?: string;
}) {
  const snap = await currentUserSnapshot();
  if (!snap) return;
  await supabase.from("activity_events").insert({
    user_id: snap.user_id,
    display_name: snap.display_name,
    avatar_url: snap.avatar_url,
    kind: input.kind,
    title: input.title,
    detail: input.detail ?? null,
    item_slug: input.item_slug ?? null,
  });
}

export async function grantDailyStreak(input: {
  title: string;
  detail?: string;
  item_slug?: string;
}) {
  const snap = await currentUserSnapshot();
  if (!snap) return false;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const { data: todayLog } = await supabase
    .from("activity_events")
    .select("id")
    .eq("user_id", snap.user_id)
    .eq("kind", "program_day")
    .gte("created_at", startOfToday.toISOString())
    .limit(1)
    .maybeSingle();

  if (todayLog) return false;
  await supabase.from("activity_events").insert({
    user_id: snap.user_id,
    display_name: snap.display_name,
    avatar_url: snap.avatar_url,
    kind: "program_day",
    title: input.title,
    detail: input.detail ?? null,
    item_slug: input.item_slug ?? null,
  });
  return true;
}

export async function listActivityFeed(limit = 50): Promise<ActivityEvent[]> {
  // Uses a SECURITY DEFINER RPC that returns only feed-safe columns.
  // The base table restricts direct SELECT to the row owner.
  const { data, error } = await supabase.rpc("get_activity_feed", { feed_limit: limit });
  if (error) throw error;
  return ((data ?? []) as Array<Omit<ActivityEvent, "user_id">>).map((r) => ({
    ...r,
    user_id: "",
  })) as ActivityEvent[];
}

// ---------- Leaderboards ----------
export interface LeaderboardRow {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  progress: number;
  completed_at: string | null;
  joined_at: string;
}

export async function listChallengeLeaderboard(challenge_slug: string, limit = 25) {
  // SECURITY DEFINER RPC, base table SELECT is restricted to the row owner.
  const { data, error } = await supabase.rpc("get_challenge_leaderboard", {
    slug: challenge_slug,
    lim: limit,
  });
  if (error) throw error;
  return (data ?? []) as LeaderboardRow[];
}

// ---------- Body measurements ----------
export interface MeasurementRow {
  id: string;
  measured_on: string;
  weight_kg: number | null;
  body_fat_pct: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arms_cm: number | null;
  thighs_cm: number | null;
  notes: string | null;
  created_at: string;
}

export async function listMeasurements() {
  const { data, error } = await supabase
    .from("body_measurements")
    .select("*")
    .order("measured_on", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MeasurementRow[];
}

export async function addMeasurement(input: Partial<MeasurementRow>) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to log measurements.");
  const { error } = await supabase.from("body_measurements").insert({
    user_id: u.user.id,
    measured_on: input.measured_on || new Date().toISOString().slice(0, 10),
    weight_kg: input.weight_kg ?? null,
    body_fat_pct: input.body_fat_pct ?? null,
    waist_cm: input.waist_cm ?? null,
    chest_cm: input.chest_cm ?? null,
    arms_cm: input.arms_cm ?? null,
    thighs_cm: input.thighs_cm ?? null,
    notes: input.notes ?? null,
  });
  if (error) throw error;
  grantDailyStreak({
    title: "Body check-in logged",
    detail: "Measurements updated",
    item_slug: "measurements",
  }).catch(() => {});
}

export async function deleteMeasurement(id: string) {
  await supabase.from("body_measurements").delete().eq("id", id);
}
