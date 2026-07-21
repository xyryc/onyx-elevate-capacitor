import { useEffect, useRef, useState, type FormEvent } from "react";
import onyxLogo from "@/assets/onyx-logo.png";
import heroBg from "@/assets/athlete-power.jpg";
import { useRouter } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import type { Lang } from "@/i18n/translations";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { updateMyProfile } from "@/lib/purchases.functions";
import { hasSavedSession } from "@/lib/capacitor-storage";

type SplashStrings = {
  flag: string;
  native: string;
  name: string;
  tagline: string;
  chooseLabel: string;
  headlineLead: string;
  headlineAccent: string;
  sub: string;
  welcome: string;
  welcomeSub: string;
  signIn: string;
  signUp: string;
  createAccount: string;
  email: string;
  password: string;
  yourName: string;
  continueGoogle: string;
  continueApple: string;
  or: string;
  newHere: string;
  haveAccount: string;
  signInLink: string;
  signUpLink: string;
  forgotPw: string;
  pleaseWait: string;
  continueGuest: string;
  switchHint: string;
  verifyEmail: (email: string) => string;
};

const STRINGS: Record<Lang, SplashStrings> = {
  en: {
    flag: "🇺🇸",
    native: "English",
    name: "English",
    tagline: "Train hard. Train smart.",
    chooseLabel: "Choose your language",
    headlineLead: "Train in your",
    headlineAccent: "language",
    sub: "Pick a language, then sign in. Everything translates instantly.",
    welcome: "Welcome to Onyx",
    welcomeSub: "Sign in to sync your training, or continue as a guest.",
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    email: "you@email.com",
    password: "Password",
    yourName: "Your name",
    continueGoogle: "Continue with Google",
    continueApple: "Continue with Apple",
    or: "OR",
    newHere: "New to Onyx?",
    haveAccount: "Already have an account?",
    signInLink: "Sign in",
    signUpLink: "Create one",
    forgotPw: "Forgot password?",
    pleaseWait: "Please wait…",
    continueGuest: "Continue as guest",
    switchHint: "Change language anytime from your profile settings",
    verifyEmail: (email) =>
      `Check your email at ${email}. Open the verification link, then come back and sign in.`,
  },
  "pt-BR": {
    flag: "🇧🇷",
    native: "Português",
    name: "Portuguese (Brazil)",
    tagline: "Treine forte. Treine inteligente.",
    chooseLabel: "Escolha seu idioma",
    headlineLead: "Treine no seu",
    headlineAccent: "idioma",
    sub: "Escolha um idioma e faça login. Tudo é traduzido na hora.",
    welcome: "Bem-vindo à Onyx",
    welcomeSub: "Entre para sincronizar seu treino, ou continue como visitante.",
    signIn: "Entrar",
    signUp: "Cadastrar",
    createAccount: "Criar Conta",
    email: "voce@email.com",
    password: "Senha",
    yourName: "Seu nome",
    continueGoogle: "Continuar com Google",
    continueApple: "Continuar com Apple",
    or: "OU",
    newHere: "Novo na Onyx?",
    haveAccount: "Já tem uma conta?",
    signInLink: "Entrar",
    signUpLink: "Criar conta",
    forgotPw: "Esqueceu a senha?",
    pleaseWait: "Aguarde…",
    continueGuest: "Continuar como visitante",
    switchHint: "Altere o idioma a qualquer momento nas configurações do perfil",
    verifyEmail: (email) =>
      `Verifique seu email em ${email}. Abra o link de verificação, depois volte e entre.`,
  },
  es: {
    flag: "🇪🇸",
    native: "Español",
    name: "Spanish",
    tagline: "Entrena fuerte. Entrena inteligente.",
    chooseLabel: "Elige tu idioma",
    headlineLead: "Entrena en tu",
    headlineAccent: "idioma",
    sub: "Elige un idioma y accede. Todo se traduce al instante.",
    welcome: "Bienvenido a Onyx",
    welcomeSub: "Inicia sesión para sincronizar tu entrenamiento, o continúa como invitado.",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    createAccount: "Crear Cuenta",
    email: "tu@email.com",
    password: "Contraseña",
    yourName: "Tu nombre",
    continueGoogle: "Continuar con Google",
    continueApple: "Continuar con Apple",
    or: "O",
    newHere: "¿Nuevo en Onyx?",
    haveAccount: "¿Ya tienes una cuenta?",
    signInLink: "Iniciar sesión",
    signUpLink: "Crear una",
    forgotPw: "¿Olvidaste tu contraseña?",
    pleaseWait: "Por favor espera…",
    continueGuest: "Continuar como invitado",
    switchHint: "Cambia el idioma cuando quieras en la configuración del perfil",
    verifyEmail: (email) =>
      `Revisa tu correo en ${email}. Abre el enlace de verificación, luego vuelve e inicia sesión.`,
  },
  no: {
    flag: "🇳🇴",
    native: "Norsk",
    name: "Norwegian",
    tagline: "Tren hardt. Tren smart.",
    chooseLabel: "Velg språk",
    headlineLead: "Tren på ditt",
    headlineAccent: "språk",
    sub: "Velg et språk og logg inn. Alt oversettes umiddelbart.",
    welcome: "Velkommen til Onyx",
    welcomeSub: "Logg inn for å synkronisere treningen, eller fortsett som gjest.",
    signIn: "Logg Inn",
    signUp: "Registrer",
    createAccount: "Opprett Konto",
    email: "du@epost.no",
    password: "Passord",
    yourName: "Navnet ditt",
    continueGoogle: "Fortsett med Google",
    continueApple: "Fortsett med Apple",
    or: "ELLER",
    newHere: "Ny på Onyx?",
    haveAccount: "Har du allerede en konto?",
    signInLink: "Logg inn",
    signUpLink: "Opprett en",
    forgotPw: "Glemt passord?",
    pleaseWait: "Vennligst vent…",
    continueGuest: "Fortsett som gjest",
    switchHint: "Bytt språk når som helst i profilinnstillingene",
    verifyEmail: (email) =>
      `Sjekk e-posten din på ${email}. Åpne bekreftelseslenken, kom tilbake og logg inn.`,
  },
};

