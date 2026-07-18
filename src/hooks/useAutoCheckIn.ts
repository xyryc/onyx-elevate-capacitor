import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Keep track of check-ins attempted in the current runtime session to avoid double checks.
let sessionCheckedInForDayKey: string | null = null;

function getTodayLocalKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Automates the daily check-in feature.
 * When the app loads or a user signs in, if they haven't checked in yet today,
 * it performs the check-in automatically in the background.
 */
export function useAutoCheckIn() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const checkingRef = useRef(false);

  useEffect(() => {
    if (loading || !user || checkingRef.current) return;

    const todayKey = getTodayLocalKey();
    if (sessionCheckedInForDayKey === todayKey) {
      return; // Already checked in during this session
    }

    async function runAutoCheckIn() {
      checkingRef.current = true;
      try {
        const startOfLocalDay = new Date();
        startOfLocalDay.setHours(0, 0, 0, 0);

        // Check database to see if we already checked in today
        const { data: existing } = await supabase
          .from("activity_events")
          .select("id")
          .eq("user_id", user!.id)
          .eq("kind", "program_day")
          .eq("item_slug", "daily-checkin")
          .gte("created_at", startOfLocalDay.toISOString())
          .limit(1);

        if (!existing || existing.length === 0) {
          // Perform automatic check-in
          const { error } = await supabase.from("activity_events").insert({
            user_id: user!.id,
            kind: "program_day",
            title: "Daily check-in",
            item_slug: "daily-checkin",
          });

          if (error) throw error;

          // Invalidate queries so streak numbers updates immediately on all pages
          await Promise.all([
            qc.invalidateQueries({ queryKey: ["streak"] }),
            qc.invalidateQueries({ queryKey: ["streak-week"] }),
            qc.invalidateQueries({ queryKey: ["profile-check-ins"] }),
          ]);

          toast.success("Checked in automatically today! ⚡️", {
            description: "Your daily streak has been updated.",
            duration: 4000,
          });
        }

        // Cache the session check-in
        sessionCheckedInForDayKey = todayKey;
      } catch (err) {
        console.error("[Auto Check-in] Failed:", err);
      } finally {
        checkingRef.current = false;
      }
    }

    runAutoCheckIn();
  }, [user, loading, qc]);
}
