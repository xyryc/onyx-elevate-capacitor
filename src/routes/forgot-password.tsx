import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password · Onyx Elevate" },
      { name: "description", content: "Reset your Onyx Elevate account password." },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-onyx py-16 lg:py-24">
      <div className="mx-auto max-w-md">
        <Link to="/auth" className="text-xs uppercase tracking-[0.2em] text-electric font-semibold">
          ← Back to sign in
        </Link>
        <h1 className="mt-4 font-display text-3xl lg:text-4xl font-bold">
          Reset your password<span className="text-electric">.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a secure link to set a new password.
        </p>

        {sent ? (
          <div className="mt-8 rounded-md border border-electric/40 bg-electric/5 p-5 text-sm">
            <div className="font-semibold text-electric mb-1">Check your inbox</div>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
              The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm focus:outline-none focus:border-electric/60"
            />
            {error && <div className="text-xs text-red-400">{error}</div>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-all disabled:opacity-50"
            >
              {busy ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
