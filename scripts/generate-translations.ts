/**
 * Build-time translation generator.
 *
 * Walks the static content catalogs (programs, recipes, coaches, articles,
 * exercises, nutrition, challenges, supplements, goals) plus the hand-written
 * UI strings from src/i18n/translations.ts and produces one JSON dictionary
 * per target language at src/i18n/generated/<lang>.json.
 *
 * The AutoTranslator seeds its in-memory cache from these dictionaries on
 * boot, so switching to a pre-generated language happens with zero network
 * calls — instant on first visit.
 *
 * Run with: LOVABLE_API_KEY=... bun scripts/generate-translations.ts
 * Only strings NOT already in the dictionary are sent to the AI, so re-runs
 * after adding a recipe/program are cheap and incremental.
 */

import { plugin } from "bun";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

// Stub non-JSON asset imports so we can load the data modules under Bun.
plugin({
  name: "stub-assets",
  setup(build) {
    build.onLoad({ filter: /\.(jpg|jpeg|png|webp|svg|avif|gif)$/ }, () => ({
      loader: "js",
      contents: "export default '';",
    }));
  },
});

const { programs, warmupByCategory } = await import("../src/data/programs.ts");
const { recipes } = await import("../src/data/recipes.ts");
const { nutritionPlans } = await import("../src/data/nutritionPlans.ts");
const { challenges } = await import("../src/data/challenges.ts");
const { articles } = await import("../src/data/articles.ts");
const { goals } = await import("../src/data/goals.ts");
const { coaches } = await import("../src/data/coaches.ts");
const { supplements } = await import("../src/data/supplements.ts");
const { categories: exerciseCategories, exercises } = await import("../src/data/exercises.ts");
const {
  poses: yogaPoses,
  articles: yogaArticles,
  introCards: yogaIntroCards,
} = await import("../src/routes/yoga-mobility.tsx");
const { translations } = await import("../src/i18n/translations.ts");
const { SEED } = await import("../src/i18n/seedDictionary.ts");

type Lang = "no" | "es" | "pt-BR";
const TARGETS: Lang[] = ["no", "es", "pt-BR"];

const LANG_NAMES: Record<Lang, string> = {
  no: "Norwegian Bokmål",
  es: "Spanish (Spain)",
  "pt-BR": "Brazilian Portuguese",
};

const HAS_LETTER = /\p{L}{2,}/u;

const NEVER_TRANSLATE_EXACT = new Set<string>(["Onyx", "Onyx Elevate"]);

function push(values: string[], v: unknown) {
  if (typeof v === "string") values.push(v);
}
function pushAll(values: string[], arr?: unknown[]) {
  arr?.forEach((v) => push(values, v));
}

function collectDeep(value: unknown, out: string[], key = "") {
  if (typeof value === "string") {
    if (
      !/^(slug|image|img|gallery|url|videoUrl|thumbnailUrl|paddlePriceId|alternatives|id)$/i.test(
        key,
      )
    ) {
      out.push(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectDeep(item, out, key));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([k, v]) => collectDeep(v, out, k));
  }
}

