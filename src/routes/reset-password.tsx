import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [{ title: "Set New Password · Onyx Elevate" }],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase auto-exchanges the recovery token from the URL hash.
    // We wait for a PASSWORD_RECOVERY event OR an active session.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/my-library" }), 1500);
    } catch (err: any) {
      setError(err?.message ?? "Could not update password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-onyx py-16 lg:py-24">
      <div className="mx-auto max-w-md">
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
          ← Back to Onyx
        </Link>
        <h1 className="mt-4 font-display text-3xl lg:text-4xl font-bold">
          Set a new password<span className="text-electric">.</span>
        </h1>

        {!ready ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Open this page from the email link we sent you. If the link expired,{" "}
            <Link to="/forgot-password" className="text-electric font-semibold hover:underline">
              request a new one
            </Link>
            .
          </p>
        ) : done ? (
          <div className="mt-8 rounded-md border border-electric/40 bg-electric/5 p-5 text-sm">
            <div className="font-semibold text-electric mb-1">Password updated.</div>
            <p className="text-muted-foreground">Redirecting to your library…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (8+ chars)"
              className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:outline-none focus:border-electric/60"
            />
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:outline-none focus:border-electric/60"
            />
            {error && <div className="text-xs text-red-400">{error}</div>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all disabled:opacity-50"
            >
              {busy ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
