import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  getDeviceHash,
  getDeviceLabel,
  getRememberDevice,
  markDeviceVerifiedInSession,
} from "@/lib/device";
import { ensureDeviceTrusted, verifyDeviceCode } from "@/lib/device.functions";

export const Route = createFileRoute("/verify-device")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: VerifyDevicePage,
  head: () => ({
    meta: [{ title: "Verify this device · Onyx Elevate" }, { name: "robots", content: "noindex" }],
  }),
});

function VerifyDevicePage() {
  const { redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const ensureFn = useServerFn(ensureDeviceTrusted);
  const verifyFn = useServerFn(verifyDeviceCode);

  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ensureFn({
          data: { deviceHash: getDeviceHash(), deviceLabel: getDeviceLabel() },
        });
        if (cancelled) return;
        if (res.trusted) {
          const { data } = await supabase.auth.getUser();
          if (data.user) markDeviceVerifiedInSession(data.user.id);
          navigate({ to: (redirectTo as any) || "/my-library" });
        } else {
          setSentTo(res.sentTo);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to send code");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureFn, navigate, redirectTo]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await verifyFn({
        data: {
          deviceHash: getDeviceHash(),
          deviceLabel: getDeviceLabel(),
          code: code.trim(),
          remember: getRememberDevice(),
        },
      });
      if (res.ok) {
        const { data } = await supabase.auth.getUser();
        if (data.user) markDeviceVerifiedInSession(data.user.id);
        navigate({ to: (redirectTo as any) || "/my-library" });
      } else {
        const map: Record<string, string> = {
          invalid_code: "That code isn't right. Check the email again.",
          expired: "This code has expired. Request a new one.",
          too_many_attempts: "Too many attempts. Request a new code.",
          no_challenge: "No pending verification. Request a new code.",
        };
        setError(map[res.reason] ?? "Verification failed");
      }
    } catch (e: any) {
      setError(e?.message ?? "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await ensureFn({
        data: { deviceHash: getDeviceHash(), deviceLabel: getDeviceLabel() },
      });
      if (res.trusted) {
        const { data } = await supabase.auth.getUser();
        if (data.user) markDeviceVerifiedInSession(data.user.id);
        navigate({ to: (redirectTo as any) || "/my-library" });
      } else {
        setSentTo(res.sentTo);
        setInfo("A new code is on the way.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to resend");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="container-onyx py-16 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl lg:text-4xl font-bold">
          Verify this device<span className="text-electric">.</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          For your security, we need to confirm this is you. We sent a 6-digit code to{" "}
          <span className="text-foreground font-semibold">{sentTo ?? "your email"}</span>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Check your spam / junk / søppelpost folder if you don't see it.
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-3">
          <input
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            className="w-full rounded-md border border-border bg-onyx-100 px-3 py-3 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-electric/60"
            autoFocus
          />
          {info && <div className="text-xs text-electric">{info}</div>}
          {error && <div className="text-xs text-red-400">{error}</div>}
          <button
            disabled={busy || code.length !== 6}
            className="w-full rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all disabled:opacity-50"
          >
            {busy ? "Verifying..." : "Verify device"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResend}
            disabled={busy}
            className="text-electric font-semibold hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground border-t border-border pt-4">
          Didn't try to sign in? Someone may have your password. Sign out, then reset your password
          immediately from the sign-in page.
        </p>
      </div>
    </div>
  );
}
