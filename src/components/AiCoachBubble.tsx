import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  X,
  Minus,
  Send,
  Sparkles,
  Trash2,
  Lock,
  Camera,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { useCheckout } from "@/hooks/useCheckout";
import { usePrice, useStripePriceId } from "@/lib/pricing";
import { BUNDLE_KEY } from "@/lib/nutritionAccess";
import { ExerciseDialog } from "@/components/ExerciseDialog";
import { exercises } from "@/data/exercises";
import {
  DAILY_LIMIT,
  MAX_IMAGES_PER_MESSAGE,
  MAX_INPUT_CHARS,
  clearCoachHistory,
  getCoachHistory,
  getCoachStatus,
  sendCoachMessage,
  type CoachMessageRow,
} from "@/lib/ai-coach.functions";

const QUICK_PROMPTS: Array<{ label: string; prompt: string }> = [
  {
    label: "10-minute quick workout",
    prompt:
      "Build me a 10-minute quick full-body workout I can do right now. Only use exercises from the Onyx library. Include sets/reps. Save it so I can open the preview.",
  },
  {
    label: "20-minute session",
    prompt:
      "Build me a focused 20-minute training session. Only use exercises from the Onyx library. Include sets, reps and rest. Save it so I can open the preview.",
  },
  {
    label: "40-min full-body workout",
    prompt:
      "Build me a 40-minute full-body workout using only exercises from the Onyx library. Include sets, reps and rest. Save it so I can open the preview.",
  },
  {
    label: "4-week training program",
    prompt:
      "Design a 4-week training program for me. Ask me 2 short questions first (goal + days per week), then build it using only exercises from the Onyx library. Save the program so I can open the preview.",
  },
  {
    label: "1-day meal plan",
    prompt:
      "Give me a simple, healthy 1-day meal plan with breakfast, lunch, dinner and one snack. Include kcal and protein per meal. If a matching Onyx meal plan exists, link it too.",
  },
  {
    label: "Shoulder pain, safer alternatives",
    prompt:
      "I have some shoulder discomfort. Give me general information: what movements typically feel safer, what to usually avoid, and warm-up/mobility ideas. Not medical advice.",
  },
  {
    label: "Knee pain, what to avoid",
    prompt:
      "I have some general knee discomfort during training. What movements usually feel safer, what should I typically avoid, and what warm-up / mobility work helps? (General info only, not medical advice.)",
  },
  {
    label: "Identify this machine (attach photo)",
    prompt:
      "I attached a photo of a gym machine I'm not sure how to use. Can you identify it, explain briefly how to use it safely, and link the matching Onyx exercise if there is one?",
  },
];

// ~1400px longest side, JPEG q=0.82. Keeps most equipment/food photos < ~250 KB.
const IMAGE_MAX_DIM = 1400;
const IMAGE_QUALITY = 0.82;

async function compressImage(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        const scale = Math.min(1, IMAGE_MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
        } catch {
          resolve(null);
        }
      };
      img.src = String(reader.result ?? "");
    };
    reader.readAsDataURL(file);
  });
}

const STORAGE_KEY = "onyx-ai-coach-bubble-open";

