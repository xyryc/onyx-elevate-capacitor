import { useEffect, useMemo, useRef, useState } from "react";
import { X, Pause, Play, SkipBack, SkipForward, CheckCircle2, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { QuickWorkout } from "@/data/quickWorkouts";
import { findExercise } from "@/data/exercises";
import { useT, useLang } from "@/i18n/LanguageProvider";
import { markSingleTrainingDayComplete } from "@/lib/engagement";
import { todayISO } from "@/components/DatePickerRow";
import { FavoriteButton } from "@/components/FavoriteButton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type BunnyPlayer = {
  on: (event: string, callback: (data?: any) => void) => void;
  off: (event?: string, callback?: (data?: any) => void) => void;
  play: () => void;
  pause: () => void;
  mute: () => void;
  setCurrentTime: (seconds: number) => void;
  getCurrentTime: (callback: (seconds: number) => void) => void;
  getDuration: (callback: (seconds: number) => void) => void;
};

declare global {
  interface Window {
    playerjs?: {
      Player: new (iframe: HTMLIFrameElement) => BunnyPlayer;
    };
  }
}

let bunnyPlayerJsPromise: Promise<void> | null = null;

function loadBunnyPlayerJs() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.playerjs?.Player) return Promise.resolve();
  if (!bunnyPlayerJsPromise) {
    bunnyPlayerJsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-bunny-playerjs="true"]',
      );
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Bunny player failed to load")), {
          once: true,
        });
        return;
      }
      const script = document.createElement("script");
      script.src = "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";
      script.async = true;
      script.dataset.bunnyPlayerjs = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Bunny player failed to load"));
      document.head.appendChild(script);
    });
  }
  return bunnyPlayerJsPromise;
}

// Inline strings so the player is fully localized without new dictionary keys.
const LIVE_STRINGS = {
  en: {
    work: "Work",
    rest: "Rest",
    set: "Set",
    exercise: "Exercise",
    reps: "Reps",
    sec: "Seconds",
    target: "Target time",
    upNext: "Up next",
    finish: "Finish & log workout",
    noVideo: "No demo video",
    doneTitle: "Workout complete!",
    doneBody:
      "Amazing job — you showed up and finished strong. Log this session to add it to your training history, and save it as a favorite so it's one tap away next time.",
    log: "Log workout",
    logging: "Logging…",
    close: "Close",
    logged: "Workout logged, great work!",
    getReady: "Get ready",
    paused: "Paused",
    start: "Start",
    saveFav: "Save as favorite",
    amrapFull: "As many reps as possible",
    amrapHint: "Tap AMRAP for info",
  },
  no: {
    work: "Jobb",
    rest: "Pause",
    set: "Sett",
    exercise: "Øvelse",
    reps: "Reps",
    sec: "Sekunder",
    target: "Måltid",
    upNext: "Neste",
    finish: "Fullfør og logg økten",
    noVideo: "Ingen demovideo",
    doneTitle: "Økten er ferdig!",
    doneBody:
      "Fantastisk jobbet — du møtte opp og fullførte sterkt. Logg denne økten for å legge den til i treningshistorikken din, og lagre den som favoritt så den er ett trykk unna neste gang.",
    log: "Logg økten",
    logging: "Logger…",
    close: "Lukk",
    logged: "Økt logget, godt jobbet!",
    getReady: "Gjør deg klar",
    paused: "Pauset",
    start: "Start",
    saveFav: "Lagre som favoritt",
    amrapFull: "Så mange reps som mulig",
    amrapHint: "Trykk AMRAP for info",
  },
  es: {
    work: "Trabajo",
    rest: "Descanso",
    set: "Serie",
    exercise: "Ejercicio",
    reps: "Reps",
    sec: "Segundos",
    target: "Tiempo objetivo",
    upNext: "Siguiente",
    finish: "Terminar y registrar",
    noVideo: "Sin video",
    doneTitle: "¡Entrenamiento completo!",
    doneBody:
      "Increíble trabajo — apareciste y terminaste con fuerza. Registra esta sesión para añadirla a tu historial y guárdala como favorita para tenerla a un toque la próxima vez.",
    log: "Registrar",
    logging: "Registrando…",
    close: "Cerrar",
    logged: "Entrenamiento registrado, ¡bien hecho!",
    getReady: "Prepárate",
    paused: "Pausado",
    start: "Empezar",
    saveFav: "Guardar como favorito",
    amrapFull: "Tantas repeticiones como sea posible",
    amrapHint: "Toca AMRAP para info",
  },
  pt: {
    work: "Trabalho",
    rest: "Descanso",
    set: "Série",
    exercise: "Exercício",
    reps: "Reps",
    sec: "Segundos",
    target: "Tempo alvo",
    upNext: "Próximo",
    finish: "Concluir e registrar",
    noVideo: "Sem vídeo",
    doneTitle: "Treino concluído!",
    doneBody:
      "Trabalho incrível — você apareceu e terminou forte. Registre esta sessão para adicioná-la ao seu histórico e salve como favorito para tê-la a um toque na próxima vez.",
    log: "Registrar treino",
    logging: "Registrando…",
    close: "Fechar",
    logged: "Treino registrado, ótimo trabalho!",
    getReady: "Prepare-se",
    paused: "Pausado",
    start: "Começar",
    saveFav: "Salvar como favorito",
    amrapFull: "O máximo de repetições possível",
    amrapHint: "Toque AMRAP para info",
  },
} as const;

