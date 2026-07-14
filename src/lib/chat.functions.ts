import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Types ----------
export type ChatRoomKind = "group" | "dm";

export type ChatRoomSummary = {
  id: string;
  kind: ChatRoomKind;
  name: string | null;
  avatar_url: string | null;
  updated_at: string;
  last_message: {
    body: string | null;
    image_path: string | null;
    created_at: string;
    sender_id: string;
    sender_name: string | null;
  } | null;
  unread_count: number;
  member_count: number;
  peer: { user_id: string; display_name: string | null; avatar_url: string | null } | null;
};

export type ChatMessage = {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string | null;
  sender_avatar: string | null;
  body: string | null;
  image_path: string | null;
  image_signed_url: string | null;
  attachment: any;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  reactions: Array<{ emoji: string; user_ids: string[] }>;
};

export type ChatMember = {
  user_id: string;
  role: "owner" | "member";
  display_name: string | null;
  avatar_url: string | null;
  last_read_at: string;
};

// ---------- Helpers ----------
async function requirePremium(supabase: any, userId: string): Promise<void> {
  // Query subscriptions/purchases directly (RLS allows user to read own rows).
  // Mirrors the client `useAccess` hook so preview and prod stay in sync.
  const [subRes, purRes] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("status,current_period_end")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("purchases").select("product_kind").eq("user_id", userId).eq("product_kind", "bundle").limit(1),
  ]);
  const now = new Date();
  const hasSub = (subRes.data ?? []).some((s: any) => {
    const active = s.status === "active" || s.status === "trialing" || s.status === "past_due";
    const endOk = !s.current_period_end || new Date(s.current_period_end) > now;
    const cancelledButStillPaid =
      s.status === "canceled" && s.current_period_end && new Date(s.current_period_end) > now;
    return (active && endOk) || cancelledButStillPaid;
  });
  const hasBundle = (purRes.data ?? []).length > 0;
  if (!hasSub && !hasBundle) {
    throw new Error("Onyx Groups is available with Onyx Pro or All Access.");
  }
}

