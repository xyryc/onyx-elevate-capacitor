import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { exercises } from "@/data/exercises";
import { programs } from "@/data/programs";
import { nutritionPlans } from "@/data/nutritionPlans";

export const DAILY_LIMIT = 10;
export const THROTTLE_SECONDS = 3;
export const MAX_INPUT_CHARS = 1000;
export const MAX_IMAGES_PER_MESSAGE = 3;
export const MAX_IMAGE_BYTES = 2_500_000; // ~2.5 MB per image after client-side compression
const MODEL = "google/gemini-3.1-flash-lite";
const HISTORY_CONTEXT = 5;
const MAX_OUTPUT_TOKENS = 1800;
const CATALOG_MAX = 45; // exercises injected per request (retrieval)
const CATALOG_CORE_MIN = 15; // popular fallback always included

const VALID_EXERCISE_SLUGS = new Set(exercises.map((e: any) => String(e.slug)));
const EXERCISE_NAME_BY_SLUG = new Map<string, string>(
  exercises.map((e: any) => [String(e.slug), String(e.name)]),
);

// Only exercises with a video/thumbnail are candidates, those are the ones
// whose /exercises/<slug> page has playable content for the user.
type ExerciseIndexRow = {
  slug: string;
  name: string;
  category: string;
  primary: string;
  secondary: string[];
  equipment: string;
  level: string;
  haystack: string; // lowercased searchable blob
};

