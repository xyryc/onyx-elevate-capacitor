import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/data/exercises";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { Lock } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

const levelTone: Record<string, string> = {
  Beginner: "text-emerald-300 border-emerald-400/60 bg-emerald-400/15",
  Intermediate: "text-electric border-electric/60 bg-electric/15",
  Advanced: "text-orange-300 border-orange-400/60 bg-orange-400/15",
};

export function ExerciseCard({ exercise, locked = false }: { exercise: Exercise; locked?: boolean }) {
  const t = useT();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageReady, setImageReady] = useState(false);
  useEffect(() => {
    // If the image was cached / completed before React attached onLoad,
    // sync the ready state so the fade-in doesn't stick at opacity-0.
    if (imgRef.current?.complete && (imgRef.current.naturalWidth ?? 0) > 0) {
      setImageReady(true);
    }
  }, [exercise.thumbnailUrl]);

  const card = (
    <article
      role="button"
      tabIndex={0}
      aria-label={locked ? `${t("Members only")} ${t(exercise.name)}` : `${t("Open")} ${t(exercise.name)}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
      }}
      className="group surface-card rounded-xl overflow-hidden md:transition-all md:hover:-translate-y-1 md:hover:border-electric/40 md:hover:shadow-electric text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-onyx-200">
        {!imageReady && exercise.thumbnailUrl && <CardImageSkeleton />}
        {!locked && !exercise.thumbnailUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
            <svg className="h-8 w-8 text-onyx-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6.5 6.5h11M6.5 17.5h11M9 9.5l-2.5-2.5M15 9.5l2.5-2.5M9 14.5l-2.5 2.5M15 14.5l2.5 2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] uppercase tracking-wider text-onyx-400/80 font-medium line-clamp-2">
              {t(exercise.name)}
            </span>
          </div>
        )}
        {exercise.thumbnailUrl && (
          <img
            ref={imgRef}
            src={exercise.thumbnailUrl}
            alt={`${t(exercise.name)} ${t("exercise demonstration")}`}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover md:transition-transform md:duration-500 md:group-hover:scale-105 ${
              locked ? "blur-md scale-110 opacity-60" : imageReady ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageReady(true)}
            onError={(e) => { setImageReady(true); (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-onyx-50/80 via-onyx-50/10 to-transparent pointer-events-none" />

        {locked ? (
          <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none px-3">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-electric/20 backdrop-blur-sm border border-electric/60 shadow-lg">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-electric" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-electric drop-shadow">
                {t("Members only")}
              </span>
            </div>
          </div>
        ) : (
          exercise.videoUrl && (
            <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
              <div className="grid h-9 w-9 sm:h-14 sm:w-14 place-items-center rounded-full bg-electric/20 backdrop-blur-sm border border-electric/50 md:transition-transform md:group-hover:scale-110 shadow-lg">
                <svg className="h-3 w-3 sm:h-5 sm:w-5 text-electric" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )
        )}

        <span className={`absolute z-30 top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border backdrop-blur-sm ${levelTone[exercise.level]}`}>
          {t(exercise.level)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base group-hover:text-electric transition-colors">
          {t(exercise.name)}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t(exercise.primaryMuscle)}</span>
          {exercise.secondaryMuscles.length > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="truncate">{exercise.secondaryMuscles.map((m) => t(m)).join(", ")}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );

  return <ExerciseDialog exercise={exercise}>{card}</ExerciseDialog>;
}

function CardImageSkeleton() {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden bg-onyx-200" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-onyx-200 via-onyx-100 to-onyx-200" />
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-electric/10 to-transparent" />
    </div>
  );
}
