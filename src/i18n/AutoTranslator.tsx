import { useContext, useEffect, useRef } from "react";
import { LanguageContext } from "@/i18n/LanguageProvider";
// translateBatch import removed, live AI translation is disabled; we ship pre-generated bundles.
import { buildSeedCache } from "./seedDictionary";
import { programs, warmupByCategory } from "@/data/programs";
import { recipes } from "@/data/recipes";
import { nutritionPlans } from "@/data/nutritionPlans";
import { challenges } from "@/data/challenges";
import { articles } from "@/data/articles";
import { goals } from "@/data/goals";
import { coaches } from "@/data/coaches";
import { supplements } from "@/data/supplements";
import { categories as exerciseCategories, exercises } from "@/data/exercises";
import { poses as yogaPoses, articles as yogaArticles, introCards as yogaIntroCards } from "@/routes/yoga-mobility";
import { clearPreparedTranslations, hasPreparedTranslations, markPreparedTranslations, translationCacheKey } from "./translationCache";
import generatedNo from "./generated/no.json";
import generatedEs from "./generated/es.json";
import generatedPt from "./generated/pt-BR.json";

const GENERATED: Record<string, Record<string, string>> = {
  no: generatedNo as Record<string, string>,
  es: generatedEs as Record<string, string>,
  "pt-BR": generatedPt as Record<string, string>,
};

function loadGenerated(lang: string): Record<string, string> {
  return GENERATED[lang] ?? {};
}

// Tags whose text we never translate
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "INPUT",
  "SVG", "PATH", "CANVAS", "IFRAME",
]);

// Attributes we translate on elements
const ATTRS = ["placeholder", "aria-label", "title", "alt"];

// Skip text that is just numbers, punctuation, prices, etc.
const HAS_LETTER = /\p{L}{2,}/u;

type CacheMap = Record<string, string>;

const NEVER_TRANSLATE_EXACT = new Set<string>([
  "Onyx",
  "Onyx Elevate",
]);

function loadCache(lang: string): CacheMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(translationCacheKey(lang));
    return raw ? (JSON.parse(raw) as CacheMap) : {};
  } catch {
    return {};
  }
}

function saveCache(lang: string, cache: CacheMap) {
  try {
    // The generated dictionary is shipped in the JS bundle; persisting it to
    // localStorage as well would blow past the ~5 MB quota. Only save the
    // delta, strings the runtime AI translator has fetched on top of what
    // is already baked in.
    const baked = GENERATED[lang] ?? {};
    const delta: CacheMap = {};
    for (const [src, tx] of Object.entries(cache)) {
      if (baked[src] === tx) continue;
      delta[src] = tx;
    }
    window.localStorage.setItem(translationCacheKey(lang), JSON.stringify(delta));
  } catch {
    // quota, drop silently
  }
}

function shouldSkipParent(node: Node): boolean {
  let el: Node | null = node.parentNode;
  while (el && el.nodeType === 1) {
    const e = el as HTMLElement;
    if (SKIP_TAGS.has(e.tagName)) return true;
    if (e.dataset && e.dataset.noTranslate !== undefined) return true;
    el = el.parentNode;
  }
  return false;
}

type Target =
  | { kind: "text"; node: Text; original: string }
  | { kind: "attr"; el: Element; attr: string; original: string };

function uniqueStrings(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const text = value.trim();
    if (!text || NEVER_TRANSLATE_EXACT.has(text) || !HAS_LETTER.test(text) || text.length > 1200 || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

function collectDeepStrings(value: unknown, out: string[] = [], key = ""): string[] {
  if (typeof value === "string") {
    if (!/^(slug|image|img|gallery|url|videoUrl|thumbnailUrl|priceId|alternatives|id)$/i.test(key)) out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectDeepStrings(item, out, key));
    return out;
  }
  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      collectDeepStrings(childValue, out, childKey);
    });
  }
  return out;
}