const EXERCISE_INDEX: ExerciseIndexRow[] = exercises
  .filter((e: any) => e.videoUrl || e.thumbnailUrl)
  .map((e: any) => {
    const secondary: string[] = Array.isArray(e.secondaryMuscles) ? e.secondaryMuscles : [];
    const haystack = [
      e.name,
      e.slug.replace(/-/g, " "),
      e.category,
      e.primaryMuscle,
      ...secondary,
      e.equipment,
      e.level,
      e.exerciseType,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return {
      slug: String(e.slug),
      name: String(e.name),
      category: String(e.category ?? ""),
      primary: String(e.primaryMuscle ?? ""),
      secondary,
      equipment: String(e.equipment ?? ""),
      level: String(e.level ?? ""),
      haystack,
    };
  });

// Popular fallback slugs so short queries ("give me a workout") still have
// options. Pick a broad, video-having base, kept small to save tokens.
const CORE_POPULAR_SLUGS = [
  "barbell-back-squat",
  "romanian-deadlift",
  "barbell-bench-press",
  "conventional-deadlift",
  "pull-ups",
  "push-ups",
  "dumbbell-shoulder-press",
  "lat-pulldown",
  "seated-cable-row",
  "barbell-hip-thrust",
  "leg-press",
  "walking-lunges",
  "dumbbell-bicep-curl",
  "tricep-pushdown",
  "plank",
].filter((s) => VALID_EXERCISE_SLUGS.has(s));

const STOP_WORDS = new Set([
  "the","a","an","and","or","for","to","of","in","on","at","is","are","was","were",
  "be","been","have","has","had","do","does","did","i","me","my","you","your","we",
  "our","it","its","that","this","with","without","can","could","should","would",
  "will","just","some","any","how","what","when","which","who","why","give","make",
  "want","need","get","help","please","today","now","also","really","very","much",
  "en","et","er","du","jeg","meg","min","mitt","mine","hva","hvordan","kan","skal",
  "vil","for","med","uten","og","eller","om","på","til","fra","har","hadde","være",
  "de","el","la","los","las","un","una","que","como","con","sin","por","para","es",
  "está","o","de","um","uma","que","como","com","sem","por","para","é","está",
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  return Array.from(new Set(words));
}

function buildExerciseCatalog(userText: string, historyText: string): string {
  const query = `${userText} ${historyText}`.slice(0, 4000);
  const keywords = extractKeywords(query);
  const picked = new Set<string>(CORE_POPULAR_SLUGS);

  if (keywords.length > 0) {
    const scored: Array<{ row: ExerciseIndexRow; score: number }> = [];
    for (const row of EXERCISE_INDEX) {
      let score = 0;
      for (const kw of keywords) {
        if (row.haystack.includes(kw)) {
          // Name/slug/primary muscle matches weigh more than generic tags.
          if (row.name.toLowerCase().includes(kw)) score += 4;
          else if (row.primary.toLowerCase().includes(kw)) score += 3;
          else if (row.category.toLowerCase().includes(kw)) score += 2;
          else score += 1;
        }
      }
      if (score > 0) scored.push({ row, score });
    }
    scored.sort((a, b) => b.score - a.score);
    for (const { row } of scored) {
      picked.add(row.slug);
      if (picked.size >= CATALOG_MAX) break;
    }
  }

  // Ensure minimum breadth so the model always has options for common categories.
  if (picked.size < CATALOG_CORE_MIN) {
    for (const row of EXERCISE_INDEX) {
      picked.add(row.slug);
      if (picked.size >= CATALOG_CORE_MIN) break;
    }
  }

  // Emit compact catalog: name|slug (URL is /exercises/<slug>, model already knows the pattern).
  const lines: string[] = [];
  for (const row of EXERCISE_INDEX) {
    if (picked.has(row.slug)) lines.push(`${row.name}|${row.slug}`);
  }
  return lines.join("\n");
}

const PROGRAM_CATALOG = programs
  .map((p: any) => `${p.title || p.name}|/programs/${p.slug}`)
  .join("\n");
const MEALPLAN_CATALOG = nutritionPlans
  .map((n: any) => `${n.title || n.name}|/meal-plans/${n.slug}`)
  .join("\n");

const SYSTEM_PROMPT = `You are the Onyx Elevate AI Coach, a friendly training & nutrition assistant inside the Onyx Elevate fitness app.

============ HARD RULES, NEVER BREAK ============
1. SCOPE: You ONLY talk about training, exercise technique, workout programming, running, general nutrition & meal ideas, hydration, sleep, recovery, mobility, warm-ups, and everyday healthy habits.
2. REFUSE, in one short sentence, and steer back to training/nutrition if the user asks about:
   - Medical advice, diagnoses, injuries requiring treatment, medications, supplements beyond basic whey/creatine/multivitamin, hormones, blood work.
   - Steroids, SARMs, peptides, PEDs, "cycles", TRT dosing, or ANY performance-enhancing drug, even "just curious". Say: "I can't help with that, please talk to a licensed medical professional."
   - Extreme diets, fasting protocols for medical conditions, disordered-eating patterns, or rapid weight loss below safe rates.
   - Anything unrelated (politics, coding, celebrities, relationships, finance, etc.).
3. If someone describes PAIN or an INJURY (e.g. knee pain, back pain, shoulder pain):
   - Do NOT diagnose. Say: "I'm not a doctor, please see a physio or medical professional for a proper assessment."
   - Then give GENERAL healthy-training tips: what movements typically feel safer, common mobility/warm-up ideas, what to usually avoid (deep loaded flexion, ballistic jumps, etc.), framed as general information, not personal medical advice.
4. Metric units by default (kg, cm, kcal, g). Keep replies practical, warm, encouraging. Short paragraphs + bullet points. Under ~300 words unless the user asks for a full program/plan.

============ USING THE ONYX LIBRARY ============
When you build a workout, a program day, or a training plan, you MUST only reference exercises from the EXERCISE CATALOG below, and you MUST link every exercise as markdown: [Exercise Name](/exercises/slug). If a movement the user wants isn't in the catalog, pick the closest equivalent that IS in the catalog. Never invent exercise slugs.

Format single workouts as a clean markdown list, e.g.:
- [Barbell Back Squat](/exercises/barbell-back-squat), 4 × 6-8, rest 2-3 min
- [Romanian Deadlift](/exercises/romanian-deadlift), 3 × 8-10

You can also build short duration-based workouts on request, 10, 15, 20, 30, 40, 45, 60 minutes, sized to the time budget (fewer moves for short sessions, more supersets/circuits when appropriate).

When recommending a full pre-built program from the catalog, link one from the PROGRAM CATALOG: [Program Title](/programs/slug).
When recommending a meal plan, link one from the MEAL PLAN CATALOG: [Plan Title](/meal-plans/slug).

============ SAVEABLE PROGRAMS, THIS IS IMPORTANT ============
When the user asks you to BUILD a training program, a workout plan, or a multi-day/multi-week routine (NOT when they just ask for tips or one-off exercises), you MUST attach ONE hidden JSON block at the very END of your reply, the app parses this and saves the program to their library so they can open it and tap "Add to my programs".

Format EXACTLY like this, no other text after the closing tag:

<onyx-program>
{
  "name": "Short program name (max 60 chars, user's language)",
  "weeks": [
    {
      "name": "Week 1",
      "days": [
        {
          "name": "Day 1, Upper",
          "exercises": [
            { "slug": "barbell-back-squat", "sets": "4", "reps": "6-8", "rest": "2-3 min", "notes": "" }
          ]
        }
      ]
    }
  ]
}
</onyx-program>

Rules for the JSON block:
- Every "slug" MUST be an exact slug from the EXERCISE CATALOG below. If unsure, pick the closest catalog slug, never invent one.
- 1-4 weeks MAXIMUM (never more than 4 weeks, even if the user asks for more, cap at 4 and mention it). 1-7 days per week, 1-15 exercises per day.
- CRITICAL: If the user asks for an "N-week program" (e.g. "3 week program", "3 ukers program", "programa de 3 semanas"), the JSON MUST contain exactly N week objects in the "weeks" array (capped at 4), each with its own days. Do NOT put all sessions as "Day 1, Day 2, Day 3..." inside a single week. Weeks can share the same structure but should show progression (e.g. add a set, add reps, add load) across weeks.
- Use short "sets"/"reps"/"rest"/"notes" strings, not objects.
- Do NOT wrap the block in \`\`\`code fences. Do NOT show the JSON to the user in the visible reply.
- For a single short workout (e.g. "give me a 20 minute session"), use ONE week with ONE day containing that workout, still emit the block so the user can save it.
- For pain/injury adaptations (e.g. "I have shoulder pain"), swap out the offending movements in the JSON as well as in your visible reply.

Before the hidden block, write ONLY 1-2 short sentences (max ~40 words) describing the program in the user's language and mentioning a saveable preview will appear below. Do NOT list weeks/days/exercises in the visible reply, the JSON block is the source of truth. Keep the visible reply short so the JSON block fits.

============ SAVEABLE MEAL PLANS, THIS IS IMPORTANT ============
When the user asks you to BUILD a meal plan, a diet plan, a weekly meal plan, a cutting/bulking food plan, or a multi-day nutrition plan (NOT when they just ask for one meal idea or a single recipe), you MUST attach ONE hidden JSON block at the very END of your reply. The app parses this and saves the plan to their library so they can open it and tap "Log this day", that automatically logs every meal of that day into their nutrition tracker (Ernæring) for the chosen date.

Format EXACTLY like this, no other text after the closing tag:

<onyx-meal-plan>
{
  "name": "Short plan name (max 60 chars, user's language)",
  "days": [
    {
      "name": "Day 1, High protein",
      "meals": [
        { "slot": "breakfast", "name": "Oats with berries & whey", "kcal": 480, "protein_g": 35, "carbs_g": 60, "fat_g": 10 },
        { "slot": "lunch", "name": "Chicken rice bowl", "kcal": 650, "protein_g": 45, "carbs_g": 70, "fat_g": 15 },
        { "slot": "dinner", "name": "Salmon, potatoes, veg", "kcal": 700, "protein_g": 45, "carbs_g": 60, "fat_g": 25 },
        { "slot": "snack", "name": "Greek yogurt & almonds", "kcal": 320, "protein_g": 25, "carbs_g": 15, "fat_g": 18 }
      ]
    }
  ]
}
</onyx-meal-plan>

Rules for the meal plan block:
- "slot" MUST be one of "breakfast", "lunch", "dinner", "snack".
- 1-14 days, 1-8 meals per day.
- kcal, protein_g, carbs_g, fat_g are integers (grams / kilocalories). Give realistic values for the meal.
- Meal "name" is short and descriptive in the user's language.
- Do NOT wrap the block in \`\`\`code fences. Do NOT show the JSON to the user in the visible reply.
- Before the block, write ONLY 1-2 short sentences (max ~40 words) in the user's language and mention a saveable preview with "Log this day" buttons will appear below. Do NOT list all meals in the visible reply, the JSON block is the source of truth. Keep the visible reply short so the JSON block fits.

============ IMAGE ATTACHMENTS ============
Users may attach photos of gym equipment, exercises, or food. If they do:
- Equipment/exercise photo: identify the machine or movement, explain briefly how it's used, then link the matching catalog exercise if there is one.
- Food photo: give a rough kcal + macro estimate and healthier swaps, no medical advice.
- Never diagnose injuries or medical issues from a photo, recommend a professional.

============ EXERCISE CATALOG ============
A per-message shortlist of exercises will be provided in a follow-up system message with format "name|slug". Use those slugs ONLY inside markdown links like [Name](/exercises/slug). Never invent a slug. If the user asks for something not in the shortlist, pick the closest match from the shortlist.

============ PROGRAM CATALOG ============
${PROGRAM_CATALOG}

============ MEAL PLAN CATALOG ============
${MEALPLAN_CATALOG}
`;


export type CoachStatus = {
  isPremium: boolean;
  messagesLeftToday: number;
  dailyLimit: number;
};

export type CoachMessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

type SendResult =
  | { ok: true; message: CoachMessageRow; messagesLeftToday: number }
  | { ok: false; error: string; code: "not_premium" | "limit" | "throttle" | "input" | "ai" | "internal" };

// Server-authoritative premium check.
// Qualifies if the user has (a) an active/trialing subscription (live or sandbox),
// or (b) a lifetime BUNDLE purchase. Single-program or single-meal-plan purchases
// do NOT unlock the AI coach.
async function checkPremium(supabase: any, userId: string): Promise<boolean> {
  const [subLive, subSandbox, purRes] = await Promise.all([
    supabase.rpc("has_active_subscription", { user_uuid: userId, check_env: "live" }),
    supabase.rpc("has_active_subscription", { user_uuid: userId, check_env: "sandbox" }),
    supabase
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("product_kind", "bundle")
      .limit(1),
  ]);
  const hasSub = subLive.data === true || subSandbox.data === true;
  const hasLifetime = (purRes.data ?? []).length > 0;
  return hasSub || hasLifetime;
}

async function getPreferredLanguage(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("preferred_language")
    .eq("id", userId)
    .maybeSingle();
  return (data?.preferred_language ?? "en").toString().slice(0, 8);
}

function localToday(timezone?: string): string {
  const tz = (timezone && timezone.trim()) || "UTC";
  try {
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function sanitizeTimezone(tz: unknown): string {
  const s = (typeof tz === "string" ? tz : "").trim().slice(0, 64);
  // IANA-ish: letters, digits, /_+-, so it's safe as a Postgres text arg.
  return /^[A-Za-z0-9_+\-/]+$/.test(s) ? s : "UTC";
}


export const getCoachStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { timezone?: string }) => ({
    timezone: sanitizeTimezone(input?.timezone),
  }))
  .handler(async ({ data, context }): Promise<CoachStatus> => {
    const { supabase, userId } = context;
    const isPremium = await checkPremium(supabase, userId);
    const today = localToday(data.timezone);
    const { data: usage } = await supabase
      .from("ai_chat_usage")
      .select("message_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .maybeSingle();
    const used = usage?.message_count ?? 0;
    return {
      isPremium,
      messagesLeftToday: Math.max(0, DAILY_LIMIT - used),
      dailyLimit: DAILY_LIMIT,
    };
  });

export const getCoachHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CoachMessageRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("ai_chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) throw error;
    return (data ?? []) as CoachMessageRow[];
  });

export const clearCoachHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("ai_chat_messages").delete().eq("user_id", userId);
    if (error) throw error;
    return { ok: true as const };
  });

