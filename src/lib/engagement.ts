import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/components/DatePickerRow";

export type FavoriteType = "program" | "exercise" | "recipe" | "meal-plan" | "challenge";

export async function listFavorites() {
  const { data, error } = await supabase
    .from("favorites")
    .select("item_type, item_slug, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function toggleFavorite(
  item_type: FavoriteType,
  item_slug: string,
  currentlyFav: boolean,
) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to save favorites.");
  if (currentlyFav) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("item_type", item_type)
      .eq("item_slug", item_slug);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: u.user.id, item_type, item_slug });
  if (error) throw error;
  const { grantDailyStreak } = await import("./engagement-extra");
  grantDailyStreak({
    title: "Saved progress",
    detail: `${item_type}: ${item_slug.replace(/-/g, " ")}`,
    item_slug,
  }).catch(() => {});
  return true;
}

// ---------- Reviews ----------
export interface ReviewRow {
  id: string;
  product_kind: string;
  product_slug: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
}

export async function listReviews(product_slug: string, product_kind = "program") {
  const { data, error } = await supabase
    .from("reviews")
    .select("id,product_kind,product_slug,rating,title,body,created_at")
    .eq("product_kind", product_kind)
    .eq("product_slug", product_slug)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Omit<ReviewRow, "user_id">[];
}

export async function getMyReview(product_slug: string, product_kind = "program") {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase
    .from("reviews")
    .select("id,product_kind,product_slug,rating,title,body,created_at")
    .eq("user_id", u.user.id)
    .eq("product_kind", product_kind)
    .eq("product_slug", product_slug)
    .maybeSingle();
  return (data as Omit<ReviewRow, never> | null) ?? null;
}

export async function upsertReview(input: {
  product_slug: string;
  product_kind?: string;
  rating: number;
  title?: string;
  body?: string;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to leave a review.");
  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: u.user.id,
      product_kind: input.product_kind ?? "program",
      product_slug: input.product_slug,
      rating: input.rating,
      title: input.title ?? null,
      body: input.body ?? null,
    },
    { onConflict: "user_id,product_kind,product_slug" },
  );
  if (error) throw error;
  const { grantDailyStreak } = await import("./engagement-extra");
  grantDailyStreak({
    title: "Review added",
    detail: input.product_slug.replace(/-/g, " "),
    item_slug: input.product_slug,
  }).catch(() => {});
}

export async function deleteMyReview(product_slug: string, product_kind = "program") {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  await supabase
    .from("reviews")
    .delete()
    .eq("user_id", u.user.id)
    .eq("product_kind", product_kind)
    .eq("product_slug", product_slug);
}

// ---------- Program progress ----------
export interface ProgressRow {
  user_id: string;
  program_slug: string;
  completed_days: string[];
  current_week: number;
  started_at: string;
  last_active_at: string;
}

export type DayCompleteResult = {
  completedDays: string[];
  loggedToday: boolean;
  alreadyLoggedToday: boolean;
};

export async function getProgress(program_slug: string) {
  const { data, error } = await supabase
    .from("program_progress")
    .select("*")
    .eq("program_slug", program_slug)
    .maybeSingle();
  if (error) throw error;
  return data as ProgressRow | null;
}