function collectStaticCatalogText(): string[] {
  const values: string[] = [];
  const push = (value: unknown) => {
    if (typeof value === "string") values.push(value);
  };
  const pushAll = (items?: unknown[]) => items?.forEach(push);

  programs.forEach((p) => {
    [p.title, p.tagline, p.category, p.level, p.duration, p.goal, p.summary, p.nutrition, p.supplementation, p.recovery, p.trainingOverview, p.progression, p.price].forEach(push);
    pushAll(p.whoItsFor);
    pushAll(p.whatYouGet);
    pushAll(p.includes);
    p.weeklySchedule.forEach((d) => [d.day, d.session].forEach(push));
    p.workouts.forEach((w) => {
      [w.day, w.title, w.focus].forEach(push);
      w.exercises.forEach((ex) => [ex.name, ex.sets, ex.reps, ex.rest].forEach(push));
    });
    p.faqs.forEach((f) => [f.question, f.answer].forEach(push));
    const warmup = p.warmup ?? warmupByCategory[p.category];
    if (warmup) {
      push(warmup.intro);
      [...warmup.generalPrep, ...warmup.specificPrep, ...warmup.activation].forEach((step) => {
        [step.name, step.detail, step.duration].forEach(push);
      });
      pushAll(warmup.rules);
    }
  });

  Object.values(warmupByCategory).forEach((warmup) => {
    push(warmup.intro);
    [...warmup.generalPrep, ...warmup.specificPrep, ...warmup.activation].forEach((step) => {
      [step.name, step.detail, step.duration].forEach(push);
    });
    pushAll(warmup.rules);
  });

  // Preload the heavy text catalogs used after navigation, so pages like
  // Programs, Recipes, Challenges, Coaches and Nutrition open already cached
  // instead of showing English while the background translator catches up.
  collectDeepStrings(recipes, values);
  collectDeepStrings(nutritionPlans, values);
  collectDeepStrings(challenges, values);
  collectDeepStrings(articles, values);
  collectDeepStrings(goals, values);
  collectDeepStrings(coaches, values);
  collectDeepStrings(supplements, values);
  collectDeepStrings(yogaPoses, values);
  collectDeepStrings(yogaArticles, values);
  collectDeepStrings(yogaIntroCards, values);


  exerciseCategories.forEach((category) => {
    [category.label, category.blurb].forEach(push);
  });
  exercises.forEach((exercise) => {
    [
      exercise.name,
      exercise.shortDescription,
      exercise.category,
      exercise.primaryMuscle,
      exercise.exerciseType,
      exercise.equipment,
      exercise.mechanics,
      exercise.forceType,
      exercise.level,
      exercise.overview,
    ].forEach(push);
    exercise.secondaryMuscles.forEach(push);
    exercise.steps.forEach((step) => [step.title, step.body].forEach(push));
    exercise.proTips.forEach(push);
    exercise.commonMistakes.forEach(push);
  });

  return uniqueStrings(values);
}