export const sendCoachMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { content: string; timezone?: string; images?: string[]; language?: string }) => {
    const content = (input?.content ?? "").toString().trim();
    if (!content) throw new Error("Empty message");
    const rawImages = Array.isArray(input?.images) ? input!.images! : [];
    const images: string[] = [];
    for (const img of rawImages) {
      if (typeof img !== "string") continue;
      if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(img)) continue;
      if (img.length > MAX_IMAGE_BYTES * 1.4) continue; // base64 overhead
      images.push(img);
      if (images.length >= MAX_IMAGES_PER_MESSAGE) break;
    }
    const validLangs = new Set(["en", "pt-BR", "es", "no"]);
    const language = validLangs.has(input?.language ?? "") ? input!.language! : "en";
    return {
      content: content.slice(0, MAX_INPUT_CHARS + 1),
      timezone: sanitizeTimezone(input?.timezone),
      images,
      language,
    };
  })
  .handler(async ({ data, context }): Promise<SendResult> => {
    const { supabase, userId } = context;
    const content = data.content;
    const timezone = data.timezone;
    const images = data.images;

    if (content.length > MAX_INPUT_CHARS) {
      return { ok: false, error: `Message too long (max ${MAX_INPUT_CHARS} characters).`, code: "input" };
    }

    // Premium check (server-authoritative).
    const isPremium = await checkPremium(supabase, userId);
    if (!isPremium) {
      return {
        ok: false,
        error: "The AI Coach is available with an active subscription or after purchasing the app.",
        code: "not_premium",
      };
    }

    // Atomic slot claim.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: claimRows, error: claimErr } = await supabaseAdmin.rpc(
      "claim_ai_coach_slot",
      {
        _user_id: userId,
        _daily_limit: DAILY_LIMIT,
        _throttle_seconds: THROTTLE_SECONDS,
        _timezone: timezone,
      },
    );
    if (claimErr) {
      console.error("claim_ai_coach_slot failed", claimErr);
      return { ok: false, error: "Could not record usage.", code: "internal" };
    }
    const claim = Array.isArray(claimRows) ? claimRows[0] : claimRows;
    if (!claim?.ok) {
      if (claim?.reason === "limit") {
        return {
          ok: false,
          error: `Daily limit reached (${DAILY_LIMIT} messages/day). Resets at your local midnight.`,
          code: "limit",
        };
      }
      if (claim?.reason === "throttle") {
        return {
          ok: false,
          error: `Slow down, please wait ${claim.seconds_until_ok ?? THROTTLE_SECONDS}s before sending another message.`,
          code: "throttle",
        };
      }
      return { ok: false, error: "Could not record usage.", code: "internal" };
    }
    const newCount = claim.new_count as number;

    const language = data.language ?? (await getPreferredLanguage(supabase, userId));

    // Recent text-only history for context.
    const { data: history } = await supabase
      .from("ai_chat_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HISTORY_CONTEXT);
    const historyMessages = ((history ?? []) as Array<{ role: string; content: string }>)
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    // Persist user message. If images were attached, record a marker in the text so the
    // history reflects it. We don't store the raw image bytes.
    const persistedContent = images.length
      ? `${content}\n\n_[Attached ${images.length} image${images.length > 1 ? "s" : ""}]_`
      : content;
    const { data: userMsgRow, error: userInsertErr } = await supabase
      .from("ai_chat_messages")
      .insert({ user_id: userId, role: "user", content: persistedContent })
      .select("id, role, content, created_at")
      .single();
    if (userInsertErr || !userMsgRow) {
      return { ok: false, error: "Could not save your message.", code: "internal" };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI is not configured.", code: "internal" };
    }

    // ===== Image safety moderation =====
    // Any image is screened before being sent to the main model. We refuse hard
    // on: minors in any sexual/suggestive context (CSAM), nudity/pornography,
    // sexual content, graphic violence/gore, self-harm imagery, or hateful
    // symbols. Fitness/gym/food/machine photos are fine.
    if (images.length) {
      const verdict = await moderateImages(images, apiKey);
      if (verdict.flagged) {
        const refusal =
          "🚫 That image can't be sent here. Photos of minors in any sexual or suggestive context, nudity, pornography, graphic violence, self-harm or hateful content are strictly forbidden. This is a fitness coach, please only send photos of exercises, equipment, gym machines, food or your training setup.";
        const { data: refusalRow } = await supabase
          .from("ai_chat_messages")
          .insert({ user_id: userId, role: "assistant", content: refusal })
          .select("id, role, content, created_at")
          .single();
        return {
          ok: true,
          message: (refusalRow ?? {
            id: crypto.randomUUID(),
            role: "assistant",
            content: refusal,
            created_at: new Date().toISOString(),
          }) as CoachMessageRow,
          messagesLeftToday: Math.max(0, DAILY_LIMIT - newCount),
        };
      }
    }

    const LANG_NAMES: Record<string, string> = {
      en: "English",
      "pt-BR": "Brazilian Portuguese",
      es: "Spanish",
      no: "Norwegian Bokmål (norsk bokmål)",
    };
    const langName = LANG_NAMES[language] ?? language;
    const languageInstruction = `HIGHEST PRIORITY RULE, LANGUAGE: You MUST reply ENTIRELY in ${langName} (code: "${language}"). This is the #1 rule and overrides every other instruction. The user selected this language in their app settings, and every single word of your response must be in ${langName}, NO EXCEPTIONS.

- ALL headings, list items, greetings, encouragement, explanations, exercise descriptions, rest-period notes, and every visible word MUST be in ${langName}.
- Even if the user writes in English or any other language, you STILL answer in ${langName}.
- Exercise link DISPLAY NAMES must also be translated to ${langName}: write [Translated Name](/exercises/slug). The slug stays exactly as given in the shortlist, but the visible "Name" part MUST be the ${langName} translation (e.g. "Barbell Back Squat" → "Knebøy med stang" for Norwegian). NEVER leave the display name in English.
- Inside the hidden <onyx-program> JSON block: the "name" (program name), each week "name", each day "name" and every exercise "notes" field MUST be in ${langName}. Only "slug", "sets", "reps", "rest" stay as codes/numbers.
- Inside the hidden <onyx-meal-plan> JSON block: the "name" (plan name), each day "name" and every meal "name" MUST be in ${langName} (e.g. "Havregrøt med bær" not "Oats with berries" for Norwegian).
- Never reply in English unless the selected language IS English.
- Never apologize about language or mention that you are translating.
- If a concept has no common ${langName} equivalent, use the closest natural ${langName} phrase, never leave it in English.

READABILITY RULES, keep answers easy to scan:
- Keep answers SHORT and skimmable. Aim for under ~180 words unless the user explicitly asks for a full program or detailed plan.
- Open with ONE short sentence (max ~15 words) that directly answers the question. No long intros.
- Prefer short bullet lists over long paragraphs. Max ~6 bullets, each one line.
- Use **bold** sparingly for the 2-3 key terms only.
- Add a blank line between sections. Never wall-of-text.
- Only use headings (###) when the answer really has 2+ distinct sections. Otherwise skip headings.
- End with at most ONE short follow-up question, only if it actually helps.`;

    // Build a per-request retrieval catalog based on the user's message
    // + recent history keywords. Massively cheaper than dumping the full library.
    const historyBlob = historyMessages
      .slice(-4)
      .map((m) => m.content)
      .join(" ");
    const exerciseCatalog = buildExerciseCatalog(content, historyBlob);
    const catalogInstruction = `EXERCISE SHORTLIST for this reply (name|slug). Only use these slugs in [Name](/exercises/slug) links. Pick the closest match if the user asks for something not listed.\n\n${exerciseCatalog}`;

    // Build multimodal user content when images are attached.
    const userMessage = images.length
      ? {
          role: "user" as const,
          content: [
            { type: "text", text: content },
            ...images.map((url) => ({ type: "image_url", image_url: { url } })),
          ],
        }
      : { role: "user" as const, content };


    let assistantText = "";
    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: languageInstruction },
            { role: "system", content: catalogInstruction },
            ...historyMessages,
            userMessage,
          ],
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        if (resp.status === 429) {
          return { ok: false, error: "AI is busy, please try again in a moment.", code: "ai" };
        }
        if (resp.status === 402) {
          return { ok: false, error: "AI credits exhausted. Please contact support.", code: "ai" };
        }
        console.error("AI gateway error", resp.status, errText);
        return { ok: false, error: "AI request failed.", code: "ai" };
      }
      const json: any = await resp.json();
      assistantText = json?.choices?.[0]?.message?.content?.trim() ?? "";
      if (!assistantText) {
        return { ok: false, error: "AI returned an empty response.", code: "ai" };
      }
    } catch (e) {
      console.error("AI fetch failed", e);
      return { ok: false, error: "AI request failed.", code: "ai" };
    }

    // If the model got cut off mid-JSON, close the dangling <onyx-*> tag so
    // the extract steps can still parse it (or, if unsalvageable, strip the
    // raw JSON so it never leaks into the visible reply).
    assistantText = closeDanglingOnyxBlocks(assistantText);

    // Post-process: extract any <onyx-program> JSON blocks, save each as a real
    // custom_program row, and replace the block with a saveable link.
    assistantText = await extractAndSavePrograms(assistantText, supabase, userId, language);
    // Same for meal plans → ai_meal_plans row.
    assistantText = await extractAndSaveMealPlans(assistantText, supabase, userId, language);

    // Final safety: if any raw <onyx-*> fragment somehow survived, strip it so
    // the user never sees a wall of JSON.
    assistantText = assistantText
      .replace(/<onyx-(?:program|meal-plan)>[\s\S]*?<\/onyx-(?:program|meal-plan)>/gi, "")
      .replace(/<onyx-(?:program|meal-plan)>[\s\S]*$/gi, "")
      .trim();

    // Save assistant message.
    const { data: assistantRow, error: assistantErr } = await supabase
      .from("ai_chat_messages")
      .insert({ user_id: userId, role: "assistant", content: assistantText })
      .select("id, role, content, created_at")
      .single();
    if (assistantErr || !assistantRow) {
      return { ok: false, error: "Could not save AI response.", code: "internal" };
    }

    return {
      ok: true,
      message: assistantRow as CoachMessageRow,
      messagesLeftToday: Math.max(0, DAILY_LIMIT - newCount),
    };
  });

