import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toggleFavorite, type FavoriteType } from "@/lib/engagement";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageProvider";


export function FavoriteButton({
  type,
  slug,
  className,
  size = "md",
}: {
  type: FavoriteType;
  slug: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const t = useT();
  const [fav, setFav] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const label = (key: string, fallback: string) => (mounted ? t(key) : fallback);


  useEffect(() => {
    if (!user) { setFav(false); return; }
    let active = true;
    supabase
      .from("favorites")
      .select("item_slug")
      .eq("item_type", type)
      .eq("item_slug", slug)
      .maybeSingle()
      .then(({ data }) => { if (active) setFav(!!data); });
    return () => { active = false; };
  }, [user, type, slug]);

  if (!user) {
    return (
      <Link
        to="/auth"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-border bg-onyx-100/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-electric/60 hover:text-electric transition-all",
          className,
        )}
        title={label("favorite.signInToSave", "Sign in to save")}
      >
        <Heart className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {label("favorite.save", "Save")}
      </Link>

    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try { setFav(await toggleFavorite(type, slug, fav)); }
        catch (e) { console.error(e); }
        finally { setBusy(false); }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
        fav
          ? "border-electric/60 bg-electric/10 text-electric"
          : "border-border bg-onyx-100/80 text-muted-foreground hover:border-electric/60 hover:text-electric",
        className,
      )}
    >
      <Heart className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4", fav && "fill-current")} />
      {fav ? label("favorite.saved", "Saved") : label("favorite.save", "Save")}
    </button>

  );
}

