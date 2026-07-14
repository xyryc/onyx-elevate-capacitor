import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

function hasSavedBrowserSession() {
  if (typeof window === "undefined") return false;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as {
        access_token?: string;
        expires_at?: number;
        currentSession?: { access_token?: string; expires_at?: number };
      };
      const session = parsed.currentSession ?? parsed;
      if (!session.access_token) continue;
      if (session.expires_at && session.expires_at * 1000 < Date.now()) continue;
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    // Use the local session for the client-side route gate so navigation to
    // paid app pages is instant even on high-latency connections. Server
    // functions still validate the user before returning protected data.
    if (!hasSavedBrowserSession()) {
      throw redirect({ to: "/auth", search: { redirect: location.pathname } });
    }
  },
  component: () => <Outlet />,
});

