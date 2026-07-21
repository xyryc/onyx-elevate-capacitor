import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Share2, Send, Loader2, MessageCircle, Users, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { listMyRooms, sendMessage, type ChatRoomSummary } from "@/lib/chat.functions";
import { useAuth } from "@/hooks/useAuth";
import { useAccess } from "@/hooks/useAccess";

export interface ShareTarget {
  url: string; // relative or absolute
  title: string;
  subtitle?: string;
  image?: string | null;
  kind: "exercise" | "program" | "recipe" | "meal-plan" | "custom-program" | "other";
}

export function ShareToChatButton({
  target,
  variant = "solid",
  size = "md",
  label = "Share",
  className = "",
}: {
  target: ShareTarget;
  variant?: "solid" | "ghost" | "outline";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const base = size === "sm" ? "h-8 px-3 text-xs gap-1.5" : "h-10 px-4 text-sm gap-2";
  const style =
    variant === "solid"
      ? "bg-electric text-onyx-50 hover:bg-electric-glow"
      : variant === "outline"
        ? "border border-electric/40 text-electric hover:bg-electric/10"
        : "text-electric hover:bg-electric/10";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center rounded-full font-semibold transition ${base} ${style} ${className}`}
        >
          <Share2 className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Share to chat</DialogTitle>
        </DialogHeader>
        <ShareBody target={target} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function ShareBody({ target, onDone }: { target: ShareTarget; onDone: () => void }) {
  const { user } = useAuth();
  const access = useAccess();
  const hasAccess = access.hasSubscription || access.hasBundle;
  const [caption, setCaption] = useState("");
  const [sentTo, setSentTo] = useState<string[]>([]);
  const qc = useQueryClient();
  const roomsQuery = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: () => listMyRooms(),
    enabled: !!user && hasAccess,
  });

  const sendMut = useMutation({
    mutationFn: (roomId: string) => {
      const absoluteUrl = target.url.startsWith("http")
        ? target.url
        : typeof window !== "undefined"
          ? new URL(target.url, window.location.origin).toString()
          : target.url;
      const attachment = {
        share: {
          url: target.url.startsWith("/") ? target.url : `/${target.url.replace(/^\/+/, "")}`,
          absoluteUrl,
          title: target.title,
          subtitle: target.subtitle ?? null,
          image: target.image ?? null,
          kind: target.kind,
        },
      };
      return sendMessage({
        data: {
          roomId,
          body: caption.trim() || undefined,
          attachment,
        },
      });
    },
    onSuccess: (_r, roomId) => {
      setSentTo((s) => [...s, roomId]);
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      qc.invalidateQueries({ queryKey: ["chat-messages", roomId] });
    },
  });

  if (!user) {
    return <div className="text-sm text-muted-foreground py-4">Sign in to share to a chat.</div>;
  }
  if (!hasAccess) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Chat sharing is included with Onyx Pro or All-Access.{" "}
        <Link to="/app" className="text-electric underline">
          See options
        </Link>
      </div>
    );
  }

  const rooms = roomsQuery.data ?? [];

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex gap-3 rounded-xl border border-border bg-onyx-100/60 p-3">
        {target.image ? (
          <img src={target.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-electric/15 grid place-items-center text-electric text-xs font-bold shrink-0">
            {target.kind.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-electric font-semibold">
            {kindLabel(target.kind)}
          </div>
          <div className="font-semibold text-sm truncate">{target.title}</div>
          {target.subtitle && (
            <div className="text-xs text-muted-foreground truncate">{target.subtitle}</div>
          )}
        </div>
      </div>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Add a note (optional)"
        rows={2}
        className="w-full resize-none rounded-lg border border-border bg-onyx-50 px-3 py-2 text-sm focus:border-electric outline-none"
      />

      <div className="max-h-64 overflow-y-auto -mx-6 px-6">
        {roomsQuery.isLoading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin inline" />
          </div>
        )}
        {!roomsQuery.isLoading && rooms.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-60" />
            You don't have any chats yet.{" "}
            <Link to="/groups" className="text-electric underline">
              Start one
            </Link>
          </div>
        )}
        <ul className="divide-y divide-border/40">
          {rooms.map((r) => (
            <RoomShareRow
              key={r.id}
              room={r}
              sent={sentTo.includes(r.id)}
              busy={sendMut.isPending && sendMut.variables === r.id}
              onSend={() => sendMut.mutate(r.id)}
            />
          ))}
        </ul>
      </div>

      {sendMut.error && (
        <p className="text-xs text-destructive">{(sendMut.error as Error).message}</p>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5"
        >
          {sentTo.length > 0 ? "Done" : "Cancel"}
        </button>
      </div>
    </div>
  );
}

function RoomShareRow({
  room,
  sent,
  busy,
  onSend,
}: {
  room: ChatRoomSummary;
  sent: boolean;
  busy: boolean;
  onSend: () => void;
}) {
  const title =
    room.kind === "dm" ? room.peer?.display_name || "Onyx athlete" : room.name || "Untitled group";
  return (
    <li className="flex items-center gap-3 py-2.5">
      {room.avatar_url || room.peer?.avatar_url ? (
        <img
          src={(room.kind === "dm" ? room.peer?.avatar_url : room.avatar_url) ?? ""}
          alt=""
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-electric/15 grid place-items-center text-electric font-bold text-[10px] shrink-0">
          {room.kind === "group" ? <Users className="w-4 h-4" /> : title.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate">{title}</div>
        <div className="text-[11px] text-muted-foreground">
          {room.kind === "group" ? `${room.member_count} members` : "Direct message"}
        </div>
      </div>
      <button
        type="button"
        onClick={onSend}
        disabled={busy || sent}
        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-xs font-semibold transition ${
          sent
            ? "bg-emerald-500/15 text-emerald-500"
            : "bg-electric text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
        }`}
      >
        {busy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : sent ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Send className="w-3.5 h-3.5" />
        )}
        {sent ? "Sent" : "Send"}
      </button>
    </li>
  );
}

function kindLabel(k: ShareTarget["kind"]): string {
  switch (k) {
    case "exercise":
      return "Exercise";
    case "program":
      return "Program";
    case "recipe":
      return "Recipe";
    case "meal-plan":
      return "Meal plan";
    case "custom-program":
      return "My program";
    default:
      return "Link";
  }
}
