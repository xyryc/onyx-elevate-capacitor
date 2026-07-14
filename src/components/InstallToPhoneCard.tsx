import { useEffect, useState } from "react";
import { Smartphone, Share, PlusSquare, MoreVertical, Download, Check, X, ChevronDown } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  const mm = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS Safari legacy flag
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return !!(mm || iosStandalone);
}

export function InstallToPhoneCard() {
  const t = useT();
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [installed, setInstalled] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [showAndroidSheet, setShowAndroidSheet] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isStandalone());

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const result = await deferred.userChoice;
      if (result.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    if (platform === "ios") {
      setShowIosSheet(true);
      return;
    }
    if (platform === "android") {
      setShowAndroidSheet(true);
      return;
    }
    setShowAndroidSheet(true);
  };

  const buttonLabel = installed
    ? t("install.button.installedDevice")
    : platform === "ios"
      ? t("install.button.iphone")
      : platform === "android"
        ? t("install.button.android")
        : t("install.button.homeScreen");

  return (
    <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/10 via-onyx-100 to-onyx-100 shadow-[0_0_30px_rgba(0,180,255,0.12)] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-onyx-100/60 transition-colors"
        aria-expanded={expanded}
      >
        <div className="h-10 w-10 shrink-0 rounded-xl bg-electric/20 grid place-items-center text-electric ring-1 ring-electric/40">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold leading-none">{t("install.eyebrow")}</p>
          <h3 className="mt-1 font-display text-base sm:text-lg font-bold leading-tight truncate">
            {t("install.title")}
          </h3>
        </div>
        {installed ? (
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-electric">
            <Check className="h-4 w-4" /> {t("install.installed")}
          </span>
        ) : (
          <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        )}
      </button>

      {expanded && !installed && (
        <div className="px-4 pb-5 pt-1 border-t border-border/60">
          <p className="mt-4 text-sm text-muted-foreground">
            {t("install.description")}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-electric px-4 py-3 text-sm font-bold text-onyx-50 hover:bg-electric-glow hover:shadow-electric transition-all"
            >
              <Download className="h-4 w-4" />
              {buttonLabel}
            </button>
            <button
              type="button"
              onClick={() => (platform === "ios" ? setShowIosSheet(true) : setShowAndroidSheet(true))}
              className="inline-flex items-center justify-center rounded-md border border-border bg-onyx-100 px-4 py-3 text-sm font-semibold hover:bg-onyx-200 transition-colors"
            >
              {t("install.howItWorks")}
            </button>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs">
            <PlatformHint
              title={t("install.platform.ios.title")}
              steps={[t("install.platform.ios.step1"), t("install.platform.ios.step2"), t("install.platform.ios.step3")]}
              onClick={() => setShowIosSheet(true)}
            />
            <PlatformHint
              title={t("install.platform.android.title")}
              steps={[t("install.platform.android.step1"), t("install.platform.android.step2"), t("install.platform.android.step3")]}
              onClick={() => setShowAndroidSheet(true)}
            />
            <PlatformHint
              title={t("install.platform.desktop.title")}
              steps={[t("install.platform.desktop.step1"), t("install.platform.desktop.step2"), t("install.platform.desktop.step3")]}
              onClick={() => setShowAndroidSheet(true)}
            />
          </div>
        </div>
      )}

      {showIosSheet && <IosInstructions onClose={() => setShowIosSheet(false)} />}
      {showAndroidSheet && <AndroidInstructions onClose={() => setShowAndroidSheet(false)} />}
    </div>
  );
}

function PlatformHint({ title, steps, onClick }: { title: string; steps: string[]; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg border border-border bg-onyx-50/60 p-3 hover:border-electric/50 hover:bg-onyx-100 transition-colors"
    >
      <p className="font-bold text-foreground">{title}</p>
      <ol className="mt-1 space-y-0.5 text-muted-foreground list-decimal list-inside">
        {steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
    </button>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-onyx-50 border border-border rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-display font-bold">{title}</h4>
          <button onClick={onClose} aria-label={t("common.close")} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto text-sm">{children}</div>
      </div>
    </div>
  );
}

function IosInstructions({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <Sheet title={t("install.ios.title")} onClose={onClose}>
      <p className="text-muted-foreground">
        {t("install.ios.intro1")} <span className="text-foreground font-semibold">{t("install.ios.openSafari")}</span> {t("install.ios.intro2")}
      </p>
      <ol className="mt-4 space-y-3">
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">1</span>
          <p>{t("install.ios.step1.before")} <span className="text-foreground font-semibold">onyxperformance.app</span> {t("install.ios.step1.after")}</p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">2</span>
          <p className="flex items-center gap-2">
            {t("install.ios.step2.before")} <Share className="inline h-4 w-4 text-electric" /> <span className="font-semibold text-foreground">{t("install.ios.share")}</span> {t("install.ios.step2.after")}
          </p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">3</span>
          <p className="flex items-center gap-2">
            {t("install.ios.step3.before")} <PlusSquare className="inline h-4 w-4 text-electric" /> <span className="font-semibold text-foreground">{t("install.ios.addHome")}</span>.
          </p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">4</span>
          <p>{t("install.ios.step4.before")} <span className="font-semibold text-foreground">{t("install.ios.add")}</span> {t("install.ios.step4.after")}</p>
        </li>
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">
        {t("install.ios.tip")}
      </p>
    </Sheet>
  );
}

function AndroidInstructions({ onClose }: { onClose: () => void }) {
  const t = useT();
  return (
    <Sheet title={t("install.android.title")} onClose={onClose}>
      <p className="text-muted-foreground">
        {t("install.android.intro1")} <span className="text-foreground font-semibold">Chrome</span>. {t("install.android.intro2")} <span className="text-foreground font-semibold">Chrome {t("install.android.or")} Edge</span>.
      </p>
      <ol className="mt-4 space-y-3">
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">1</span>
          <p>{t("install.android.step1.before")} <span className="text-foreground font-semibold">onyxperformance.app</span>.</p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">2</span>
          <p className="flex items-center gap-2">
            {t("install.android.step2.before")} <MoreVertical className="inline h-4 w-4 text-electric" /> {t("install.android.step2.middle")} <Download className="inline h-4 w-4 text-electric" /> {t("install.android.step2.after")}
          </p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">3</span>
          <p>{t("install.android.step3.before")} <span className="font-semibold text-foreground">{t("install.android.installApp")}</span> {t("install.android.or")} <span className="font-semibold text-foreground">{t("install.android.addHome")}</span>.</p>
        </li>
        <li className="flex gap-3">
          <span className="h-6 w-6 shrink-0 rounded-full bg-electric text-onyx-50 grid place-items-center text-xs font-bold">4</span>
          <p>{t("install.android.step4.before")} <span className="font-semibold text-foreground">{t("install.android.install")}</span>. {t("install.android.step4.after")}</p>
        </li>
      </ol>
      <p className="mt-4 text-xs text-muted-foreground">
        {t("install.android.tip")}
      </p>
    </Sheet>
  );
}