function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function AiCoachBubble() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<CoachMessageRow | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const qc = useQueryClient();

  const statusFn = useServerFn(getCoachStatus);
  const historyFn = useServerFn(getCoachHistory);
  const sendFn = useServerFn(sendCoachMessage);
  const clearFn = useServerFn(clearCoachHistory);

  const status = useQuery({
    queryKey: ["coach", "status"],
    queryFn: () => statusFn({ data: { timezone: getBrowserTimezone() } }),
    staleTime: 30_000,
    enabled: !!user,
  });
  const history = useQuery({
    queryKey: ["coach", "history"],
    queryFn: () => historyFn(),
    enabled: !!user && open && status.data?.isPremium === true,
  });

  const messages: CoachMessageRow[] = history.data ?? [];

  // Restore last open state
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        setOpen(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    } catch {}
    // Lock body scroll while the full-screen coach is open.
    if (typeof document === "undefined") return;
    if (open) {
      const scrollY = window.scrollY;
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.width = prevWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pending, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const send = useMutation({
    mutationFn: async (payload: { content: string; images: string[] }) =>
      sendFn({
        data: {
          content: payload.content,
          images: payload.images,
          timezone: getBrowserTimezone(),
          language: lang,
        },
      }),
    onSuccess: (res) => {
      setPending(null);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["coach", "status"] });
      qc.invalidateQueries({ queryKey: ["coach", "history"] });
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    onError: (e: any) => {
      setPending(null);
      toast.error(e?.message ?? "Something went wrong.");
    },
  });

  const clear = useMutation({
    mutationFn: async () => clearFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["coach", "history"] });
      toast.success("History cleared");
    },
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES_PER_MESSAGE - images.length;
    if (room <= 0) {
      toast.error(`You can attach up to ${MAX_IMAGES_PER_MESSAGE} images per message.`);
      return;
    }
    const chosen = Array.from(files).slice(0, room);
    const compressed: string[] = [];
    for (const f of chosen) {
      if (!f.type.startsWith("image/")) continue;
      const dataUrl = await compressImage(f);
      if (dataUrl) compressed.push(dataUrl);
    }
    if (compressed.length === 0) {
      toast.error("Could not read those images.");
      return;
    }
    setImages((prev) => [...prev, ...compressed].slice(0, MAX_IMAGES_PER_MESSAGE));
  }

  function submitText(text: string, attached: string[] = images) {
    const trimmed = text.trim();
    if ((!trimmed && attached.length === 0) || send.isPending) return;
    if (!status.data?.isPremium) return;
    if ((status.data?.messagesLeftToday ?? 0) <= 0) {
      toast.error("Daily message limit reached.");
      return;
    }
    const finalText = trimmed || (attached.length ? "What is this?" : "");
    setPending({
      id: `pending-${Date.now()}`,
      role: "user",
      content: attached.length
        ? `${finalText}\n\n_[Attached ${attached.length} image${attached.length > 1 ? "s" : ""}]_`
        : finalText,
      created_at: new Date().toISOString(),
    });
    setInput("");
    setImages([]);
    send.mutate({ content: finalText, images: attached });
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    submitText(input);
  }

  if (authLoading) return null;

  // Guests see the tab too, but the panel is locked until they sign in / subscribe.
  const isGuest = !user;
  if (!isGuest && (status.isLoading || !status.data)) return null;

  const isPremium = !isGuest && status.data ? status.data.isPremium : false;
  const left = !isGuest && status.data ? status.data.messagesLeftToday : 0;

  // Collapsed: a small vertical tab pinned to the right edge of the screen.
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Coach"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex w-7 flex-col items-center justify-center gap-1.5 rounded-l-xl bg-blue-900/85 px-0 py-3 text-blue-50 shadow-lg shadow-blue-950/40 transition-colors hover:bg-blue-900"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span
          className="text-[10px] font-bold uppercase leading-none tracking-[0.15em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          AI Coach
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-onyx-50 sm:inset-auto sm:right-4 sm:bottom-4 sm:h-[80vh] sm:max-h-[640px] sm:w-[calc(100vw-2rem)] sm:max-w-md sm:rounded-2xl sm:border sm:border-border/60 sm:bg-onyx-50/95 sm:shadow-2xl sm:backdrop-blur-xl">
      <div className="sm:hidden" style={{ height: "env(safe-area-inset-top)" }} />
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-electric/15 text-electric">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight">Onyx AI Coach</div>
            {isPremium && (
              <div className="text-[11px] text-muted-foreground leading-tight">
                {left} / {DAILY_LIMIT} messages left today
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isPremium && messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all AI Coach history?")) clear.mutate();
              }}
              aria-label="Clear history"
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-onyx-100 text-muted-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            aria-label="Minimize"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-onyx-100 text-muted-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-onyx-100 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Non-premium gate, chat opens but is read-only. Shows a canned message with 3 plans. */}
      {!isPremium ? (
        <NonPremiumGate onClose={() => setOpen(false)} />
      ) : (
        <>
          {/* Transcript */}
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ overscrollBehavior: "contain" }}
          >
            {messages.length === 0 && !pending ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Hi! I'm your Onyx coach. I can help with training, running, healthy nutrition and
                  workout programming, every exercise I suggest is linked to a video in your
                  library. Try one of these:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.label}
                      onClick={() => submitText(qp.prompt)}
                      className="rounded-full border border-border/60 bg-onyx-100/60 px-3 py-1.5 text-xs text-foreground hover:bg-onyx-100 hover:border-electric/50 transition-colors text-left"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-2 border-t border-border/40">
                  Not medical advice. For pain or injuries always see a licensed professional.
                </p>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} onLink={() => setOpen(false)} />
                ))}
                {pending && <MessageBubble message={pending} onLink={() => setOpen(false)} />}
                {send.isPending && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-electric animate-pulse" />
                    Coach is thinking…
                  </div>
                )}
              </>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border/60 p-2 space-y-2"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
          >
            {images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <div key={i} className="relative shrink-0">
                    <img
                      src={src}
                      alt={`Attachment ${i + 1}`}
                      className="h-16 w-16 rounded-lg object-cover border border-border/60"
                    />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label="Remove image"
                      className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-onyx-900 text-white border border-border/60 hover:bg-onyx-900/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={send.isPending || left <= 0 || images.length >= MAX_IMAGES_PER_MESSAGE}
                aria-label="Take a photo"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/60 bg-onyx-100/50 text-muted-foreground hover:bg-onyx-100 hover:text-foreground disabled:opacity-40"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={send.isPending || left <= 0 || images.length >= MAX_IMAGES_PER_MESSAGE}
                aria-label="Attach image"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/60 bg-onyx-100/50 text-muted-foreground hover:bg-onyx-100 hover:text-foreground disabled:opacity-40"
              >
                <ImagePlus className="h-4 w-4" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_CHARS))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={1}
                placeholder={
                  left <= 0
                    ? "Daily limit reached"
                    : images.length
                      ? "Ask about the image…"
                      : "Ask about training, food, running…"
                }
                disabled={send.isPending || left <= 0}
                className="flex-1 resize-none rounded-xl border border-border/60 bg-onyx-100/50 px-3 py-2 text-sm outline-none focus:border-electric/60 max-h-32 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={send.isPending || left <= 0 || (!input.trim() && images.length === 0)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-electric text-onyx-900 disabled:opacity-40 hover:bg-electric/90"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

