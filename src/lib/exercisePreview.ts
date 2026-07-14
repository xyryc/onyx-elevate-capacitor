// Free-tier preview gate for the exercise library.
// Every category exposes the first N exercises for free (even without a
// membership). A given exercise can only count as "free" in ONE category —
// e.g. a push-up that lives in both Chest and Triceps won't be free in both;
// it fills the Chest quota, and Triceps picks a different free exercise.

import { exercises, type Exercise } from "@/data/exercises";

export const FREE_PREVIEW_PER_CATEGORY = 5;

// Precompute once at module load. Stable order = same on server and client.
const freeSlugs: Set<string> = (() => {
  const counts = new Map<string, number>();
  const set = new Set<string>();
  for (const e of exercises) {
    // Skip if this exercise is already free from another category — avoids
    // "same exercise unlocked twice" (chest push-up also unlocking triceps).
    if (set.has(e.slug)) continue;
    const n = counts.get(e.category) ?? 0;
    if (n < FREE_PREVIEW_PER_CATEGORY) {
      set.add(e.slug);
      counts.set(e.category, n + 1);
    }
  }
  return set;
})();

export function isFreePreviewExercise(e: Pick<Exercise, "slug">): boolean {
  return freeSlugs.has(e.slug);
}

