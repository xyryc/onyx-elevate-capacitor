import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAccess } from "@/hooks/useAccess";
import {
  listMyRooms,
  getRoom,
  getMessages,
  sendMessage,
  toggleReaction,
  markRead,
  createGroup,
  createDm,
  inviteToRoom,
  removeMember,
  renameGroup,
  deleteRoom,
  deleteMessage,
  setRoomAvatar,
  type ChatRoomSummary,
  type ChatMessage,
  type ChatMember,
} from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ImageIcon,
  Send,
  Plus,
  Users,
  MessageCircle,
  Trash2,
  Settings,
  UserPlus,
  Loader2,
  X,
  Lock,
  Camera,
  Search,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/_authenticated/groups")({
  component: GroupsPage,
  head: () => ({
    meta: [
      { title: "Groups, Onyx Elevate" },
      { name: "description", content: "Private group chats and DMs with your Onyx crew." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "💪", "😂"];

function GroupsPage() {
  const { user, loading: authLoading } = useAuth();
  const access = useAccess();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const hasAccess = access.hasSubscription || access.hasBundle;

  // Lock page scroll on mobile when a chat is open so the background can't scroll behind.
  useEffect(() => {
    if (!activeRoomId) return;
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeRoomId]);

  if (authLoading || access.loading) {
    return (
      <div className="container-onyx py-24 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="container-onyx py-24 text-center text-sm text-muted-foreground">
        Sign in required.
      </div>
    );
  }
  if (!hasAccess) {
    return <PremiumUpsell />;
  }

  return (
    <div className="container-onyx py-6 lg:py-10 md:min-h-[calc(100vh-4rem)]">
      <div className="grid md:grid-cols-[320px_1fr] gap-4 md:h-[calc(100vh-8rem)]">
        <div
          className={`${activeRoomId ? "hidden md:block" : ""} min-h-0 h-[calc(100dvh-8rem)] md:h-auto`}
        >
          <RoomList activeRoomId={activeRoomId} onSelect={setActiveRoomId} />
        </div>
        <div
          className={
            activeRoomId
              ? "fixed inset-0 z-50 bg-background md:static md:z-auto md:bg-transparent min-h-0"
              : "hidden md:block min-h-0"
          }
        >
          {activeRoomId ? (
            <ChatPane
              roomId={activeRoomId}
              onBack={() => setActiveRoomId(null)}
              onDeleted={() => setActiveRoomId(null)}
            />
          ) : (
            <EmptyPane />
          )}
        </div>
      </div>
    </div>
  );
}

// ------------- Premium Upsell -------------
function PremiumUpsell() {
  const t = useT();
  return (
    <div className="container-onyx py-16 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-lg text-center rounded-2xl border border-electric/30 bg-onyx-100/60 p-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-electric/15 border border-electric/40 grid place-items-center mb-4">
          <Lock className="w-6 h-6 text-electric" />
        </div>
        <h1 className="font-display text-2xl font-bold">{t("Onyx Groups is a Pro feature")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "Private group chats and DMs are included with Onyx Pro and All-Access. Invite your training partners, share programs, and stay in sync, no public feed, no strangers.",
          )}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/app"
            className="inline-flex items-center justify-center rounded-md bg-electric px-4 py-2.5 text-sm font-semibold text-onyx-50 hover:bg-electric-glow transition"
          >
            {t("See membership options")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ------------- Room List -------------
function RoomList({
  activeRoomId,
  onSelect,
}: {
  activeRoomId: string | null;
  onSelect: (id: string) => void;
}) {
  const t = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "groups">("all");
  const query = useQuery({
    queryKey: ["chat-rooms"],
    queryFn: () => listMyRooms(),
    refetchInterval: 30_000,
  });

  // Realtime: any new message anywhere → refresh room list
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("rooms-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_members", filter: `user_id=eq.${user.id}` },
        () => {
          qc.invalidateQueries({ queryKey: ["chat-rooms"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id, qc]);

  const rooms = query.data ?? [];
  const filtered = rooms.filter((r) => {
    if (filter === "unread" && r.unread_count === 0) return false;
    if (filter === "groups" && r.kind !== "group") return false;
    if (search.trim()) {
      const t = (r.kind === "dm" ? r.peer?.display_name : r.name)?.toLowerCase() ?? "";
      if (!t.includes(search.trim().toLowerCase())) return false;
    }
    return true;
  });
  const unreadTotal = rooms.reduce((n, r) => n + (r.unread_count > 0 ? 1 : 0), 0);

  return (
    <div className="relative flex flex-col h-full md:rounded-2xl md:border md:border-border bg-background md:bg-onyx-100/40 overflow-hidden">
      {/* Big title header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
        <h1 className="font-display font-black text-2xl md:text-xl text-electric tracking-tight">
          {t("Chats")}
        </h1>
        <div className="flex gap-1.5">
          <NewDmDialog />
          <NewGroupDialog />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Search or start a new chat")}
            className="w-full h-10 pl-9 pr-3 rounded-full bg-onyx-200/60 border border-transparent focus:border-electric outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {(
          [
            { k: "all", label: t("All") },
            { k: "unread", label: `${t("Unread")}${unreadTotal ? ` ${unreadTotal}` : ""}` },
            { k: "groups", label: t("Groups") },
          ] as const
        ).map((c) => (
          <button
            key={c.k}
            type="button"
            onClick={() => setFilter(c.k)}
            className={`shrink-0 px-3 h-7 rounded-full text-xs font-semibold border transition ${
              filter === c.k
                ? "bg-electric/15 border-electric/60 text-electric"
                : "bg-onyx-200/40 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {query.isLoading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin inline" />
          </div>
        )}
        {!query.isLoading && filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-60" />
            {rooms.length === 0 ? t("No chats yet. Tap + to start one.") : t("Nothing here.")}
          </div>
        )}
        {filtered.map((r) => (
          <RoomListItem
            key={r.id}
            room={r}
            active={r.id === activeRoomId}
            onClick={() => onSelect(r.id)}
          />
        ))}
        <div className="h-24" />
      </div>
    </div>
  );
}

function RoomListItem({
  room,
  active,
  onClick,
}: {
  room: ChatRoomSummary;
  active: boolean;
  onClick: () => void;
}) {
  const title =
    room.kind === "dm" ? room.peer?.display_name || "Onyx athlete" : room.name || "Untitled group";
  const preview = room.last_message
    ? room.last_message.body || (room.last_message.image_path ? "📷 Photo" : "…")
    : room.kind === "group"
      ? `${room.member_count} member${room.member_count === 1 ? "" : "s"}`
      : "Say hi 👋";
  const hasUnread = room.unread_count > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center gap-3 active:bg-onyx-200/60 hover:bg-onyx-200/40 transition ${active ? "bg-onyx-200/50" : ""}`}
    >
      <div
        className={`shrink-0 rounded-full ${hasUnread ? "p-[2px] bg-gradient-to-br from-electric to-electric-glow" : ""}`}
      >
        <div className={hasUnread ? "rounded-full bg-background p-[1.5px]" : ""}>
          <Avatar
            name={title}
            url={room.kind === "dm" ? (room.peer?.avatar_url ?? null) : room.avatar_url}
            kind={room.kind}
            size="lg"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`truncate ${hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground/90"} text-[15px]`}
          >
            {title}
          </span>
          {room.last_message && (
            <span
              className={`text-[11px] shrink-0 ${hasUnread ? "text-electric font-semibold" : "text-muted-foreground"}`}
            >
              {timeAgo(room.last_message.created_at)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className={`text-[13px] truncate ${hasUnread ? "text-foreground/80" : "text-muted-foreground"}`}
          >
            {preview}
          </span>
          {hasUnread && (
            <span className="shrink-0 bg-electric text-onyx-50 text-[11px] font-bold rounded-full min-w-[20px] h-[20px] px-1.5 grid place-items-center">
              {room.unread_count > 99 ? "99+" : room.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ------------- Empty pane -------------
function EmptyPane() {
  const t = useT();
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full rounded-xl border border-dashed border-border bg-onyx-100/20 text-center p-8">
      <MessageCircle className="w-10 h-10 text-muted-foreground/60 mb-3" />
      <p className="font-semibold">{t("Pick a chat to start")}</p>
      <p className="text-sm text-muted-foreground mt-1">
        {t("Or start a new group / DM from the left panel.")}
      </p>
    </div>
  );
}

// ------------- Chat Pane -------------
function ChatPane({
  roomId,
  onBack,
  onDeleted,
}: {
  roomId: string;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const roomQuery = useQuery({
    queryKey: ["chat-room", roomId],
    queryFn: () => getRoom({ data: { roomId } }),
  });
  const msgQuery = useQuery({
    queryKey: ["chat-messages", roomId],
    queryFn: () => getMessages({ data: { roomId } }),
  });

  const markReadMut = useMutation({ mutationFn: () => markRead({ data: { roomId } }) });

  // Realtime for this room
  useEffect(() => {
    const ch = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["chat-messages", roomId] });
          qc.invalidateQueries({ queryKey: ["chat-rooms"] });
        },
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_reactions" }, () => {
        qc.invalidateQueries({ queryKey: ["chat-messages", roomId] });
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_members", filter: `room_id=eq.${roomId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["chat-room", roomId] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [roomId, qc]);

  // Mark read on message load and on focus
  useEffect(() => {
    if (msgQuery.data) {
      markReadMut.mutate();
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgQuery.dataUpdatedAt]);

  const room = roomQuery.data?.room;
  const members = roomQuery.data?.members ?? [];
  const myRole = roomQuery.data?.my_role ?? "member";

  const title =
    room?.kind === "dm"
      ? members.find((m) => m.user_id !== user?.id)?.display_name || "Direct message"
      : room?.name || "Group";

  return (
    <div className="flex flex-col h-[100dvh] md:h-full md:rounded-2xl md:border md:border-border bg-onyx-100/30 overflow-hidden chat-bg">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/60 flex items-center gap-3 bg-onyx-100/80 backdrop-blur-md pt-[max(0.625rem,env(safe-area-inset-top))]">
        <button
          className="md:hidden -ml-1 p-1.5 rounded-full hover:bg-onyx-200/60 text-electric"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {room?.kind === "group" ? (
          <RoomAvatarEditor
            roomId={roomId}
            userId={user?.id ?? ""}
            currentUrl={room.avatar_url}
            name={title}
          />
        ) : (
          <Avatar
            name={title}
            url={members.find((m) => m.user_id !== user?.id)?.avatar_url ?? null}
            size="md"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate text-[15px] leading-tight">{title}</div>
          {room?.kind === "group" ? (
            <div className="text-[11px] text-muted-foreground truncate">
              {members.length} member{members.length === 1 ? "" : "s"}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground">Direct message</div>
          )}
        </div>
        {room?.kind === "group" && (
          <RoomSettingsDialog
            roomId={roomId}
            members={members}
            myRole={myRole}
            currentName={room.name ?? ""}
            currentUserId={user?.id ?? ""}
            onDeleted={onDeleted}
          />
        )}
      </div>

      {/* Messages */}
      <MessageList
        messages={msgQuery.data ?? []}
        loading={msgQuery.isLoading}
        currentUserId={user?.id ?? ""}
        members={members}
      />

      {/* Composer */}
      <Composer
        roomId={roomId}
        onSent={() => {
          qc.invalidateQueries({ queryKey: ["chat-messages", roomId] });
        }}
      />
    </div>
  );
}

// ------------- Message List -------------
function MessageList({
  messages,
  loading,
  currentUserId,
  members,
}: {
  messages: ChatMessage[];
  loading: boolean;
  currentUserId: string;
  members: ChatMember[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin inline" />
        </div>
      )}
      {!loading && messages.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-10">
          No messages yet, send the first one 👋
        </div>
      )}
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          msg={m}
          mine={m.sender_id === currentUserId}
          members={members}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  msg,
  mine,
  members,
  currentUserId,
}: {
  msg: ChatMessage;
  mine: boolean;
  members: ChatMember[];
  currentUserId: string;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const qc = useQueryClient();
  const toggleMut = useMutation({
    mutationFn: (emoji: string) => toggleReaction({ data: { messageId: msg.id, emoji } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat-messages", msg.room_id] }),
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteMessage({ data: { messageId: msg.id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat-messages", msg.room_id] }),
  });

  // Read receipts: members whose last_read_at >= msg.created_at (excluding sender)
  const readers = members.filter(
    (m) => m.user_id !== msg.sender_id && m.last_read_at >= msg.created_at,
  );

  return (
    <div className={`flex gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      {!mine && <Avatar name={msg.sender_name || "?"} url={msg.sender_avatar} size="sm" />}
      <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
        {!mine && (
          <span className="text-[11px] text-muted-foreground px-1 mb-0.5">
            {msg.sender_name || "Onyx athlete"}
          </span>
        )}
        <div
          className={`relative px-3.5 py-2 text-[14px] leading-snug break-words shadow-sm ${
            mine
              ? "bg-gradient-to-br from-electric to-electric-glow text-onyx-50 rounded-2xl rounded-br-sm"
              : "bg-onyx-100 text-foreground border border-border/60 rounded-2xl rounded-bl-sm"
          } ${msg.deleted_at ? "italic opacity-60" : ""}`}
          onDoubleClick={() => !msg.deleted_at && setShowReactions((v) => !v)}
        >
          {msg.deleted_at ? (
            <span>message deleted</span>
          ) : (
            <>
              {msg.image_signed_url && (
                <img
                  src={msg.image_signed_url}
                  alt=""
                  className="rounded-lg mb-1 max-h-72 object-cover"
                />
              )}
              {msg.attachment?.share && <ShareCard share={msg.attachment.share} mine={mine} />}
              {msg.body && <div className="whitespace-pre-wrap">{msg.body}</div>}
            </>
          )}

          {showReactions && !msg.deleted_at && (
            <div
              className={`absolute ${mine ? "right-0" : "left-0"} -top-9 bg-onyx-50 border border-border rounded-full px-2 py-1 flex gap-1 shadow-lg z-10`}
            >
              {REACTION_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    toggleMut.mutate(e);
                    setShowReactions(false);
                  }}
                  className="text-lg hover:scale-125 transition"
                >
                  {e}
                </button>
              ))}
              {mine && (
                <button
                  type="button"
                  onClick={() => {
                    deleteMut.mutate();
                    setShowReactions(false);
                  }}
                  className="ml-1 text-destructive hover:scale-110 transition"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 px-1">
            {msg.reactions.map((r) => (
              <button
                key={r.emoji}
                type="button"
                onClick={() => toggleMut.mutate(r.emoji)}
                className={`text-xs rounded-full border px-1.5 py-0.5 ${
                  r.user_ids.includes(currentUserId)
                    ? "border-electric bg-electric/15"
                    : "border-border bg-onyx-200/40"
                }`}
              >
                {r.emoji} {r.user_ids.length}
              </button>
            ))}
          </div>
        )}

        <div
          className={`flex items-center gap-1 mt-0.5 px-1 text-[10px] text-muted-foreground ${mine ? "flex-row-reverse" : ""}`}
        >
          <span>
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {mine && readers.length > 0 && (
            <span>· Seen{readers.length > 1 ? ` by ${readers.length}` : ""}</span>
          )}
          {!msg.deleted_at && (
            <button
              type="button"
              onClick={() => setShowReactions((v) => !v)}
              className="opacity-60 hover:opacity-100"
              aria-label="React"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------- Composer -------------
function Composer({ roomId, onSent }: { roomId: string; onSent: () => void }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Prevent mobile browsers from auto-focusing the composer on mount.
  useEffect(() => {
    const el = textareaRef.current;
    if (el && el === document.activeElement) {
      el.blur();
    }
  }, []);

  const sendMut = useMutation({
    mutationFn: (payload: { body?: string; imagePath?: string }) =>
      sendMessage({ data: { roomId, ...payload } }),
    onSuccess: () => {
      setText("");
      onSent();
    },
  });

  const submit = () => {
    const body = text.trim();
    if (!body || sendMut.isPending) return;
    sendMut.mutate({ body });
  };

  const uploadImage = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${roomId}/${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("chat-attachments").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      sendMut.mutate({ imagePath: path, body: text.trim() || undefined });
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-border/60 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-end gap-2 bg-onyx-100/80 backdrop-blur-md">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
      />

      {/* Pill input with icons inside */}
      <div className="flex-1 flex items-end gap-1 rounded-[22px] bg-onyx-50 border border-border focus-within:border-electric transition px-1.5 py-1">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || sendMut.isPending}
          className="shrink-0 h-9 w-9 grid place-items-center rounded-full text-electric hover:bg-electric/10 transition"
          aria-label="Attach image"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Message"
          className="flex-1 resize-none bg-transparent px-1 py-2 text-[15px] max-h-32 focus:outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={uploading || sendMut.isPending}
          className="shrink-0 h-9 w-9 grid place-items-center rounded-full text-electric hover:bg-electric/10 transition"
          aria-label="Take photo"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!text.trim() || sendMut.isPending}
        className="shrink-0 h-11 w-11 grid place-items-center rounded-full bg-gradient-to-br from-electric to-electric-glow text-onyx-50 shadow-lg shadow-electric/30 disabled:opacity-40 disabled:shadow-none active:scale-95 transition"
        aria-label="Send"
      >
        {sendMut.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5 -ml-0.5" />
        )}
      </button>
    </div>
  );
}

// ------------- Room Avatar Editor -------------
function RoomAvatarEditor({
  roomId,
  userId,
  currentUrl,
  name,
}: {
  roomId: string;
  userId: string;
  currentUrl: string | null;
  name: string;
}) {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const libRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const setMut = useMutation({
    mutationFn: (path: string) => setRoomAvatar({ data: { roomId, path } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-room", roomId] });
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
  });

  const upload = async (file: File) => {
    if (!userId) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${roomId}/avatar/${userId}-${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("chat-attachments").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      await setMut.mutateAsync(path);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (libRef.current) libRef.current.value = "";
      if (camRef.current) camRef.current.value = "";
      setMenuOpen(false);
    }
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        className="relative block"
        aria-label="Change chat photo"
      >
        <Avatar name={name} url={currentUrl} kind="group" size="sm" />
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-electric text-onyx-50 grid place-items-center border border-onyx-100">
          {uploading ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
          ) : (
            <Plus className="w-2.5 h-2.5" />
          )}
        </span>
      </button>
      <input
        ref={libRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 bg-onyx-50 border border-border rounded-lg shadow-lg py-1 w-44">
            <button
              type="button"
              onClick={() => libRef.current?.click()}
              className="w-full text-left px-3 py-2 text-sm hover:bg-onyx-200/60 flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" /> Choose from library
            </button>
            <button
              type="button"
              onClick={() => camRef.current?.click()}
              className="w-full text-left px-3 py-2 text-sm hover:bg-onyx-200/60 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Take a photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ------------- Dialogs -------------
function NewDmDialog() {
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () => createDm({ data: { identifier } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      setOpen(false);
      setIdentifier("");
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="h-8 w-8 grid place-items-center rounded-full border border-border hover:border-electric transition"
          aria-label="New DM"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New direct message</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Enter their Onyx username or email.</p>
        <Input
          placeholder="username or email@example.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => mut.mutate()} disabled={!identifier.trim() || mut.isPending}>
            {mut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewGroupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () =>
      createGroup({ data: { name, initialMembers: members.map((m) => m.trim()).filter(Boolean) } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      setOpen(false);
      setName("");
      setMembers([""]);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="h-8 w-8 grid place-items-center rounded-full border border-electric/60 bg-electric/10 text-electric hover:bg-electric/20 transition"
          aria-label="New group"
        >
          <Plus className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New group</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Group name</label>
            <Input
              placeholder="Legs Squad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">
              Invite members (username or email, optional)
            </label>
            {members.map((m, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <Input
                  placeholder="username or email"
                  value={m}
                  onChange={(e) =>
                    setMembers((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMembers((prev) => [...prev, ""])}
              className="text-xs text-electric mt-2 hover:underline"
            >
              + Add another
            </button>
          </div>
          <div className="rounded-lg border border-electric/30 bg-electric/5 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-electric mb-1">Community rules</p>
            Onyx Groups are for <strong>fitness-related content only</strong>, training, programs,
            nutrition, progress and motivation. Harassment, spam, nudity, or unrelated content is
            not allowed and may result in your group being removed and your account suspended. Chats
            are private to invited members only.
          </div>
        </div>
        {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => mut.mutate()} disabled={!name.trim() || mut.isPending}>
            {mut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoomSettingsDialog({
  roomId,
  members,
  myRole,
  currentName,
  currentUserId,
  onDeleted,
}: {
  roomId: string;
  members: ChatMember[];
  myRole: "owner" | "member";
  currentName: string;
  currentUserId: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [invite, setInvite] = useState("");
  const qc = useQueryClient();
  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const renameMut = useMutation({
    mutationFn: () => renameGroup({ data: { roomId, name } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat-room", roomId] }),
  });
  const inviteMut = useMutation({
    mutationFn: () => inviteToRoom({ data: { roomId, identifier: invite } }),
    onSuccess: () => {
      setInvite("");
      qc.invalidateQueries({ queryKey: ["chat-room", roomId] });
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
    },
  });
  const removeMut = useMutation({
    mutationFn: (uid: string) => removeMember({ data: { roomId, userId: uid } }),
    onSuccess: (_d, uid) => {
      qc.invalidateQueries({ queryKey: ["chat-room", roomId] });
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      if (uid === currentUserId) {
        setOpen(false);
        onDeleted();
      }
    },
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteRoom({ data: { roomId } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-rooms"] });
      setOpen(false);
      onDeleted();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded hover:bg-onyx-200/50" aria-label="Group settings">
          <Settings className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Group settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {myRole === "owner" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <div className="flex gap-2 mt-1">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button
                  onClick={() => renameMut.mutate()}
                  disabled={!name.trim() || name === currentName}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          {myRole === "owner" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Add member</label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="username or email"
                  value={invite}
                  onChange={(e) => setInvite(e.target.value)}
                />
                <Button
                  onClick={() => inviteMut.mutate()}
                  disabled={!invite.trim() || inviteMut.isPending}
                >
                  {inviteMut.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {inviteMut.error && (
                <p className="text-xs text-destructive mt-1">
                  {(inviteMut.error as Error).message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Members</label>
            <div className="mt-1 space-y-1">
              {members.map((m) => (
                <div
                  key={m.user_id}
                  className="flex items-center gap-2 py-1.5 border-b border-border/40"
                >
                  <Avatar name={m.display_name || "?"} url={m.avatar_url} size="sm" />
                  <div className="flex-1 text-sm truncate">
                    {m.display_name || "Onyx athlete"}
                    {m.role === "owner" && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-electric">
                        Owner
                      </span>
                    )}
                    {m.user_id === currentUserId && (
                      <span className="ml-2 text-[10px] text-muted-foreground">(you)</span>
                    )}
                  </div>
                  {myRole === "owner" && m.user_id !== currentUserId && (
                    <button
                      className="text-destructive text-xs hover:underline"
                      onClick={() => removeMut.mutate(m.user_id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => removeMut.mutate(currentUserId)}>
              Leave group
            </Button>
            {myRole === "owner" && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Delete this group for everyone?")) deleteMut.mutate();
                }}
              >
                Delete group
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ------------- Share Card -------------
function ShareCard({ share, mine }: { share: any; mine: boolean }) {
  const url = typeof share?.url === "string" ? share.url : "/";
  const title = share?.title || "Shared";
  const subtitle = share?.subtitle || null;
  const image = share?.image || null;
  const kind = share?.kind || "other";
  const label =
    kind === "exercise"
      ? "Exercise"
      : kind === "program"
        ? "Program"
        : kind === "recipe"
          ? "Recipe"
          : kind === "meal-plan"
            ? "Meal plan"
            : kind === "custom-program"
              ? "My program"
              : "Link";
  return (
    <a
      href={url}
      className={`block rounded-xl overflow-hidden mb-1 border ${
        mine
          ? "bg-onyx-50/15 border-onyx-50/25 hover:bg-onyx-50/25"
          : "bg-onyx-200/60 border-border hover:bg-onyx-200/80"
      } transition max-w-[280px]`}
    >
      {image && <img src={image} alt="" className="w-full h-28 object-cover" />}
      <div className="p-2.5">
        <div
          className={`text-[10px] font-bold uppercase tracking-wider ${mine ? "text-onyx-50/80" : "text-electric"}`}
        >
          {label}
        </div>
        <div
          className={`text-sm font-semibold leading-snug ${mine ? "text-onyx-50" : "text-foreground"} line-clamp-2`}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className={`text-xs mt-0.5 ${mine ? "text-onyx-50/70" : "text-muted-foreground"} line-clamp-1`}
          >
            {subtitle}
          </div>
        )}
      </div>
    </a>
  );
}

// ------------- Utils -------------

function Avatar({
  name,
  url,
  size = "md",
  kind,
}: {
  name: string;
  url: string | null;
  size?: "sm" | "md" | "lg";
  kind?: "group" | "dm";
}) {
  const sizeClass =
    size === "sm"
      ? "w-8 h-8 text-[10px]"
      : size === "lg"
        ? "w-12 h-12 text-sm"
        : "w-11 h-11 text-xs";

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border border-border shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} rounded-full bg-electric/15 border border-electric/30 grid place-items-center text-electric font-bold shrink-0`}
    >
      {kind === "group" ? <Users className="w-4 h-4" /> : name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}