function MessageBubble({ message, onLink }: { message: CoachMessageRow; onLink: () => void }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-electric px-3 py-2 text-sm text-onyx-900 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] text-sm text-foreground/90 prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 prose-a:text-electric prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => {
              const isInternal = href?.startsWith("/");
              // Exercise links open the ExerciseDialog inline so the
              // Bunny video plays right inside the coach, no navigation,
              // no lost message context.
              const exMatch = href?.match(/^\/exercises\/([a-z0-9-]+)\/?$/i);
              if (exMatch) {
                const ex = exercises.find((x) => x.slug === exMatch[1]);
                if (ex) {
                  return (
                    <ExerciseDialog exercise={ex}>
                      <button type="button" className="text-electric hover:underline text-left">
                        {children}
                      </button>
                    </ExerciseDialog>
                  );
                }
              }
              if (isInternal) {
                return (
                  <Link
                    to={href as string}
                    onClick={onLink}
                    className="text-electric hover:underline"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-electric hover:underline"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

type PlanKey = "monthly" | "yearly" | "lifetime";

function NonPremiumGate({ onClose: _onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState<PlanKey | null>(null);
  const { openCheckout } = useCheckout();

  const monthlyPrice = usePrice("monthly");
  const yearlyPrice = usePrice("yearly");
  const lifetimePrice = usePrice("lifetime");

  const monthlyId = useStripePriceId("monthly");
  const yearlyId = useStripePriceId("yearly");
  const lifetimeId = useStripePriceId("lifetime");

  const start = async (plan: PlanKey) => {
    setBusy(plan);
    try {
      if (plan === "monthly") {
        await openCheckout({
          priceId: monthlyId,
          productSlug: "all_access_monthly",
          firstMonthDiscount: true,
        });
      } else if (plan === "yearly") {
        await openCheckout({ priceId: yearlyId, productSlug: "all_access_yearly" });
      } else {
        await openCheckout({ priceId: lifetimeId, productSlug: BUNDLE_KEY });
      }
    } finally {
      setBusy(null);
    }
  };

  const plans: Array<{ key: PlanKey; title: string; price: string; sub: string }> = [
    { key: "monthly", title: "Monthly", price: `${monthlyPrice}/mo`, sub: "Cancel anytime" },
    { key: "yearly", title: "Yearly", price: `${yearlyPrice}/yr`, sub: "Save vs monthly" },
    { key: "lifetime", title: "Lifetime", price: lifetimePrice, sub: "One-time · forever" },
  ];

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* Canned assistant message (not AI generated) */}
      <div className="flex justify-start">
        <div className="max-w-[95%] rounded-2xl rounded-bl-sm bg-onyx-100/60 border border-border/50 px-3 py-2.5 text-sm text-foreground/90">
          <div className="flex items-center gap-1.5 text-electric text-xs font-semibold mb-1">
            <Lock className="h-3 w-3" /> Chat is locked
          </div>
          <p className="leading-relaxed">
            The AI Coach is included with any Onyx membership. Pick a plan below to unlock unlimited
            access to training programs, meal plans, and personal coaching, all built from the Onyx
            library.
          </p>
        </div>
      </div>

      <div className="flex justify-start">
        <div className="w-full max-w-[95%] space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Which payment would you like to use?
          </p>
          {plans.map((p) => (
            <button
              key={p.key}
              onClick={() => start(p.key)}
              disabled={busy !== null}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-onyx-100/40 hover:bg-onyx-100 hover:border-electric/60 px-3 py-2.5 text-left transition-colors disabled:opacity-60"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-[11px] text-muted-foreground">{p.sub}</div>
              </div>
              <div className="text-sm font-bold text-electric shrink-0">
                {busy === p.key ? "Opening…" : p.price}
              </div>
            </button>
          ))}
          <p className="text-[10px] text-muted-foreground/80 px-1 pt-1">
            Already paid on another device? Sign in with the same account and it unlocks
            automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