// -------- Salvage helpers for truncated model output --------

// Try to parse a JSON string; if truncated, walk back through the last balanced
// point and add matching closers so we can recover partial meal plans/programs
// even when the model got cut off by max_tokens.
function salvageJsonObject(raw: string): any | null {
  const base = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const tryParse = (t: string) => { try { return JSON.parse(t); } catch { return null; } };
  const first = tryParse(base);
  if (first) return first;

  for (let i = base.length; i > 20; i--) {
    const candidate = base.slice(0, i).replace(/[,\s]+$/, "");
    if (!candidate) break;
    const stack: string[] = [];
    let inStr = false;
    let esc = false;
    for (const ch of candidate) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
    if (!inStr) {
      const closers = stack.reverse().join("");
      const p = tryParse(candidate + closers);
      if (p) return p;
    }
    const cut = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
    if (cut <= 0) break;
    i = cut + 1;
  }
  return null;
}

// If the model output contains an opening <onyx-program> or <onyx-meal-plan>
// tag without its closing counterpart (truncated response), salvage the JSON
// and re-emit a closed block. If salvage fails, strip the dangling opener +
// trailing JSON so the user never sees a wall of raw JSON.
function closeDanglingOnyxBlocks(text: string): string {
  let out = text;
  for (const kind of ["program", "meal-plan"] as const) {
    const openRe = new RegExp(`<onyx-${kind}>`, "i");
    const closeRe = new RegExp(`</onyx-${kind}>`, "i");
    const openMatch = out.match(openRe);
    if (!openMatch || closeRe.test(out)) continue;
    const openIdx = openMatch.index ?? -1;
    if (openIdx < 0) continue;
    const jsonStart = openIdx + openMatch[0].length;
    const jsonRaw = out.slice(jsonStart);
    const parsed = salvageJsonObject(jsonRaw);
    if (!parsed) {
      out = out.slice(0, openIdx).trim();
      continue;
    }
    const rebuilt = `<onyx-${kind}>${JSON.stringify(parsed)}</onyx-${kind}>`;
    out = `${out.slice(0, openIdx)}${rebuilt}`;
  }
  return out;
}

