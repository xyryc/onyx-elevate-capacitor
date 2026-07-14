import { useEffect, useState, type ReactNode } from "react";

/**
 * On mobile (<1024px) renders children inside a collapsed electric-bordered
 * teaser box that expands when tapped. On desktop renders children as-is so
 * the existing layout is untouched.
 */
export function MobileCollapse({
  eyebrow,
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isDesktop) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-electric/30 bg-gradient-to-br from-onyx-100/60 to-onyx-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-bold">{eyebrow}</p>
          )}
          <p className="mt-1 font-display font-bold text-base leading-tight">{title}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
          <p className="mt-2 text-[10px] uppercase tracking-wider text-electric/80 font-semibold">
            {open ? "Tap to hide ▴" : "Tap to view ▾"}
          </p>
        </div>
        <span
          className={`shrink-0 grid h-9 w-9 place-items-center rounded-full bg-electric/10 text-electric transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && <div className="px-4 pb-5 pt-1">{children}</div>}
    </div>
  );
}
