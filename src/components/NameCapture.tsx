import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "@/lib/purchases.functions";
import { looksLikeRealName } from "@/lib/displayName";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/**
 * Shown once per account when the profile has no real display name
 * (common after Apple sign-in, which hides the user's real name).
 * Persists the answer in profiles.display_name so every page sees it.
 */
export function NameCapture() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMyProfile(),
    enabled: !!user,
  });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [dismissedForSession, setDismissedForSession] = useState(false);

  const shouldAsk =
    !loading &&
    !!user &&
    profile !== undefined && // wait until the profile query has resolved
    !looksLikeRealName(profile?.display_name) &&
    !dismissedForSession;

  useEffect(() => {
    if (shouldAsk) {
      const fallback =
        (user?.user_metadata as any)?.full_name ||
        (user?.user_metadata as any)?.name ||
        "";
      setName(looksLikeRealName(fallback) ? fallback : "");
    }
  }, [shouldAsk, user]);

  if (!shouldAsk) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    setBusy(true);
    try {
      await updateMyProfile({ data: { display_name: trimmed } });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success(`Nice to meet you, ${trimmed.split(" ")[0]}!`);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save your name");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-electric/40 bg-onyx-100 p-6 shadow-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-electric">
          One quick thing
        </div>
        <h2 className="mt-2 font-display text-xl font-bold">
          What should we call you?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We'll show this on your dashboard and next to your name in groups.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            className="w-full rounded-md border border-border bg-onyx-50 px-3 py-2.5 text-sm focus:outline-none focus:border-electric/60"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={busy || !name.trim()}
              className="flex-1 rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setDismissedForSession(true)}
              className="rounded-md border border-border bg-onyx-50 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
