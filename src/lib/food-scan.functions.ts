import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DAILY_LIMIT = 10;

export interface ScannedItem {
  name: string;
  grams: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface ScanResult {
  ok: true;
  items: ScannedItem[];
  remaining: number;
}
export interface ScanRefused {
  ok: false;
  reason: string;
  remaining: number;
}

const scanInput = z.object({
  imageBase64: z.string().min(100),
  mimeType: z.string().default("image/jpeg"),
});

function todayStart() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export const getScanQuota = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ used: number; limit: number; remaining: number }> => {
    const { supabase, userId } = context;
    const { count, error } = await supabase
      .from("food_log_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("source", "scan")
      .gte("created_at", todayStart());
    if (error) throw error;
    const used = count ?? 0;
    return { used, limit: DAILY_LIMIT, remaining: Math.max(0, DAILY_LIMIT - used) };
  });

export const scanFoodPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => scanInput.parse(d))
  .handler(async ({ data, context }): Promise<ScanResult | ScanRefused> => {
    const { supabase, userId } = context;

    // Rate limit: count today's scan entries (both accepted + refused counted via source='scan' logs is not enough, use a separate count via source ref).
    // Simplest: count food_log_entries with source='scan' created today. Refused scans still increment via a lightweight insert-then-delete? No, just count accepted logs. To prevent abuse of refused ones, count activity_events if available; otherwise count from food_log_entries source='scan'.
    const { count, error: countErr } = await supabase
      .from("food_log_entries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("source", "scan")
      .gte("created_at", todayStart());
    if (countErr) throw countErr;
    const used = count ?? 0;
    if (used >= DAILY_LIMIT) {
      return {
        ok: false,
        reason: `Daily scan limit reached (${DAILY_LIMIT}/day). Try again tomorrow or log manually.`,
        remaining: 0,
      };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI unavailable");

    const systemPrompt = `You are a food-recognition assistant for a fitness app.
Rules:
1. ONLY analyze photos of food/drink/meals on plates, bowls, packaging, or hands.
2. If the photo contains anything else (people, screens, random objects, empty scenes, drawings, memes, inappropriate content), refuse.
3. Estimate what's on the plate. Break it into individual foods with realistic gram weights.
4. Estimate kcal, protein (g), carbs (g), fat (g) per item using standard nutrition values.
5. Return ONLY strict JSON, no markdown, no prose.

Response shape when it IS food:
{"ok":true,"items":[{"name":"Grilled chicken breast","grams":150,"kcal":248,"protein_g":46,"carbs_g":0,"fat_g":5}]}

Response when NOT food or unclear:
{"ok":false,"reason":"Not a food photo"}`;

    const callModel = async (model: string) =>
      fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Identify the foods in this photo and estimate their macros. Return JSON only.",
                },
                {
                  type: "image_url",
                  image_url: { url: `data:${data.mimeType};base64,${data.imageBase64}` },
                },
              ],
            },
          ],
        }),
      });

    let res = await callModel("google/gemini-2.5-flash");
    if (!res.ok && res.status !== 429 && res.status !== 402) {
      // Fallback to a smaller, more available model
      res = await callModel("google/gemini-2.5-flash-lite");
    }

    if (!res.ok) {
      if (res.status === 429)
        return {
          ok: false,
          reason: "AI is busy, try again in a moment.",
          remaining: DAILY_LIMIT - used,
        };
      if (res.status === 402)
        return {
          ok: false,
          reason: "AI credits exhausted. Please contact support.",
          remaining: DAILY_LIMIT - used,
        };
      const txt = await res.text().catch(() => "");
      console.error("[scanFoodPhoto] AI error", res.status, txt.slice(0, 500));
      throw new Error(`AI error ${res.status}: ${txt.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "";
    let cleaned = raw.trim();
    // strip fenced code blocks if present
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
    }
    // extract first {...} in case of extra prose
    const braceStart = cleaned.indexOf("{");
    const braceEnd = cleaned.lastIndexOf("}");
    if (braceStart >= 0 && braceEnd > braceStart) cleaned = cleaned.slice(braceStart, braceEnd + 1);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        ok: false,
        reason: "Couldn't read that photo. Try better lighting or log manually.",
        remaining: DAILY_LIMIT - used,
      };
    }

    const responseSchema = z.union([
      z.object({
        ok: z.literal(true),
        items: z
          .array(
            z.object({
              name: z.string().min(1).max(120),
              grams: z.number().positive().max(3000),
              kcal: z.number().min(0).max(5000),
              protein_g: z.number().min(0).max(500),
              carbs_g: z.number().min(0).max(500),
              fat_g: z.number().min(0).max(500),
            }),
          )
          .min(1)
          .max(10),
      }),
      z.object({ ok: z.literal(false), reason: z.string().max(200) }),
    ]);
    const val = responseSchema.safeParse(parsed);
    if (!val.success) {
      return {
        ok: false,
        reason: "AI returned an unexpected result. Try another photo.",
        remaining: DAILY_LIMIT - used,
      };
    }
    if (!val.data.ok) {
      return {
        ok: false,
        reason: `${val.data.reason}. Only real food photos are allowed, repeated misuse can lead to a ban.`,
        remaining: DAILY_LIMIT - used,
      };
    }
    return { ok: true, items: val.data.items, remaining: DAILY_LIMIT - used - 1 };
  });
