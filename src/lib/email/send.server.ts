// Server-only helper to enqueue a transactional email from trusted server code
// (e.g. Stripe webhook). Skips the user-JWT check that the public
// /lovable/email/transactional/send route enforces. Never import from client code.
import * as React from "react";
import { render } from "react-email";
import { TEMPLATES } from "@/lib/email-templates/registry";

const SITE_NAME = "onyx-movements-hub";
const SENDER_DOMAIN = "notify.onyxperformance.app";
const FROM_DOMAIN = "onyxperformance.app";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function enqueueTransactionalEmail(opts: {
  templateName: string;
  recipientEmail: string;
  templateData?: Record<string, any>;
  idempotencyKey?: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const { templateName, recipientEmail } = opts;
  const templateData = opts.templateData ?? {};

  const entry = TEMPLATES[templateName];
  if (!entry) return { ok: false, reason: "template_not_found" };

  const normalized = recipientEmail.trim().toLowerCase();
  if (!normalized.includes("@")) return { ok: false, reason: "invalid_email" };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const messageId = crypto.randomUUID();
  const idempotencyKey = opts.idempotencyKey || messageId;

  // Check suppression
  const { data: suppressed } = await supabaseAdmin
    .from("suppressed_emails")
    .select("email")
    .eq("email", normalized)
    .maybeSingle();
  if (suppressed) return { ok: false, reason: "suppressed" };

  // Unsubscribe token
  let unsubscribeToken: string | undefined;
  const { data: existingToken } = await supabaseAdmin
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalized)
    .maybeSingle();
  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token;
  } else if (!existingToken) {
    unsubscribeToken = generateToken();
    await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: unsubscribeToken, email: normalized },
        { onConflict: "email", ignoreDuplicates: true },
      );
    const { data: stored } = await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalized)
      .maybeSingle();
    if (stored) unsubscribeToken = stored.token;
  } else {
    return { ok: false, reason: "token_used" };
  }

  const element = React.createElement(entry.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject = typeof entry.subject === "function" ? entry.subject(templateData) : entry.subject;

  await supabaseAdmin.from("email_send_log").insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: normalized,
    status: "pending",
  });

  const { error: enqueueError } = await supabaseAdmin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: normalized,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    await supabaseAdmin.from("email_send_log").insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: normalized,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
    return { ok: false, reason: "enqueue_failed" };
  }

  return { ok: true };
}