async function signImage(supabase: any, path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("chat-attachments").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

// ---------- Rooms ----------
export const listMyRooms = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ChatRoomSummary[]> => {
    const { supabase, userId } = context;
    const { data: memberships, error: memErr } = await supabase
      .from("chat_members")
      .select("room_id, last_read_at, chat_rooms!inner(id, kind, name, avatar_url, updated_at)")
      .eq("user_id", userId);
    if (memErr) throw memErr;
    const rooms = (memberships ?? []) as any[];
    if (rooms.length === 0) return [];

    const roomIds = rooms.map((r) => r.room_id);

    // Fetch all members in one shot for peer resolution and counts.
    const { data: allMembersRaw } = await supabase
      .from("chat_members")
      .select("room_id, user_id")
      .in("room_id", roomIds);
    const allMembers = (allMembersRaw ?? []) as any[];

    const otherUserIds = Array.from(new Set(allMembers.map((m) => m.user_id).filter((id) => id !== userId)));
    const { data: profs } = otherUserIds.length
      ? await supabase.from("profiles").select("id, display_name, avatar_url").in("id", otherUserIds)
      : { data: [] as any[] };
    const profileById = new Map<string, { display_name: string | null; avatar_url: string | null }>(
      (profs ?? []).map((p: any) => [p.id, { display_name: p.display_name, avatar_url: p.avatar_url }]),
    );

    // Latest message per room (fetch last N and pick per room).
    const { data: recentMsgs } = await supabase
      .from("chat_messages")
      .select("room_id, sender_id, body, image_path, created_at")
      .in("room_id", roomIds)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(roomIds.length * 5);
    const lastByRoom = new Map<string, any>();
    for (const m of recentMsgs ?? []) {
      if (!lastByRoom.has(m.room_id)) lastByRoom.set(m.room_id, m);
    }

    // Unread counts: messages after last_read_at not sent by me.
    const unreadCounts = new Map<string, number>();
    await Promise.all(
      rooms.map(async (r) => {
        const { count } = await supabase
          .from("chat_messages")
          .select("id", { count: "exact", head: true })
          .eq("room_id", r.room_id)
          .gt("created_at", r.last_read_at)
          .neq("sender_id", userId)
          .is("deleted_at", null);
        unreadCounts.set(r.room_id, count ?? 0);
      }),
    );

    const rowsOut = await Promise.all(
      rooms.map(async (r): Promise<ChatRoomSummary> => {
        const roomMembers = allMembers.filter((m) => m.room_id === r.room_id);
        const last = lastByRoom.get(r.room_id);
        const peerMember = r.chat_rooms.kind === "dm"
          ? roomMembers.find((m) => m.user_id !== userId)
          : null;
        const peerProfile = peerMember ? profileById.get(peerMember.user_id) : null;
        const groupAvatar = r.chat_rooms.kind === "group"
          ? await signImage(supabase, r.chat_rooms.avatar_url)
          : null;
        return {
          id: r.chat_rooms.id,
          kind: r.chat_rooms.kind,
          name: r.chat_rooms.name,
          avatar_url: groupAvatar,
          updated_at: r.chat_rooms.updated_at,
          last_message: last
            ? {
                body: last.body,
                image_path: last.image_path,
                created_at: last.created_at,
                sender_id: last.sender_id,
                sender_name: profileById.get(last.sender_id)?.display_name ?? null,
              }
            : null,
          unread_count: unreadCounts.get(r.room_id) ?? 0,
          member_count: roomMembers.length,
          peer: peerMember
            ? {
                user_id: peerMember.user_id,
                display_name: peerProfile?.display_name ?? null,
                avatar_url: peerProfile?.avatar_url ?? null,
              }
            : null,
        };
      }),
    );
    return rowsOut.sort((a, b) => {
      const at = a.last_message?.created_at ?? a.updated_at;
      const bt = b.last_message?.created_at ?? b.updated_at;
      return bt.localeCompare(at);
    });

  });

export const getRoom = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string }) => d)
  .handler(async ({ data, context }): Promise<{
    room: { id: string; kind: ChatRoomKind; name: string | null; avatar_url: string | null; created_by: string };
    members: ChatMember[];
    my_role: "owner" | "member";
  } | null> => {
    const { supabase, userId } = context;
    const { data: room, error: rErr } = await supabase
      .from("chat_rooms")
      .select("id, kind, name, avatar_url, created_by")
      .eq("id", data.roomId)
      .maybeSingle();
    if (rErr) throw rErr;
    if (!room) return null;
    const { data: members, error: mErr } = await supabase
      .from("chat_members")
      .select("user_id, role, last_read_at")
      .eq("room_id", data.roomId);
    if (mErr) throw mErr;
    const ids = (members ?? []).map((m: any) => m.user_id);
    const { data: profs } = ids.length
      ? await supabase.from("profiles").select("id, display_name, avatar_url").in("id", ids)
      : { data: [] as any[] };
    const pmap = new Map<string, any>((profs ?? []).map((p: any) => [p.id, p]));
    const mine = (members ?? []).find((m: any) => m.user_id === userId);
    const signedAvatar = room.kind === "group" ? await signImage(supabase, room.avatar_url) : null;
    return {
      room: { ...room, avatar_url: signedAvatar } as any,
      members: (members ?? []).map((m: any) => ({
        user_id: m.user_id,
        role: m.role,
        display_name: pmap.get(m.user_id)?.display_name ?? null,
        avatar_url: pmap.get(m.user_id)?.avatar_url ?? null,
        last_read_at: m.last_read_at,
      })),
      my_role: (mine?.role ?? "member") as "owner" | "member",
    };
  });


