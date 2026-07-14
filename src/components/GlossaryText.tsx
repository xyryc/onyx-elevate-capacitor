import { useMemo } from "react";
import { GLOSSARY, getGlossaryEntry } from "@/data/glossary";
import { useLang } from "@/i18n/LanguageProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Scans a string, finds any known glossary term (case-insensitive, whole-word),
 * and wraps it in a tap-to-define blue popover. Non-matching text is rendered as-is.
 *
 * Use for beginner-facing copy where jargon (RPE, hypertrophy, AMRAP…) may appear.
 */
export function GlossaryText({ children, className }: { children: string; className?: string }) {
  const { lang } = useLang();

  // Build one big regex of all terms + aliases, sorted longest-first so
  // "drop set" wins over "set".
  const regex = useMemo(() => {
    const all = GLOSSARY.flatMap((g) => [g.term, ...(g.aliases ?? [])])
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (!all.length) return null;
    return new RegExp(`\\b(${all.join("|")})\\b`, "gi");
  }, []);

  if (!regex || !children) {
    return <span className={className}>{children}</span>;
  }

  const parts: Array<string | { term: string; key: string }> = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  regex.lastIndex = 0;
  while ((match = regex.exec(children)) !== null) {
    if (match.index > last) parts.push(children.slice(last, match.index));
    parts.push({ term: match[0], key: `t-${i++}-${match.index}` });
    last = match.index + match[0].length;
    if (match[0].length === 0) regex.lastIndex++;
  }
  if (last < children.length) parts.push(children.slice(last));

  return (
    <span className={className}>
      {parts.map((p, idx) => {
        if (typeof p === "string") return <span key={idx}>{p}</span>;
        const entry = getGlossaryEntry(p.term);
        if (!entry) return <span key={idx}>{p.term}</span>;
        const def = entry.definitions[lang] ?? entry.definitions.en;
        return (
          <Popover key={p.key}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-electric decoration-electric/60 decoration-dotted underline underline-offset-4 hover:decoration-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric/60 rounded-sm"
                aria-label={`Definition: ${entry.term}`}
              >
                {p.term}
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-72 text-sm bg-onyx-100 border-electric/30">
              <p className="font-semibold text-electric mb-1 capitalize">{entry.term}</p>
              <p className="text-foreground/85 leading-relaxed">{def}</p>
            </PopoverContent>
          </Popover>
        );
      })}
    </span>
  );
}
