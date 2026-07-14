import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const POLL_MS = 20_000;

function makeId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch { /* noop */ }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function localKey(userId: string) {
  return `onyx.session.${userId}`;
}

function getLocalSessionId(userId: string): string {
  try {
    const existing = localStorage.getItem(localKey(userId));
    if (existing) return existing;
  } catch { /* noop */ }
  const fresh = makeId();
  try { localStorage.setItem(localKey(userId), fresh); } catch { /* noop */ }
  return fresh;
}

async function claimSession(userId: string, sessionId: string) {
  // deno-lint-ignore no-explicit-any
  await (supabase.from("profiles") as any)
    .update({ active_session_id: sessionId, active_session_at: new Date().toISOString() })
    .eq("id", userId);
}

async function checkSession(userId: string, sessionId: string): Promise<"ok" | "kicked"> {
  const { data, error } = await supabase
    .from("profiles")
    // deno-lint-ignore no-explicit-any
    .select("active_session_id" as any)
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return "ok";
  // deno-lint-ignore no-explicit-any
  const remote = (data as any).active_session_id as string | null;
  if (remote && remote !== sessionId) return "kicked";
  return "ok";
}

/**
 * Enforces one active browser session per account.
 * When someone signs in elsewhere, older sessions are auto-signed-out.
 */
export function useSingleSession() {
  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;

    async function startForUser(userId: string) {
      const sessionId = getLocalSessionId(userId);
      // Claim on entry so this becomes the active session.
      await claimSession(userId, sessionId);
      if (cancelled) return;

      const tick = async () => {
        try {
          const status = await checkSession(userId, sessionId);
          if (status === "kicked") {
            if (interval) { clearInterval(interval); interval = null; }
            try { localStorage.removeItem(localKey(userId)); } catch { /* noop */ }
            toast.error("Signed out, this account was opened on another device.");
            await supabase.auth.signOut();
          }
        } catch { /* ignore transient errors */ }
      };
      interval = setInterval(tick, POLL_MS);
    }

    function stop() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const uid = data.session?.user?.id;
      if (uid) void startForUser(uid);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      const uid = session?.user?.id;
      if (evt === "SIGNED_IN" && uid) {
        stop();
        // New sign-in on this browser: mint a fresh session id so it
        // supersedes any other device currently signed into this account.
        try { localStorage.removeItem(localKey(uid)); } catch { /* noop */ }
        void startForUser(uid);
      } else if (evt === "SIGNED_OUT") {
        stop();
      }
    });

    return () => {
      cancelled = true;
      stop();
      sub.subscription.unsubscribe();
    };
  }, []);
}
