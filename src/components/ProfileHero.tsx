import { useEffect, useRef, useState, isValidElement, cloneElement } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Flame,
  Bell,
  BellOff,
  LogOut,
  Trophy,
  Dumbbell,
  Utensils,
  Heart,
  Camera,
  Loader2,
  Settings,
  Globe,
  Check,
  CalendarDays,
  BarChart3,
  Pencil,
  X,
} from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { getMyStreak, getRecentCheckInDays, getThisWeekLoggedDays } from "@/lib/streak";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useT, useLang } from "@/i18n/LanguageProvider";
import {
  isIOSNative,
  hkIsAvailable,
  hkRequestPermissions,
  hkIsConnected,
  hkSetEnabled,
} from "@/lib/healthkit";
import type { Lang } from "@/i18n";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { updateMyProfile } from "@/lib/purchases.functions";
import { toast } from "sonner";
import type { Program } from "@/data/programs";
import profileBanner from "@/assets/profile-banner.jpg";

type Props = {
  name: string;
  avatarUrl?: string | null;
  isMember: boolean;
  memberTierLabel?: string;
  workoutsCompleted: number;
  savedItems: number;
  challengesDone: number;
  recipesTried: number;
  activeProgram?: { program: Program; progress: any; pct: number; totalDays: number } | null;
  onSignOut: () => void;
};