export function AutoTranslator() {
  const ctx = useContext(LanguageContext);
  const lang = ctx?.lang ?? "en";
  // Stores original English for each node/attr we've touched so we can restore
  const originals = useRef(new WeakMap<Node, string>());
  const attrOriginals = useRef(new WeakMap<Element, Record<string, string>>());
  const lastWrittenText = useRef(new WeakMap<Text, string>());
  const lastWrittenAttr = useRef(new WeakMap<Element, Record<string, string>>());
  const preloadedCatalogLangs = useRef(new Set<string>());


  useEffect(() => {
    if (!ctx) return;
    if (typeof window === "undefined") return;

    // Reset per-language: the originals map captures whatever text was in the
    // DOM the first time we saw a node. If those nodes were rendered by
    // react-i18next in the previous language (e.g. "SPRÅK", "Norsk"),
    // restoreAll() would forever revert them to that stale non-English text,
    // producing mismatched flags/labels after switching languages.
    originals.current = new WeakMap<Node, string>();
    attrOriginals.current = new WeakMap<Element, Record<string, string>>();
    lastWrittenText.current = new WeakMap<Text, string>();
    lastWrittenAttr.current = new WeakMap<Element, Record<string, string>>();

    let cancelled = false;
    // Seed dictionary is HAND-VERIFIED and must always win over the persisted
    // AI cache, otherwise old bad AI translations (e.g. "Setel" for "Beginner")
    // stick around forever in users' localStorage.
    // Layering order (last wins):
    //   1. loadCache, persisted AI translations from previous sessions
    //   2. loadGenerated, build-time pre-translated dictionary (baked in)
    //   3. buildSeedCache, hand-verified overrides
    const cache: CacheMap = lang === "en"
      ? {}
      : { ...loadCache(lang), ...loadGenerated(lang), ...buildSeedCache(lang) };
    // If the build-time dictionary shipped with entries for this language,
    // mark it as prepared so the language switcher never blocks on a splash.
    if (lang !== "en" && Object.keys(loadGenerated(lang)).length > 0) {
      markPreparedTranslations(lang);
    }
    let activeStartedAt = Date.now();

    function markTranslationStart(count = 0, blocking = false) {
      if (lang === "en") return;
      activeStartedAt = Date.now();
      document.documentElement.dataset.onyxTranslating = lang;
      window.dispatchEvent(new CustomEvent("onyx:translation-start", { detail: { lang, count, blocking, startedAt: activeStartedAt } }));
    }

    function markTranslationReady() {
      const readyAt = Date.now();
      if (document.documentElement.dataset.onyxTranslating === lang) {
        delete document.documentElement.dataset.onyxTranslating;
      }
      (window as unknown as { __onyxTranslationReady?: { lang: string; at: number; startedAt: number } }).__onyxTranslationReady = { lang, at: readyAt, startedAt: activeStartedAt };
      window.dispatchEvent(new CustomEvent("onyx:translation-ready", { detail: { lang, at: readyAt, startedAt: activeStartedAt } }));
    }

    function getOriginalText(n: Text): string {
      const stored = originals.current.get(n);
      if (stored !== undefined) return stored;
      const v = n.nodeValue ?? "";
      originals.current.set(n, v);
      return v;
    }

    function getOriginalAttr(el: Element, attr: string): string {
      let map = attrOriginals.current.get(el);
      if (!map) {
        map = {};
        attrOriginals.current.set(el, map);
      }
      if (map[attr] !== undefined) return map[attr];
      const v = el.getAttribute(attr) ?? "";
      map[attr] = v;
      return v;
    }

    function applyText(n: Text, value: string) {
      if (n.nodeValue !== value) {
        n.nodeValue = value;
        lastWrittenText.current.set(n, value);
      }
    }

    function applyAttr(el: Element, attr: string, value: string) {
      if (el.getAttribute(attr) !== value) {
        el.setAttribute(attr, value);
        let map = lastWrittenAttr.current.get(el);
        if (!map) { map = {}; lastWrittenAttr.current.set(el, map); }
        map[attr] = value;
      }
    }


    function collect(root: Node): Target[] {
      const out: Target[] = [];
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            if (node.nodeType === 3) {
              const text = (node as Text).nodeValue ?? "";
              if (!HAS_LETTER.test(text)) return NodeFilter.FILTER_REJECT;
              if (shouldSkipParent(node)) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
            // element - we want to also visit for attrs but not stop descent
            return NodeFilter.FILTER_SKIP;
          },
        },
      );
      // include the root itself if it's a text node (TreeWalker starts AFTER root)
      if (root.nodeType === 3) {
        const tn = root as Text;
        const text = tn.nodeValue ?? "";
        if (HAS_LETTER.test(text) && !shouldSkipParent(tn)) {
          out.push({ kind: "text", node: tn, original: getOriginalText(tn) });
        }
      }
      let cur = walker.nextNode();
      while (cur) {
        if (cur.nodeType === 3) {
          const tn = cur as Text;
          out.push({ kind: "text", node: tn, original: getOriginalText(tn) });
        }
        cur = walker.nextNode();
      }
      // attributes: simple querySelector for elements with translatable attrs
      const elRoot = root.nodeType === 1 ? (root as Element) : document.body;
      for (const attr of ATTRS) {
        const list = elRoot.querySelectorAll(`[${attr}]`);
        list.forEach((el) => {
          if (SKIP_TAGS.has(el.tagName)) return;
          if ((el as HTMLElement).dataset?.noTranslate !== undefined) return;
          const v = el.getAttribute(attr) ?? "";
          if (!HAS_LETTER.test(v)) return;
          out.push({ kind: "attr", el, attr, original: getOriginalAttr(el, attr) });
        });
      }
      return out;
    }

    function restoreAll() {
      // restore text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let cur = walker.nextNode();
      while (cur) {
        const orig = originals.current.get(cur);
        if (orig !== undefined && cur.nodeValue !== orig) {
          applyText(cur as Text, orig);
        }
        cur = walker.nextNode();
      }
      // attributes
      for (const attr of ATTRS) {
        document.querySelectorAll(`[${attr}]`).forEach((el) => {
          const map = attrOriginals.current.get(el);
          if (map && map[attr] !== undefined) {
            applyAttr(el, attr, map[attr]);
          }
        });
      }
    }

    function restoreTranslatorWrites() {
      // On a language swap React may have already re-rendered real i18n text
      // into the new language. Only undo text/attrs that still exactly match
      // what this translator wrote, so hardcoded DOM strings return to their
      // English source before the next language pass without clobbering React.
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let cur = walker.nextNode();
      while (cur) {
        const written = lastWrittenText.current.get(cur as Text);
        const orig = originals.current.get(cur);
        if (written !== undefined && orig !== undefined && cur.nodeValue === written) {
          (cur as Text).nodeValue = orig;
        }
        cur = walker.nextNode();
      }

      for (const attr of ATTRS) {
        document.querySelectorAll(`[${attr}]`).forEach((el) => {
          const written = lastWrittenAttr.current.get(el)?.[attr];
          const orig = attrOriginals.current.get(el)?.[attr];
          if (written !== undefined && orig !== undefined && el.getAttribute(attr) === written) {
            el.setAttribute(attr, orig);
          }
        });
      }
    }

    async function ensureCached(_textsToCache: string[]) {
      // Live AI translation is disabled, we ship pre-generated bundles for
      // every supported language. Strings missing from the bundle stay in
      // English rather than triggering a slow network round-trip.
      return true;
    }



    async function translateTargets(targets: Target[]): Promise<boolean> {
      if (lang === "en") return true;
      const sources = uniqueStrings(targets.map((t) => t.original.trim()));

      // apply cached translations immediately
      for (const t of targets) {
        const src = t.original.trim();
        if (!src || !cache[src]) continue;
        if (t.kind === "text") applyText(t.node, t.original.replace(src, cache[src]));
        else applyAttr(t.el, t.attr, t.original.replace(src, cache[src]));
      }

      const cached = await ensureCached(sources);
      if (!cached) return false;

      // re-apply after newly fetched translations land in cache
      for (const tgt of targets) {
        const src = tgt.original.trim();
        if (!src || !cache[src]) continue;
        const newVal = tgt.original.replace(src, cache[src]);
        if (tgt.kind === "text") {
          if (tgt.node.nodeValue !== newVal) applyText(tgt.node, newVal);
        } else {
          if (tgt.el.getAttribute(tgt.attr) !== newVal) applyAttr(tgt.el, tgt.attr, newVal);
        }
      }
      return true;
    }


    // Main run: restore originals then translate to current lang
    async function run() {
      // Always restore to the English originals first. Otherwise, when the
      // user switches from one non-English language to another (e.g. NO → PT),
      // any string that isn't in the new language's cache would keep its
      // previous-language text stuck in the DOM.
      restoreAll();
      if (lang === "en") {
        markTranslationReady();
        return;
      }
      const targets = collect(document.body);
      const needsFullPreload = !preloadedCatalogLangs.current.has(lang) && !hasPreparedTranslations(lang);
      markTranslationStart(targets.length, needsFullPreload);
      if (needsFullPreload) {
        const preloadOk = await ensureCached([...collectStaticCatalogText(), ...uniqueStrings(targets.map((t) => t.original.trim()))]);
        if (!preloadOk && !cancelled) {
          clearPreparedTranslations(lang);
          window.setTimeout(() => { void run(); }, 1500);
          return;
        }
        preloadedCatalogLangs.current.add(lang);
        markPreparedTranslations(lang);
      } else {
        preloadedCatalogLangs.current.add(lang);
      }
      const pageOk = await translateTargets(targets);
      if (!pageOk && !cancelled) {
        window.setTimeout(() => { void run(); }, 1500);
        return;
      }
      if (!cancelled) {
        markTranslationReady();
      }
    }

    // Initial run after a microtask so the route has rendered. Keep this as a
    // single run: the splash screen waits for its ready event, and a duplicate
    // run could signal "ready" before the full preload catalog has finished.
    let runPromise: Promise<void> | null = null;
    function triggerRun() {
      if (runPromise) return;
      runPromise = run().finally(() => { runPromise = null; });
    }

    const initialTimer = window.setTimeout(triggerRun, 0);

    const onTranslationRequest = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.lang === lang) triggerRun();
    };
    window.addEventListener("onyx:translation-request", onTranslationRequest as EventListener);


    // Observe DOM changes for SPA navigation / dynamic content
    let scheduled = false;
    const pendingRoots = new Set<Node>();
    const pendingSyncRoots = new Set<Node>();
    let syncRafId = 0;

    // Drop any root that's a descendant of another root in the same batch so
    // we don't walk the same subtree twice.
    function dedupeRoots(roots: Iterable<Node>): Node[] {
      const arr = Array.from(roots).filter((n) => n.nodeType === 1 || n.nodeType === 3 && n.isConnected);
      arr.sort((a, b) => {
        let da = 0, db = 0;
        for (let x: Node | null = a; x; x = x.parentNode) da++;
        for (let x: Node | null = b; x; x = x.parentNode) db++;
        return da - db;
      });
      const kept: Node[] = [];
      for (const n of arr) {
        let inside = false;
        for (const k of kept) {
          if (k === n) { inside = true; break; }
          if (k.nodeType === 1 && (k as Element).contains(n)) { inside = true; break; }
        }
        if (!inside) kept.push(n);
      }
      return kept;
    }

    // Apply cached translations to freshly-mounted subtrees. Deferred to the
    // next animation frame so we never block paint inside the MutationObserver
    // callback, this is the main source of category-swap jank.
    function applyCachedSync(roots: Iterable<Node>) {
      if (lang === "en") return;
      for (const root of roots) pendingSyncRoots.add(root);
      if (syncRafId) return;
      syncRafId = window.requestAnimationFrame(() => {
        syncRafId = 0;
        if (cancelled) { pendingSyncRoots.clear(); return; }
        const deduped = dedupeRoots(pendingSyncRoots);
        pendingSyncRoots.clear();
        for (const root of deduped) {
          let targets: Target[] = [];
          try { targets = collect(root); } catch { continue; }
          for (const t of targets) {
            const src = t.original.trim();
            if (!src || !cache[src]) continue;
            const newVal = t.original.replace(src, cache[src]);
            if (t.kind === "text") {
              if (t.node.nodeValue !== newVal) applyText(t.node, newVal);
            } else {
              if (t.el.getAttribute(t.attr) !== newVal) applyAttr(t.el, t.attr, newVal);
            }
          }
        }
      });
    }

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(() => {
        scheduled = false;
        if (lang === "en") {
          pendingRoots.clear();
          return;
        }
        const roots = dedupeRoots(pendingRoots);
        pendingRoots.clear();
        const all: Target[] = [];
        for (const root of roots) {
          try { all.push(...collect(root)); } catch {}
        }
        if (all.length) {
          markTranslationStart(all.length, false);
          void translateTargets(all).then((ok) => {
            if (!cancelled && ok) markTranslationReady();
            if (!cancelled && !ok) window.setTimeout(() => { void run(); }, 1500);
          });
        } else {
          markTranslationReady();
        }
      }, 400);
    }

    const observer = new MutationObserver((mutations) => {
      const freshRoots: Node[] = [];
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1 || n.nodeType === 3) {
              pendingRoots.add(n);
              freshRoots.push(n);
            }
          });
        } else if (m.type === "characterData") {
          const n = m.target as Text;
          if (lastWrittenText.current.get(n) === n.nodeValue) continue;
          originals.current.delete(n);
          pendingRoots.add(n);
          freshRoots.push(n);
        } else if (m.type === "attributes" && m.attributeName && ATTRS.includes(m.attributeName)) {
          const el = m.target as Element;
          const attr = m.attributeName;
          const written = lastWrittenAttr.current.get(el)?.[attr];
          if (written !== undefined && written === el.getAttribute(attr)) continue;
          const map = attrOriginals.current.get(el);
          if (map) delete map[attr];
          pendingRoots.add(el);
          freshRoots.push(el);
        }
      }
      if (freshRoots.length) applyCachedSync(freshRoots);
      if (pendingRoots.size) {
        schedule();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });

    // Expose a synchronous pre-paint translator so routes can call it from
    // useLayoutEffect and prevent the English flash on freshly-mounted content.
    (window as unknown as { __onyxApplyCachedNow?: () => void }).__onyxApplyCachedNow = () => {
      if (lang === "en") return;
      applyCachedSync([document.body]);
    };

    return () => {
      restoreTranslatorWrites();
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.removeEventListener("onyx:translation-request", onTranslationRequest as EventListener);
      observer.disconnect();
      delete (window as unknown as { __onyxApplyCachedNow?: () => void }).__onyxApplyCachedNow;
    };
  }, [lang]);

  if (!ctx) return null;
  return null;
}
