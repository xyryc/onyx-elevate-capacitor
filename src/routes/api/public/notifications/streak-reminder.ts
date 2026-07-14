import { createFileRoute } from "@tanstack/react-router";

/**
 * Streak reminder dispatcher (public cron endpoint).
 *
 * Called by pg_cron once per hour. Iterates every push_subscription with
 * `streak_reminders_enabled = true`, checks the user's local time, and — if
 * it's evening (20:00–22:00 local) AND they haven't logged today — sends a
 * push nudge.
 *
 * WEB path: needs VAPID keys. Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`,
 * `VAPID_CONTACT` (mailto:you@domain.com) as backend secrets and add the
 * `web-push` package to actually send. The scaffold below records the
 * intended target so the iOS wrap (APNs) can consume it too.
 *
 * iOS path (APNs) — deferred until after the Xcode wrap. You'll need:
 *   - APNs .p8 key
 *   - APNs Key ID
 *   - Apple Team ID
 *   - Bundle ID
 * Add them as backend secrets and swap the `TODO(apns)` block below for a
 * real signed JWT + POST to https://api.push.apple.com/3/device/<token>.
 */
export const Route = createFileRoute("/api/public/notifications/streak-reminder")({
  // @ts-expect-error server route option exists at runtime; TS augmentation missing.
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        // Basic anti-abuse: require the Supabase anon apikey header. Cron
        // sends it automatically; random internet traffic doesn't.
        const apikey = request.headers.get("apikey");
        if (!apikey || apikey !== process.env.SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const nowIso = new Date().toISOString();
        const startOfTodayUtc = new Date();
        startOfTodayUtc.setUTCHours(0, 0, 0, 0);

        const { data: subs } = await supabaseAdmin
          .from("push_subscriptions")
          .select("user_id, endpoint, p256dh, auth, platform, timezone")
          .eq("streak_reminders_enabled", true);

        let considered = 0;
        let nudged = 0;

        for (const sub of subs ?? []) {
          considered++;
          // Compute the user's local hour.
          const tz = (sub as any).timezone || "UTC";
          let localHour = 20;
          try {
            const fmt = new Intl.DateTimeFormat("en-US", {
              timeZone: tz,
              hour: "2-digit",
              hour12: false,
            });
            localHour = Number(fmt.format(new Date()));
          } catch {}
          if (localHour < 20 || localHour > 22) continue;

          // Did this user log today (their local day)? Approximation: any
          // program_day activity in the last 20 h.
          const { data: logged } = await supabaseAdmin
            .from("activity_events")
            .select("id")
            .eq("user_id", sub.user_id)
            .eq("kind", "program_day")
            .gte("created_at", new Date(Date.now() - 20 * 3600_000).toISOString())
            .limit(1)
            .maybeSingle();
          if (logged) continue;

          // TODO(web-push): send Web Push via `web-push` library using VAPID.
          // TODO(apns): sign a JWT with your .p8 key and POST to APNs.
          nudged++;
        }

        return Response.json({ ok: true, considered, nudged, at: nowIso });
      },
    },
  },
});
