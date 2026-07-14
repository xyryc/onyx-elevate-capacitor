import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PurchaseRow = {
  id: string;
  product_kind: "bundle" | "program" | "plan";
  product_slug: string;
  product_title: string | null;
  created_at: string;
};

export const getMyPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PurchaseRow[]> => {
    const { data, error } = await context.supabase
      .from("purchases")
      .select("id, product_kind, product_slug, product_title, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PurchaseRow[];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url, training_goal, preferred_language, country, hidden_program_slugs, hidden_plan_slugs")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw error;
    if (!data?.avatar_url) return data;

    let avatarUrl = data.avatar_url;
    let storagePath = avatarUrl;
    if (/^https?:\/\//.test(storagePath)) {
      const marker = "/site-images/";
      const markerIndex = storagePath.indexOf(marker);
      storagePath = markerIndex >= 0 ? decodeURIComponent(storagePath.slice(markerIndex + marker.length).split("?")[0]) : "";
    }

    if (storagePath && !/^https?:\/\//.test(storagePath)) {
      const { data: signed } = await context.supabase.storage
        .from("site-images")
        .createSignedUrl(storagePath, 60 * 60);
      avatarUrl = signed?.signedUrl ?? avatarUrl;
    }

    return { ...data, avatar_url: avatarUrl };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { display_name?: string; avatar_url?: string; training_goal?: string; preferred_language?: string; country?: string; hidden_program_slugs?: string[]; hidden_plan_slugs?: string[] }) => data)
  .handler(async ({ data, context }) => {
    const { data: existing, error: readError } = await context.supabase
      .from("profiles")
      .select("id")
      .eq("id", context.userId)
      .maybeSingle();
    if (readError) throw readError;

    if (existing) {
      const { error } = await context.supabase
        .from("profiles")
        .update(data)
        .eq("id", context.userId);
      if (error) throw error;
      return { ok: true };
    }

    const payload = {
          id: context.userId,
          display_name:
            data.display_name ??
            (typeof context.claims.user_metadata === "object" && context.claims.user_metadata && "full_name" in context.claims.user_metadata
              ? String((context.claims.user_metadata as Record<string, unknown>).full_name ?? "") || null
              : null),
          ...data,
        };

    const { error } = await context.supabase.from("profiles").insert(payload);
    if (error) throw error;
    return { ok: true };
  });
