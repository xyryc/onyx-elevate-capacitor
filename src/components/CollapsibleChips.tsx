import { useState, type ReactNode } from "react";
import { useT } from "@/i18n/LanguageProvider";

/**
 * Mobile: collapses a long chip list into a tappable box that expands to reveal
 * the chips (grid). Desktop (lg+): renders chips inline as a flex-wrap row.
 *
 * Pass either `children` (already-styled chip elements) OR use the standalone
 * component consumers by wrapping their existing chips in <CollapsibleChips>.
 */
export function CollapsibleChips({
  label,
  activeLabel,
  children,
}: {
  label: string;
  activeLabel?: string;
  children: ReactNode;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Mobile / tablet: collapsible box */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-electric/40 bg-gradient-to-br from-onyx-100/80 to-onyx-50 px-4 py-3 text-left shadow-[0_0_0_1px_oklch(0.7_0.22_240/0.15)_inset] hover:border-electric/70 transition-all"
        >
          <div className="min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">
              {t(label)}
            </span>
            {activeLabel && (
              <span className="block mt-0.5 text-sm font-semibold text-foreground truncate">
                {t(activeLabel)}
              </span>
            )}
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`h-5 w-5 text-electric shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div
            className="mt-2 rounded-xl border border-border bg-onyx-100/60 p-3 grid grid-cols-2 gap-2 place-items-center animate-in fade-in slide-in-from-top-1 duration-200"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        )}
      </div>

      {/* Desktop: inline flex-wrap */}
      <div className="hidden lg:flex flex-wrap gap-2 justify-center">{children}</div>
    </div>
  );
}
