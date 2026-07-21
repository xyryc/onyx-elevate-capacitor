import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
});

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

function UnsubscribePage() {
  const [status, setStatus] = useState<Status>("loading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) {
      setStatus("invalid");
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setStatus("valid");
        else if (d.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      })
      .catch(() => setStatus("error"));
  }, []);

  const confirm = async () => {
    if (!token) return;
    setStatus("loading");
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (d.success) setStatus("success");
      else if (d.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background text-foreground">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Unsubscribe</h1>
        {status === "loading" && <p>Checking…</p>}
        {status === "valid" && (
          <>
            <p>Click below to unsubscribe from Onyx emails.</p>
            <button
              onClick={confirm}
              className="px-5 py-2 rounded-md bg-primary text-primary-foreground"
            >
              Confirm unsubscribe
            </button>
          </>
        )}
        {status === "success" && <p>You've been unsubscribed. Sorry to see you go.</p>}
        {status === "already" && <p>This email is already unsubscribed.</p>}
        {status === "invalid" && <p>This unsubscribe link is invalid or expired.</p>}
        {status === "error" && <p>Something went wrong. Please try again later.</p>}
      </div>
    </div>
  );
}