// -------- Program block parsing & saving --------

const PROGRAM_BLOCK_RE = /<onyx-program>\s*([\s\S]*?)\s*<\/onyx-program>/gi;

async function extractAndSavePrograms(
  text: string,
  supabase: any,
  userId: string,
  language: string = "en",
): Promise<string> {
  const blocks = Array.from(text.matchAll(PROGRAM_BLOCK_RE));
  if (blocks.length === 0) return text;

  const L = PROGRAM_LINK_STRINGS[language] ?? PROGRAM_LINK_STRINGS.en;

  let out = text;
  for (const match of blocks) {
    const raw = match[1] ?? "";
    const parsed = safeParseProgram(raw);
    if (!parsed) {
      out = out.replace(match[0], "");
      continue;
    }

    try {
      const { data: row, error } = await supabase
        .from("custom_programs")
        .insert({ user_id: userId, name: parsed.name, weeks: parsed.weeks as any })
        .select("id")
        .single();
      if (error || !row) {
        out = out.replace(match[0], "");
        continue;
      }
      const id = (row as any).id as string;
      const totalExercises = parsed.weeks.reduce(
        (sum, w) => sum + w.days.reduce((s, d) => s + d.exercises.length, 0),
        0,
      );
      const totalDays = parsed.weeks.reduce((s, w) => s + w.days.length, 0);
      const wk = parsed.weeks.length;
      const link = [
        `\n\n---\n`,
        `📋 **[${L.openLabel}: ${parsed.name}](/shared-program/${id})**\n`,
        `_${L.week(wk)} · ${L.day(totalDays)} · ${L.exercise(totalExercises)}, ${L.tapHint}._`,
      ].join("");
      out = out.replace(match[0], link);
    } catch (e) {
      console.error("save program failed", e);
      out = out.replace(match[0], "");
    }
  }

  return out.trim();
}