export async function listAllProgress() {
  const { data, error } = await supabase
    .from("program_progress")
    .select("*")
    .order("last_active_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProgressRow[];
}

/**
 * Mark a day complete. One-way: cannot be un-done (prevents cheating the streak).
 * Marks the selected program day immediately. Streak/activity rewards are still
 * limited to ONE real calendar day per user, so spam-tapping days cannot farm streaks.
 */
export async function markDayComplete(program_slug: string, dayKey: string, workoutTitle?: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to track progress.");

  const existing = await getProgress(program_slug);
  const set = new Set(existing?.completed_days ?? []);
  if (set.has(dayKey)) {
    return Array.from(set);
  }

  // Always mark the day in program_progress so the checkmark shows.
  set.add(dayKey);
  const payload = {
    user_id: u.user.id,
    program_slug,
    completed_days: Array.from(set),
    current_week: existing?.current_week ?? 1,
    last_active_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("program_progress")
    .upsert(payload, { onConflict: "user_id,program_slug" });
  if (error) throw error;

  const { grantDailyStreak } = await import("./engagement-extra");
  grantDailyStreak({
    title: workoutTitle ? `Trained: ${workoutTitle}` : `Completed ${dayKey.replace(/-/g, " ")}`,
    detail: `Program: ${program_slug.replace(/-/g, " ")}`,
    item_slug: program_slug,
  }).catch(() => {});

  return payload.completed_days;
}

export async function getLoggedTrainingToday() {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("activity_events")
    .select("id,title,item_slug,created_at")
    .eq("user_id", u.user.id)
    .eq("kind", "program_day")
    .gte("created_at", startOfToday.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function markSingleTrainingDayComplete(
  program_slug: string,
  dayKey: string,
  workoutTitle?: string,
): Promise<DayCompleteResult> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to track progress.");

  const existingToday = await getLoggedTrainingToday();
  // Always mark the day itself (visual checkmark + progress). The one-log-per-day
  // rule only gates the streak/activity event, which markDayComplete handles internally.
  const completedDays = await markDayComplete(
    program_slug,
    dayKey || `log-${todayISO()}`,
    workoutTitle,
  );
  return {
    completedDays,
    loggedToday: true,
    alreadyLoggedToday: Boolean(existingToday),
  };
}

/** @deprecated use markDayComplete, kept temporarily for old call-sites */
export const toggleDayComplete = markDayComplete;

/**
 * Freely set a day's completion state. No streak/reward side effects, no daily gate.
 * Use for custom user-built programs where marking is just a personal checkbox.
 */
export async function setDayCompletion(program_slug: string, dayKey: string, done: boolean) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to track progress.");
  const existing = await getProgress(program_slug);
  const set = new Set(existing?.completed_days ?? []);
  if (done) set.add(dayKey);
  else set.delete(dayKey);
  const payload = {
    user_id: u.user.id,
    program_slug,
    completed_days: Array.from(set),
    current_week: existing?.current_week ?? 1,
    last_active_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("program_progress")
    .upsert(payload, { onConflict: "user_id,program_slug" });
  if (error) throw error;
  if (done) {
    const { grantDailyStreak } = await import("./engagement-extra");
    grantDailyStreak({
      title: "Training day checked off",
      detail: program_slug.replace(/-/g, " "),
      item_slug: program_slug,
    }).catch(() => {});
  }
  return payload.completed_days;
}

/** Remove a program from the user's library, deletes their progress row. */
export async function deleteProgramProgress(program_slug: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in required.");
  const { error } = await supabase
    .from("program_progress")
    .delete()
    .eq("user_id", u.user.id)
    .eq("program_slug", program_slug);
  if (error) throw error;
}

/** Pull the user's training log entries for the calendar view. */
export async function listMyTrainingLog(daysBack = 120) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const { data, error } = await supabase
    .from("activity_events")
    .select("created_at, title, detail, item_slug")
    .eq("user_id", u.user.id)
    .eq("kind", "program_day")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as {
    created_at: string;
    title: string;
    detail: string | null;
    item_slug: string | null;
  }[];
}

// ---------- Challenges ----------
export interface ChallengeParticipant {
  user_id: string;
  challenge_slug: string;
  joined_at: string;
  progress: number;
  completed_at: string | null;
}

export async function listMyChallenges() {
  const { data, error } = await supabase
    .from("challenge_participants")
    .select("*")
    .order("joined_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ChallengeParticipant[];
}

export async function joinChallenge(challenge_slug: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to join a challenge.");

  // Enforce max 3 active (not-yet-completed) challenges so athletes stay focused
  // instead of joining every challenge at once and cheating streaks.
  const { data: active } = await supabase
    .from("challenge_participants")
    .select("challenge_slug, completed_at")
    .eq("user_id", u.user.id)
    .is("completed_at", null);
  const activeSlugs = new Set((active ?? []).map((r: any) => r.challenge_slug));
  if (!activeSlugs.has(challenge_slug) && activeSlugs.size >= 3) {
    throw new Error(
      "You can only run 3 challenges at once. Finish or leave one before joining another.",
    );
  }

  const { data: prof } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", u.user.id)
    .maybeSingle();
  const display_name =
    prof?.display_name ??
    (u.user.user_metadata as any)?.full_name ??
    u.user.email?.split("@")[0] ??
    "Athlete";
  const avatar_url = prof?.avatar_url ?? (u.user.user_metadata as any)?.avatar_url ?? null;
  const { error } = await supabase
    .from("challenge_participants")
    .upsert(
      { user_id: u.user.id, challenge_slug, progress: 0, display_name, avatar_url },
      { onConflict: "user_id,challenge_slug" },
    );
  if (error) throw error;
  const { logActivity, grantDailyStreak } = await import("./engagement-extra");
  logActivity({
    kind: "challenge_joined",
    title: `Joined a challenge`,
    detail: challenge_slug.replace(/-/g, " "),
    item_slug: challenge_slug,
  }).catch(() => {});
  grantDailyStreak({
    title: "Challenge joined",
    detail: challenge_slug.replace(/-/g, " "),
    item_slug: challenge_slug,
  }).catch(() => {});
}

export async function bumpChallengeProgress(challenge_slug: string, totalDays: number, delta = 1) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in.");
  const { data: cur } = await supabase
    .from("challenge_participants")
    .select("progress, completed_at")
    .eq("challenge_slug", challenge_slug)
    .maybeSingle();
  const wasComplete = !!cur?.completed_at;
  const next = Math.max(0, Math.min(totalDays, (cur?.progress ?? 0) + delta));
  const completed_at = next >= totalDays ? new Date().toISOString() : null;
  await supabase
    .from("challenge_participants")
    .upsert(
      { user_id: u.user.id, challenge_slug, progress: next, completed_at },
      { onConflict: "user_id,challenge_slug" },
    );

  const { logActivity, grantDailyStreak } = await import("./engagement-extra");
  if (delta > 0) {
    grantDailyStreak({
      title: `Challenge day logged`,
      detail: challenge_slug.replace(/-/g, " "),
      item_slug: challenge_slug,
    }).catch(() => {});
  }
  if (!wasComplete && completed_at) {
    logActivity({
      kind: "challenge_complete",
      title: `Finished the ${challenge_slug.replace(/-/g, " ")} challenge`,
      detail: `${totalDays} days complete`,
      item_slug: challenge_slug,
    }).catch(() => {});
  }
  return next;
}

export async function leaveChallenge(challenge_slug: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in required.");
  await supabase
    .from("challenge_participants")
    .delete()
    .eq("challenge_slug", challenge_slug)
    .eq("user_id", u.user.id);
}