// ---------- Messages ----------
export const getMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; limit?: number }) => d)
  .handler(async ({ data, context }): Promise<ChatMessage[]> => {
    const { supabase } = context;
    const limit = Math.min(200, Math.max(1, data.limit ?? 80));
    const { data: msgs, error } = await supabase
      .from("chat_messages")
      .select("id, room_id, sender_id, body, image_path, attachment, created_at, edited_at, deleted_at")
      .eq("room_id", data.roomId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    const rows = (msgs ?? []).reverse();
    if (rows.length === 0) return [];

    const senderIds = Array.from(new Set(rows.map((r: any) => r.sender_id)));
    const { data: profs } = await supabase
      .from("profiles").select("id, display_name, avatar_url").in("id", senderIds);
    const pmap = new Map<string, any>((profs ?? []).map((p: any) => [p.id, p]));

    const msgIds = rows.map((r: any) => r.id);
    const { data: reacts } = await supabase
      .from("chat_reactions").select("message_id, user_id, emoji").in("message_id", msgIds);
    const reactsByMsg = new Map<string, Array<{ emoji: string; user_id: string }>>();
    for (const r of reacts ?? []) {
      const arr = reactsByMsg.get(r.message_id) ?? [];
      arr.push({ emoji: r.emoji, user_id: r.user_id });
      reactsByMsg.set(r.message_id, arr);
    }

    // Sign images (parallel).
    const signed = await Promise.all(
      rows.map((r: any) => signImage(supabase, r.image_path)),
    );

    return rows.map((r: any, i: number): ChatMessage => {
      const grouped = new Map<string, string[]>();
      for (const rc of reactsByMsg.get(r.id) ?? []) {
        const arr = grouped.get(rc.emoji) ?? [];
        arr.push(rc.user_id);
        grouped.set(rc.emoji, arr);
      }
      return {
        id: r.id,
        room_id: r.room_id,
        sender_id: r.sender_id,
        sender_name: pmap.get(r.sender_id)?.display_name ?? null,
        sender_avatar: pmap.get(r.sender_id)?.avatar_url ?? null,
        body: r.deleted_at ? null : r.body,
        image_path: r.deleted_at ? null : r.image_path,
        image_signed_url: r.deleted_at ? null : signed[i],
        attachment: r.deleted_at ? null : r.attachment,
        created_at: r.created_at,
        edited_at: r.edited_at,
        deleted_at: r.deleted_at,
        reactions: Array.from(grouped.entries()).map(([emoji, user_ids]) => ({ emoji, user_ids })),
      };
    });
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; body?: string; imagePath?: string; attachment?: any }) => d)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;
    const body = data.body?.trim() || null;
    const imagePath = data.imagePath?.trim() || null;
    const attachment = (data.attachment ?? null) as any;
    if (!body && !imagePath && !attachment) throw new Error("Message is empty");
    if (body && body.length > 4000) throw new Error("Message too long");
    const { data: row, error } = await supabase
      .from("chat_messages")
      .insert({ room_id: data.roomId, sender_id: userId, body, image_path: imagePath, attachment })
      .select("id")
      .single();
    if (error) throw error;
    // Bump room updated_at
    await supabase.from("chat_rooms").update({ updated_at: new Date().toISOString() }).eq("id", data.roomId);
    return { id: row.id };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messageId: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase } = context;
    const { error } = await supabase
      .from("chat_messages")
      .update({ deleted_at: new Date().toISOString(), body: null, image_path: null, attachment: null })
      .eq("id", data.messageId);
    if (error) throw error;
    return { ok: true };
  });

// ---------- Reactions ----------
export const toggleReaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { messageId: string; emoji: string }) => d)
  .handler(async ({ data, context }): Promise<{ added: boolean }> => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("chat_reactions")
      .select("emoji")
      .eq("message_id", data.messageId)
      .eq("user_id", userId)
      .eq("emoji", data.emoji)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("chat_reactions")
        .delete()
        .eq("message_id", data.messageId)
        .eq("user_id", userId)
        .eq("emoji", data.emoji);
      return { added: false };
    }
    await supabase.from("chat_reactions").insert({
      message_id: data.messageId,
      user_id: userId,
      emoji: data.emoji,
    });
    return { added: true };
  });