const PROGRAM_LINK_STRINGS: Record<string, {
  openLabel: string;
  week: (n: number) => string;
  day: (n: number) => string;
  exercise: (n: number) => string;
  tapHint: string;
}> = {
  en: {
    openLabel: "Open program preview",
    week: (n) => `${n} week${n === 1 ? "" : "s"}`,
    day: (n) => `${n} day${n === 1 ? "" : "s"}`,
    exercise: (n) => `${n} exercise${n === 1 ? "" : "s"}`,
    tapHint: "tap to preview all videos and add to your library",
  },
  no: {
    openLabel: "Åpne programforhåndsvisning",
    week: (n) => `${n} uke${n === 1 ? "" : "r"}`,
    day: (n) => `${n} dag${n === 1 ? "" : "er"}`,
    exercise: (n) => `${n} øvelse${n === 1 ? "" : "r"}`,
    tapHint: "trykk for å se alle videoer og legge til i biblioteket ditt",
  },
  "pt-BR": {
    openLabel: "Abrir prévia do programa",
    week: (n) => `${n} semana${n === 1 ? "" : "s"}`,
    day: (n) => `${n} dia${n === 1 ? "" : "s"}`,
    exercise: (n) => `${n} exercício${n === 1 ? "" : "s"}`,
    tapHint: "toque para ver todos os vídeos e adicionar à sua biblioteca",
  },
  es: {
    openLabel: "Abrir vista previa del programa",
    week: (n) => `${n} semana${n === 1 ? "" : "s"}`,
    day: (n) => `${n} día${n === 1 ? "" : "s"}`,
    exercise: (n) => `${n} ejercicio${n === 1 ? "" : "s"}`,
    tapHint: "toca para ver todos los videos y añadirlo a tu biblioteca",
  },
};