function collectAll(): string[] {
  const values: string[] = [];

  // UI strings from translations.ts
  Object.values(translations.en).forEach((v) => push(values, v));

  // Programs
  programs.forEach((p: any) => {
    [
      p.title,
      p.tagline,
      p.category,
      p.level,
      p.duration,
      p.goal,
      p.summary,
      p.nutrition,
      p.supplementation,
      p.recovery,
      p.trainingOverview,
      p.progression,
      p.price,
    ].forEach((v) => push(values, v));
    pushAll(values, p.whoItsFor);
    pushAll(values, p.whatYouGet);
    pushAll(values, p.includes);
    p.weeklySchedule?.forEach((d: any) => [d.day, d.session].forEach((v) => push(values, v)));
    p.workouts?.forEach((w: any) => {
      [w.day, w.title, w.focus].forEach((v) => push(values, v));
      w.exercises?.forEach((ex: any) =>
        [ex.name, ex.sets, ex.reps, ex.rest].forEach((v) => push(values, v)),
      );
    });
    p.faqs?.forEach((f: any) => [f.question, f.answer].forEach((v) => push(values, v)));
    const warmup = p.warmup ?? warmupByCategory[p.category];
    if (warmup) {
      push(values, warmup.intro);
      [
        ...(warmup.generalPrep ?? []),
        ...(warmup.specificPrep ?? []),
        ...(warmup.activation ?? []),
      ].forEach((s: any) => {
        [s.name, s.detail, s.duration].forEach((v) => push(values, v));
      });
      pushAll(values, warmup.rules);
    }
  });

  Object.values(warmupByCategory).forEach((warmup: any) => {
    push(values, warmup.intro);
    [
      ...(warmup.generalPrep ?? []),
      ...(warmup.specificPrep ?? []),
      ...(warmup.activation ?? []),
    ].forEach((s: any) => {
      [s.name, s.detail, s.duration].forEach((v) => push(values, v));
    });
    pushAll(values, warmup.rules);
  });

  collectDeep(recipes, values);
  collectDeep(nutritionPlans, values);
  collectDeep(challenges, values);
  collectDeep(articles, values);
  collectDeep(goals, values);
  collectDeep(coaches, values);
  collectDeep(supplements, values);
  collectDeep(yogaPoses, values);
  collectDeep(yogaArticles, values);
  collectDeep(yogaIntroCards, values);

  // Yoga page static UI strings (hardcoded in the route JSX).
  const yogaUiStrings = [
    "Free • A calm corner of Onyx",
    "Yoga &",
    "Mobility",
    "A quiet space to breathe, stretch, and recover. Start with a featured practice, learn the foundational poses, and explore short reads on mindful movement.",
    "Featured Practice",
    "Start here - a gentle guided session",
    "~20 minutes • All levels",
    "A gentle, accessible session to ease into your practice. Follow along at your own pace - modify freely and let the breath lead each movement. This is the perfect starting point whether you're brand new to yoga or returning after time away.",
    "Roll out a mat, dim the lights, and give yourself these twenty minutes. Consistency beats intensity - even a short daily practice will move you further than a long session once a week.",
    "This video is provided by the original creator and embedded from YouTube. All rights belong to the respective channel.",
    "Onyx Player",
    "Featured",
    "The Practice",
    "Ten poses. A lifetime of practice.",
    "You don't need a hundred postures - you need a handful, practiced with attention. Below are the foundational shapes that most yoga sessions return to. Learn them slowly, feel them deeply, and let them become old friends.",
    "Foundational Poses",
    "The shapes worth knowing",
    "View how-to →",
    "Benefits",
    "Breathing",
    "Step by step",
    "Common mistakes",
    "Modifications",
    "Hold:",
    "If a pose causes sharp pain, come out slowly. Yoga should challenge, not injure. Consult a health professional if you have injuries or medical concerns.",
    "Read & Reflect",
    "Short reads for a calmer practice",
    "Read article →",
    "Takeaway",
  ];
  yogaUiStrings.forEach((v) => push(values, v));

  exerciseCategories.forEach((c: any) => [c.label, c.blurb].forEach((v) => push(values, v)));
  exercises.forEach((e: any) => {
    [
      e.name,
      e.shortDescription,
      e.category,
      e.primaryMuscle,
      e.exerciseType,
      e.equipment,
      e.mechanics,
      e.forceType,
      e.level,
      e.overview,
    ].forEach((v) => push(values, v));
    pushAll(values, e.secondaryMuscles);
    e.steps?.forEach((s: any) => [s.title, s.body].forEach((v) => push(values, v)));
    pushAll(values, e.proTips);
    pushAll(values, e.commonMistakes);
  });

  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const t = raw.trim();
    if (!t || seen.has(t)) continue;
    if (!HAS_LETTER.test(t)) continue;
    if (t.length > 1200) continue;
    if (NEVER_TRANSLATE_EXACT.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

const SYSTEM = (
  lang: Lang,
) => `You are a professional translator for a fitness/training website (brand: Onyx Elevate).
Translate every item in the JSON array from English to ${LANG_NAMES[lang]}.
Rules:
- Preserve the array order and length exactly.
- Keep brand names ("Onyx", "Onyx Elevate"), proper nouns, coach names, and prices unchanged.
- Keep numbers, units (kg, lb, reps, sets, RPE), and emojis unchanged.
- Do NOT translate text that is already in ${LANG_NAMES[lang]}; return it unchanged.

GLOSSARY — respect these meanings in context of a gym/nutrition site:
- "Back" refers to the BACK MUSCLE GROUP (lats, rhomboids, traps). Norwegian: "Rygg". Portuguese: "Costas". Spanish: "Espalda". NEVER translate as "Tilbake"/"Voltar"/"Atrás".
- "Sirloin" is BEEF (red meat), never pork. Norwegian: "mørbrad av storfe" or "biff". Portuguese: "alcatra". Spanish: "solomillo de res".
- "Chicken breast" = kyllingbryst / peito de frango / pechuga de pollo.
- "Chest" as an exercise category = the CHEST MUSCLE (bryst / peito / pecho), not a storage chest.
- "Legs", "Arms", "Shoulders" are muscle groups, not anatomical descriptions.
- "Rest" between sets = pause/hvile/descanso (not "the rest of…").

ZERO TOLERANCE — recipe and food content must NEVER use drug or steroid terminology:
- NEVER use "anabolizante", "esteroides", "drogas", "anabólico" (as a noun), "bomba", "anabolizantes" for food or recipes.
- "Mass gainer" / "protein shake" → Portuguese: "Shake proteico" or "Hipercalórico". Spanish: "Batido proteico" or "Hipercalórico". Norwegian: "Proteindrikk" or "Kaloririk shake".
- "Anabolic" in a food context → Portuguese: "Recuperação muscular". Spanish: "Recuperación muscular". Norwegian: "Muskelrestitusjon".

Return ONLY a JSON object: {"t":["...","..."]} with exactly the same number of items as the input.`;

async function translateBatch(texts: string[], lang: Lang, apiKey: string): Promise<string[]> {
  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEM(lang) },
      { role: "user", content: JSON.stringify(texts) },
    ],
    response_format: { type: "json_object" },
  };
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) {
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        throw new Error(`gateway_${res.status}: ${await res.text()}`);
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(content) as { t?: unknown };
      const arr = Array.isArray(parsed.t) ? (parsed.t as unknown[]) : [];
      return texts.map((src, i) => {
        const v = arr[i];
        return typeof v === "string" && v.trim() ? v : src;
      });
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
    }
  }
  return texts;
}

