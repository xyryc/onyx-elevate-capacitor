import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ImageOverrideMap = Record<string, string>;

async function fetchOverrides(): Promise<ImageOverrideMap> {
  const { data, error } = await supabase.from("image_overrides").select("slot_key,image_url");
  if (error) return {};
  const map: ImageOverrideMap = {};
  for (const row of data ?? []) map[row.slot_key] = row.image_url;
  return map;
}

export function useImageOverrides() {
  return useQuery({
    queryKey: ["image-overrides"],
    queryFn: fetchOverrides,
    staleTime: 60_000,
  });
}

export function useImage(slot: string, fallback: string): string {
  const { data } = useImageOverrides();
  return data?.[slot] ?? fallback;
}