// -------- Meal plan block parsing & saving --------

const MEAL_PLAN_BLOCK_RE = /<onyx-meal-plan>\s*([\s\S]*?)\s*<\/onyx-meal-plan>/gi;

const MEAL_PLAN_LINK_STRINGS: Record<string, {
  openLabel: string;
  day: (n: number) => string;
  meal: (n: number) => string;
  tapHint: string;
}> = {
  en: {
    openLabel: "Open meal plan",
    day: (n) => `${n} day${n === 1 ? "" : "s"}`,
    meal: (n) => `${n} meal${n === 1 ? "" : "s"}`,
    tapHint: "tap to preview and log a day into your nutrition",
  },
  no: {
    openLabel: "Åpne måltidsplan",
    day: (n) => `${n} dag${n === 1 ? "" : "er"}`,
    meal: (n) => `${n} måltid${n === 1 ? "" : "er"}`,
    tapHint: "trykk for å forhåndsvise og logge en dag i ernæringen din",
  },
  "pt-BR": {
    openLabel: "Abrir plano alimentar",
    day: (n) => `${n} dia${n === 1 ? "" : "s"}`,
    meal: (n) => `${n} refeição${n === 1 ? "" : "ões"}`,
    tapHint: "toque para pré-visualizar e registrar um dia na sua nutrição",
  },
  es: {
    openLabel: "Abrir plan de comidas",
    day: (n) => `${n} día${n === 1 ? "" : "s"}`,
    meal: (n) => `${n} comida${n === 1 ? "" : "s"}`,
    tapHint: "toca para previsualizar y registrar un día en tu nutrición",
  },
};

function safeParseMealPlan(raw: string): {
  name: string;
  days: Array<{ name: string; meals: Array<{ slot: string; name: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number; notes?: string }> }>;
} | null {
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const obj = JSON.parse(cleaned);
    if (!obj || typeof obj !== "object") return null;
    const name = String(obj.name ?? "AI Meal Plan").trim().slice(0, 60) || "AI Meal Plan";
    const daysRaw = Array.isArray(obj.days) ? obj.days : [];
    const days = daysRaw.slice(0, 14).map((d: any, di: number) => ({
      name: String(d?.name ?? `Day ${di + 1}`).slice(0, 60),
      meals: (Array.isArray(d?.meals) ? d.meals : []).slice(0, 8).map((m: any) => {
        const slotRaw = String(m?.slot ?? "snack").toLowerCase();
        const slot = ["breakfast", "lunch", "dinner", "snack"].includes(slotRaw) ? slotRaw : "snack";
        const nm = String(m?.name ?? "").trim().slice(0, 120);
        if (!nm) return null;
        const num = (v: any) => {
          const n = Number(v);
          return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
        };
        return {
          slot,
          name: nm,
          kcal: num(m?.kcal),
          protein_g: num(m?.protein_g),
          carbs_g: num(m?.carbs_g),
          fat_g: num(m?.fat_g),
          notes: m?.notes ? String(m.notes).slice(0, 200) : undefined,
        };
      }).filter((x: any): x is any => x !== null),
    })).filter((d: any) => d.meals.length > 0);
    if (days.length === 0) return null;
    return { name, days };
  } catch {
    return null;
  }
}

