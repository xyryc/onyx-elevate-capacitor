import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Streak reminder push subscription.
 *
 * Web layer only: registers a Service Worker and stores the PushSubscription
 * in `public.push_subscriptions`. iOS native (APNs) will be added when the
 * app is wrapped in Xcode — this hook already stores the platform tag so the
 * native layer can flip `platform = 'ios'` without changing the schema.
 *
 * Sending the actual push is handled by a cron-triggered server route (see
 * `/api/public/notifications/streak-reminder`).
 */
export type PushStatus = "unsupported" | "denied" | "granted" | "default" | "loading";

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as PushStatus);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const subscribe = useCallback(async () => {
    if (typeof window === "undefined") return;
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      setStatus(perm as PushStatus);
      if (perm !== "granted") return;

      const reg = await navigator.serviceWorker.register("/sw-push.js");
      await navigator.serviceWorker.ready;

      // Note: Real Web Push needs a VAPID application server key. When you're
      // ready, add VITE_VAPID_PUBLIC_KEY and switch to `applicationServerKey`.
      // For now we still register a subscription record so the toggle sticks
      // and the streak reminder can be sent via a native path (APNs) once
      // wrapped.
      let sub: PushSubscription | null = null;
      try {
        const vapid = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ?? "";
        const opts: PushSubscriptionOptionsInit = { userVisibleOnly: true };
        if (vapid) opts.applicationServerKey = urlBase64ToUint8Array(vapid).buffer as ArrayBuffer;
        sub = await reg.pushManager.subscribe(opts);
      } catch {
        // Push subscribe requires VAPID on most browsers — fall through and
        // still record the intent so we can nudge the user another way.
        sub = null;
      }

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
      const endpoint = sub?.endpoint ?? `pending:${u.user.id}`;
      const keys = sub ? (sub.toJSON().keys ?? {}) : {};

      await supabase.from("push_subscriptions").upsert(
        {
          user_id: u.user.id,
          endpoint,
          p256dh: (keys as any).p256dh ?? null,
          auth: (keys as any).auth ?? null,
          platform: "web",
          timezone: tz,
          streak_reminders_enabled: true,
        },
        { onConflict: "user_id,endpoint" },
      );
    } finally {
      setBusy(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      await supabase
        .from("push_subscriptions")
        .update({ streak_reminders_enabled: false })
        .eq("user_id", u.user.id);
    } finally {
      setBusy(false);
    }
  }, []);

  return { status, busy, subscribe, disable, refresh };
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
