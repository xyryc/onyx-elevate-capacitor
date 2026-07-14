import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  DAILY_LIMIT,
  MAX_INPUT_CHARS,
  clearCoachHistory,
  getCoachHistory,
  getCoachStatus,
  sendCoachMessage,
  type CoachMessageRow,
} from "@/lib/ai-coach.functions";
import { toast } from "sonner";
import { useLang } from "@/i18n/LanguageProvider";

const COACH_STRINGS: Record<string, {
  subtitle: (left: number, limit: number) => string;
  clearConfirm: string;
  clear: string;
  emptyTitle: string;
  emptyBody: string;
  thinking: string;
  placeholder: string;
  limitReached: string;
  limitToast: string;
  hint: string;
}> = {
  en: {
    subtitle: (l, m) => `Nutrition · Training · Wellness · ${l}/${m} messages left today`,
    clearConfirm: "Clear your chat history?",
    clear: "Clear",
    emptyTitle: "Hey! I'm your Onyx AI Coach.",
    emptyBody: "Ask me about meal ideas, macro targets, exercise form, recovery, or how to structure your week. I stick to nutrition, training, and general wellness.",
    thinking: "Coach is thinking…",
    placeholder: "Ask about nutrition, training, wellness…",
    limitReached: "Daily limit reached, resets at 00:00 UTC",
    limitToast: "Daily message limit reached. Resets at 00:00 UTC.",
    hint: "Enter to send · Shift+Enter for newline",
  },
  no: {
    subtitle: (l, m) => `Ernæring · Trening · Velvære · ${l}/${m} meldinger igjen i dag`,
    clearConfirm: "Slette chat-historikken din?",
    clear: "Slett",
    emptyTitle: "Hei! Jeg er din Onyx AI-coach.",
    emptyBody: "Spør meg om måltidsideer, makromål, øvelsesteknikk, restitusjon eller hvordan du bør legge opp uka. Jeg holder meg til ernæring, trening og generell velvære.",
    thinking: "Coachen tenker…",
    placeholder: "Spør om ernæring, trening, velvære…",
    limitReached: "Dagsgrense nådd, nullstilles kl. 00:00 UTC",
    limitToast: "Daglig meldingsgrense nådd. Nullstilles kl. 00:00 UTC.",
    hint: "Enter for å sende · Shift+Enter for ny linje",
  },
  "pt-BR": {
    subtitle: (l, m) => `Nutrição · Treino · Bem-estar · ${l}/${m} mensagens restantes hoje`,
    clearConfirm: "Limpar seu histórico de conversa?",
    clear: "Limpar",
    emptyTitle: "Oi! Sou seu Onyx AI Coach.",
    emptyBody: "Pergunte sobre ideias de refeições, metas de macros, técnica de exercícios, recuperação ou como estruturar sua semana. Foco em nutrição, treino e bem-estar.",
    thinking: "O coach está pensando…",
    placeholder: "Pergunte sobre nutrição, treino, bem-estar…",
    limitReached: "Limite diário atingido, reinicia às 00:00 UTC",
    limitToast: "Limite diário de mensagens atingido. Reinicia às 00:00 UTC.",
    hint: "Enter para enviar · Shift+Enter para nova linha",
  },
  es: {
    subtitle: (l, m) => `Nutrición · Entrenamiento · Bienestar · ${l}/${m} mensajes restantes hoy`,
    clearConfirm: "¿Borrar tu historial de chat?",
    clear: "Borrar",
    emptyTitle: "¡Hola! Soy tu Onyx AI Coach.",
    emptyBody: "Pregúntame sobre ideas de comidas, objetivos de macros, técnica de ejercicios, recuperación o cómo estructurar tu semana. Me centro en nutrición, entrenamiento y bienestar.",
    thinking: "El coach está pensando…",
    placeholder: "Pregunta sobre nutrición, entrenamiento, bienestar…",
    limitReached: "Límite diario alcanzado, se reinicia a las 00:00 UTC",
    limitToast: "Límite diario de mensajes alcanzado. Se reinicia a las 00:00 UTC.",
    hint: "Enter para enviar · Shift+Enter para nueva línea",
  },
};