function normalizeImage(img: any): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (typeof img === "object" && "url" in img) return (img as any).url ?? null;
  return null;
}

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "no", label: "Norsk", flag: "🇳🇴" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
];

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ProfileHero({
  name,
  avatarUrl,
  isMember,
  memberTierLabel,
  workoutsCompleted,
  savedItems,
  challengesDone,
  recipesTried,
  activeProgram,
  onSignOut,
}: Props) {
  const t = useT();
  const { lang, setLang } = useLang();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: streak } = useQuery({ queryKey: ["streak"], queryFn: getMyStreak });
  const { data: weekDays } = useQuery({ queryKey: ["streak-week"], queryFn: getThisWeekLoggedDays });
  const { data: checkInDays = [] } = useQuery({ queryKey: ["profile-check-ins"], queryFn: () => getRecentCheckInDays(30, 7) });
  const push = usePushNotifications();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [optimisticCheckedIn, setOptimisticCheckedIn] = useState(false);
  const [celebrateQueue, setCelebrateQueue] = useState<{ key: string; label: string; icon: React.ReactNode; flame?: boolean }[]>([]);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [savingName, setSavingName] = useState(false);

  // ── HealthKit State & Sync handlers ───────────────────────────────────────
  const [hkAvailable, setHkAvailable] = useState(false);
  const [hkConnected, setHkConnected] = useState(false);
  const [syncingHk, setSyncingHk] = useState(false);

  useEffect(() => {
    if (isIOSNative()) {
      hkIsAvailable().then(setHkAvailable);
      hkIsConnected().then(setHkConnected);
    }
  }, []);

  const handleHkToggle = async (enabled: boolean) => {
    if (enabled) {
      setSyncingHk(true);
      
      // Wait 500ms to allow dropdown menu close transitions to fully finish.
      // This stabilizes the iOS view hierarchy and prevents RunningBoard (RBS) errors.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a timeout promise to reset the loading state if the native iOS coordinator hangs/fails.
      let hasTimedOut = false;
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          hasTimedOut = true;
          resolve(false);
        }, 8000); // 8 seconds
      });

      try {
        console.log("[HealthKit] Starting authorization race with 8s timeout...");
        const authorized = await Promise.race([
          hkRequestPermissions(),
          timeoutPromise
        ]);

        if (authorized) {
          await hkSetEnabled(true);
          setHkConnected(true);
          toast.success(t("profile.healthkit.success") || "Apple Health sync enabled successfully! ✅");
        } else {
          if (hasTimedOut) {
            console.warn("[HealthKit] Request timed out. Incomplete Xcode HealthKit capabilities/plist setup is the typical cause.");
            toast.error(
              "Sync timed out. Please ensure you have added the 'HealthKit' Capability in Xcode under 'Signing & Capabilities'.",
              { duration: 8000 }
            );
          } else {
            toast.error(t("profile.healthkit.error") || "Permission to access Apple Health was denied.");
          }
        }
      } catch (err) {
        console.error("[HealthKit] Authorization race threw error:", err);
        toast.error("Failed to connect to Apple Health.");
      } finally {
        setSyncingHk(false);
      }
    } else {
      await hkSetEnabled(false);
      setHkConnected(false);
      toast.success(t("profile.healthkit.disabled") || "Apple Health sync disabled.");
    }
  };


  const initial = (name || "A").trim().charAt(0).toUpperCase();
  const dayLabels = (() => {
    const bcp47 = lang === "no" ? "nb-NO" : lang === "es" ? "es-ES" : lang === "pt-BR" ? "pt-BR" : "en-US";
    try {
      const fmt = new Intl.DateTimeFormat(bcp47, { weekday: "narrow" });
      // Monday 2024-01-01 through Sunday 2024-01-07
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(2024, 0, 1 + i);
        return fmt.format(d).toUpperCase();
      });
    } catch {
      return ["M", "T", "W", "T", "F", "S", "S"];
    }
  })();
  const doneThisWeek = (weekDays ?? []).filter(Boolean).length;
  const weeklyPct = doneThisWeek >= 7 ? 100 : Math.floor((doneThisWeek / 7) * 100);
  const avatarSrc = avatarPreview ?? avatarUrl;

  const streakTagline =
    (streak?.currentStreak ?? 0) >= 7
      ? t("profile.hero.streakOnFire")
      : (streak?.currentStreak ?? 0) >= 1
        ? t("profile.hero.streakGood")
        : t("profile.hero.streakStart");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    let shouldRevokeLocalPreview = false;
    setAvatarPreview(localPreview);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not signed in");
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `avatars/${uid}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-images")
        .upload(path, file, { cacheControl: "3600", upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("site-images").createSignedUrl(path, 60 * 60);
      await updateMyProfile({ data: { avatar_url: path } });
      if (signed?.signedUrl) {
        setAvatarPreview(signed.signedUrl);
        shouldRevokeLocalPreview = true;
      }
      await qc.invalidateQueries({ queryKey: ["me-profile"] });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success(t("profile.hero.photoUpdated"));
    } catch (err: any) {
      console.error(err);
      setAvatarPreview(null);
      toast.error(t("profile.hero.photoError"));
    } finally {
      if (shouldRevokeLocalPreview) URL.revokeObjectURL(localPreview);
      setUploading(false);
    }
  }

  async function handleSaveName() {
    const value = newName.trim();
    if (value.length < 2) return;
    setSavingName(true);
    try {
      await updateMyProfile({ data: { display_name: value } });
      await qc.invalidateQueries({ queryKey: ["me-profile"] });
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success(t("profile.hero.nameSaved") || "Name updated");
      setNameDialogOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(t("profile.hero.nameError") || "Could not update name");
    } finally {
      setSavingName(false);
    }
  }

  const pushOn = push.status === "granted";

  // Scrollable day strip: 30 days back → 7 days forward, today highlighted
  const today = new Date();
  const todayKey = localDateKey(today);
  const checkInDaySet = new Set(checkInDays);
  const todayIdx = (today.getDay() + 6) % 7; // 0=Mon..6=Sun (for weekDays array)
  const dayShort = [
    t("profile.hero.weekMonShort") || "MON",
    t("profile.hero.weekTueShort") || "TUE",
    t("profile.hero.weekWedShort") || "WED",
    t("profile.hero.weekThuShort") || "THU",
    t("profile.hero.weekFriShort") || "FRI",
    t("profile.hero.weekSatShort") || "SAT",
    t("profile.hero.weekSunShort") || "SUN",
  ];
  const DAYS_BACK = 30;
  const DAYS_FWD = 7;
  const dayStrip = Array.from({ length: DAYS_BACK + DAYS_FWD + 1 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - DAYS_BACK + i);
    const dowMon = (d.getDay() + 6) % 7;
    const isToday = i === DAYS_BACK;
    const done = checkInDaySet.has(localDateKey(d));
    return { d, dowMon, isToday, done };
  });
  const checkedInToday = checkInDaySet.has(todayKey) || optimisticCheckedIn;
  const alreadyCountedToday = !!(weekDays ?? [])[todayIdx];
  const displayStreak = checkedInToday
    ? Math.max(1, (streak?.currentStreak ?? 0) + (optimisticCheckedIn && !alreadyCountedToday ? 1 : 0))
    : (streak?.currentStreak ?? 0);
  const todayStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  return (
    <div className="space-y-5">
      {/* Top bar: avatar with gradient ring + greeting + actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative shrink-0"
          title={t("profile.hero.changePhoto")}
          aria-label={t("profile.hero.changePhoto")}
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-electric to-[#60a5fa] p-[2px]">
            <div className="relative h-full w-full rounded-full overflow-hidden bg-onyx-50">
              {avatarSrc ? (
                <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center font-display text-base font-bold text-electric bg-[#1e1e1e]">
                  {initial}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-black/60">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full border border-onyx-50 bg-electric text-white">
            <Camera className="h-2.5 w-2.5" />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
            {t("profile.hero.hiThere") || "Hi there"}
          </div>
          <button
            type="button"
            onClick={() => setNameDialogOpen(true)}
            className="group flex items-center gap-1.5 text-left"
            title={t("profile.hero.editName") || "Edit name"}
            aria-label={t("profile.hero.editName") || "Edit name"}
          >
            <h1 className="font-display text-lg sm:text-xl font-bold leading-tight break-words">{name}</h1>
            <Pencil className="h-3.5 w-3.5 text-white/40 group-hover:text-electric transition-colors shrink-0" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={t("profile.hero.settings") || "Settings"}
              aria-label={t("profile.hero.settings") || "Settings"}
            >
              <Settings className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("profile.hero.settings") || "Settings"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="h-4 w-4 mr-2" />
                <span>{t("lang.label")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onSelect={() => setLang(l.code)}>
                    <span className="mr-2">{l.flag}</span>
                    <span className="flex-1">{l.label}</span>
                    {lang === l.code && <Check className="h-4 w-4 text-electric" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onSelect={() => setNameDialogOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              <span>{t("profile.hero.editName") || "Edit name"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.navigate({ to: "/groups" })}>
              {t("nav.groups")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.navigate({ to: "/subscription" })}>
              {t("Subscription & billing")}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={push.busy || push.status === "unsupported"}
              onSelect={(e) => e.preventDefault()}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>{t("profile.hero.notifications")}</span>
              </div>
              <Switch
                checked={pushOn}
                onCheckedChange={() => {
                  (pushOn ? push.disable() : push.subscribe()).then(push.refresh);
                }}
                disabled={push.busy || push.status === "unsupported"}
                aria-label={pushOn ? t("profile.hero.remindersOn") : t("profile.hero.remindersOff")}
              />
            </DropdownMenuItem>
            {isIOSNative() && (
              <DropdownMenuItem
                disabled={syncingHk}
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-400 fill-rose-400/20" />
                  <span>{t("profile.healthkit.dropdownTitle") || "Apple Health Sync"}</span>
                </div>
                <Switch
                  checked={hkConnected}
                  onCheckedChange={handleHkToggle}
                  disabled={syncingHk}
                  aria-label={t("profile.healthkit.dropdownTitle") || "Apple Health Sync"}
                />
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut} className="text-red-400 focus:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t("auth.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Daily Check-in — glass depth card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-onyx-100 to-onyx-50 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-electric/10 blur-[80px]" aria-hidden />

        <div className="relative flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg">
            {t("profile.hero.dailyCheckIn") || "Daily Check-in"}
          </h2>
          <div className="flex items-center gap-1.5 rounded-full bg-electric/20 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-electric">
              {displayStreak} {t("profile.hero.dayStreak")}
            </span>
          </div>
        </div>

        <div
          ref={todayStripRef}
          className="relative -mx-5 px-5 flex items-center gap-3 overflow-x-auto pt-4 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          {dayStrip.map((day, i) => {
            const past = day.d < today && !day.isToday;
            const future = day.d > today;
            const showCheck = day.done || (day.isToday && checkedInToday);
            return (
              <div
                key={i}
                ref={(el) => {
                  if (day.isToday && el && todayStripRef.current) {
                    const parent = todayStripRef.current;
                    if (parent.dataset.centered !== "1") {
                      parent.scrollLeft = el.offsetLeft - parent.clientWidth / 2 + el.clientWidth / 2;
                      parent.dataset.centered = "1";
                    }
                  }
                }}
                className={
                  day.isToday
                    ? "relative shrink-0 -mt-1 h-16 w-12 rounded-2xl bg-electric shadow-[0_0_24px_rgba(37,99,235,0.45)] flex flex-col items-center justify-center"
                    : `relative shrink-0 h-14 w-10 rounded-2xl border border-white/5 bg-white/5 flex flex-col items-center justify-center ${past ? "opacity-70" : future ? "opacity-40" : ""}`
                }
              >
                <span
                  className={
                    day.isToday
                      ? "text-[10px] font-bold uppercase text-white/80"
                      : "text-[10px] font-medium uppercase text-muted-foreground"
                  }
                >
                  {day.isToday ? (t("profile.hero.today") || "Today") : dayShort[day.dowMon]}
                </span>
                <span
                  className={
                    day.isToday
                      ? "font-display text-lg font-extrabold text-white leading-none mt-0.5"
                      : "text-sm font-bold text-foreground leading-none mt-1"
                  }
                >
                  {day.d.getDate()}
                </span>
                {showCheck && (
                  <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 border border-onyx-50 shadow">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={checkedInToday || checkingIn}
          onClick={async () => {
            if (checkedInToday) return;
            setCheckingIn(true);
            try {
              const { data: u } = await supabase.auth.getUser();
              if (!u.user) throw new Error("not signed in");
              // Guard against double check-in on the same local day. Workout logs do not pre-check this button.
              const startOfLocalDay = new Date();
              startOfLocalDay.setHours(0, 0, 0, 0);
              const { data: existing } = await supabase
                .from("activity_events")
                .select("id")
                .eq("user_id", u.user.id)
                .eq("kind", "program_day")
                .eq("item_slug", "daily-checkin")
                .gte("created_at", startOfLocalDay.toISOString())
                .limit(1);
              if (!existing || existing.length === 0) {
                const { error } = await supabase.from("activity_events").insert({
                  user_id: u.user.id,
                  kind: "program_day",
                  title: "Daily check-in",
                  item_slug: "daily-checkin",
                });
                if (error) throw error;
              }
              setOptimisticCheckedIn(true);
              await Promise.all([
                qc.invalidateQueries({ queryKey: ["streak"] }),
                qc.invalidateQueries({ queryKey: ["streak-week"] }),
                qc.invalidateQueries({ queryKey: ["profile-check-ins"] }),
              ]);
              toast.success(t("profile.hero.checkedInToday") || "Checked in!");
              if (push.status !== "granted" && push.status !== "unsupported") {
                push.subscribe().then(push.refresh).catch(() => {});
              }
            } catch (e: any) {
              toast.error(e?.message || "Could not check in");
            } finally {
              setCheckingIn(false);
            }
          }}
          className="relative flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors group disabled:opacity-70 disabled:cursor-default"
        >
          <span>
            {checkingIn
              ? "..."
              : checkedInToday
                ? t("profile.hero.checkedInToday") || "You're checked in today"
                : t("profile.hero.checkInToday") || "Your check-in is Today"}
          </span>
          {!checkedInToday && (
            <span aria-hidden className="text-electric group-hover:translate-x-1 transition-transform">→</span>
          )}
        </button>

      </div>

      {/* Stat strip — individual glass tiles */}
      <div className="grid grid-cols-4 gap-2">
        <StatCell value={workoutsCompleted} label={t("profile.hero.workouts")} />
        <StatCell value={streak?.currentStreak ?? 0} label={t("profile.hero.streak")} accent />
        <StatCell value={recipesTried} label={t("profile.hero.recipes")} />
        <StatCell value={savedItems} label={t("profile.hero.saved")} />
      </div>

      {/* Weekly progress + active program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setStatsOpen(true)}
          className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-left transition-colors hover:bg-white/[0.08]"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-sm font-bold">{t("profile.hero.weeklyProgress")}</h3>
              <p className="text-xs text-muted-foreground">
                {doneThisWeek} {t("profile.hero.ofDaysCompleted")}
              </p>
            </div>
            <span className="font-display text-2xl font-black text-electric">{weeklyPct}%</span>
          </div>
          <div className="flex justify-between items-center px-1">
            {dayLabels.map((d, i) => {
              const done = !!(weekDays ?? [])[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      done
                        ? "bg-electric text-white"
                        : "bg-white/10 border border-white/20 text-white/30"
                    }`}
                    aria-label={`${d} ${done ? t("profile.hero.done") : t("profile.hero.rest")}`}
                  >
                    {d}
                  </div>
                </div>
              );
            })}
          </div>
        </button>

        {activeProgram && (
          <Link
            to="/training/$slug"
            params={{ slug: activeProgram.program.slug }}
            className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition-all"
          >
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              {normalizeImage(activeProgram.program.image) && (
                <img
                  src={normalizeImage(activeProgram.program.image)!}
                  alt=""
                  className="h-full w-full object-cover"
                  aria-hidden
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-onyx-100 via-onyx-100/70 to-transparent" />
            </div>
            <div className="relative">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                {t("profile.hero.activeProgram")}
              </div>
              <div className="mt-1 font-display text-base font-bold text-electric line-clamp-1">
                {activeProgram.program.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeProgram.progress.completed_days.length}/{activeProgram.totalDays} {t("library.days")}
              </div>
              <Progress value={activeProgram.pct} className="mt-2" />
              <div className="mt-2 text-xs font-semibold text-electric">
                {t("library.openTraining")}
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* iOS HealthKit Integration Card */}
      {isIOSNative() && !hkConnected && (
        <div className="relative overflow-hidden rounded-[1.5rem] border border-rose-500/25 bg-gradient-to-br from-rose-500/10 via-onyx-100 to-onyx-100 p-5 shadow-[0_12px_24px_rgba(244,63,94,0.06)]">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" aria-hidden />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-rose-500/20 grid place-items-center text-rose-400">
                <Heart className="h-5 w-5 fill-rose-500/30 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Sync with Apple Health
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                  Automatically import your body weight, sync workouts, and track daily activity calories.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={syncingHk}
              onClick={() => handleHkToggle(true)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-xl transition duration-150 shrink-0"
            >
              {syncingHk ? "Connecting..." : "Enable Sync"}
            </button>
          </div>
        </div>
      )}

      {/* Achievements */}
      <AchievementsBlock
        workoutsCompleted={workoutsCompleted}
        challengesDone={challengesDone}
        recipesTried={recipesTried}
        longestStreak={streak?.longestStreak ?? 0}
        achievementsOpen={achievementsOpen}
        setAchievementsOpen={setAchievementsOpen}
        onNewlyUnlocked={(items) => setCelebrateQueue((q) => [...q, ...items])}
        t={t}
      />

      {/* Achievement celebration modal */}
      {celebrateQueue.length > 0 && (
        <Dialog
          open
          onOpenChange={(o) => {
            if (!o) setCelebrateQueue((q) => q.slice(1));
          }}
        >
          <DialogContent className="w-[calc(100%-3rem)] max-w-[280px] rounded-2xl border-electric/40 bg-gradient-to-b from-onyx-50 to-onyx-100 p-0 text-center text-foreground shadow-[0_20px_60px_rgba(37,99,235,0.4)]">
            <div className="relative overflow-hidden rounded-2xl p-4">
              <div className="pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-electric/25 blur-2xl" aria-hidden />
              <div className="relative">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-electric">
                  {t("profile.hero.achievementUnlocked")}
                </div>
                <div className="mx-auto mt-3 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-electric to-[#1e3a8a] shadow-[0_0_24px_rgba(37,99,235,0.6)]">
                  <div className="scale-125">
                    {isValidElement(celebrateQueue[0].icon)
                      ? cloneElement(celebrateQueue[0].icon as React.ReactElement<{ className?: string; size?: number }>, {
                          className: `${((celebrateQueue[0].icon as React.ReactElement<{ className?: string }>).props.className || "").replace(/h-\d+\s+w-\d+/g, "").trim()} h-8 w-8`,
                          size: 32,
                        })
                      : celebrateQueue[0].icon}
                  </div>
                </div>
                <DialogTitle className="mt-3 font-display text-lg font-bold">
                  {t("profile.hero.congrats")}
                </DialogTitle>
                <div className="mt-0.5 font-display text-sm font-bold text-electric">
                  {celebrateQueue[0].label}
                </div>
                <DialogDescription className="mt-2 text-xs text-muted-foreground">
                  {t("profile.hero.keepItUp")}
                </DialogDescription>
                <button
                  type="button"
                  onClick={() => setCelebrateQueue((q) => q.slice(1))}
                  className="mt-4 w-full rounded-xl bg-electric py-2.5 text-xs font-bold text-white hover:bg-electric/90 transition-colors"
                >
                  {t("common.awesome")}
                </button>
              </div>
            </div>
          </DialogContent>

        </Dialog>
      )}


      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-md rounded-2xl border-electric/25 bg-gradient-to-b from-onyx-50 to-onyx-100 p-0 text-foreground shadow-[0_24px_80px_rgba(37,99,235,0.25)]">
          <div className="p-5">
            <DialogTitle className="flex items-center gap-2 font-display text-2xl text-electric">
              <CalendarDays className="h-5 w-5" />
              {t("profile.hero.weeklyProgress")}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {t("profile.hero.statsSubtitle")}
            </DialogDescription>

            <div className="mt-5 rounded-2xl border border-electric/20 bg-onyx-100/70 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    {t("profile.hero.thisWeekScore")}
                  </div>
                  <div className="mt-1 font-display text-4xl font-bold text-electric">{doneThisWeek}/7</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold">{weeklyPct}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    {t("profile.hero.completed")}
                  </div>
                </div>
              </div>
              <Progress value={weeklyPct} className="mt-4" />
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2">
              {dayLabels.map((d, i) => {
                const done = !!(weekDays ?? [])[i];
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-2 text-center ${
                      done ? "border-electric/60 bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground"
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase">{d}</div>
                    <div className="mt-1 text-sm font-bold">{done ? "✓" : "–"}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat value={streak?.currentStreak ?? 0} label={t("profile.hero.streak")} />
              <MiniStat value={streak?.longestStreak ?? 0} label={t("profile.hero.longest")} />
              <MiniStat value={workoutsCompleted} label={t("profile.hero.workouts")} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent className="w-[calc(100%-1rem)] max-w-sm rounded-2xl border-electric/25 bg-gradient-to-b from-onyx-50 to-onyx-100 p-0 text-foreground shadow-[0_24px_80px_rgba(37,99,235,0.25)]">
          <div className="p-5">
            <DialogTitle className="font-display text-xl text-electric">
              {t("profile.hero.editName") || "Edit name"}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {t("profile.hero.yourName") || "Your name"}
            </DialogDescription>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newName.trim().length >= 2 && !savingName) {
                  void handleSaveName();
                }
              }}
              placeholder={t("profile.hero.yourName") || "Your name"}
              className="mt-4 w-full rounded-xl border border-white/10 bg-onyx-100 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none"
              disabled={savingName}
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setNameDialogOpen(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/10 transition-colors"
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                type="button"
                disabled={newName.trim().length < 2 || savingName}
                onClick={() => void handleSaveName()}
                className="flex-1 rounded-xl bg-electric py-2.5 text-sm font-bold text-white hover:bg-electric/90 transition-colors disabled:opacity-50"
              >
                {savingName ? "..." : t("common.save") || "Save"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCell({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center">
      <div className={`font-display text-xl font-black leading-none ${accent ? "text-electric" : "text-foreground"}`}>{value}</div>
      <div className="mt-1.5 text-[9px] uppercase tracking-widest text-muted-foreground font-bold leading-tight break-words">
        {label}
      </div>
    </div>
  );
}

function Badge({ unlocked, icon, label, flame: _flame }: { unlocked: boolean; icon: React.ReactNode; label: string; flame?: boolean }) {
  return (
    <div
      className={`shrink-0 flex flex-col items-center gap-2 w-20 ${unlocked ? "" : "opacity-40"}`}
      title={label}
    >
      <div
        className={`grid h-14 w-14 place-items-center rounded-full ${
          unlocked
            ? "bg-gradient-to-br from-electric to-[#1e3a8a] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            : "border border-white/10 bg-white/5 text-white/40"
        }`}
      >
        {icon}
      </div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground text-center leading-tight line-clamp-2">
        {label}
      </div>
    </div>
  );
}


function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-onyx-100 p-3 text-center">
      <div className="font-display text-xl font-bold text-electric">{value}</div>
      <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight">{label}</div>
    </div>
  );
}

type AchItem = { key: string; unlocked: boolean; icon: React.ReactNode; label: string; flame?: boolean };

function AchievementsBlock({
  workoutsCompleted,
  challengesDone,
  recipesTried,
  longestStreak,
  achievementsOpen,
  setAchievementsOpen,
  onNewlyUnlocked,
  t,
}: {
  workoutsCompleted: number;
  challengesDone: number;
  recipesTried: number;
  longestStreak: number;
  achievementsOpen: boolean;
  setAchievementsOpen: (v: boolean) => void;
  onNewlyUnlocked: (items: { key: string; label: string; icon: React.ReactNode; flame?: boolean }[]) => void;
  t: (k: string) => string;
}) {
  const flame = <Flame className="h-5 w-5 text-orange-400" fill="currentColor" />;
  const achievements: AchItem[] = [
    { key: "first-workout", unlocked: workoutsCompleted >= 1, icon: <Dumbbell className="h-5 w-5" />, label: t("profile.hero.firstWorkout") },
    { key: "streak-3", unlocked: longestStreak >= 3, icon: flame, label: t("profile.hero.threeDay") || "3-day streak", flame: true },
    { key: "streak-7", unlocked: longestStreak >= 7, icon: flame, label: t("profile.hero.sevenDay"), flame: true },
    { key: "streak-14", unlocked: longestStreak >= 14, icon: flame, label: t("profile.hero.fourteenDay") || "14-day streak", flame: true },
    { key: "streak-30", unlocked: longestStreak >= 30, icon: flame, label: t("profile.hero.thirtyDay"), flame: true },
    { key: "streak-60", unlocked: longestStreak >= 60, icon: flame, label: t("profile.hero.sixtyDay") || "60-day streak", flame: true },
    { key: "streak-100", unlocked: longestStreak >= 100, icon: flame, label: t("profile.hero.hundredDay") || "100-day streak", flame: true },
    { key: "streak-180", unlocked: longestStreak >= 180, icon: flame, label: t("profile.hero.oneEightyDay") || "180-day streak", flame: true },
    { key: "streak-365", unlocked: longestStreak >= 365, icon: <Trophy className="h-5 w-5 text-yellow-400" />, label: t("profile.hero.yearStreak") || "1-year streak" },
    { key: "first-challenge", unlocked: challengesDone >= 1, icon: <Trophy className="h-5 w-5 text-yellow-400" />, label: t("profile.hero.firstChallenge") },
    { key: "recipes-10", unlocked: recipesTried >= 10, icon: <Utensils className="h-5 w-5" />, label: t("profile.hero.tenRecipes") },
    { key: "workouts-50", unlocked: workoutsCompleted >= 50, icon: <Dumbbell className="h-5 w-5" />, label: t("profile.hero.fiftyWorkouts") },
    { key: "workouts-100", unlocked: workoutsCompleted >= 100, icon: <Dumbbell className="h-5 w-5" />, label: t("profile.hero.hundredWorkouts") || "100 workouts" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const STORE_KEY = "onyx.achievements.seen.v1";
    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    } catch {}
    const seenSet = new Set(seen);
    const unlockedNow = achievements.filter((a) => a.unlocked);
    const unlockedKeys = unlockedNow.map((a) => a.key);
    // First-run: don't celebrate pre-existing unlocked achievements — just seed.
    if (seen.length === 0) {
      localStorage.setItem(STORE_KEY, JSON.stringify(unlockedKeys));
      return;
    }
    const newly = unlockedNow.filter((a) => !seenSet.has(a.key));
    if (newly.length > 0) {
      onNewlyUnlocked(newly.map(({ key, label, icon, flame }) => ({ key, label, icon, flame })));
      localStorage.setItem(STORE_KEY, JSON.stringify(Array.from(new Set([...seen, ...unlockedKeys]))));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutsCompleted, challengesDone, recipesTried, longestStreak]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/50 px-1">
          {t("profile.hero.achievements")}
        </h3>
        <button
          type="button"
          onClick={() => setAchievementsOpen(true)}
          className="text-[11px] font-bold text-electric hover:underline"
        >
          {t("profile.hero.seeAll") || "See all"} →
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto -mx-1 px-1 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {achievements.map((a, i) => (
          <Badge key={i} unlocked={a.unlocked} icon={a.icon} label={a.label} flame={a.flame} />
        ))}
      </div>

      <Dialog open={achievementsOpen} onOpenChange={setAchievementsOpen}>
        <DialogContent className="fixed inset-0 z-50 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-gradient-to-b from-onyx-50 to-onyx-100 p-0 text-foreground data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100">
          <div className="flex h-[100dvh] flex-col overflow-hidden">
            <div className="sticky top-0 z-10 border-b border-white/10 bg-onyx-50/95 px-5 pt-[env(safe-area-inset-top)] pb-4 backdrop-blur-md">
              <DialogTitle className="flex items-center gap-2 font-display text-xl text-electric">
                <Trophy className="h-5 w-5" />
                {t("profile.hero.allAchievements") || "All achievements"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-muted-foreground">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length} {t("profile.hero.done")}
              </DialogDescription>
            </div>
            <DialogClose className="absolute right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-50 grid h-9 w-9 place-items-center rounded-full bg-onyx-950/70 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-onyx-950/90 transition-colors focus:outline-none focus:ring-2 focus:ring-electric">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="flex-1 overflow-y-auto overscroll-y-contain p-5 pb-8 [-webkit-overflow-scrolling:touch]">
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((a, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-4 text-center ${
                      a.unlocked
                        ? "border-electric/30 bg-electric/5"
                        : "border-white/10 bg-white/5 opacity-60"
                    }`}
                  >
                    <div
                      className={`grid h-14 w-14 place-items-center rounded-full ${
                        a.unlocked
                          ? "bg-gradient-to-br from-electric to-[#1e3a8a] shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                          : "border border-white/10 bg-white/5 text-white/40"
                      }`}
                    >
                      {a.unlocked ? a.icon : <span className="text-white/40">{a.icon}</span>}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                      {a.label}
                    </div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest ${a.unlocked ? "text-electric" : "text-muted-foreground"}`}>
                      {a.unlocked ? (t("profile.hero.unlocked") || "Unlocked") : (t("profile.hero.locked") || "Locked")}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-8" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
