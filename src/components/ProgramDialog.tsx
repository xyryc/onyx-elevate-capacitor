import { cloneElement, isValidElement, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { X } from "lucide-react";

import { type Program } from "@/data/programs";
import { useT } from "@/i18n/LanguageProvider";
import { MembershipModal } from "@/components/MembershipModal";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { TrainingDialog } from "@/components/TrainingDialog";
import { WorkoutsByWeek } from "@/components/WorkoutsByWeek";
import { useAccess } from "@/hooks/useAccess";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CompactCard({ p, fluid = false }: { p: Program; fluid?: boolean }) {
  const t = useT();
  const access = useAccess();
  const unlocked = access.hasProgram(p.slug);
  const hasAccess = !!p.isFree || unlocked;

  return (
    <ProgramDialog program={p}>
      <article
        role="button"
        tabIndex={0}
        aria-label={`${t("cta.openProgram")} ${p.title}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
        className={`group surface-card rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-electric/40 hover:shadow-electric flex flex-col h-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric ${fluid ? "w-full" : "w-[200px] shrink-0"}`}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" decoding="async" fetchPriority="low" />
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50/60 via-transparent to-transparent" />
          {p.isFree ? (
            <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/90 text-onyx-50 font-bold">{t("purchase.free")}</span>
          ) : hasAccess ? (
            <span className="absolute top-1.5 left-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/90 text-onyx-50 font-bold">{t("purchase.unlocked")}</span>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-9 w-9 rounded-full bg-onyx-50/70 backdrop-blur border border-border/60 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-electric"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          )}
          <span className="absolute top-1.5 right-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-onyx-50/80 backdrop-blur border border-border">{t(p.level)}</span>

        </div>
        <div className="p-2.5 flex flex-col flex-1">
          <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2 min-h-[2.4em] group-hover:text-electric transition-colors">{p.title}</h3>
          <div className="mt-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">{p.duration}</span>
            <span className="px-1 py-[1px] rounded bg-onyx-200 border border-border">{p.daysPerWeek}d/wk</span>
          </div>
        </div>
      </article>
    </ProgramDialog>
  );
}

export function ProgramDialog({ program, children }: { program: Program; children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const skipClearRef = useRef(false);
  const STORAGE_KEY = "programs:openDialog";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === program.slug) {
        setOpen(true);
      }
    } catch {}
  }, [program.slug]);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (typeof window === "undefined") return;
    try {
      if (v) {
        sessionStorage.setItem(STORAGE_KEY, program.slug);
      } else if (skipClearRef.current) {
        skipClearRef.current = false;
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  const handleNavigate = () => {
    skipClearRef.current = true;
    setOpen(false);
  };

  type TriggerElement = ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
  }>;
  const trigger = isValidElement(children)
    ? cloneElement(children as TriggerElement, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: (event: MouseEvent<HTMLElement>) => {
          (children as TriggerElement).props.onClick?.(event);
          if (!event.defaultPrevented) handleOpenChange(true);
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          const shouldOpen = event.key === "Enter" || event.key === " ";
          (children as TriggerElement).props.onKeyDown?.(event);
          if (shouldOpen) {
            event.preventDefault();
            handleOpenChange(true);
          }
        },
      })
    : children;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger}
      <DialogContent showClose={false} className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <DialogClose className="fixed sm:absolute right-3 top-[max(env(safe-area-inset-top),0.75rem)] sm:top-3 z-[60] grid h-10 w-10 place-items-center rounded-full bg-onyx-950/80 text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-onyx-950/95 transition-colors focus:outline-none focus:ring-2 focus:ring-electric shadow-lg">
          <X className="h-5 w-5" />
          <span className="sr-only">{t("common.close")}</span>
        </DialogClose>

        <ProgramDialogBody program={program} onNavigate={handleNavigate} />
      </DialogContent>
    </Dialog>
  );
}

function ProgramDialogBody({ program: p, onNavigate }: { program: Program; onNavigate: () => void }) {
  const t = useT();
  const access = useAccess();
  const unlocked = access.hasProgram(p.slug);
  const hasMembership = access.hasBundle || access.hasSubscription;
  const hasFullAccess = !!p.isFree || unlocked || hasMembership;

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-none sm:rounded-t-2xl bg-onyx-100 border-b border-border/60">
        <img
          src={p.image}
          alt={p.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-onyx-50 to-transparent" />
        <span className="absolute top-3 left-3 rounded-md bg-onyx-50/90 border border-border/60 text-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
          {t(p.category)}
        </span>
      </div>

      <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
        <DialogHeader className="text-left">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-onyx-100 border border-border text-muted-foreground">
              {p.duration}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-onyx-100 border border-border text-muted-foreground">
              {p.daysPerWeek} {t("programs.daysFull")}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-onyx-100 border border-border text-muted-foreground">
              {t(p.level)}
            </span>
          </div>
          <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
            {p.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {p.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ProgramDialogStat label={t("program.goal")} value={p.goal} />
          <ProgramDialogStat label={t("program.duration")} value={p.duration} />
          <ProgramDialogStat label={t("program.frequency")} value={`${p.daysPerWeek} ${t("programs.daysFull")}`} />
          <ProgramDialogStat label={t("program.level")} value={t(p.level)} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <TrainingDialog program={p}>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-electric px-3 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow transition-colors w-full"
            >
              {t("program.addToWorkout")}
            </button>
          </TrainingDialog>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(`program-workouts-${p.slug}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center justify-center rounded-md border border-border bg-onyx-100 px-3 py-2.5 text-sm font-semibold hover:border-electric/60 hover:text-electric transition-colors w-full"
          >
            {t("program.viewExercises")}
          </button>
          <ShareToChatButton
            variant="outline"
            className="w-full"
            target={{
              url: `/programs/${p.slug}`,
              title: p.title,
              subtitle: `${p.duration} · ${p.category}`,
              image: p.image,
              kind: "program",
            }}
          />
          <FavoriteButton type="program" slug={p.slug} className="w-full" />
        </div>


        {!hasFullAccess && (
          <div className="mt-4 rounded-lg border border-electric/30 bg-electric/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-electric">{t("programs.members.eyebrow")}</p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{t("programs.members.subtitle")}</p>
            <div className="mt-3">
              <MembershipModal
                trigger={
                  <button type="button" className="rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50 hover:bg-electric-glow transition-colors">
                    {t("programs.members.cta")}
                  </button>
                }
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("program.workoutSummary")}
          </h3>
          <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{p.summary}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ProgramDialogPanel title={t("program.whoFor")} items={p.whoItsFor} />
          <ProgramDialogPanel title={t("program.whatYouGet")} items={p.whatYouGet} />
        </div>

        <div className="mt-8">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("program.weeklySchedule")}
          </h3>
          <ul className="mt-3 divide-y divide-border/60 rounded-lg border border-border/60 bg-onyx-100/40 overflow-hidden">
            {p.weeklySchedule.map((day, i) => (
              <li key={`${day.day}-${i}`} className="grid grid-cols-[84px_1fr] gap-3 px-3 py-2.5 text-sm">
                <span className="text-xs uppercase tracking-wider text-electric font-semibold">{t(day.day)}</span>
                <span className="text-foreground/85">{t(day.session)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8" id={`program-workouts-${p.slug}`}>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("program.workouts")}
          </h3>
          <div className="mt-3">
            <WorkoutsByWeek p={p} />
          </div>
        </div>

      </div>
    </>
  );
}

function ProgramDialogStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border/60 bg-onyx-100 px-2 py-2 text-center">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground leading-tight truncate">{label}</p>
      <p className="mt-0.5 font-display font-bold text-sm truncate">{value}</p>
    </div>
  );
}

function ProgramDialogPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border/60 bg-onyx-100/40 p-4">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
            <svg className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