function formatRestLabel(seconds: number): string {
  if (seconds <= 0) return "";
  if (seconds < 60) return `${seconds} sek`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, "0")}`;
}

function useLive() {
  const { lang } = useLang();
  const key = (lang || "en").toString().slice(0, 2) as keyof typeof LIVE_STRINGS;
  return LIVE_STRINGS[key] || LIVE_STRINGS.en;
}

/**
 * Live guided workout player. Auto-advances through every set of every
 * exercise in a QuickWorkout, alternating "work" and "rest" phases, and
 * auto-plays the exercise demo video each time the exercise changes.
 *
 * Duration parsing:
 *   reps "30s" / "40s" / "3 min" -> timed work phase
 *   reps "10" / "12/side" / "AMRAP" / "15 reps" -> default 40s work
 *   rest "45s" / "2 min" / "-" (skip)
 */

interface FlatStep {
  blockIndex: number;
  blockTitle: string;
  exerciseSlug?: string;
  exerciseName: string;
  reps: string;
  rest: string;
  note?: string;
  setLabel: string; // "Set 2 / 3" or "AMRAP"
  workSeconds: number;
  restSeconds: number;
  isRepBased: boolean;
  isDistance: boolean;
  isThumbnailOnly: boolean;
}

function parseSeconds(str: string, fallback: number): number {
  const s = str.trim().toLowerCase();
  if (!s || s === "-") return 0;
  const min = s.match(/(\d+(?:\.\d+)?)\s*min/);
  if (min) return Math.round(parseFloat(min[1]) * 60);
  const sec = s.match(/(\d+)\s*s/);
  if (sec) return parseInt(sec[1], 10);
  // pure number in reps means rep-count, not time
  if (/^\d+/.test(s) && !/m|s|rep/.test(s)) return fallback;
  return fallback;
}

function isTimeBased(reps: string): boolean {
  const s = reps.trim().toLowerCase();
  return /\d+\s*(s|min)\b/.test(s);
}

function isDistanceBased(reps: string): boolean {
  const s = reps.trim().toLowerCase();
  // matches "1 km", "500 m", "2km" — but NOT "min"
  return /\d+\s*km\b/.test(s) || /\d+\s*m(?!in)\b/.test(s) || /meter/.test(s);
}

/** Exercises where we prefer the thumbnail (video adds no value or loads slowly):
 *  running, rowing, biking, stair climber, sled, ski erg, assault, plank/side plank/holds. */
function isThumbnailPreferred(name: string): boolean {
  return /treadmill|\brun\b|running|jog|walk|walking|row(ing)?|erg|ski erg|assault|bike|biking|cycle|cycling|stair|sled|slede|plank|hold|dead hang|carry/i.test(
    name || "",
  );
}

function distanceMeters(reps: string): number {
  const km = reps.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (km) return parseFloat(km[1]) * 1000;
  const m = reps.match(/(\d+)\s*m(?!in)/i);
  if (m) return parseInt(m[1], 10);
  return 0;
}

function estimateDistanceSeconds(reps: string, exerciseName: string): number {
  const meters = distanceMeters(reps);
  if (!meters) return 60;
  const name = (exerciseName || "").toLowerCase();
  const isRow = /\bro\b|row|rower|robåt|ergo/i.test(name);
  const isSled = /sled|slede/i.test(name);
  // Rough paces: run 5:00/km (0.30 s/m), row 4:00/500m (0.48 s/m), sled push slow (0.9 s/m)
  const pacePerMeter = isSled ? 0.9 : isRow ? 0.48 : 0.3;
  return Math.max(30, Math.round(meters * pacePerMeter));
}

function estimateRepSeconds(reps: string): number {
  // Extract first number as rep count; assume ~2.5s per rep, min 30s, max 90s.
  const m = reps.match(/(\d+)/);
  const count = m ? parseInt(m[1], 10) : 0;
  if (!count) return 45;
  return Math.max(30, Math.min(90, Math.round(count * 2.5)));
}

function buildSteps(workout: QuickWorkout): FlatStep[] {
  const steps: FlatStep[] = [];
  workout.blocks.forEach((block, bi) => {
    block.exercises.forEach((ex) => {
      const setsStr = String(ex.sets).toUpperCase();
      const amrap = setsStr.includes("AMRAP");
      const setCount = amrap ? 1 : Math.max(1, parseInt(setsStr, 10) || 1);
      const distance = isDistanceBased(ex.reps);
      const timed = isTimeBased(ex.reps);
      const workSeconds = distance
        ? estimateDistanceSeconds(ex.reps, ex.name)
        : timed
          ? parseSeconds(ex.reps, 40)
          : estimateRepSeconds(ex.reps);
      // Long distance (>=500 m) deserves ~2 min rest; otherwise cap at 45s to keep flow tight.
      const meters = distance ? distanceMeters(ex.reps) : 0;
      const longEffort = meters >= 500;
      const parsedRest = parseSeconds(ex.rest, longEffort ? 120 : 20);
      const restSeconds = longEffort ? Math.max(parsedRest, 120) : Math.min(parsedRest, 45);
      for (let i = 0; i < setCount; i++) {
        steps.push({
          blockIndex: bi,
          blockTitle: block.title,
          exerciseSlug: ex.slug,
          exerciseName: ex.name,
          reps: ex.reps,
          rest: ex.rest,
          note: ex.note,
          setLabel: amrap ? "AMRAP" : `${i + 1} / ${setCount}`,
          workSeconds,
          restSeconds,
          isRepBased: !timed && !distance,
          isDistance: distance,
          isThumbnailOnly: distance || isThumbnailPreferred(ex.name),
        });
      }
    });
  });
  return steps;
}

export function LiveWorkoutPlayer({
  workout,
  open,
  onOpenChange,
}: {
  workout: QuickWorkout;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useT();
  const L = useLive();
  const steps = useMemo(() => buildSteps(workout), [workout]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"prep" | "work" | "rest" | "done">("prep");
  const [remaining, setRemaining] = useState(5);
  const [running, setRunning] = useState(false);
  const PREP_SECONDS = 5;
  const LOOP_START_SECONDS = 3;
  const muted = true;
  const [logging, setLogging] = useState(false);
  const [videoRevealed, setVideoRevealed] = useState(false);
  const [amrapInfoOpen, setAmrapInfoOpen] = useState(false);
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<BunnyPlayer | null>(null);
  const loopLockRef = useRef(false);
  const videoActiveRef = useRef(false);

  const step = steps[idx];
  const nextStep = steps[idx + 1];
  const exObj = step?.exerciseSlug ? findExercise(step.exerciseSlug) : undefined;
  const previewStep = phase === "rest" ? (nextStep ?? step) : step;
  const previewExercise = previewStep?.exerciseSlug
    ? findExercise(previewStep.exerciseSlug)
    : exObj;
  const posterSrc = previewExercise?.thumbnailUrl || exObj?.thumbnailUrl;

  // For distance cardio (run/row/sled push X km/m) plus other "just look at
  // the timer" moves (plank, stair climber, treadmill work, rowing, biking,
  // carries) we skip the video entirely — the thumbnail stays visible and the
  // timer floats on top so it starts instantly.
  const isThumbnailOnly = !!step?.isThumbnailOnly;
  const videoMounted = running && (phase === "prep" || phase === "work") && !isThumbnailOnly;
  const videoActive = running && phase === "work" && !isThumbnailOnly;

  // Build a live-only autoplay embed URL. The exercise library keeps its normal press-and-play video.
  const buildLiveSrc = (url: string | undefined, tag: string, autoplay: boolean) => {
    if (!url) return undefined;
    try {
      const u = new URL(url);
      u.searchParams.set("autoplay", autoplay ? "true" : "false");
      u.searchParams.set("muted", muted ? "true" : "false");
      u.searchParams.set("loop", "false");
      u.searchParams.set("preload", "true");
      u.searchParams.set("responsive", "true");
      u.searchParams.set("controls", "false");
      u.searchParams.set("showControls", "false");
      u.searchParams.set("playsinline", "true");
      u.searchParams.set("t", String(LOOP_START_SECONDS));
      u.searchParams.set("startTime", String(LOOP_START_SECONDS));
      u.searchParams.set("live", `${workout.slug}-${tag}`);
      return u.toString();
    } catch {
      return url;
    }
  };
  const videoSrc = useMemo(
    () => buildLiveSrc(exObj?.videoUrl, String(idx), true),
    [LOOP_START_SECONDS, exObj?.videoUrl, idx, muted, workout.slug],
  );

  // Preload the NEXT exercise's video during rest so the transition is instant.
  const nextExObj = nextStep?.exerciseSlug ? findExercise(nextStep.exerciseSlug) : undefined;
  const shouldPreloadNext =
    running && phase === "rest" && !!nextStep && !nextStep.isThumbnailOnly && !!nextExObj?.videoUrl;
  const preloadSrc = useMemo(
    () =>
      shouldPreloadNext ? buildLiveSrc(nextExObj?.videoUrl, `pre-${idx + 1}`, false) : undefined,
    [LOOP_START_SECONDS, nextExObj?.videoUrl, idx, muted, workout.slug, shouldPreloadNext],
  );

  useEffect(() => {
    videoActiveRef.current = videoActive;
  }, [videoActive]);

  useEffect(() => {
    setVideoRevealed(false);
  }, [idx, phase]);

  useEffect(() => {
    if (!videoMounted || !iframeRef.current) {
      playerRef.current = null;
      return;
    }

    let cancelled = false;
    let pollId: number | undefined;
    const seekToLoopStart = (player: BunnyPlayer) => {
      if (loopLockRef.current) return;
      loopLockRef.current = true;
      try {
        player.setCurrentTime(LOOP_START_SECONDS);
        player.play();
      } catch {}
      window.setTimeout(() => {
        loopLockRef.current = false;
      }, 650);
    };

    loadBunnyPlayerJs()
      .then(() => {
        if (cancelled || !iframeRef.current || !window.playerjs?.Player) return;
        const player = new window.playerjs.Player(iframeRef.current);
        playerRef.current = player;

        const keepLoopClean = (data?: any) => {
          const seconds = Number(data?.seconds ?? 0);
          const duration = Number(data?.duration ?? 0);
          if (!duration || !videoActiveRef.current) return;
          if (seconds >= Math.max(LOOP_START_SECONDS + 0.5, duration - 0.75)) {
            seekToLoopStart(player);
          }
        };

        const onReady = () => {
          try {
            player.mute();
            player.setCurrentTime(LOOP_START_SECONDS);
            player.play();
          } catch {}
          if (videoActiveRef.current) {
            window.setTimeout(() => setVideoRevealed(true), 250);
          }
        };

        const onEnded = () => seekToLoopStart(player);

        player.on("ready", onReady);
        player.on("timeupdate", keepLoopClean);
        player.on("ended", onEnded);

        pollId = window.setInterval(() => {
          if (!videoActiveRef.current || !playerRef.current) return;
          player.getDuration((duration) => {
            if (!duration) return;
            player.getCurrentTime((seconds) => {
              if (seconds >= Math.max(LOOP_START_SECONDS + 0.5, duration - 0.75)) {
                seekToLoopStart(player);
              }
            });
          });
        }, 250);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      try {
        playerRef.current?.off("ready");
        playerRef.current?.off("timeupdate");
        playerRef.current?.off("ended");
      } catch {}
      playerRef.current = null;
    };
  }, [LOOP_START_SECONDS, videoMounted, videoSrc]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (videoActive) {
      setVideoRevealed(false);
      try {
        player.mute();
        player.setCurrentTime(LOOP_START_SECONDS);
        player.play();
      } catch {}
      const id = window.setTimeout(() => setVideoRevealed(true), 350);
      return () => window.clearTimeout(id);
    }
    setVideoRevealed(false);
    try {
      player.pause();
    } catch {}
  }, [LOOP_START_SECONDS, videoActive]);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setIdx(0);
      setPhase("prep");
      setRemaining(PREP_SECONDS);
      setRunning(false);
    } else {
      setRunning(false);
    }
  }, [open, steps]);

  // Sync remaining when idx or phase changes (auto-transitions)
  useEffect(() => {
    if (!step || phase === "done") return;
    if (phase === "prep") return; // prep seconds are seeded explicitly
    setRemaining(phase === "work" ? step.workSeconds : step.restSeconds);
  }, [idx, phase, step]);

  // Timer tick
  useEffect(() => {
    if (!running || phase === "done") return;
    if (remaining <= 0) {
      // advance
      if (phase === "prep") {
        setPhase("work");
        setRemaining(step?.workSeconds ?? 0);
        return;
      }
      if (phase === "work") {
        // Auto-advance both timed and rep-based work into rest,
        // so the countdown always drives the flow.
        if (step && step.restSeconds > 0) {
          setPhase("rest");
          setRemaining(step.restSeconds);
        } else {
          goNext();
        }
      } else if (phase === "rest") {
        goNext();
      }
      return;
    }
    const id = setTimeout(() => {
      setRemaining((r) => r - 1);
      // light beep on last 3 seconds
      if (remaining <= 4 && remaining > 1 && beepRef.current) {
        try {
          beepRef.current.currentTime = 0;
          beepRef.current.play().catch(() => {});
        } catch {}
      }
    }, 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, remaining, phase, step]);

  function goNext() {
    if (idx + 1 >= steps.length) {
      setPhase("done");
      setRunning(false);
      return;
    }
    const upcoming = steps[idx + 1];
    setIdx((i) => i + 1);
    setPhase("work");
    setRemaining(upcoming?.workSeconds ?? 0);
  }
  function goPrev() {
    if (idx <= 0) {
      setPhase("work");
      setRemaining(step?.workSeconds ?? 0);
      return;
    }
    const previous = steps[idx - 1];
    setIdx((i) => i - 1);
    setPhase("work");
    setRemaining(previous?.workSeconds ?? 0);
  }
  function repDone() {
    setRunning(true);
    if (step && step.restSeconds > 0) {
      setPhase("rest");
      setRemaining(step.restSeconds);
    } else goNext();
  }

  const queryClient = useQueryClient();

  // Lock body scroll while the live player is open (mobile can't nudge the page).
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, [open]);

  async function finishAndLog() {
    setLogging(true);
    try {
      const today = todayISO();
      const result = await markSingleTrainingDayComplete(
        `qw-${workout.slug}`,
        `live-${today}`,
        workout.title,
      );
      // Refresh profile / stats / activity feed so the log appears immediately
      queryClient.invalidateQueries({ queryKey: ["training-logged-today"] });
      queryClient.invalidateQueries({ queryKey: ["program-progress"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (result.alreadyLoggedToday) toast.info("Come back tomorrow to log another day.");
      else toast.success(L.logged);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || "Could not log workout");
    } finally {
      setLogging(false);
    }
  }

  // If the workout is already a favorite, skip the congrats card:
  // auto-log the session and close silently when it ends.
  const { user } = useAuth();
  useEffect(() => {
    if (phase !== "done" || !user) return;
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("favorites")
        .select("item_slug")
        .eq("item_type", "program")
        .eq("item_slug", `qw-${workout.slug}`)
        .maybeSingle();
      if (active && data) {
        finishAndLog();
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, user, workout.slug]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="block w-full sm:w-[calc(100%-1rem)] max-w-full sm:max-w-2xl h-[100dvh] sm:h-auto max-h-[100dvh] sm:max-h-[92dvh] overflow-hidden sm:overflow-y-auto overscroll-none touch-pan-y p-0 border-border/60 rounded-none sm:rounded-2xl text-white"
        style={{ backgroundColor: "hsl(220 20% 4%)" }}
      >
        <VisuallyHidden asChild>
          <DialogTitle>{t(workout.title)}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>{L.exercise}</DialogDescription>
        </VisuallyHidden>
        {/* Beep for last-3-second cue */}
        <audio
          ref={beepRef}
          src="data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAA"
          preload="auto"
        />

        {/* Close */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-[calc(env(safe-area-inset-top)_+_0.75rem)] z-50 grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90"
        >
          <X className="h-4 w-4" />
        </button>

        {phase === "done" ? (
          <DoneView
            workout={workout}
            onFinish={finishAndLog}
            logging={logging}
            onClose={() => onOpenChange(false)}
          />
        ) : step ? (
          <div className="flex flex-col h-[100dvh] sm:h-auto sm:min-h-0 pt-[env(safe-area-inset-top)]">
            {/* Video */}
            <div className="relative aspect-video bg-black">
              {videoSrc ? (
                <>
                  {posterSrc && (
                    <img
                      src={posterSrc}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${videoActive ? "opacity-0" : "opacity-100"}`}
                      loading="eager"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
                  {videoMounted && (
                    <iframe
                      ref={iframeRef}
                      key={`${idx}-${videoSrc}`}
                      src={videoSrc}
                      title={step.exerciseName}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-150 ${videoActive && videoRevealed ? "opacity-100" : "opacity-0"}`}
                      tabIndex={-1}
                    />
                  )}
                  {/* Blocks any tap/click on the player so it just loops silently */}
                  <div className="absolute inset-0" aria-hidden="true" />
                  {/* Hidden warm-up iframe for the next exercise, so switching is instant */}
                  {preloadSrc && (
                    <iframe
                      key={`preload-${idx + 1}-${preloadSrc}`}
                      src={preloadSrc}
                      title="preload"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="pointer-events-none absolute h-px w-px opacity-0"
                      style={{ left: -9999, top: -9999 }}
                    />
                  )}
                  {!videoActive && (
                    <div
                      className={`absolute inset-0 grid place-items-center ${isThumbnailOnly && running && phase === "work" ? "bg-black/30" : "bg-black/55"}`}
                    >
                      <div className="flex flex-col items-center gap-3 text-center">
                        {!running ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPhase("prep");
                              setRemaining(PREP_SECONDS);
                              setRunning(true);
                            }}
                            className="grid h-16 w-16 place-items-center rounded-full bg-electric text-onyx-50 shadow-[0_0_28px_rgba(0,180,255,0.55)] ring-1 ring-white/20 hover:bg-electric-glow"
                            aria-label={L.start}
                          >
                            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" />
                          </button>
                        ) : isThumbnailOnly && phase === "work" ? (
                          <>
                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-electric">
                              {t(step.reps)}
                            </span>
                            <span className="font-display text-5xl font-bold tabular-nums text-white drop-shadow-[0_2px_10px_rgba(0,180,255,0.55)]">
                              {Math.floor(Math.max(0, remaining) / 60)}:
                              {String(Math.max(0, remaining) % 60).padStart(2, "0")}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                              {L.target}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-electric">
                              {phase === "prep"
                                ? L.getReady
                                : phase === "rest"
                                  ? L.getReady
                                  : L.work}
                            </span>
                            {phase === "prep" && (
                              <span className="font-display text-5xl font-bold tabular-nums text-white">
                                {Math.max(0, remaining)}
                              </span>
                            )}
                            {previewStep && (
                              <span className="max-w-[80%] text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                                {t(previewStep.exerciseName)}
                              </span>
                            )}
                            <span className="mt-2 inline-flex gap-1" aria-hidden="true">
                              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse [animation-delay:150ms]" />
                              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse [animation-delay:300ms]" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/60 text-sm">
                  {L.noVideo}
                </div>
              )}
              {/* Phase badge */}
              <span
                className={`absolute left-3 bottom-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${phase === "rest" || phase === "prep" ? "bg-sky-400 text-onyx-950" : "bg-electric text-onyx-50"}`}
              >
                {phase === "rest" ? L.rest : phase === "prep" ? L.getReady : L.work}
              </span>
            </div>

            {/* Info + timer */}
            <div
              className="relative flex-1 px-5 pt-6 flex flex-col"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.75rem)" }}
            >
              {/* Ambient glow backdrop */}
              <div
                className="pointer-events-none absolute inset-0 -z-0"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.14), transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(0,180,255,0.10), transparent 60%)",
                }}
              />

              <div className="relative z-10 flex flex-col flex-1">
                {/* Progress dots for exercises */}
                <div className="flex items-center gap-1 mb-3" aria-hidden="true">
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < idx ? "bg-electric" : i === idx ? "bg-electric/80" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">
                  {t(step.blockTitle)} · {L.exercise} {idx + 1}/{steps.length}
                </p>
                <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold tracking-tight">
                  {t(step.exerciseName)}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                    {L.set} {step.setLabel}
                  </span>
                  {String(step.reps).toUpperCase().includes("AMRAP") ? (
                    <button
                      type="button"
                      onClick={() => setAmrapInfoOpen((v) => !v)}
                      className="inline-flex items-center rounded-full bg-electric/15 ring-1 ring-electric/40 px-2.5 py-1 text-[11px] font-bold text-electric hover:bg-electric/25 transition-colors"
                      aria-label={L.amrapFull}
                      title={L.amrapFull}
                    >
                      AMRAP
                    </button>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">
                      {t(step.reps)}
                    </span>
                  )}
                  {step.restSeconds > 0 && (
                    <span className="inline-flex items-center rounded-full bg-sky-400/10 ring-1 ring-sky-400/25 px-2.5 py-1 text-[11px] font-semibold text-sky-300">
                      {L.rest} {formatRestLabel(step.restSeconds)}
                    </span>
                  )}
                </div>
                {amrapInfoOpen && String(step.reps).toUpperCase().includes("AMRAP") && (
                  <p className="mt-2 text-[11px] text-electric/90 leading-snug">
                    <span className="font-bold">AMRAP</span> — {L.amrapFull}
                  </p>
                )}

                {/* Big timer with animated progress ring inside premium card */}
                <div className="mt-6 flex items-center justify-center">
                  <div
                    className="relative h-52 w-52 rounded-full p-[1px]"
                    style={{
                      background:
                        "conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.35), rgba(0,180,255,0.05), rgba(56,189,248,0.35))",
                    }}
                  >
                    <div className="relative h-full w-full rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06),rgba(0,0,0,0.55)_70%)] ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_-20px_rgba(0,180,255,0.45)]">
                      {(() => {
                        const total =
                          phase === "rest"
                            ? step.restSeconds
                            : phase === "prep"
                              ? PREP_SECONDS
                              : step.workSeconds;
                        const pct = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
                        const R = 92;
                        const C = 2 * Math.PI * R;
                        const elapsedPct = 1 - pct;
                        const ringColor = phase === "work" ? "#38bdf8" : "#38bdf8";
                        const tickMs = phase === "prep" ? 200 : 1000;
                        const transitionStyle = `${tickMs}ms linear`;
                        return (
                          <>
                            <svg className="absolute inset-0" viewBox="0 0 208 208">
                              <circle
                                cx="104"
                                cy="104"
                                r={R}
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                key={`${idx}-${phase}`}
                                cx="104"
                                cy="104"
                                r={R}
                                stroke={ringColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={C}
                                strokeDashoffset={C * (1 - elapsedPct)}
                                transform="rotate(-90 104 104)"
                                style={{
                                  transition: `stroke-dashoffset ${transitionStyle}`,
                                  filter: "drop-shadow(0 0 10px rgba(56,189,248,0.75))",
                                }}
                              />
                            </svg>

                            <div className="absolute inset-0 grid place-items-center px-6">
                              {step.isRepBased && phase === "work" ? (
                                (() => {
                                  const translated = t(step.reps);
                                  const isAmrap = translated.toUpperCase().includes("AMRAP");
                                  const m = translated.match(/^(\d+)/);
                                  const num = m ? m[1] : translated;
                                  return (
                                    <div className="text-center flex flex-col items-center">
                                      {isAmrap ? (
                                        <button
                                          type="button"
                                          onClick={() => setAmrapInfoOpen((v) => !v)}
                                          className="font-display text-[30px] leading-none font-extrabold tracking-tight text-electric hover:text-electric-glow transition-colors"
                                          style={{ textShadow: "0 0 18px rgba(0,180,255,0.55)" }}
                                          title={L.amrapFull}
                                          aria-label={L.amrapFull}
                                        >
                                          AMRAP
                                        </button>
                                      ) : (
                                        <p className="font-display text-[44px] leading-none font-bold tabular-nums bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                                          {num}
                                        </p>
                                      )}
                                      <p className="text-[10px] uppercase tracking-[0.24em] text-white/60 mt-1.5 font-semibold">
                                        {isAmrap ? L.amrapHint : L.reps}
                                      </p>
                                      <span
                                        className="my-2 h-px w-10 bg-gradient-to-r from-transparent via-electric/60 to-transparent"
                                        aria-hidden="true"
                                      />
                                      <p className="font-display text-xl font-bold tabular-nums text-sky-300">
                                        {Math.floor(Math.max(0, remaining) / 60)}:
                                        {String(Math.max(0, remaining) % 60).padStart(2, "0")}
                                      </p>
                                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 mt-0.5">
                                        {L.target}
                                      </p>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-center">
                                  <p className="font-display text-[56px] leading-none font-bold tabular-nums bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                                    {phase === "prep"
                                      ? Math.max(0, remaining)
                                      : `${Math.floor(Math.max(0, remaining) / 60)}:${String(Math.max(0, remaining) % 60).padStart(2, "0")}`}
                                  </p>
                                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/55 mt-2">
                                    {phase === "rest"
                                      ? L.rest
                                      : phase === "prep"
                                        ? L.getReady
                                        : L.work}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {nextStep && (
                  <p className="mt-5 text-center text-[11px] uppercase tracking-[0.2em] text-white/45">
                    {L.upNext} · <span className="text-white/75">{t(nextStep.exerciseName)}</span>
                  </p>
                )}

                {/* Spotify-style controls: skip buttons pushed to the sides */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between gap-3 px-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="grid h-12 w-12 place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/[0.06] active:scale-95 transition"
                      aria-label="Previous"
                    >
                      <SkipBack className="h-7 w-7" fill="currentColor" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setRunning((r) => !r)}
                      className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-white to-white/85 text-onyx-50 hover:brightness-105 active:scale-[0.97] shadow-[0_14px_40px_-10px_rgba(255,255,255,0.35),0_0_0_1px_rgba(0,180,255,0.35),0_0_38px_-4px_rgba(0,180,255,0.55)] transition"
                      aria-label={running ? "Pause" : "Play"}
                    >
                      {running ? (
                        <Pause className="h-8 w-8" fill="currentColor" />
                      ) : (
                        <Play className="h-8 w-8 translate-x-0.5" fill="currentColor" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (phase === "work" && step.isRepBased) {
                          repDone();
                        } else {
                          goNext();
                        }
                      }}
                      className="grid h-12 w-12 place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/[0.06] active:scale-95 transition"
                      aria-label="Next"
                    >
                      <SkipForward className="h-7 w-7" fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DoneView({
  workout,
  onFinish,
  logging,
  onClose,
}: {
  workout: QuickWorkout;
  onFinish: () => void;
  logging: boolean;
  onClose: () => void;
}) {
  const L = useLive();
  const t = useT();
  const title = t(`programs.quick.item.${workout.slug}.title`) || workout.title;
  return (
    <div className="h-[100dvh] sm:h-auto sm:min-h-0 px-5 pt-[calc(env(safe-area-inset-top)_+_2.5rem)] pb-10 sm:py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_30px_80px_-20px_rgba(0,180,255,0.35)]">
        {workout.image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={workout.image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-950 via-onyx-950/40 to-transparent" />
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-electric/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-onyx-50 shadow-[0_0_20px_rgba(0,180,255,0.55)]">
              <Trophy className="h-3.5 w-3.5" fill="currentColor" />
              {L.doneTitle}
            </div>
          </div>
        )}
        <div className="px-6 py-7 text-center">
          {!workout.image && (
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-electric text-onyx-50 shadow-[0_0_24px_rgba(0,180,255,0.55)]">
              <Trophy className="h-8 w-8" fill="currentColor" />
            </div>
          )}
          <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm text-white/75 leading-relaxed">{L.doneBody}</p>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onFinish}
              disabled={logging}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-electric-glow to-electric px-6 py-3 text-sm font-bold text-onyx-50 shadow-[0_10px_30px_-8px_rgba(0,180,255,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/20 hover:brightness-110 disabled:opacity-50 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              {logging ? L.logging : L.log}
            </button>

            <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/90">
              <span>{L.saveFav}</span>
              <FavoriteButton type="program" slug={`qw-${workout.slug}`} />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-white/15 bg-transparent px-6 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/[0.05] transition"
            >
              {L.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
