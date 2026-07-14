import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Exercise } from "@/data/exercises";
import { useAccess } from "@/hooks/useAccess";
import { MembershipModal } from "@/components/MembershipModal";
import { ShareToChatButton } from "@/components/ShareToChatButton";
import { isFreePreviewExercise } from "@/lib/exercisePreview";

/**
 * Wraps an exercise card as a Dialog trigger. Clicking opens full exercise
 * details in a smooth modal overlay (matches yoga tab).
 *
 * Access rule: members unlock everything. Non-members can still open the
 * first 8 exercises per category (the "free preview" set); every other
 * exercise opens the membership paywall modal instead.
 */
export function ExerciseDialog({ exercise, children }: { exercise: Exercise; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const access = useAccess();
  const hasAccess = access.hasBundle || access.hasSubscription;
  const isFree = isFreePreviewExercise(exercise);

  // While access is still loading, don't route to the paywall yet — otherwise
  // paid users get the membership modal for a split second on tap.
  if (!access.loading && !hasAccess && !isFree) {
    return <MembershipModal trigger={children} />;
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-3xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-y-auto overscroll-contain p-0 bg-onyx-50 border-border/60 rounded-none sm:rounded-2xl [-webkit-overflow-scrolling:touch]">
        <div className="sticky top-0 right-0 z-50 h-0 pointer-events-none">
          <DialogClose className="absolute right-3 top-3 pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <ExerciseDialogBody exercise={exercise} />
      </DialogContent>
    </Dialog>
  );
}

function ExerciseDialogBody({ exercise: e }: { exercise: Exercise }) {
  return (
    <>
      <div className="relative aspect-video overflow-hidden rounded-none sm:rounded-t-2xl bg-onyx-100 border-b border-border/60">
        {e.videoUrl ? (
          <iframe
            src={e.videoUrl}
            title={`${e.name} demonstration`}
            loading="lazy"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : e.thumbnailUrl ? (
          <img
            src={e.thumbnailUrl}
            alt={e.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-onyx-100 text-muted-foreground text-sm">
            Video coming soon
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-md border border-electric/40 bg-onyx-50/80 backdrop-blur-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric z-10">
          {e.level}
        </span>
      </div>

      <div className="px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1rem)] sm:px-6 sm:pb-6">
        <DialogHeader className="text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-semibold">
            {e.exerciseType} · {e.mechanics}
          </p>
          <DialogTitle className="font-display text-2xl md:text-3xl font-bold leading-tight">
            {e.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {e.shortDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3">
          <ShareToChatButton
            variant="outline"
            target={{
              url: `/exercises/${e.slug}`,
              title: e.name,
              subtitle: `${e.exerciseType} · ${e.mechanics}`,
              image: e.thumbnailUrl ?? null,
              kind: "exercise",
            }}
          />
        </div>

        <div className="mt-6 rounded-lg border border-border/60 bg-onyx-100/40 p-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
            Overview
          </h4>
          <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{e.overview}</p>
        </div>

        <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-3 text-sm">
          <ProfileRow label="Primary muscle" value={e.primaryMuscle} />
          <ProfileRow label="Secondary" value={e.secondaryMuscles.join(", ") || "-"} />
          <ProfileRow label="Equipment" value={e.equipment} />
          <ProfileRow label="Force" value={e.forceType} />
          <ProfileRow label="Type" value={e.exerciseType} />
          <ProfileRow label="Level" value={e.level} />
        </div>

        <div className="mt-6">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
            Step by step
          </h4>
          <ol className="mt-3 space-y-3">
            {e.steps.map((s, i) => (
              <li key={s.title} className="flex gap-3 text-sm text-foreground/85 leading-relaxed">
                <span className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-electric text-onyx-50 text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="mt-0.5 text-foreground/80">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
              Pro tips
            </h4>
            <ul className="mt-3 space-y-2">
              {e.proTips.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-electric">
              Common mistakes
            </h4>
            <ul className="mt-3 space-y-2">
              {e.commonMistakes.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-foreground/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/70" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border/60 bg-onyx-100/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-foreground/90">{value}</p>
    </div>
  );
}
