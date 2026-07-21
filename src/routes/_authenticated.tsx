import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { hasSavedSession } from "@/lib/capacitor-storage";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const hasSession = await hasSavedSession();
    if (!hasSession) {
      console.log("[Auth] Unauthorized. Redirecting to /auth");
      throw redirect({ to: "/auth", search: { redirect: location.pathname } });
    }
  },
  component: () => <Outlet />,
});
