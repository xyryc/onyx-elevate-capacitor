import { supabase } from "@/integrations/supabase/client";

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null;
  daysThisWeek: number;
};

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getMyStreak(): Promise<StreakInfo> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) {
    return { currentStreak: 0, longestStreak: 0, lastLoggedDate: null, daysThisWeek: 0 };
  }

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 180);

  const { data, error } = await supabase
    .from("activity_events")
    .select("created_at")
    .eq("user_id", u.user.id)
    .eq("kind", "program_day")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;

  const dayKeys = Array.from(
    new Set((data ?? []).map((row) => localDateKey(new Date(row.created_at as string)))),
  ).sort();
  const daySet = new Set(dayKeys);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  for (
    let cursor = new Date(today);
    daySet.has(localDateKey(cursor));
    cursor.setDate(cursor.getDate() - 1)
  ) {
    currentStreak += 1;
  }

  let longestStreak = 0;
  let run = 0;
  let previous: Date | null = null;
  for (const key of dayKeys) {
    const current = new Date(`${key}T00:00:00`);
    if (previous) {
      const diffDays = Math.round((current.getTime() - previous.getTime()) / 86400000);
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longestStreak = Math.max(longestStreak, run);
    previous = current;
  }

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const daysThisWeek = dayKeys.filter((key) => new Date(`${key}T00:00:00`) >= weekStart).length;

  return {
    currentStreak,
    longestStreak,
    lastLoggedDate: dayKeys.at(-1) ?? null,
    daysThisWeek,
  };
}

/** Returns 7 booleans (Mon..Sun) — did the user log a training day that weekday of the current ISO week? */
export async function getThisWeekLoggedDays(): Promise<boolean[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [false, false, false, false, false, false, false];

  const now = new Date();
  // Monday of this ISO week (local)
  const day = now.getDay(); // 0=Sun, 1=Mon..6=Sat
  const diffToMon = (day + 6) % 7;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diffToMon);

  const { data } = await supabase
    .from("activity_events")
    .select("created_at")
    .eq("user_id", u.user.id)
    .eq("kind", "program_day")
    .gte("created_at", monday.toISOString());

  const flags = [false, false, false, false, false, false, false];
  for (const r of data ?? []) {
    const d = new Date(r.created_at as string);
    const idx = (d.getDay() + 6) % 7;
    flags[idx] = true;
  }
  return flags;
}

/** Returns local-date keys for explicit profile check-ins only. Workouts do not pre-check the button. */
export async function getRecentCheckInDays(daysBack = 30, daysForward = 7): Promise<string[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysBack);

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  end.setDate(end.getDate() + daysForward);

  const { data, error } = await supabase
    .from("activity_events")
    .select("created_at")
    .eq("user_id", u.user.id)
    .eq("kind", "program_day")
    .eq("item_slug", "daily-checkin")
    .gte("created_at", start.toISOString())
    .lte("created_at", end.toISOString());
  if (error) throw error;

  return Array.from(
    new Set((data ?? []).map((row) => localDateKey(new Date(row.created_at as string)))),
  );
}