// ---------- Read receipts ----------
export const markRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    await supabase
      .from("chat_members")
      .update({ last_read_at: new Date().toISOString() })
      .eq("room_id", data.roomId)
      .eq("user_id", userId);
    return { ok: true };
  });

// ---------- Create room / invite ----------
async function resolveUserByIdentifier(supabase: any, identifier: string): Promise<string | null> {
  const cleaned = identifier.trim();
  if (!cleaned) return null;
  // Try profile display_name (case-insensitive)
  const { data: pByName } = await supabase
    .from("profiles")
    .select("id")
    .ilike("display_name", cleaned)
    .limit(1);
  if (pByName && pByName.length) return pByName[0].id;
  // If it looks like an email, try admin lookup
  if (cleaned.includes("@")) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // getUserByEmail is available in @supabase/supabase-js admin API
    const anyAdmin = supabaseAdmin.auth.admin as any;
    if (typeof anyAdmin.getUserByEmail === "function") {
      const { data } = await anyAdmin.getUserByEmail(cleaned);
      if (data?.user?.id) return data.user.id;
    }
    // Fallback: list users and filter (small projects only)
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find((u: any) => (u.email ?? "").toLowerCase() === cleaned.toLowerCase());
    if (found) return found.id;
  }
  return null;
}

export const createGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; initialMembers?: string[] }) => d)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;
    await requirePremium(supabase, userId);
    const name = data.name.trim();
    if (!name) throw new Error("Group name is required");
    if (name.length > 80) throw new Error("Group name too long");

    // Use service-role admin to bypass RLS edge cases when creating a room +
    // adding the creator as owner atomically. Premium + auth are already verified above.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: room, error } = await supabaseAdmin
      .from("chat_rooms")
      .insert({ kind: "group", name, created_by: userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { error: memErr } = await supabaseAdmin
      .from("chat_members")
      .insert({ room_id: room.id, user_id: userId, role: "owner" });
    if (memErr) {
      // Roll back the room so we never leave an orphaned row the creator can't see.
      await supabaseAdmin.from("chat_rooms").delete().eq("id", room.id);
      throw new Error(memErr.message);
    }

    // Resolve and add initial members (best-effort; a bad identifier doesn't fail the whole group).
    for (const ident of data.initialMembers ?? []) {
      const uid = await resolveUserByIdentifier(supabase, ident);
      if (uid && uid !== userId) {
        await supabaseAdmin
          .from("chat_members")
          .insert({ room_id: room.id, user_id: uid, role: "member" });
      }
    }
    return { id: room.id };
  });

export const createDm = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { identifier: string }) => d)
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const { supabase, userId } = context;
    await requirePremium(supabase, userId);
    const otherId = await resolveUserByIdentifier(supabase, data.identifier);
    if (!otherId) throw new Error("No Onyx user found with that name or email");
    if (otherId === userId) throw new Error("You can't DM yourself");

    // Find existing DM between the two
    const { data: mine } = await supabase
      .from("chat_members")
      .select("room_id, chat_rooms!inner(kind)")
      .eq("user_id", userId);
    const myDmRoomIds = (mine ?? [])
      .filter((r: any) => r.chat_rooms.kind === "dm")
      .map((r: any) => r.room_id);
    if (myDmRoomIds.length) {
      const { data: theirs } = await supabase
        .from("chat_members")
        .select("room_id")
        .eq("user_id", otherId)
        .in("room_id", myDmRoomIds);
      if (theirs && theirs.length) return { id: theirs[0].room_id };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: room, error } = await supabaseAdmin
      .from("chat_rooms")
      .insert({ kind: "dm", created_by: userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const { error: memErr } = await supabaseAdmin.from("chat_members").insert([
      { room_id: room.id, user_id: userId, role: "owner" },
      { room_id: room.id, user_id: otherId, role: "member" },
    ]);
    if (memErr) {
      await supabaseAdmin.from("chat_rooms").delete().eq("id", room.id);
      throw new Error(memErr.message);
    }
    return { id: room.id };
  });