const ORDER: Lang[] = ["en", "pt-BR", "es", "no"];

const SPLASH_DONE_KEY = "onyx.languageSplash.done";
const LEGACY_SPLASH_DONE_KEY = "onyx.splash.dismissed";
const LANG_KEY = "onyx.lang";
const FORCED_LOGIN_SPLASH_KEY = "onyx.loginSplash.forceOpen";
const SAVED_EMAIL_KEY = "onyx.lastLoginEmail";

function authEmailRedirectTo() {
  const origin = window.location.origin;
  const publishedAuthUrl = "https://onyxperformance.app/auth";
  if (/lovableproject\.com|lovable\.app|lovable\.dev/.test(origin)) {
    return publishedAuthUrl;
  }
  return `${origin}/auth`;
}

function hasDismissedSplash() {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(SPLASH_DONE_KEY) === "1" ||
    window.localStorage.getItem(LEGACY_SPLASH_DONE_KEY) === "1"
  );
}

async function hasDismissedSplashNative(): Promise<boolean> {
  // On native iOS, localStorage is wiped on restart. Check native preferences.
  if (typeof window === "undefined") return false;
  if (hasDismissedSplash()) return true;
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key: SPLASH_DONE_KEY });
    if (value === "1") {
      // Restore to localStorage for future sync checks
      window.localStorage.setItem(SPLASH_DONE_KEY, "1");
      window.localStorage.setItem(LEGACY_SPLASH_DONE_KEY, "1");
      return true;
    }
  } catch {}
  return false;
}

async function getStoredLangNative(): Promise<string | null> {
  // Read lang from localStorage first, fall back to native preferences.
  const local = typeof window !== "undefined" ? window.localStorage.getItem(LANG_KEY) : null;
  if (local) return local;
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key: LANG_KEY });
    if (value) {
      // Restore to localStorage
      if (typeof window !== "undefined") window.localStorage.setItem(LANG_KEY, value);
      return value;
    }
  } catch {}
  return null;
}

function markSplashDismissed() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SPLASH_DONE_KEY, "1");
    window.localStorage.setItem(LEGACY_SPLASH_DONE_KEY, "1");
  } catch {}
  // Also persist to native preferences so it survives iOS localStorage wipes
  import("@capacitor/preferences")
    .then(({ Preferences }) => {
      void Preferences.set({ key: SPLASH_DONE_KEY, value: "1" });
    })
    .catch(() => {});
}