async function extractAndSaveMealPlans(
  text: string,
  supabase: any,
  userId: string,
  language: string = "en",
): Promise<string> {
  const blocks = Array.from(text.matchAll(MEAL_PLAN_BLOCK_RE));
  if (blocks.length === 0) return text;

  const L = MEAL_PLAN_LINK_STRINGS[language] ?? MEAL_PLAN_LINK_STRINGS.en;
  let out = text;
  for (const match of blocks) {
    const raw = match[1] ?? "";
    const parsed = safeParseMealPlan(raw);
    if (!parsed) {
      out = out.replace(match[0], "");
      continue;
    }
    try {
      const { data: row, error } = await supabase
        .from("ai_meal_plans")
        .insert({ user_id: userId, name: parsed.name, days: parsed.days as any })
        .select("id")
        .single();
      if (error || !row) {
        out = out.replace(match[0], "");
        continue;
      }
      const id = (row as any).id as string;
      const totalDays = parsed.days.length;
      const totalMeals = parsed.days.reduce((s, d) => s + d.meals.length, 0);
      const link = [
        `\n\n---\n`,
        `🍽️ **[${L.openLabel}: ${parsed.name}](/ai-meal-plan/${id})**\n`,
        `_${L.day(totalDays)} · ${L.meal(totalMeals)}, ${L.tapHint}._`,
      ].join("");
      out = out.replace(match[0], link);
    } catch (e) {
      console.error("save meal plan failed", e);
      out = out.replace(match[0], "");
    }
  }
  return out.trim();
}


function safeParseProgram(raw: string): {
  name: string;
  weeks: Array<{ name: string; days: Array<{ name: string; exercises: any[] }> }>;
} | null {
  try {
    // Tolerate accidental code-fence wrapping.
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    const obj = JSON.parse(cleaned);
    if (!obj || typeof obj !== "object") return null;
    const name = String(obj.name ?? "AI Program").trim().slice(0, 60) || "AI Program";
    const weeksRaw = Array.isArray(obj.weeks) ? obj.weeks : [];
    const weeks = weeksRaw.slice(0, 4).map((w: any, wi: number) => ({
      name: String(w?.name ?? `Week ${wi + 1}`).slice(0, 40),
      days: (Array.isArray(w?.days) ? w.days : []).slice(0, 7).map((d: any, di: number) => ({
        name: String(d?.name ?? `Day ${di + 1}`).slice(0, 60),
        exercises: (Array.isArray(d?.exercises) ? d.exercises : [])
          .slice(0, 15)
          .map((ex: any) => {
            const slug = String(ex?.slug ?? "").trim();
            if (!VALID_EXERCISE_SLUGS.has(slug)) return null;
            return {
              exerciseSlug: slug,
              exerciseName: EXERCISE_NAME_BY_SLUG.get(slug) ?? slug,
              sets: ex?.sets != null ? String(ex.sets).slice(0, 20) : "",
              reps: ex?.reps != null ? String(ex.reps).slice(0, 20) : "",
              rest: ex?.rest != null ? String(ex.rest).slice(0, 20) : "",
              tempo: ex?.tempo != null ? String(ex.tempo).slice(0, 20) : "",
              rpe: ex?.rpe != null ? String(ex.rpe).slice(0, 10) : "",
              notes: ex?.notes != null ? String(ex.notes).slice(0, 200) : "",
            };
          })
          .filter((x: any): x is any => x !== null),
      })).filter((d: any) => d.exercises.length > 0),
    })).filter((w: any) => w.days.length > 0);
    if (weeks.length === 0) return null;
    return { name, weeks };
  } catch {
    return null;
  }
}

// -------- Image safety moderation --------

type ModerationVerdict = { flagged: boolean; reason?: string };

async function moderateImages(images: string[], apiKey: string): Promise<ModerationVerdict> {
  const MODERATION_PROMPT = `You are an image safety classifier for a fitness coaching app.

Return ONLY strict JSON of the shape: {"flagged": boolean, "category": string}

Set "flagged": true if ANY image contains ANY of the following (zero tolerance):
- Minors (anyone appearing under 18) in sexual, suggestive, nude, semi-nude, or exploitative context, CSAM. Always flag.
- Nudity, partial nudity intended sexually, pornography, or sexual acts.
- Sexual content of any kind.
- Graphic violence, gore, mutilation, dead bodies, or torture.
- Self-harm, suicide imagery, or promotion of eating disorders.
- Hateful symbols, terrorism, or extremist content.
- Illegal drugs or drug use.

Set "flagged": false for normal fitness content: gym equipment, exercise machines, people fully clothed in athletic wear working out, food, meal photos, physique photos in normal athletic/gym attire (shorts + shirt / sports bra worn in a gym context is OK), screenshots of training apps, handwritten programs.

Categories: "csam", "sexual", "violence", "self_harm", "hate", "drugs", "safe".`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 60,
        messages: [
          { role: "system", content: MODERATION_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Classify these image(s). Respond with JSON only." },
              ...images.map((url) => ({ type: "image_url", image_url: { url } })),
            ],
          },
        ],
      }),
    });
    if (!resp.ok) {
      // Fail closed on any moderation failure, safer to refuse than to let through.
      console.error("moderation gateway error", resp.status);
      return { flagged: true, reason: "moderation_unavailable" };
    }
    const json: any = await resp.json();
    const raw = String(json?.choices?.[0]?.message?.content ?? "");
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return { flagged: true, reason: "unparseable" };
    const parsed = JSON.parse(match[0]);
    return { flagged: Boolean(parsed?.flagged), reason: String(parsed?.category ?? "") };
  } catch (e) {
    console.error("moderation failed", e);
    return { flagged: true, reason: "exception" };
  }
}