export const inviteToRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; identifier: string }) => d)
  .handler(async ({ data, context }): Promise<{ user_id: string; display_name: string | null }> => {
    const { supabase, userId } = context;
    const { data: mine } = await supabase
      .from("chat_members")
      .select("role")
      .eq("room_id", data.roomId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!mine || mine.role !== "owner") throw new Error("Only the group owner can invite members");
    const otherId = await resolveUserByIdentifier(supabase, data.identifier);
    if (!otherId) throw new Error("No Onyx user found with that name or email");
    if (otherId === userId) throw new Error("You're already in this group");

    const { data: exists } = await supabase
      .from("chat_members")
      .select("user_id")
      .eq("room_id", data.roomId)
      .eq("user_id", otherId)
      .maybeSingle();
    if (exists) throw new Error("They're already in this group");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Enforce: invited user must have an active subscription (no free-riders)
    const [liveCheck, sandboxCheck] = await Promise.all([
      supabaseAdmin.rpc("has_active_subscription", { user_uuid: otherId, check_env: "live" }),
      supabaseAdmin.rpc("has_active_subscription", { user_uuid: otherId, check_env: "sandbox" }),
    ]);
    const hasSub = Boolean(liveCheck.data) || Boolean(sandboxCheck.data);
    if (!hasSub) {
      throw new Error("This person needs an active subscription before they can be added to a group.");
    }

    const { error } = await supabaseAdmin
      .from("chat_members")
      .insert({ room_id: data.roomId, user_id: otherId, role: "member" });
    if (error) throw new Error(error.message);
    const { data: prof } = await supabase
      .from("profiles").select("display_name").eq("id", otherId).maybeSingle();
    return { user_id: otherId, display_name: prof?.display_name ?? null };
  });

export const removeMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; userId: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase, userId } = context;
    if (data.userId !== userId) {
      // owner-only path
      const { data: mine } = await supabase
        .from("chat_members").select("role").eq("room_id", data.roomId).eq("user_id", userId).maybeSingle();
      if (!mine || mine.role !== "owner") throw new Error("Only the owner can remove members");
    }
    await supabase.from("chat_members").delete().eq("room_id", data.roomId).eq("user_id", data.userId);
    return { ok: true };
  });

export const renameGroup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; name: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase } = context;
    const name = data.name.trim();
    if (!name || name.length > 80) throw new Error("Invalid name");
    const { error } = await supabase.from("chat_rooms").update({ name }).eq("id", data.roomId);
    if (error) throw error;
    return { ok: true };
  });

export const deleteRoom = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { supabase } = context;
    const { error } = await supabase.from("chat_rooms").delete().eq("id", data.roomId);
    if (error) throw error;
    return { ok: true };
  });

export const setRoomAvatar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { roomId: string; path: string }) => d)
  .handler(async ({ data, context }): Promise<{ ok: true; url: string | null }> => {
    const { supabase, userId } = context;
    const { data: mem } = await supabase
      .from("chat_members").select("role").eq("room_id", data.roomId).eq("user_id", userId).maybeSingle();
    if (!mem) throw new Error("Not a member of this chat");
    const { data: room } = await supabase
      .from("chat_rooms").select("kind").eq("id", data.roomId).maybeSingle();
    if (!room || room.kind !== "group") throw new Error("Only group chats have a photo");
    const { error } = await supabase.from("chat_rooms").update({ avatar_url: data.path }).eq("id", data.roomId);
    if (error) throw error;
    return { ok: true, url: await signImage(supabase, data.path) };
  });



// ---------- Signed-URL helper for client-side avatar/image loads ----------
export const signChatImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { path: string }) => d)
  .handler(async ({ data, context }): Promise<{ url: string | null }> => {
    return { url: await signImage(context.supabase, data.path) };
  });

// ---------- Premium check (client-side gate) ----------
export const checkChatAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: boolean }> => {
    try {
      await requirePremium(context.supabase, context.userId);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });
