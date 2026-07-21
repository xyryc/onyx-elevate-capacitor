import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LANG_NAMES: Record<string, string> = {
  en: "English",
  "pt-BR": "Brazilian Portuguese",
  es: "Spanish (Spain)",
  no: "Norwegian Bokmål",
};

const InputSchema = z.object({
  target: z.string().min(2).max(10),
  texts: z.array(z.string().min(1).max(1200)).min(1).max(180),
});

export const translateBatch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const { target, texts } = data;
    if (target === "en") return { translations: texts };
    const langName = LANG_NAMES[target] ?? target;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { translations: texts, error: "missing_api_key" };
    }

    const system = `You are a professional translator for a fitness/training website (brand: Onyx Elevate).
Translate every item in the JSON array from English to ${langName}.
Rules:
- Preserve the array order and length exactly.
- Keep brand names ("Onyx", "Onyx Elevate"), proper nouns, coach names, and prices unchanged.
- Keep numbers, units (kg, lb, reps, sets, RPE), and emojis unchanged.
- Do NOT translate text that is already in ${langName}; return it unchanged.

GLOSSARY, respect these meanings in context of a gym/nutrition site:
- "Back" refers to the BACK MUSCLE GROUP (lats, rhomboids, traps). Norwegian: "Rygg". Portuguese: "Costas". Spanish: "Espalda". NEVER translate as "Tilbake"/"Voltar"/"Atrás" (those mean navigation "return"). The navigation button uses "Go back" instead.
- "Sirloin" is BEEF (red meat), never pork. Norwegian: "mørbrad av storfe" or "biff". Portuguese: "alcatra". Spanish: "solomillo de res". NEVER translate as "svinekjøtt"/"lombo de porco"/"lomo de cerdo".
- "Chicken breast" = kyllingbryst / peito de frango / pechuga de pollo.
- "Chest" as an exercise category = the CHEST MUSCLE (bryst / peito / pecho), not a storage chest.
- "Legs", "Arms", "Shoulders" are muscle groups, not anatomical descriptions.
- "Rest" between sets = pause/hvile/descanso (not "the rest of…").

ZERO TOLERANCE, recipe and food content must NEVER use drug or steroid terminology:
- NEVER translate "mass gainer", "protein shake", "recovery smoothie", or any recipe/food text using words that imply steroids, hormones, or illegal substances.
- In Portuguese: NEVER use "anabolizante", "esteroides", "drogas", "anabólico" (as a noun), or "bomba" for food or recipes. These refer to illegal performance-enhancing drugs.
- In Spanish: NEVER use "anabolizante", "esteroides", "drogas", or "bombas" for food or recipes.
- Correct safe alternatives for high-protein recipes:
  - "Mass gainer" / "protein shake" → Portuguese: "Shake proteico" or "Hipercalórico". Spanish: "Batido proteico" or "Hipercalórico". Norwegian: "Proteindrikk" or "Kaloririk shake".
  - "Anabolic" in a food context → Portuguese: "Recuperação muscular" or "Construção muscular". Spanish: "Recuperación muscular" or "Construcción muscular". Norwegian: "Muskelrestitusjon".
- Recipe titles must sound appetizing and use normal food language, never gym drug slang.

- Return ONLY a JSON object: {"t":["...","..."]} with exactly ${texts.length} items.`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(texts) },
      ],
      response_format: { type: "json_object" },
    };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        return { translations: texts, error: `gateway_${res.status}` };
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(content) as { t?: unknown };
      const arr = Array.isArray(parsed.t) ? (parsed.t as unknown[]) : [];
      const out = texts.map((src, i) => {
        const v = arr[i];
        return typeof v === "string" && v.trim() ? v : src;
      });
      return { translations: out };
    } catch (e) {
      return { translations: texts, error: e instanceof Error ? e.message : "unknown" };
    }
  });