function clearForcedLoginSplash() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(FORCED_LOGIN_SPLASH_KEY);
  } catch {}
}

function isForcedLoginSplashOpen() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(FORCED_LOGIN_SPLASH_KEY) === "1";
  } catch {
    return false;
  }
}

export function LanguageSplash() {
  const router = useRouter();
  const { lang, setLang } = useLang();
  // Start hidden on both server and client to avoid hydration mismatch.
  // The effect below decides whether to show after mount.
  const [show, setShow] = useState<boolean>(false);
  const [fading, setFading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const forcedOpenRef = useRef(false);

  // auth form
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem(SAVED_EMAIL_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Debug log panel
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  function dbg(msg: string) {
    const ts = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev.slice(-20), `[${ts}] ${msg}`]);
  }

  useEffect(() => {
    let cancelled = false;

    // Listen for manual opens (e.g. Login tab in bottom bar)
    const onOpen = () => {
      forcedOpenRef.current = true;
      try {
        window.sessionStorage.setItem(FORCED_LOGIN_SPLASH_KEY, "1");
      } catch {}
      setFading(false);
      setMode("signin");
      setError(null);
      setInfo(null);
      setShow(true);
    };
    window.addEventListener("onyx:open-login-splash", onOpen);

    (async () => {
      await hasSavedSession().catch(() => false);
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      // Read dismissed + lang from native preferences (survives iOS localStorage wipes)
      const dismissed = await hasDismissedSplashNative();
      const forcedOpen = isForcedLoginSplashOpen();
      const localStored = (await getStoredLangNative()) as Lang | null;

      if (!data.session) {
        // Guest: a manual login open must stay open until the user explicitly
        // signs in/up or presses Continue as guest. Language clicks never close it.
        if (forcedOpen || forcedOpenRef.current || !dismissed) setShow(true);
        return;
      }
      setSignedIn(true);
      clearForcedLoginSplash();

      // User is signed in — always hide the splash regardless of dismissed flag.
      // On iOS, localStorage is wiped on restart so dismissed may be false even
      // for existing users. We never want to show the login screen to someone
      // who already has a valid session.
      if (localStored && STRINGS[localStored]) {
        if (localStored !== lang) setLang(localStored);
        await markSplashDismissed();
        setShow(false);
        return;
      }

      if (dismissed) {
        setShow(false);
        return;
      }

      try {
        const pending = window.localStorage.getItem("onyx.pending.lang") as Lang | null;
        let target: Lang | null = null;
        if (pending && STRINGS[pending]) {
          target = pending;
          await persistLanguage(pending).catch(() => false);
        } else if (localStored && STRINGS[localStored]) {
          target = localStored;
        }
        window.localStorage.removeItem("onyx.pending.lang");
        if (target) {
          try {
            window.localStorage.setItem(LANG_KEY, target);
          } catch {}
          // Also persist to native preferences
          import("@capacitor/preferences")
            .then(({ Preferences }) => {
              void Preferences.set({ key: LANG_KEY, value: target });
            })
            .catch(() => {});
          if (target !== lang) setLang(target);
          markSplashDismissed();
          setShow(false);
        } else {
          setShow(true);
        }
      } catch {
        setShow(true);
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("onyx:open-login-splash", onOpen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!show || typeof window === "undefined") return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const prevHtml = {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    };
    const prevBody = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      position: body.style.position,
      width: body.style.width,
      height: body.style.height,
      top: body.style.top,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.top = `-${scrollY}px`;

    const stopScroll = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("touchmove", stopScroll, { passive: false });
    window.addEventListener("wheel", stopScroll, { passive: false });

    return () => {
      window.removeEventListener("touchmove", stopScroll);
      window.removeEventListener("wheel", stopScroll);
      html.style.overflow = prevHtml.overflow;
      html.style.overscrollBehavior = prevHtml.overscrollBehavior;
      body.style.overflow = prevBody.overflow;
      body.style.overscrollBehavior = prevBody.overscrollBehavior;
      body.style.position = prevBody.position;
      body.style.width = prevBody.width;
      body.style.height = prevBody.height;
      body.style.top = prevBody.top;
      window.scrollTo(0, scrollY);
    };
  }, [show]);

  function dismiss(delay = 0) {
    window.setTimeout(() => {
      forcedOpenRef.current = false;
      clearForcedLoginSplash();
      markSplashDismissed();
      setFading(true);
      router.navigate({ to: "/" });
      window.setTimeout(() => setShow(false), 450);
    }, delay);
  }

  const handlePickLang = (code: Lang) => {
    try {
      window.localStorage.setItem(LANG_KEY, code);
    } catch {}
    // Also persist to native preferences so lang survives iOS restart
    import("@capacitor/preferences")
      .then(({ Preferences }) => {
        void Preferences.set({ key: LANG_KEY, value: code });
      })
      .catch(() => {});
    setLang(code);
    setFading(false);
    setShow(true);
    // Never auto-dismiss the splash on language pick. The user must
    // explicitly sign in, sign up, or press "Continue as guest".
    if (signedIn) {
      void persistLanguage(code);
    }
  };

  async function persistLanguage(code: Lang): Promise<boolean> {
    try {
      await updateMyProfile({ data: { preferred_language: code } });
      return true;
    } catch {}
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return false;
      const displayName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : (user.email?.split("@")[0] ?? null);
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, display_name: displayName, preferred_language: code },
          { onConflict: "id" },
        );
      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    dbg(`handleEmail mode=${mode} email=${email} password=${password} lang=${lang}`);
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        dbg("Signing up...");
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authEmailRedirectTo(),
            data: {
              full_name: name || email.split("@")[0],
              preferred_language: lang,
            },
          },
        });
        if (err) {
          dbg(`SignUp ERROR: ${err.message}`);
          throw err;
        }
        dbg(`SignUp OK session=${!!data.session} user=${data.user?.id}`);
        if (!data.session) {
          setInfo(s.verifyEmail(email));
          setMode("signin");
          setPassword("");
          dbg("No session — verification email sent");
          return;
        }
      } else {
        dbg("Signing in...");
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          dbg(`SignIn ERROR: ${err.message}`);
          throw err;
        }
        dbg("SignIn OK");
      }
      dbg("Persisting language...");
      try {
        localStorage.setItem(SAVED_EMAIL_KEY, email);
      } catch {}
      await persistLanguage(lang);
      setSignedIn(true);
      dbg("Done, dismissing...");
      dismiss(120);
    } catch (err) {
      dbg(`ERROR: ${(err as Error)?.message}`);
      setError((err as Error)?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setBusy(true);
    setError(null);
    try {
      try {
        window.localStorage.setItem("onyx.pending.lang", lang);
      } catch {}
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) {
        await persistLanguage(lang);
        setSignedIn(true);
        dismiss(120);
      }
    } catch (err) {
      setError((err as Error)?.message ?? `${provider} sign-in failed`);
    } finally {
      setBusy(false);
    }
  }

  if (!show) return null;

  const s = STRINGS[lang] ?? STRINGS.en;

  return (
    <div
      data-no-translate
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[200] flex h-dvh w-full touch-none items-center justify-center overflow-hidden overscroll-none bg-onyx-50 transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark overlay + brand tint */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 0%, rgba(0,168,255,0.22) 0%, rgba(0,168,255,0.06) 35%, transparent 70%), linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.72) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,168,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,255,.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] translate-x-1/3 translate-y-1/3 rounded-full bg-electric/10 blur-[100px]" />

      <div className="relative z-10 flex h-full max-h-dvh w-full max-w-md flex-col justify-center px-4 py-4 sm:px-8 sm:py-8">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 sm:gap-2.5">
            <img src={onyxLogo} alt="ONYX" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
            <div className="text-left">
              <div className="font-display text-lg font-bold tracking-tight leading-none sm:text-xl">
                ONYX
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-electric mt-0.5 sm:text-[10px]">
                Elevate
              </div>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-2.5 py-0.5 sm:mt-5 sm:px-3 sm:py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-electric sm:text-[10px]">
              {s.chooseLabel}
            </span>
          </div>
        </div>

        {/* Compact flag row */}
        <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4 sm:gap-2.5">
          {ORDER.map((code) => {
            const opt = STRINGS[code];
            const isActive = lang === code;
            return (
              <button
                key={code}
                onClick={() => handlePickLang(code)}
                aria-label={opt.name}
                className={`group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-onyx-100/60 text-2xl leading-none transition-colors duration-300 backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:text-[28px] ${
                  isActive
                    ? "border-electric shadow-[0_0_30px_-5px_rgba(0,168,255,0.55)]"
                    : "border-border hover:border-electric/60"
                }`}
              >
                <span aria-hidden>{opt.flag}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-1 text-center text-[9px] uppercase tracking-[0.25em] text-muted-foreground sm:mt-2 sm:text-[10px]">
          {s.native}
        </div>

        {/* Auth heading */}
        <div className="mt-4 text-center sm:mt-6">
          <h1 className="font-display text-xl font-bold leading-tight sm:text-2xl sm:leading-tight">
            {mode === "signin" ? s.signIn : s.createAccount}
            <span className="text-electric">.</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">{s.welcomeSub}</p>
        </div>

        {/* Auth */}
        <div className="mt-4 sm:mt-5">
          <div className="grid gap-2 sm:gap-2.5">
            <button
              onClick={() => handleOAuth("google")}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-border bg-onyx-100 px-4 py-2.5 text-sm font-semibold hover:border-electric/60 hover:bg-onyx-200 transition-all disabled:opacity-50 sm:py-3"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 43.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.7-3.3-11.3-7.9l-6.6 5.1C9.6 38.9 16.3 43.5 24 43.5z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5c-.5.4 7-5 7-15 0-1.2-.1-2.3-.2-3.5z"
                />
              </svg>
              {s.continueGoogle}
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-border bg-onyx-100 px-4 py-2.5 text-sm font-semibold hover:border-electric/60 hover:bg-onyx-200 transition-all disabled:opacity-50 sm:py-3"
            >
              <svg width="16" height="18" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM256.4 84.5c30.1-35.7 27.4-68.2 26.5-79.9-26.6 1.5-57.4 18.1-75 38.5-19.4 21.9-30.8 49-28.4 78.7 28.8 2.2 55.1-12.6 76.9-37.3z" />
              </svg>
              {s.continueApple}
            </button>
          </div>

          <div className="my-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:my-4">
            <div className="h-px flex-1 bg-border" />
            {s.or}
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-2 sm:space-y-2.5">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={s.yourName}
                className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-base focus:outline-none focus:border-electric/60 sm:py-2.5 sm:text-sm"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.email}
              className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-base focus:outline-none focus:border-electric/60 sm:py-2.5 sm:text-sm"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={mode === "signup" ? 8 : 6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={s.password}
                className="w-full rounded-md border border-border bg-onyx-100 px-3 py-2 pr-10 text-base focus:outline-none focus:border-electric/60 sm:py-2.5 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-electric transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {info && (
              <div className="rounded-md border border-electric/30 bg-electric/10 p-3 text-xs leading-relaxed text-electric">
                {info}
              </div>
            )}
            {error && <div className="text-xs text-red-400">{error}</div>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-onyx-50 hover:bg-electric-glow transition-all disabled:opacity-50 sm:py-3"
            >
              {busy ? s.pleaseWait : mode === "signin" ? s.signIn : s.createAccount}
            </button>
          </form>

          <div className="mt-2 text-center text-xs text-muted-foreground sm:mt-3">
            {mode === "signin" ? s.newHere : s.haveAccount}{" "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
              className="text-electric font-semibold hover:underline"
            >
              {mode === "signin" ? s.signUpLink : s.signInLink}
            </button>
          </div>

          <div className="mt-3 flex justify-center border-t border-border/60 pt-2 sm:mt-4 sm:pt-3">
            <button
              onClick={async () => {
                try {
                  const { data } = await supabase.auth.getSession();
                  if (data.session) void persistLanguage(lang);
                } catch {}
                dismiss(0);
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-electric transition-colors"
            >
              {s.continueGuest} →
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 sm:mt-5 sm:text-[10px]">
          "{s.tagline}"
        </p>

        {/* Debug log panel — remove when done testing */}
        {debugLogs.length > 0 && (
          <div className="mt-3 max-h-40 overflow-y-auto rounded-md bg-black/80 p-2 text-left font-mono text-[10px] text-green-400">
            {debugLogs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