export const Route = createFileRoute("/_authenticated/ai-coach")({
  head: () => ({
    meta: [
      { title: "AI Coach, Onyx Elevate" },
      { name: "description", content: "Chat with the Onyx AI Coach for personalised nutrition, training, and wellness guidance." },
    ],
  }),
  component: AiCoachPage,
});

function AiCoachPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { lang } = useLang();
  const L = COACH_STRINGS[lang] ?? COACH_STRINGS.en;
  const statusFn = useServerFn(getCoachStatus);
  const historyFn = useServerFn(getCoachHistory);
  const sendFn = useServerFn(sendCoachMessage);
  const clearFn = useServerFn(clearCoachHistory);

  const status = useQuery({ queryKey: ["coach", "status"], queryFn: () => statusFn() });
  const history = useQuery({
    queryKey: ["coach", "history"],
    queryFn: () => historyFn(),
    enabled: status.data?.isPremium === true,
  });

  const [pending, setPending] = useState<CoachMessageRow | null>(null);
  const [input, setInput] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const messages: CoachMessageRow[] = history.data ?? [];

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status.data?.isPremium]);

  const send = useMutation({
    mutationFn: async (content: string) => sendFn({ data: { content } }),
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

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || send.isPending) return;
    if ((status.data?.messagesLeftToday ?? 0) <= 0) {
      toast.error(L.limitToast);
      return;
    }
    setPending({
      id: `pending-${Date.now()}`,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    });
    setInput("");
    send.mutate(text);
  }

  if (status.isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center text-muted-foreground">
        Loading AI Coach…
      </div>
    );
  }

  if (status.data && !status.data.isPremium) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-border/60 bg-onyx-50/70 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-electric/15 text-electric text-2xl">
            ⚡
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Unlock the AI Coach
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            The Onyx AI Coach gives you on-demand nutrition, training, and wellness guidance.
            Available with an Onyx Pro subscription or after purchasing the app.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center rounded-full bg-electric px-6 text-sm font-semibold text-onyx-900 hover:bg-electric/90"
            >
              View plans
            </Link>
            <button
              onClick={() => router.history.back()}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border/60 px-6 text-sm font-medium hover:bg-onyx-100"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const left = status.data?.messagesLeftToday ?? 0;
  const outOfMessages = left <= 0;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-3xl flex-col px-3 md:h-[calc(100dvh-5rem)] md:px-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 py-3">
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold tracking-tight md:text-xl">
            AI Coach <span className="text-electric">⚡</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            {L.subtitle(left, DAILY_LIMIT)}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              if (confirm(L.clearConfirm)) clear.mutate();
            }}
            className="shrink-0 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-onyx-100"
          >
            {L.clear}
          </button>
        )}
      </div>

      {/* Transcript */}
      <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto py-4">
        {messages.length === 0 && !pending && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border/60 bg-onyx-50/50 p-5 text-sm text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">{L.emptyTitle}</p>
            <p>{L.emptyBody}</p>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {pending && <MessageBubble message={pending} />}
        {send.isPending && (
          <div className="flex items-center gap-2 pl-1 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-electric" />
            {L.thinking}
          </div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="border-t border-border/60 py-3">
        <div className="flex items-end gap-2">
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
            placeholder={outOfMessages ? L.limitReached : L.placeholder}
            disabled={outOfMessages || send.isPending}
            rows={1}
            className="min-h-11 max-h-40 flex-1 resize-none rounded-2xl border border-border/60 bg-onyx-50/70 px-4 py-3 text-sm outline-none focus:border-electric disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || send.isPending || outOfMessages}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-electric px-5 text-sm font-semibold text-onyx-900 hover:bg-electric/90 disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{L.hint}</span>
          <span>{input.length}/{MAX_INPUT_CHARS}</span>
        </p>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: CoachMessageRow }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-electric px-4 py-2.5 text-sm text-onyx-900 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex">
      <div className="prose prose-sm prose-invert max-w-[90%] text-foreground [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}
