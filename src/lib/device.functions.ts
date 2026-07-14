import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SITE_NAME = "Onyx Elevate";
const CODE_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

// Users exempt from device email verification (e.g. accounts without a real
// inbox they can access, such as Apple private-relay aliases they don't own).
const DEVICE_VERIFY_BYPASS_USER_IDS = new Set<string>([
  "054655a6-c41c-4608-83da-a2d916f4fc9e",
]);


async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] % 1_000_000).toString().padStart(6, "0");
}

export type EnsureDeviceResult =
  | { trusted: true }
  | { trusted: false; sentTo: string };

export const ensureDeviceTrusted = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { deviceHash: string; deviceLabel?: string }) => {
    if (!input?.deviceHash || typeof input.deviceHash !== "string" || input.deviceHash.length > 128) {
      throw new Error("Invalid device");
    }
    return {
      deviceHash: input.deviceHash,
      deviceLabel: (input.deviceLabel ?? "Unknown device").slice(0, 120),
    };
  })
  .handler(async ({ data, context }): Promise<EnsureDeviceResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    // Bypass for accounts without an accessible inbox: auto-trust every device.
    if (DEVICE_VERIFY_BYPASS_USER_IDS.has(userId)) {
      await supabaseAdmin.from("user_trusted_devices").upsert(
        {
          user_id: userId,
          device_hash: data.deviceHash,
          label: data.deviceLabel,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,device_hash" },
      );
      return { trusted: true };
    }


    // Already trusted?
    const { data: trusted } = await supabaseAdmin
      .from("user_trusted_devices")
      .select("device_hash")
      .eq("user_id", userId)
      .eq("device_hash", data.deviceHash)
      .maybeSingle();

    if (trusted) {
      await supabaseAdmin
        .from("user_trusted_devices")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("device_hash", data.deviceHash);
      return { trusted: true };
    }

    // Look up user email up-front (needed for the masked hint either way).
    const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(userId);
    const email = userRes?.user?.email;
    if (!email) throw new Error("User email not found");
    const [local, domain] = email.split("@");
    const masked = `${local.slice(0, 2)}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;

    // Reuse existing challenge if it was sent recently (avoid email spam on reloads).
    const { data: existing } = await supabaseAdmin
      .from("user_device_challenges")
      .select("expires_at, created_at")
      .eq("user_id", userId)
      .eq("device_hash", data.deviceHash)
      .maybeSingle();
    if (
      existing &&
      new Date(existing.expires_at).getTime() > Date.now() &&
      Date.now() - new Date(existing.created_at).getTime() < 60_000
    ) {
      return { trusted: false, sentTo: masked };
    }

    // Create/refresh challenge and email a fresh code.
    const code = generateCode();
    const codeHash = await sha256Hex(`${userId}:${data.deviceHash}:${code}`);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString();

    await supabaseAdmin.from("user_device_challenges").upsert(
      {
        user_id: userId,
        device_hash: data.deviceHash,
        code_hash: codeHash,
        label: data.deviceLabel,
        attempts: 0,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      },
      { onConflict: "user_id,device_hash" },
    );


    const { enqueueTransactionalEmail } = await import("@/lib/email/send.server");
    const result = await enqueueTransactionalEmail({
      templateName: "device-verification",
      recipientEmail: email,
      idempotencyKey: `device-verify-${userId}-${data.deviceHash}-${Date.now()}`,
      templateData: {
        code,
        deviceLabel: data.deviceLabel,
        siteName: SITE_NAME,
      },
    });

    if (!result.ok && result.reason !== "suppressed") {
      // Still return not-trusted; user can request a resend.
      console.error("Failed to enqueue device verification email:", result.reason);
    }

    return { trusted: false, sentTo: masked };
  });

export const verifyDeviceCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { deviceHash: string; code: string; deviceLabel?: string; remember?: boolean }) => {
    if (!input?.deviceHash || !input?.code) throw new Error("Missing fields");
    const code = String(input.code).replace(/\s+/g, "");
    if (!/^\d{6}$/.test(code)) throw new Error("Code must be 6 digits");
    return {
      deviceHash: String(input.deviceHash).slice(0, 128),
      code,
      deviceLabel: (input.deviceLabel ?? "Unknown device").slice(0, 120),
      remember: input.remember !== false, // default true
    };
  })
  .handler(async ({ data, context }): Promise<{ ok: true } | { ok: false; reason: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: challenge } = await supabaseAdmin
      .from("user_device_challenges")
      .select("code_hash, expires_at, attempts, label")
      .eq("user_id", userId)
      .eq("device_hash", data.deviceHash)
      .maybeSingle();

    if (!challenge) return { ok: false, reason: "no_challenge" };
    if (new Date(challenge.expires_at).getTime() < Date.now()) {
      return { ok: false, reason: "expired" };
    }
    if ((challenge.attempts ?? 0) >= MAX_ATTEMPTS) {
      return { ok: false, reason: "too_many_attempts" };
    }

    const expected = await sha256Hex(`${userId}:${data.deviceHash}:${data.code}`);
    if (expected !== challenge.code_hash) {
      await supabaseAdmin
        .from("user_device_challenges")
        .update({ attempts: (challenge.attempts ?? 0) + 1 })
        .eq("user_id", userId)
        .eq("device_hash", data.deviceHash);
      return { ok: false, reason: "invalid_code" };
    }

    // Only persist as trusted if "Remember this device" was checked at sign-in.
    if (data.remember) {
      await supabaseAdmin.from("user_trusted_devices").upsert(
        {
          user_id: userId,
          device_hash: data.deviceHash,
          label: challenge.label ?? data.deviceLabel,
          first_seen_at: new Date().toISOString(),
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id,device_hash" },
      );
    }
    await supabaseAdmin
      .from("user_device_challenges")
      .delete()
      .eq("user_id", userId)
      .eq("device_hash", data.deviceHash);

    return { ok: true };
  });
