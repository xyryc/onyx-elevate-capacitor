import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  listReviews,
  upsertReview,
  deleteMyReview,
  getMyReview,
  type ReviewRow,
} from "@/lib/engagement";
import { StarRating } from "./StarRating";

export function ReviewsSection({ slug, kind = "program" }: { slug: string; kind?: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [mine, setMine] = useState<ReviewRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([listReviews(slug, kind), getMyReview(slug, kind)])
      .then(([r, m]) => {
        if (active) {
          setReviews(r);
          setMine(m);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, kind, user?.id]);

  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setTitle(mine.title ?? "");
      setBody(mine.body ?? "");
    }
  }, [mine?.id]);

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await upsertReview({ product_slug: slug, product_kind: kind, rating, title, body });
      const [r, m] = await Promise.all([listReviews(slug, kind), getMyReview(slug, kind)]);
      setReviews(r);
      setMine(m);
    } catch (e: any) {
      alert(e.message ?? "Could not submit review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="surface-card rounded-2xl p-6 md:p-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">
            Reviews & Ratings
          </p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold">
            {reviews.length > 0 ? avg.toFixed(1) : "-"}
            <span className="text-base font-normal text-muted-foreground"> / 5</span>
          </h2>
        </div>
        <div className="text-right">
          <StarRating value={Math.round(avg)} size={20} />
          <p className="mt-1 text-xs text-muted-foreground">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Write / edit form */}
      {user ? (
        <form onSubmit={submit} className="mt-6 space-y-3 border-t border-border/60 pt-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {mine ? "Edit your review" : "Leave a review"}
          </p>
          <StarRating value={rating} onChange={setRating} size={24} />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline (optional)"
            className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
            maxLength={120}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you think? Did it deliver?"
            rows={3}
            className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
            maxLength={2000}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-electric px-4 py-2 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-50"
            >
              {busy ? "Saving..." : mine ? "Update review" : "Post review"}
            </button>
            {mine && (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Delete your review?")) return;
                  await deleteMyReview(slug, kind);
                  const [r, m] = await Promise.all([
                    listReviews(slug, kind),
                    getMyReview(slug, kind),
                  ]);
                  setReviews(r);
                  setMine(m);
                  setTitle("");
                  setBody("");
                  setRating(5);
                }}
                className="rounded-md border border-border bg-onyx-100 px-4 py-2 text-sm font-medium hover:border-destructive hover:text-destructive transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-md border border-border bg-onyx-100/50 p-4 text-sm text-muted-foreground">
          <Link to="/auth" className="text-electric font-semibold hover:underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </div>
      )}

      {/* List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">Be the first to review this program.</p>
        ) : (
          reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-onyx-100/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <StarRating value={r.rating} size={14} />
                <span className="text-[11px] text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.title && <h4 className="mt-2 font-display font-bold">{r.title}</h4>}
              {r.body && (
                <p className="mt-1 text-sm text-foreground/85 whitespace-pre-wrap">{r.body}</p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
