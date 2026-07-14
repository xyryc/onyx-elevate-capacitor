// Lightweight client-side unlock flags for one-time purchases.
// Stores: individual meal-plan unlocks, individual program unlocks, and the
// All Access bundle (which grants everything forever).
// Note: presentation-level only. Sensitive content should be gated server-side
// once user accounts ship.

const KEY = "onyx_unlocks_v2";
export const BUNDLE_KEY = "__all_access__";
export const BUNDLE_PRICE_BRL = 299;
export const BUNDLE_PRICE_ID = "all_access_one_time";
export const PROGRAM_PRICE_BRL = 29.99;
export const PROGRAM_PRICE_ID = "program_premium_one_time";

type Store = Record<string, true>;

function read(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function isBundleUnlocked(): boolean {
  return Boolean(read()[BUNDLE_KEY]);
}

export function unlockBundle(): void {
  const s = read();
  s[BUNDLE_KEY] = true;
  write(s);
}

export function isPlanUnlocked(slug: string): boolean {
  const s = read();
  return Boolean(s[BUNDLE_KEY] || s[`plan:${slug}`] || s[slug]);
}

export function unlockPlan(slug: string): void {
  const s = read();
  s[`plan:${slug}`] = true;
  write(s);
}

export function isProgramUnlocked(slug: string): boolean {
  const s = read();
  return Boolean(s[BUNDLE_KEY] || s[`program:${slug}`]);
}

export function unlockProgram(slug: string): void {
  const s = read();
  s[`program:${slug}`] = true;
  write(s);
}

/** Handle any checkout success slug, bundle, plan:<slug>, or program:<slug>. */
export function unlockFromSuccessSlug(slug: string): void {
  if (slug === BUNDLE_KEY || slug === "all-access" || slug === "bundle" || slug === "all_access_lifetime" || slug === "all_access_monthly" || slug === "all_access_yearly") {
    unlockBundle();
    return;
  }
  if (slug.startsWith("program:")) {
    unlockProgram(slug.slice("program:".length));
    return;
  }
  if (slug.startsWith("plan:")) {
    unlockPlan(slug.slice("plan:".length));
    return;
  }
  // legacy: bare slug = meal plan
  unlockPlan(slug);
}

/**
 * Clear all locally-stored unlock flags. Called on sign-out so a shared browser
 * doesn't keep another user's purchases visible as "unlocked".
 */
export function clearAllUnlocks(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(KEY); } catch { /* noop */ }
}