async function main() {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const strings = collectAll();
  console.log(`Collected ${strings.length} unique strings.`);

  const outDir = join(process.cwd(), "src/i18n/generated");
  await mkdir(outDir, { recursive: true });

  const onlyLang = process.env.ONLY_LANG as Lang | undefined;
  const runTargets = onlyLang ? [onlyLang] : TARGETS;

  for (const lang of runTargets) {
    const file = join(outDir, `${lang}.json`);
    let dict: Record<string, string> = {};
    if (existsSync(file)) {
      try {
        dict = JSON.parse(await readFile(file, "utf8"));
      } catch {}
    }

    // Seed dict wins — never re-translate hand-verified entries.
    const seedFor = Object.fromEntries(
      Object.entries(SEED)
        .map(([src, m]: [string, any]) => [src, m[lang]])
        .filter(([, v]) => typeof v === "string" && v),
    ) as Record<string, string>;

    const needs = strings.filter((s) => !dict[s] && !seedFor[s]);
    console.log(
      `[${lang}] existing=${Object.keys(dict).length} seed=${Object.keys(seedFor).length} to-translate=${needs.length}`,
    );

    const BATCH = 80;
    const batches: string[][] = [];
    for (let i = 0; i < needs.length; i += BATCH) batches.push(needs.slice(i, i + BATCH));

    let done = 0;
    const CONCURRENCY = 5;
    let idx = 0;
    const workers = Array.from({ length: Math.min(CONCURRENCY, batches.length) }, async () => {
      while (idx < batches.length) {
        const i = idx++;
        const texts = batches[i];
        try {
          const results = await translateBatch(texts, lang, apiKey);
          for (let k = 0; k < texts.length; k++) {
            const src = texts[k];
            const tx = results[k];
            if (typeof tx === "string" && tx.trim()) dict[src] = tx;
          }
        } catch (e) {
          console.warn(`[${lang}] batch ${i} failed:`, (e as Error).message);
        }
        done += texts.length;
        if (done % 400 < BATCH) {
          await writeFile(file, JSON.stringify(dict, null, 0));
          console.log(`[${lang}] progress ${done}/${needs.length}`);
        }
      }
    });
    await Promise.all(workers);

    await writeFile(file, JSON.stringify(dict, null, 0));
    console.log(`[${lang}] wrote ${Object.keys(dict).length} entries → ${file}`);
  }
}

await main();
