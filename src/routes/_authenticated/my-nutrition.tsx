import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2, Plus, X, Search, Target, Lock, Check, Flame, Apple, BarChart3, Utensils, CalendarCheck, Sparkles, Loader2, Camera, Droplet, Wheat, Beef, Nut, Pencil, RotateCcw, ChevronDown, CheckCircle2, Save, Barcode, Footprints } from "lucide-react";
import { scanFoodPhoto, getScanQuota, type ScannedItem } from "@/lib/food-scan.functions";
import { BarcodeScanDialog } from "@/components/BarcodeScanDialog";
import { useAccess } from "@/hooks/useAccess";
import { useCheckout } from "@/hooks/useCheckout";
import { useStripePriceId, usePrices, usePrice } from "@/lib/pricing";
import { isIOSNative } from "@/lib/revenuecat";
import {
  searchFoods,
  listDayLog,
  listWeekLog,
  logFood,
  deleteLogEntry,
  createCustomFood,
  getTargets,
  upsertTargets,
  getDayTargets,
  upsertDayTargets,
  deleteDayTargets,
  listDayDrafts,
  commitDraft,
  commitDayDrafts,

  deleteDraft,
  type FoodRow,
  type FoodLogEntry,
  type FoodDraft,
} from "@/lib/nutrition.functions";
import { useLang } from "@/i18n/LanguageProvider";
import { FastingCard, WeightCard, NotesCard } from "@/components/NutritionExtras";
import nutritionBg from "@/assets/nutrition-bg.jpg";

export const Route = createFileRoute("/_authenticated/my-nutrition")({
  head: () => ({
    meta: [
      { title: "My Nutrition · Onyx Elevate" },
      { name: "description", content: "Log every meal, track calories, macros and weight, and see your full progress over time." },
    ],
  }),
  errorComponent: ({ error, reset }) => (
    <div className="container-onyx py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load nutrition.</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-md bg-electric px-4 py-2 text-sm font-semibold text-onyx-50">Try again</button>
    </div>
  ),
  notFoundComponent: () => <div className="container-onyx py-24">Not found.</div>,
  component: NutritionPage,
});

const MEAL_SLOTS = [
  { key: "breakfast" },
  { key: "lunch" },
  { key: "dinner" },
  { key: "snack" },
] as const;

const NUTRITION_COPY = {
  en: {
    title: "My Nutrition",
    subtitle: "Your food diary & progress",
    description: "Log every meal, track your weight, and see the full picture, calories, macros and body progress in one place.",
    tabs: { today: "Today", week: "This week", progress: "Progress" },
    today: "Today",
    calories: "Calories",
    goal: "Goal",
    eaten: "Eaten",
    left: "Left",
    burned: "Burned",
    kcalLeft: "kcal left",
    of: "of",
    carbs: "Carbs",
    protein: "Protein",
    fat: "Fat",
    water: "Water",
    glass: "glass",
    resetWater: "Reset water",
    emptyGlass: "Empty glass",
    fillGlass: "Fill glass",
    hydrationDone: "Daily hydration logged",
    logThisDay: "Log this day",
    tapComplete: "Tap to mark today complete once you're done eating & drinking.",
    undo: "Undo",
    logDay: "Log day",
    confirmTitle: "Log this day?",
    confirmBody: "Have you added everything you ate today so the macros are correct? Once logged, this day is marked complete in This week and Progress.",
    confirmYes: "Yes, log day",
    confirmNo: "Not yet",
    close: "Close",
    reset: "Reset",
    cancel: "Cancel",
    save: "Save",
    addLabel: "Add",
    manualLog: "Manual log",
    eatenManual: "Eaten, manual",
    kcalEaten: "kcal eaten",
    eatenHint: "Add calories you ate without logging the food. Saved on this device for this day.",
    burnedTitle: "Burned calories",
    kcalBurned: "kcal burned",
    burnedHint: "From training, steps or other activity. Saved on this device for this day.",
    steps: "Steps",
    stepsTitle: "Steps today",
    stepsUnit: "steps",
    stepsHint: "Log your steps manually from your phone or watch. Saved on this device for this day.",
    meals: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snacks" },
    dateLocale: "en-US",
    week: {
      previous: "Previous week",
      next: "Next week",
      today: "Today",
      loading: "Loading…",
      daysLogged: "Days logged",
      avgCalories: "Avg calories",
      avgProtein: "Avg protein",
      avgCarbsFat: "Avg carbs / fat",
      caloriesTitle: "calories",
      dashedGoal: (kcal: number) => `Dashed line = your ${kcal} kcal goal.`,
      dailyDetails: "Daily details",
      tapForBreakdown: "Tap a day for full breakdown",
      nothingLogged: "Nothing logged",
      nothingLoggedShort: "Nothing logged.",
      nothingLoggedYet: "Nothing logged yet.",
      sideBySide: "Want to see your training and nutrition side by side?",
      openLibrary: "Open My Library",
    },
    progress: {
      logWeight: "Log your weight",
      weightKg: "Weight (kg)",
      weightPlaceholder: "e.g. 82.5",
      date: "Date",
      note: "Note (optional)",
      notePlaceholder: "How you're feeling…",
      saving: "Saving…",
      logWeightBtn: "Log weight",
      range: "Range:",
      days30: "30 days",
      months3: "3 months",
      year1: "1 year",
      currentWeight: "Current weight",
      startOfRange: "Start of range",
      change: "Change",
      avgDailyCalories: "Avg daily calories",
      weightTrend: "Weight trend",
      loading: "Loading…",
      noWeightYet: "No weight logged in this range yet. Log your first entry above and watch the graph fill in.",
      caloriesOverTime: "Calories over time",
      noCaloriesYet: "Log meals in Today to see your calorie history here.",
      weightHistory: "Weight history",
      deleteEntry: "Delete entry",
      weightLogged: "Weight logged",
      invalidWeight: "Enter a valid weight in kg",
      failed: "Failed",
    },
  },
  "pt-BR": {
    title: "Minha Nutrição",
    subtitle: "Seu diário alimentar e progresso",
    description: "Registre cada refeição, acompanhe seu peso e veja tudo, calorias, macros e progresso corporal em um só lugar.",
    tabs: { today: "Hoje", week: "Esta semana", progress: "Progresso" },
    today: "Hoje",
    calories: "Calorias",
    goal: "Meta",
    eaten: "Consumido",
    left: "Restante",
    burned: "Queimado",
    kcalLeft: "kcal restantes",
    of: "de",
    carbs: "Carboidratos",
    protein: "Proteína",
    fat: "Gordura",
    water: "Água",
    glass: "copo",
    resetWater: "Zerar água",
    emptyGlass: "Esvaziar copo",
    fillGlass: "Encher copo",
    hydrationDone: "Hidratação diária registrada",
    logThisDay: "Registrar este dia",
    tapComplete: "Toque para marcar hoje como concluído quando terminar de comer e beber.",
    undo: "Desfazer",
    logDay: "Registrar dia",
    confirmTitle: "Registrar este dia?",
    confirmBody: "Você adicionou tudo o que comeu hoje para que os macros estejam corretos? Depois de registrar, o dia é marcado como concluído em Esta semana e Progresso.",
    confirmYes: "Sim, registrar dia",
    confirmNo: "Ainda não",
    close: "Fechar",
    reset: "Zerar",
    cancel: "Cancelar",
    save: "Salvar",
    addLabel: "Adicionar",
    manualLog: "Registro manual",
    eatenManual: "Consumido, manual",
    kcalEaten: "kcal consumidas",
    eatenHint: "Adicione calorias que você consumiu sem registrar o alimento. Salvo neste dispositivo para este dia.",
    burnedTitle: "Calorias queimadas",
    kcalBurned: "kcal queimadas",
    burnedHint: "De treino, passos ou outra atividade. Salvo neste dispositivo para este dia.",
    steps: "Passos",
    stepsTitle: "Passos de hoje",
    stepsUnit: "passos",
    stepsHint: "Registre seus passos manualmente pelo celular ou relógio. Salvo neste dispositivo para este dia.",
    meals: { breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar", snack: "Lanches" },
    dateLocale: "pt-BR",
    week: {
      previous: "Semana anterior",
      next: "Próxima semana",
      today: "Hoje",
      loading: "Carregando…",
      daysLogged: "Dias registrados",
      avgCalories: "Média de calorias",
      avgProtein: "Média de proteína",
      avgCarbsFat: "Média de carbs / gordura",
      caloriesTitle: "calorias",
      dashedGoal: (kcal: number) => `Linha tracejada = sua meta de ${kcal} kcal.`,
      dailyDetails: "Detalhes diários",
      tapForBreakdown: "Toque em um dia para ver os detalhes",
      nothingLogged: "Nada registrado",
      nothingLoggedShort: "Nada registrado.",
      nothingLoggedYet: "Nada registrado ainda.",
      sideBySide: "Quer ver seu treino e nutrição lado a lado?",
      openLibrary: "Abrir Minha Biblioteca",
    },
    progress: {
      logWeight: "Registre seu peso",
      weightKg: "Peso (kg)",
      weightPlaceholder: "ex: 82,5",
      date: "Data",
      note: "Observação (opcional)",
      notePlaceholder: "Como você está se sentindo…",
      saving: "Salvando…",
      logWeightBtn: "Registrar peso",
      range: "Período:",
      days30: "30 dias",
      months3: "3 meses",
      year1: "1 ano",
      currentWeight: "Peso atual",
      startOfRange: "Início do período",
      change: "Variação",
      avgDailyCalories: "Média diária de calorias",
      weightTrend: "Tendência de peso",
      loading: "Carregando…",
      noWeightYet: "Nenhum peso registrado neste período ainda. Registre sua primeira entrada acima e veja o gráfico se preencher.",
      caloriesOverTime: "Calorias ao longo do tempo",
      noCaloriesYet: "Registre refeições em Hoje para ver seu histórico de calorias aqui.",
      weightHistory: "Histórico de peso",
      deleteEntry: "Excluir entrada",
      weightLogged: "Peso registrado",
      invalidWeight: "Digite um peso válido em kg",
      failed: "Falhou",
    },
  },
  es: {
    title: "Mi Nutrición",
    subtitle: "Tu diario de comida y progreso",
    description: "Registra cada comida, controla tu peso y ve el panorama completo: calorías, macros y progreso corporal en un solo lugar.",
    tabs: { today: "Hoy", week: "Esta semana", progress: "Progreso" },
    today: "Hoy",
    calories: "Calorías",
    goal: "Objetivo",
    eaten: "Consumido",
    left: "Restante",
    burned: "Quemado",
    kcalLeft: "kcal restantes",
    of: "de",
    carbs: "Carbohidratos",
    protein: "Proteína",
    fat: "Grasa",
    water: "Agua",
    glass: "vaso",
    resetWater: "Reiniciar agua",
    emptyGlass: "Vaciar vaso",
    fillGlass: "Llenar vaso",
    hydrationDone: "Hidratación diaria registrada",
    logThisDay: "Registrar este día",
    tapComplete: "Toca para marcar hoy como completado cuando termines de comer y beber.",
    undo: "Deshacer",
    logDay: "Registrar día",
    confirmTitle: "¿Registrar este día?",
    confirmBody: "¿Añadiste todo lo que comiste hoy para que los macros sean correctos? Una vez registrado, este día se marca como completado en Esta semana y Progreso.",
    confirmYes: "Sí, registrar día",
    confirmNo: "Aún no",
    close: "Cerrar",
    reset: "Reiniciar",
    cancel: "Cancelar",
    save: "Guardar",
    addLabel: "Añadir",
    manualLog: "Registro manual",
    eatenManual: "Consumido, manual",
    kcalEaten: "kcal consumidas",
    eatenHint: "Añade calorías que consumiste sin registrar la comida. Se guarda en este dispositivo para este día.",
    burnedTitle: "Calorías quemadas",
    kcalBurned: "kcal quemadas",
    burnedHint: "De entrenamiento, pasos u otra actividad. Se guarda en este dispositivo para este día.",
    steps: "Pasos",
    stepsTitle: "Pasos de hoy",
    stepsUnit: "pasos",
    stepsHint: "Registra tus pasos manualmente desde tu móvil o reloj. Se guarda en este dispositivo para este día.",
    meals: { breakfast: "Desayuno", lunch: "Almuerzo", dinner: "Cena", snack: "Snacks" },
    dateLocale: "es-ES",
    week: {
      previous: "Semana anterior",
      next: "Semana siguiente",
      today: "Hoy",
      loading: "Cargando…",
      daysLogged: "Días registrados",
      avgCalories: "Promedio de calorías",
      avgProtein: "Promedio de proteína",
      avgCarbsFat: "Promedio de carbos / grasa",
      caloriesTitle: "calorías",
      dashedGoal: (kcal: number) => `Línea discontinua = tu objetivo de ${kcal} kcal.`,
      dailyDetails: "Detalles diarios",
      tapForBreakdown: "Toca un día para ver el detalle",
      nothingLogged: "Nada registrado",
      nothingLoggedShort: "Nada registrado.",
      nothingLoggedYet: "Nada registrado aún.",
      sideBySide: "¿Quieres ver tu entrenamiento y nutrición lado a lado?",
      openLibrary: "Abrir Mi Biblioteca",
    },
    progress: {
      logWeight: "Registra tu peso",
      weightKg: "Peso (kg)",
      weightPlaceholder: "p. ej. 82,5",
      date: "Fecha",
      note: "Nota (opcional)",
      notePlaceholder: "Cómo te sientes…",
      saving: "Guardando…",
      logWeightBtn: "Registrar peso",
      range: "Rango:",
      days30: "30 días",
      months3: "3 meses",
      year1: "1 año",
      currentWeight: "Peso actual",
      startOfRange: "Inicio del rango",
      change: "Cambio",
      avgDailyCalories: "Calorías diarias promedio",
      weightTrend: "Tendencia de peso",
      loading: "Cargando…",
      noWeightYet: "Aún no hay peso registrado en este rango. Registra tu primera entrada arriba y observa cómo se llena el gráfico.",
      caloriesOverTime: "Calorías a lo largo del tiempo",
      noCaloriesYet: "Registra comidas en Hoy para ver tu historial de calorías aquí.",
      weightHistory: "Historial de peso",
      deleteEntry: "Eliminar entrada",
      weightLogged: "Peso registrado",
      invalidWeight: "Introduce un peso válido en kg",
      failed: "Falló",
    },
  },
  no: {
    title: "Min ernæring",
    subtitle: "Matdagboken og fremgangen din",
    description: "Logg hvert måltid, følg vekten din og se helheten, kalorier, makroer og kroppsfremgang på ett sted.",
    tabs: { today: "I dag", week: "Denne uken", progress: "Fremgang" },
    today: "I dag",
    calories: "Kalorier",
    goal: "Mål",
    eaten: "Spist",
    left: "Igjen",
    burned: "Forbrent",
    kcalLeft: "kcal igjen",
    of: "av",
    carbs: "Karbohydrater",
    protein: "Protein",
    fat: "Fett",
    water: "Vann",
    glass: "glass",
    resetWater: "Nullstill vann",
    emptyGlass: "Tøm glass",
    fillGlass: "Fyll glass",
    hydrationDone: "Daglig hydrering loggført",
    logThisDay: "Logg denne dagen",
    tapComplete: "Trykk for å markere dagen fullført når du er ferdig med å spise og drikke.",
    undo: "Angre",
    logDay: "Logg dag",
    confirmTitle: "Logg denne dagen?",
    confirmBody: "Har du lagt til alt du har spist i dag slik at makroene stemmer? Når den er logget, blir dagen markert som fullført i Denne uken og Fremgang.",
    confirmYes: "Ja, logg dag",
    confirmNo: "Ikke ennå",
    close: "Lukk",
    reset: "Nullstill",
    cancel: "Avbryt",
    save: "Lagre",
    addLabel: "Legg til",
    manualLog: "Manuell logg",
    eatenManual: "Spist - manuelt",
    kcalEaten: "kcal spist",
    eatenHint: "Legg til kalorier du har spist uten å logge maten. Lagres på denne enheten for denne dagen.",
    burnedTitle: "Forbrente kalorier",
    kcalBurned: "kcal forbrent",
    burnedHint: "Fra trening, skritt eller annen aktivitet. Lagres på denne enheten for denne dagen.",
    steps: "Skritt",
    stepsTitle: "Skritt i dag",
    stepsUnit: "skritt",
    stepsHint: "Logg skrittene dine manuelt fra telefonen eller klokka. Lagres på denne enheten for denne dagen.",
    meals: { breakfast: "Frokost", lunch: "Lunsj", dinner: "Middag", snack: "Snacks" },
    dateLocale: "nb-NO",
    week: {
      previous: "Forrige uke",
      next: "Neste uke",
      today: "I dag",
      loading: "Laster…",
      daysLogged: "Dager loggført",
      avgCalories: "Snitt kalorier",
      avgProtein: "Snitt protein",
      avgCarbsFat: "Snitt karb / fett",
      caloriesTitle: "kalorier",
      dashedGoal: (kcal: number) => `Stiplet linje = ditt mål på ${kcal} kcal.`,
      dailyDetails: "Daglige detaljer",
      tapForBreakdown: "Trykk på en dag for full oversikt",
      nothingLogged: "Ingenting loggført",
      nothingLoggedShort: "Ingenting loggført.",
      nothingLoggedYet: "Ingenting loggført ennå.",
      sideBySide: "Vil du se trening og kosthold side om side?",
      openLibrary: "Åpne Mitt bibliotek",
    },
    progress: {
      logWeight: "Logg vekten din",
      weightKg: "Vekt (kg)",
      weightPlaceholder: "f.eks. 82,5",
      date: "Dato",
      note: "Notat (valgfritt)",
      notePlaceholder: "Hvordan du føler deg…",
      saving: "Lagrer…",
      logWeightBtn: "Logg vekt",
      range: "Periode:",
      days30: "30 dager",
      months3: "3 måneder",
      year1: "1 år",
      currentWeight: "Nåværende vekt",
      startOfRange: "Start av perioden",
      change: "Endring",
      avgDailyCalories: "Snitt daglige kalorier",
      weightTrend: "Vekttrend",
      loading: "Laster…",
      noWeightYet: "Ingen vekt loggført i denne perioden ennå. Logg din første oppføring over og se grafen fylles ut.",
      caloriesOverTime: "Kalorier over tid",
      noCaloriesYet: "Logg måltider i I dag for å se kalorihistorikken din her.",
      weightHistory: "Vekthistorikk",
      deleteEntry: "Slett oppføring",
      weightLogged: "Vekt loggført",
      invalidWeight: "Skriv inn en gyldig vekt i kg",
      failed: "Feilet",
    },
  },
} as const;

function useNutritionCopy() {
  const { lang } = useLang();
  return NUTRITION_COPY[lang] ?? NUTRITION_COPY.en;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function NutritionPage() {
  const access = useAccess();
  const copy = useNutritionCopy();
  const [tab, setTab] = useState<"today" | "week" | "progress">("today");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [date, setDate] = useState(() => search.date ?? todayISO());
  // Re-sync to actual local "today" whenever the tab regains focus / a new day rolls over
  useEffect(() => {
    const sync = () => {
      if (!search.date) setDate(todayISO());
    };
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [search.date]);
  useEffect(() => {
    if (search.date && search.date !== date) setDate(search.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.date]);
  useEffect(() => {
    if (search.date && search.date !== date) {
      navigate({ search: { date }, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Only show the paywall once access has resolved AND the user lacks access.
  // While loading we render the normal shell so the page swap from other tabs
  // (Exercises → Nutrition) is instant and doesn't flash a spinner screen.
  const hasAccess = access.loading || access.hasSubscription || access.hasBundle;
  if (!access.loading && !hasAccess) return <NutritionPaywall />;

  const tabs: { key: "today" | "week" | "progress"; label: string }[] = [
    { key: "today", label: copy.tabs.today },
    { key: "week", label: copy.tabs.week },
    { key: "progress", label: copy.tabs.progress },
  ];

  return (
    <div className="min-h-0 overflow-x-hidden bg-onyx-50 pb-6 md:min-h-screen md:pb-24">
      <header className="border-b border-border/60 bg-gradient-to-b from-electric/10 to-transparent">
        <div className="mx-auto w-full max-w-7xl px-3 py-2.5 sm:px-5 sm:py-3 md:px-8 md:py-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-electric font-semibold">{copy.title}</p>
          <h1 className="mt-1 font-display text-lg md:text-4xl font-bold leading-tight">{copy.subtitle}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl hidden sm:block">
            {copy.description}
          </p>
          {/* Global date picker, kept above the tabs so users always see and can shift the active day */}
          <div className="mt-2.5 md:mt-4 flex max-w-full items-center overflow-hidden rounded-lg border border-border bg-onyx-100">
            <button
              onClick={() => setDate(addDays(date, -1))}
              aria-label="Previous day"
              className="shrink-0 px-3 py-2.5 text-sm hover:bg-electric/10 hover:text-electric transition-colors"
            >
              ←
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value || todayISO())}
              className="flex-1 min-w-0 bg-transparent px-2 py-2.5 text-sm text-center border-x border-border"
            />
            <button
              onClick={() => setDate(addDays(date, 1))}
              aria-label="Next day"
              className="shrink-0 px-3 py-2.5 text-sm hover:bg-electric/10 hover:text-electric transition-colors"
            >
              →
            </button>
          </div>
          <div className="mt-2.5 md:mt-4">
            <div className="grid w-full grid-cols-3 rounded-full border border-border bg-onyx-100 p-1 sm:inline-flex sm:w-auto">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`min-w-0 rounded-full px-1.5 py-1.5 text-[11px] font-semibold transition-colors sm:px-4 sm:text-sm ${
                    tab === t.key ? "bg-electric text-onyx-50" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${nutritionBg})` }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl px-3 pt-3 sm:px-5 sm:pt-5 md:px-8 md:pt-6">
          {tab === "today" && <TodayView date={date} setDate={setDate} />}
          {tab === "week" && <WeekView anchorDate={date} />}
          {tab === "progress" && <ProgressView />}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// Today view
// ============================================================
function TodayView({ date, setDate }: { date: string; setDate: (d: string) => void }) {
  const copy = useNutritionCopy();
  const qc = useQueryClient();
  const [addingSlot, setAddingSlot] = useState<string | null>(null);
  const [scanningSlot, setScanningSlot] = useState<string | null>(null);
  const [barcodeSlot, setBarcodeSlot] = useState<string | null>(null);
  const [scanMenuSlot, setScanMenuSlot] = useState<string | null>(null);
  const [showTargets, setShowTargets] = useState(false);
  const [showBurned, setShowBurned] = useState(false);
  const [showEatenExtra, setShowEatenExtra] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [burned, setBurned] = useState<number>(0);
  const [eatenExtra, setEatenExtra] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const b = window.localStorage.getItem(`onyx-burned-${date}`);
    setBurned(b ? Number(b) || 0 : 0);
    const e = window.localStorage.getItem(`onyx-eaten-extra-${date}`);
    setEatenExtra(e ? Number(e) || 0 : 0);
    const s = window.localStorage.getItem(`onyx-steps-${date}`);
    setSteps(s ? Number(s) || 0 : 0);
  }, [date]);

  const listDay = useServerFn(listDayLog);
  const getTargetsFn = useServerFn(getTargets);
  const getDayTargetsFn = useServerFn(getDayTargets);
  const delFn = useServerFn(deleteLogEntry);
  const listDraftsFn = useServerFn(listDayDrafts);
  const commitDraftFn = useServerFn(commitDraft);
  const delDraftFn = useServerFn(deleteDraft);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["nutrition-day", date],
    queryFn: () => listDay({ data: { date } }),
  });
  const { data: drafts = [] } = useQuery({
    queryKey: ["nutrition-drafts", date],
    queryFn: () => listDraftsFn({ data: { date } }),
  });
  const { data: targets } = useQuery({
    queryKey: ["nutrition-targets"],
    queryFn: () => getTargetsFn(),
  });
  const { data: dayTargets } = useQuery({
    queryKey: ["nutrition-day-targets", date],
    queryFn: () => getDayTargetsFn({ data: { date } }),
  });

  const totals = useMemo(() => {
    // Include pending drafts so the daily ring and macro bars reflect the
    // full "planned" day the user added from a meal plan. Committing the
    // day later just moves drafts into food_log_entries, the numbers stay.
    const combined = [...entries, ...drafts];
    return combined.reduce(
      (acc, e) => ({
        kcal: acc.kcal + e.kcal,
        protein_g: acc.protein_g + e.protein_g,
        carbs_g: acc.carbs_g + e.carbs_g,
        fat_g: acc.fat_g + e.fat_g,
      }),
      { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
    );
  }, [entries, drafts]);

  // Per-day effective target: if this day was populated from a meal plan
  // ("Add day"), the plan's totals ARE the goal for that specific date, so
  // the ring shows 100% and macro bars show fully filled. Other days keep
  // using the global goal from nutrition_targets.
  const mealPlanTotals = useMemo(() => {
    const combined = [...entries, ...drafts].filter((e) => e.source === "meal-plan");
    if (combined.length === 0) return null;
    return combined.reduce(
      (acc, e) => ({
        kcal: acc.kcal + e.kcal,
        protein_g: acc.protein_g + e.protein_g,
        carbs_g: acc.carbs_g + e.carbs_g,
        fat_g: acc.fat_g + e.fat_g,
      }),
      { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
    );
  }, [entries, drafts]);

  const effectiveTargets = useMemo(() => {
    // Priority: per-day override > meal-plan totals > global goal
    if (dayTargets && (dayTargets.kcal || dayTargets.protein_g || dayTargets.carbs_g || dayTargets.fat_g)) {
      return dayTargets;
    }
    if (mealPlanTotals) {
      return {
        kcal: Math.round(mealPlanTotals.kcal),
        protein_g: Math.round(mealPlanTotals.protein_g),
        carbs_g: Math.round(mealPlanTotals.carbs_g),
        fat_g: Math.round(mealPlanTotals.fat_g),
      };
    }
    return targets ?? null;
  }, [dayTargets, mealPlanTotals, targets]);


  const deleteMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nutrition-day", date] }),
  });

  const commitDraftMut = useMutation({
    mutationFn: (id: string) => commitDraftFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Logged");
      qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
      qc.invalidateQueries({ queryKey: ["nutrition-drafts", date] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to log"),
  });
  const deleteDraftMut = useMutation({
    mutationFn: (id: string) => delDraftFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nutrition-drafts", date] }),
  });

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
      {/* Totals, first on mobile, sidebar on desktop */}
      <aside className="min-w-0 space-y-3 sm:space-y-4 lg:order-2">
        <div className="surface-card max-w-full rounded-xl p-2.5 sm:rounded-2xl sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{copy.today}</p>
              <h3 className="mt-0.5 font-display font-bold text-base sm:text-lg">{copy.calories}</h3>
            </div>
            <button
              onClick={() => setShowTargets(true)}
              className="shrink-0 inline-flex items-center gap-1 rounded-full border border-electric/40 bg-electric/10 px-2.5 py-1 text-[11px] font-bold text-electric hover:bg-electric/20"
            >
              <Pencil className="h-3 w-3" /> {copy.goal}
            </button>
          </div>

          <CalorieRing consumed={totals.kcal + eatenExtra} target={effectiveTargets?.kcal ?? null} />

          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
            <StatColumn icon={<Utensils className="h-4 w-4" />} label={copy.eaten} value={totals.kcal + eatenExtra} unit="kcal" tone="foreground" />
            <StatColumn icon={<Target className="h-4 w-4" />} label={copy.left} value={Math.max(0, (effectiveTargets?.kcal ?? 0) - (totals.kcal + eatenExtra) + burned)} unit="kcal" tone="electric" />
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBurned(true)}
                className="w-full rounded-lg text-left hover:bg-onyx-100 transition-colors focus:outline-none focus:ring-2 focus:ring-electric/40"
                title={copy.burnedTitle}
              >
                <StatColumn icon={<Flame className="h-4 w-4" />} label={copy.burned} value={burned} unit="kcal" tone={burned > 0 ? "electric" : "muted"} />
              </button>
              <button
                type="button"
                onClick={() => setShowBurned(true)}
                title={copy.burnedTitle}
                aria-label={copy.burnedTitle}
                className="absolute top-1 right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-electric text-onyx-50 shadow hover:bg-electric/90 focus:outline-none focus:ring-2 focus:ring-electric/50"
              >
                <Plus className="h-3 w-3" strokeWidth={3} />
              </button>
            </div>
          </div>


          <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
            <MacroBar icon={<Wheat className="h-3.5 w-3.5" />} label={copy.carbs} value={totals.carbs_g} target={effectiveTargets?.carbs_g ?? null} color="bg-amber-400" trackColor="bg-amber-400/20" />
            <MacroBar icon={<Beef className="h-3.5 w-3.5" />} label={copy.protein} value={totals.protein_g} target={effectiveTargets?.protein_g ?? null} color="bg-rose-400" trackColor="bg-rose-400/20" />
            <MacroBar icon={<Nut className="h-3.5 w-3.5" />} label={copy.fat} value={totals.fat_g} target={effectiveTargets?.fat_g ?? null} color="bg-sky-400" trackColor="bg-sky-400/20" />

          </div>

          <button
            type="button"
            onClick={() => setShowSteps(true)}
            className="mt-4 flex w-full items-center gap-3 rounded-lg border border-border bg-onyx-100/60 px-3 py-2.5 text-left hover:border-electric/60 hover:bg-electric/5 focus:outline-none focus:ring-2 focus:ring-electric/40"
            title={copy.stepsTitle}
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric/15 text-electric">
              <Footprints className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{copy.steps}</span>
              <span className="block text-sm font-bold">
                {steps.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">{copy.stepsUnit}</span>
              </span>
            </span>
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric text-onyx-50">
              <Plus className="h-3 w-3" strokeWidth={3} />
            </span>
          </button>
        </div>


        <div className="hidden lg:block"><WaterTracker date={date} /></div>

        <div className="surface-card rounded-xl p-4 sm:p-5 text-sm hidden sm:block">
          <p className="font-semibold mb-2">Tip</p>
          <p className="text-muted-foreground leading-relaxed">
            You can also log a recipe directly, open any recipe and tap <span className="text-electric font-semibold">Log this meal</span>.
          </p>
        </div>
      </aside>


      <div className="min-w-0 space-y-3 sm:space-y-4 lg:order-1">
        {/* Save this day CTA, prominent so people understand progress is stored */}
        <SaveDayButton date={date} totals={totals} entriesCount={entries.length} draftsCount={drafts.length} />

        {/* Date nav lives above the tabs at the page header */}

        {isLoading ? (
          <div className="surface-card rounded-xl p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : (
          MEAL_SLOTS.map((slot) => {
            const slotEntries = entries.filter((e) => e.meal_slot === slot.key);
            const slotDrafts = drafts.filter((d) => d.meal_slot === slot.key);
            return (
              <div key={slot.key} className="surface-card max-w-full rounded-xl">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/50 p-2.5 sm:gap-3 sm:p-4">
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-sm sm:text-base truncate">{copy.meals[slot.key]}</h2>
                    <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                      {slotEntries.reduce((s, e) => s + e.kcal, 0).toFixed(0)} kcal · {slotEntries.length} item{slotEntries.length === 1 ? "" : "s"}
                      {slotDrafts.length > 0 && (
                        <span className="ml-1 text-electric">· {slotDrafts.length} pending</span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    <div className="relative">
                      <button
                        onClick={() => setScanMenuSlot(scanMenuSlot === slot.key ? null : slot.key)}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-electric/50 bg-electric/10 px-2 py-2 text-xs font-bold text-electric hover:bg-electric/20 sm:px-2.5"
                        title="Scan food"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        <span className="hidden min-[360px]:inline">Scan</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {scanMenuSlot === slot.key && (
                        <div className="absolute right-0 bottom-full mb-1 z-20 w-44 rounded-md border border-border bg-onyx-100 shadow-lg overflow-hidden">
                          <button
                            onClick={() => { setBarcodeSlot(slot.key); setScanMenuSlot(null); }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-electric hover:bg-electric/10"
                          >
                            <Barcode className="h-3.5 w-3.5" /> Barcode
                          </button>
                          <button
                            onClick={() => { setScanningSlot(slot.key); setScanMenuSlot(null); }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-electric hover:bg-electric/10"
                          >
                            <Camera className="h-3.5 w-3.5" /> Food plate
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setAddingSlot(slot.key)}
                      className="inline-flex items-center justify-center gap-1 rounded-md bg-electric px-2 py-2 text-xs font-bold text-onyx-50 hover:bg-electric-glow sm:px-2.5"
                    >
                      <Plus className="h-3.5 w-3.5" /> <span className="hidden min-[360px]:inline">Add</span>
                    </button>
                  </div>
                </div>
                {slotDrafts.length > 0 && (
                  <div className="border-b border-electric/20 bg-electric/5 px-2.5 py-2 sm:px-4">
                    <ul className="space-y-1.5">
                      {slotDrafts.map((d) => (
                        <DraftRow
                          key={d.id}
                          draft={d}
                          onLog={() => commitDraftMut.mutate(d.id)}
                          onDelete={() => deleteDraftMut.mutate(d.id)}
                          busy={commitDraftMut.isPending || deleteDraftMut.isPending}
                        />
                      ))}
                    </ul>
                  </div>
                )}
                {slotEntries.length === 0 && slotDrafts.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground italic">
                    {copy.week.nothingLoggedYet}
                  </p>
                ) : (
                  <ul className="divide-y divide-border/40">
                    {slotEntries.map((e) => (
                      <EntryRow key={e.id} entry={e} onDelete={() => deleteMut.mutate(e.id)} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
        <div className="lg:hidden"><WaterTracker date={date} /></div>

        {/* Blue indicator: separates log-day items from body metrics / notes */}
        <div className="h-0.5 w-full rounded-full bg-electric/80 shadow-[0_0_6px_rgba(59,130,246,0.35)]" />

        {/* Periodisk faste */}
        <FastingCard date={date} />

        {/* Kroppsmål, notater — not part of «Logg dag» */}
        <WeightCard />
        <NotesCard date={date} />
      </div>

      {addingSlot && (
        <AddFoodDialog
          date={date}
          slot={addingSlot}
          onClose={() => setAddingSlot(null)}
          onLogged={() => {
            qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
          }}
        />
      )}
      {scanningSlot && (
        <ScanFoodDialog
          date={date}
          slot={scanningSlot}
          onClose={() => setScanningSlot(null)}
          onLogged={() => {
            qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
          }}
        />
      )}
      {barcodeSlot && (
        <BarcodeScanDialog
          date={date}
          slot={barcodeSlot}
          onClose={() => setBarcodeSlot(null)}
          onLogged={() => {
            qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
          }}
          onDraftSaved={() => {
            qc.invalidateQueries({ queryKey: ["nutrition-drafts", date] });
          }}
        />
      )}
      {showTargets && <TargetsDialog current={targets ?? null} dayCurrent={dayTargets ?? null} date={date} onClose={() => setShowTargets(false)} />}
      {showBurned && (
        <BurnedDialog
          date={date}
          current={burned}
          onClose={() => setShowBurned(false)}
          onSave={(v) => {
            setBurned(v);
            if (typeof window !== "undefined") {
              if (v > 0) window.localStorage.setItem(`onyx-burned-${date}`, String(v));
              else window.localStorage.removeItem(`onyx-burned-${date}`);
            }
            setShowBurned(false);
          }}
        />
      )}
      {showEatenExtra && (
        <ManualKcalDialog
          date={date}
          current={eatenExtra}
          title={copy.eatenManual}
          eyebrow={copy.addLabel}
          label={copy.kcalEaten}
          hint={copy.eatenHint}
          onClose={() => setShowEatenExtra(false)}
          onSave={(v) => {
            setEatenExtra(v);
            if (typeof window !== "undefined") {
              if (v > 0) window.localStorage.setItem(`onyx-eaten-extra-${date}`, String(v));
              else window.localStorage.removeItem(`onyx-eaten-extra-${date}`);
            }
            setShowEatenExtra(false);
          }}
        />
      )}
      {showSteps && (
        <StepsDialog
          date={date}
          current={steps}
          title={copy.stepsTitle}
          eyebrow={copy.steps}
          label={copy.steps}
          unit={copy.stepsUnit}
          hint={copy.stepsHint}
          onClose={() => setShowSteps(false)}
          onSave={(v) => {
            setSteps(v);
            if (typeof window !== "undefined") {
              if (v > 0) window.localStorage.setItem(`onyx-steps-${date}`, String(v));
              else window.localStorage.removeItem(`onyx-steps-${date}`);
            }
            setShowSteps(false);
          }}
        />
      )}


    </div>
  );
}


function EntryRow({ entry, onDelete }: { entry: FoodLogEntry; onDelete: () => void }) {
  const portion = entry.grams ? `${entry.grams.toFixed(0)}g` : entry.servings ? `${entry.servings} serving${entry.servings === 1 ? "" : "s"}` : "";
  return (
    <li className="flex min-w-0 items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{entry.name}</p>
        <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
          {entry.kcal.toFixed(0)} kcal
          {portion && ` · ${portion}`}
          {" · "}P {entry.protein_g.toFixed(0)}g · C {entry.carbs_g.toFixed(0)}g · F {entry.fat_g.toFixed(0)}g
        </p>
      </div>
      <button onClick={onDelete} aria-label="Delete entry" className="shrink-0 p-1 text-muted-foreground hover:text-red-400">
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

function DraftRow({
  draft,
  onLog,
  onDelete,
  busy,
}: {
  draft: FoodDraft;
  onLog: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const portion = draft.grams ? `${draft.grams.toFixed(0)}g` : draft.servings ? `${draft.servings} serving${draft.servings === 1 ? "" : "s"}` : "";
  return (
    <li className="flex min-w-0 items-center gap-2 rounded-md border border-electric/30 bg-onyx-100/60 p-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{draft.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {draft.kcal.toFixed(0)} kcal{portion && ` · ${portion}`} · P {draft.protein_g.toFixed(0)}g · C {draft.carbs_g.toFixed(0)}g · F {draft.fat_g.toFixed(0)}g
        </p>
      </div>
      {/* Per-meal Log removed: drafts commit together via the top "Log day" button. */}

      <button
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete pending item"
        className="shrink-0 p-1 text-muted-foreground hover:text-red-400 disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

function CalorieRing({ consumed, target }: { consumed: number; target: number | null }) {
  const copy = useNutritionCopy();
  const goal = target && target > 0 ? target : 2000;
  const left = Math.max(0, goal - consumed);
  const pct = Math.min(100, (consumed / goal) * 100);
  // Responsive size, smaller on phones
  const [size, setSize] = useState(118);
  useEffect(() => {
    const update = () => setSize(window.innerWidth >= 640 ? 176 : window.innerWidth < 375 ? 112 : 124);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const stroke = size < 150 ? 9 : 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-electric/25" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          className="stroke-electric fill-none transition-all duration-500 drop-shadow-[0_0_6px_rgba(0,180,255,0.55)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[8px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[10px]">{copy.kcalLeft}</span>
        <span className="font-display mt-0.5 text-xl font-bold leading-none sm:mt-1 sm:text-4xl">{left.toFixed(0)}</span>
        <span className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground">{copy.of} {goal.toFixed(0)}</span>
      </div>
    </div>
  );
}


function StatColumn({ icon, label, value, unit, tone }: { icon: React.ReactNode; label: string; value: number; unit: string; tone: "foreground" | "electric" | "muted" }) {
  const toneClass = tone === "electric" ? "text-electric" : tone === "muted" ? "text-muted-foreground" : "text-foreground";
  return (
    <div className="min-w-0 rounded-lg border border-border/50 bg-onyx-100/40 p-1 sm:p-2.5 text-center">
      <div className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-onyx-100 sm:h-6 sm:w-6 ${toneClass} mx-auto`}>{icon}</div>
      <p className="mt-1 truncate text-[8px] uppercase text-muted-foreground sm:text-[10px] sm:tracking-wider">{label}</p>
      <p className={`text-xs sm:text-sm font-bold ${toneClass} tabular-nums`}>{value.toFixed(0)}</p>
      <p className="text-[9px] text-muted-foreground">{unit}</p>
    </div>

  );
}

function MacroBar({ icon, label, value, target, color, trackColor }: { icon: React.ReactNode; label: string; value: number; target: number | null; color: string; trackColor: string }) {
  const pct = target ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-[11px]">
        <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-foreground">
          <span className="text-muted-foreground">{icon}</span>{label}
        </span>
        <span className="shrink-0 text-muted-foreground tabular-nums">
          <span className="font-bold text-foreground">{value.toFixed(0)}</span>{target ? ` / ${target.toFixed(0)}g` : "g"}
        </span>
      </div>
      <div className={`h-1.5 rounded-full overflow-hidden ${trackColor}`}>
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const WATER_GLASS_ML = 250;
const WATER_TOTAL_GLASSES = 12; // 3000 ml daily target
function waterKey(date: string) { return `onyx-water-${date}`; }
function savedDayKey(date: string) { return `onyx-day-saved-${date}`; }

function readWaterGlasses(date: string): number {
  try {
    const raw = localStorage.getItem(waterKey(date));
    return raw ? Math.max(0, Math.min(WATER_TOTAL_GLASSES, Number(raw) || 0)) : 0;
  } catch { return 0; }
}

function SaveDayButton({ date, totals, entriesCount, draftsCount }: { date: string; totals: { kcal: number; protein_g: number; carbs_g: number; fat_g: number }; entriesCount: number; draftsCount: number }) {
  const copy = useNutritionCopy();
  const qc = useQueryClient();
  const commitAll = useServerFn(commitDayDrafts);
  const [saved, setSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(savedDayKey(date));
      if (raw) { setSaved(true); setSavedAt(raw); } else { setSaved(false); setSavedAt(null); }
    } catch { setSaved(false); setSavedAt(null); }
  }, [date]);

  const [confirming, setConfirming] = useState(false);

  const requestSave = () => {
    if (entriesCount === 0 && draftsCount === 0) {
      toast.error("Log at least one meal first");
      return;
    }
    setConfirming(true);
  };

  const handleSave = async () => {
    setConfirming(false);
    setBusy(true);
    try {
      if (draftsCount > 0) {
        await commitAll({ data: { date } });
        qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
        qc.invalidateQueries({ queryKey: ["nutrition-drafts", date] });
        qc.invalidateQueries({ queryKey: ["nutrition-week"] });
        qc.invalidateQueries({ queryKey: ["nutrition-range"] });
      }
      const stamp = new Date().toISOString();
      try { localStorage.setItem(savedDayKey(date), stamp); } catch {}
      setSaved(true);
      setSavedAt(stamp);
      toast.success("Day logged, see it in This week & Progress");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to log day");
    } finally {
      setBusy(false);
    }
  };


  const handleUnsave = () => {
    try { localStorage.removeItem(savedDayKey(date)); } catch {}
    setSaved(false);
    setSavedAt(null);
  };

  const glasses = readWaterGlasses(date);

  return (
    <div className="space-y-2">
      <div className={`relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2.5 transition-colors sm:gap-3 sm:p-4 ${saved ? "border-emerald-500/40 bg-emerald-500/10" : "border-electric/40 bg-electric/10"}`}>
        {confirming && !saved && (
          <div className="absolute right-0 bottom-full z-10 mb-2 w-56 rounded-lg border border-electric/40 bg-onyx-100 p-2.5 shadow-[0_0_20px_rgba(0,180,255,0.2)] sm:w-64">
            <p className="font-display text-xs font-bold leading-tight sm:text-sm">
              {copy.confirmTitle}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {copy.confirmBody}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={handleSave}
                disabled={busy}
                className="rounded-md bg-electric px-2 py-1.5 text-[11px] font-bold text-onyx-50 shadow-[0_0_12px_rgba(0,180,255,0.25)] hover:bg-electric-glow disabled:opacity-60"
              >
                {busy ? "…" : copy.confirmYes}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border border-border bg-onyx-100 px-2 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {copy.confirmNo}
              </button>
            </div>
            <span className="absolute right-4 top-full block h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-electric/40 bg-onyx-100" />
          </div>
        )}
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg sm:h-10 sm:w-10 ${saved ? "bg-emerald-500/20 text-emerald-400" : "bg-electric/20 text-electric"}`}>
          {saved ? <CheckCircle2 className="h-5 w-5" /> : <Save className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-sm sm:text-base leading-tight">
            {saved ? `${copy.logDay} ✓` : copy.logThisDay}
          </p>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
            {saved
              ? `${totals.kcal.toFixed(0)} kcal · ${entriesCount} item${entriesCount === 1 ? "" : "s"} · ${glasses * WATER_GLASS_ML} ml ${copy.water.toLowerCase()}`
              : copy.tapComplete}
          </p>
        </div>
        <div className="relative">
          {saved ? (
            <button
              type="button"
              onClick={handleUnsave}
              className="shrink-0 rounded-md border border-border bg-onyx-100 px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground sm:px-3"
            >
              {copy.undo}
            </button>
          ) : (
            <button
              type="button"
              onClick={requestSave}
              disabled={busy}
              className="shrink-0 rounded-md bg-electric px-2.5 py-2 text-xs font-bold text-onyx-50 shadow-[0_0_18px_rgba(0,180,255,0.25)] hover:bg-electric-glow disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {busy ? "…" : copy.logDay}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



function WaterTracker({ date }: { date: string }) {
  const copy = useNutritionCopy();
  const [glasses, setGlasses] = useState<number>(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(waterKey(date));
      setGlasses(raw ? Math.max(0, Math.min(WATER_TOTAL_GLASSES, Number(raw) || 0)) : 0);
    } catch { setGlasses(0); }
  }, [date]);

  function set(n: number) {
    const v = Math.max(0, Math.min(WATER_TOTAL_GLASSES, n));
    setGlasses(v);
    try { localStorage.setItem(waterKey(date), String(v)); } catch {}
  }

  const ml = glasses * WATER_GLASS_ML;
  const target = WATER_TOTAL_GLASSES * WATER_GLASS_ML;
  const done = glasses >= WATER_TOTAL_GLASSES;

  return (
    <div className="surface-card max-w-full rounded-xl p-2.5 sm:rounded-2xl sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
            <Droplet className="h-4 w-4" fill="currentColor" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-sm sm:text-base leading-none">{copy.water}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">1 {copy.glass} = {WATER_GLASS_ML} ml</p>
          </div>
        </div>
        <button
          onClick={() => set(0)}
          aria-label={copy.resetWater}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-onyx-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex min-w-0 items-baseline gap-1.5 sm:gap-2">
        <span className="font-display text-2xl font-bold text-sky-400 tabular-nums">{ml}</span>
        <span className="truncate text-xs text-muted-foreground sm:text-sm">ml / {target} ml</span>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
        {Array.from({ length: WATER_TOTAL_GLASSES }).map((_, i) => {
          const filled = i < glasses;
          return (
            <button
              key={i}
              type="button"
              onClick={() => set(filled ? i : i + 1)}
              aria-label={filled ? `${copy.emptyGlass} ${i + 1}` : `${copy.fillGlass} ${i + 1}`}
                className={`flex aspect-[3/4] items-end justify-center overflow-hidden rounded-md border-2 transition-all active:scale-95 ${
                filled ? "border-sky-400 bg-sky-500/20" : "border-dashed border-border bg-onyx-100/40 hover:border-sky-400/60"
              }`}
            >
              <Droplet
                className={`mb-1 h-4 w-4 transition-all sm:h-5 sm:w-5 ${filled ? "text-sky-400" : "text-muted-foreground/40"}`}
                fill={filled ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>

      {done && (
        <p className="mt-3 text-[11px] text-center font-bold text-sky-400 inline-flex items-center justify-center gap-1 w-full">
          <Check className="h-3.5 w-3.5" /> {copy.hydrationDone}
        </p>
      )}
    </div>
  );
}


// ============================================================
// Body scroll lock (prevents page scrolling behind open dialogs on iOS)
// ============================================================
function useLockBodyScroll() {
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, []);
}

// ============================================================
// Add food dialog
// ============================================================
const FOOD_CATEGORIES: Array<{ id: string; emoji: string; match: string[] }> = [
  { id: "all", emoji: "", match: [] },
  { id: "fish", emoji: "🐟", match: ["fish", "seafood"] },
  { id: "shellfish", emoji: "🦐", match: ["shellfish"] },
  { id: "meat", emoji: "🥩", match: ["meat"] },
  { id: "poultry", emoji: "🍗", match: ["poultry"] },
  { id: "egg", emoji: "🥚", match: ["egg"] },
  { id: "dairy", emoji: "🥛", match: ["dairy"] },
  { id: "fruit", emoji: "🍎", match: ["fruit"] },
  { id: "vegetable", emoji: "🥦", match: ["vegetable", "salad"] },
  { id: "grain", emoji: "🍚", match: ["grain", "carb"] },
  { id: "bread", emoji: "🍞", match: ["bread"] },
  { id: "nuts", emoji: "🥜", match: ["nuts", "fat", "legume"] },
  { id: "drink", emoji: "🥤", match: ["drink"] },
  { id: "snack", emoji: "🍫", match: ["snack", "dessert"] },
  { id: "meal", emoji: "🍽️", match: ["meal", "breakfast", "side", "soup", "fastfood", "protein"] },
];

const FOOD_CATEGORY_LABELS: Record<"en" | "no" | "es" | "pt-BR", Record<string, string>> = {
  en: { all: "All", fish: "Fish", shellfish: "Shellfish", meat: "Meat", poultry: "Chicken", egg: "Eggs", dairy: "Dairy", fruit: "Fruit", vegetable: "Vegetables", grain: "Rice & Grains", bread: "Bread", nuts: "Nuts & Seeds", drink: "Drinks", snack: "Snacks", meal: "Meals" },
  no: { all: "Alle", fish: "Fisk", shellfish: "Skalldyr", meat: "Kjøtt", poultry: "Kylling", egg: "Egg", dairy: "Meieri", fruit: "Frukt", vegetable: "Grønnsaker", grain: "Ris og korn", bread: "Brød", nuts: "Nøtter og frø", drink: "Drikke", snack: "Snacks", meal: "Måltider" },
  es: { all: "Todos", fish: "Pescado", shellfish: "Mariscos", meat: "Carne", poultry: "Pollo", egg: "Huevos", dairy: "Lácteos", fruit: "Fruta", vegetable: "Verduras", grain: "Arroz y granos", bread: "Pan", nuts: "Frutos secos y semillas", drink: "Bebidas", snack: "Snacks", meal: "Comidas" },
  "pt-BR": { all: "Todos", fish: "Peixe", shellfish: "Frutos do mar", meat: "Carne", poultry: "Frango", egg: "Ovos", dairy: "Laticínios", fruit: "Frutas", vegetable: "Vegetais", grain: "Arroz e grãos", bread: "Pão", nuts: "Castanhas e sementes", drink: "Bebidas", snack: "Snacks", meal: "Refeições" },
};

function AddFoodDialog({ date, slot, onClose, onLogged }: { date: string; slot: string; onClose: () => void; onLogged: () => void }) {
  useLockBodyScroll();
  const { lang } = useLang();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [mode, setMode] = useState<"search" | "custom">("search");
  // Cart: multiple foods with per-item grams + unit (for drinks: ml/dl/L)
  type Unit = "g" | "ml" | "dl" | "l";
  const isDrink = (f: FoodRow) =>
    f.category === "drink" ||
    /melk|milk|juice|jus|drikk|drink|kaffe|coffee|te\b|tea|cola|brus|soda|smoothie|shake|vann|water|øl|beer|vin|wine|kombucha|latte|cappuccino|espresso|yoghurt.*drikk|drikke/i.test(
      f.name,
    );
  const defaultUnit = (f: FoodRow): Unit => (isDrink(f) ? "ml" : "g");
  const toGrams = (amount: number, unit: Unit) => {
    switch (unit) {
      case "g":
      case "ml":
        return amount;
      case "dl":
        return amount * 100;
      case "l":
        return amount * 1000;
    }
  };
  const defaultAmount = (f: FoodRow, unit: Unit) => {
    const g = f.serving_size_g ?? (isDrink(f) ? 250 : 100);
    if (unit === "g" || unit === "ml") return g;
    if (unit === "dl") return g / 100;
    return g / 1000;
  };
  const [cart, setCart] = useState<Array<{ food: FoodRow; amount: number; unit: Unit }>>([]);

  const searchFn = useServerFn(searchFoods);
  const logFn = useServerFn(logFood);

  const { data: allResults = [], isLoading } = useQuery({
    queryKey: ["food-search", q, lang],
    queryFn: () => searchFn({ data: { query: q, lang } }),
  });
  const results = useMemo(() => {
    if (cat === "all") return allResults;
    const conf = FOOD_CATEGORIES.find((c) => c.id === cat);
    const set = new Set(conf?.match ?? []);
    return allResults.filter((f) => (f.category ? set.has(f.category) : false) || f.is_custom);
  }, [allResults, cat]);

  const inCart = (f: FoodRow) => cart.some((c) => c.food.id === f.id && c.food.is_custom === f.is_custom);
  const toggle = (f: FoodRow) => {
    setCart((prev) => {
      const key = (c: { food: FoodRow }) => c.food.id === f.id && c.food.is_custom === f.is_custom;
      if (prev.some(key)) return prev.filter((c) => !key(c));
      const unit = defaultUnit(f);
      return [...prev, { food: f, unit, amount: defaultAmount(f, unit) }];
    });
  };
  const updateAmount = (idx: number, a: number) =>
    setCart((prev) => prev.map((c, i) => (i === idx ? { ...c, amount: Math.max(0, a) } : c)));
  const updateUnit = (idx: number, unit: Unit) =>
    setCart((prev) =>
      prev.map((c, i) => {
        if (i !== idx) return c;
        // Convert current amount to grams then to new unit so the physical quantity stays constant
        const grams = toGrams(c.amount, c.unit);
        const next =
          unit === "g" || unit === "ml" ? grams : unit === "dl" ? grams / 100 : grams / 1000;
        return { ...c, unit, amount: Math.max(0.01, Number(next.toFixed(unit === "l" ? 3 : 1))) };
      }),
    );
  const removeAt = (idx: number) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const totals = cart.reduce(
    (a, c) => {
      const r = toGrams(c.amount, c.unit) / 100;
      return {
        kcal: a.kcal + c.food.kcal_per_100g * r,
        p: a.p + c.food.protein_g_per_100g * r,
        cb: a.cb + c.food.carbs_g_per_100g * r,
        f: a.f + c.food.fat_g_per_100g * r,
      };
    },
    { kcal: 0, p: 0, cb: 0, f: 0 },
  );

  const logMut = useMutation({
    mutationFn: async () => {
      if (cart.length === 0) throw new Error("Pick at least one food");
      for (const item of cart) {
        const grams = toGrams(item.amount, item.unit);
        const r = grams / 100;
        const unitLabel =
          item.unit === "g"
            ? null
            : item.unit === "l"
              ? `${item.amount} L`
              : `${item.amount} ${item.unit}`;
        await logFn({
          data: {
            date,
            meal_slot: slot as "breakfast" | "lunch" | "dinner" | "snack",
            name: unitLabel ? `${item.food.name} (${unitLabel})` : item.food.name,
            food_id: item.food.is_custom ? undefined : item.food.id,
            food_kind: item.food.is_custom ? "custom" : "public",
            grams,
            kcal: item.food.kcal_per_100g * r,
            protein_g: item.food.protein_g_per_100g * r,
            carbs_g: item.food.carbs_g_per_100g * r,
            fat_g: item.food.fat_g_per_100g * r,
            source: "manual",
          },
        });
      }
    },
    onSuccess: () => {
      toast.success(`Logged ${cart.length} item${cart.length === 1 ? "" : "s"}`);
      setCart([]);
      onLogged();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to log"),
  });


  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden rounded-none border border-border bg-onyx-50 sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:rounded-2xl">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-3 sm:p-4">
          <div className="min-w-0">
            <h3 className="font-display font-bold capitalize">Add to {slot}</h3>
            <p className="truncate text-xs text-muted-foreground">Adding to <span className="text-foreground font-semibold">{date}</span> · pick as many as you want</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="shrink-0 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="shrink-0 flex border-b border-border">
          <button onClick={() => setMode("search")} className={`flex-1 py-2 text-sm font-semibold ${mode === "search" ? "text-electric border-b-2 border-electric" : "text-muted-foreground"}`}>Search</button>
          <button onClick={() => setMode("custom")} className={`flex-1 py-2 text-sm font-semibold ${mode === "custom" ? "text-electric border-b-2 border-electric" : "text-muted-foreground"}`}>Quick add</button>
        </div>

        {mode === "search" ? (
          <>
            <div className="shrink-0 border-b border-border/50 p-3 sm:p-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={
                    lang === "no"
                      ? "Søk mat (laks, kylling, banan…)"
                      : lang === "es"
                        ? "Buscar comida (salmón, pollo, plátano…)"
                        : lang === "pt-BR"
                          ? "Buscar comida (salmão, frango, banana…)"
                          : "Search foods (salmon, chicken, banana…)"
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-onyx-100 text-base sm:text-sm"
                />
              </div>
            </div>
            <div className="shrink-0 border-b border-border/50 overflow-x-auto">
              <div className="flex gap-1.5 px-3 py-2 min-w-max">
                {FOOD_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                      cat === c.id
                        ? "bg-electric text-onyx-50"
                        : "bg-onyx-100 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c.emoji ? `${c.emoji} ` : ""}{FOOD_CATEGORY_LABELS[lang]?.[c.id] ?? c.id}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-0 flex-1 overflow-y-auto">
              {isLoading && <p className="p-4 text-sm text-muted-foreground">Searching…</p>}
              {!isLoading && results.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No foods found. Try another category or "Quick add" above.</p>
              )}
              <ul>
                {results.map((f) => {
                  const picked = inCart(f);
                  return (
                    <li key={`${f.is_custom ? "c" : "p"}-${f.id}`}>
                      <button
                        onClick={() => toggle(f)}
                        className={`w-full text-left px-4 py-3 border-b border-border/30 hover:bg-onyx-100/60 transition-colors flex items-center gap-3 ${picked ? "bg-electric/10" : ""}`}
                      >
                        <div className={`h-5 w-5 shrink-0 rounded-md border ${picked ? "bg-electric border-electric" : "border-border"} grid place-items-center`}>
                          {picked && <Check className="h-3.5 w-3.5 text-onyx-50" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{f.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {f.kcal_per_100g}kcal · P{f.protein_g_per_100g}g C{f.carbs_g_per_100g}g F{f.fat_g_per_100g}g / 100{isDrink(f) ? "ml" : "g"}
                            {f.is_custom && <span className="ml-2 px-1.5 py-0.5 bg-electric/20 text-electric rounded text-[10px]">mine</span>}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>


            {cart.length > 0 && (
              <div className="border-t border-border bg-onyx-100/50">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border/50 px-3 py-2 sm:px-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-electric">Your picks ({cart.length})</p>
                  <p className="shrink-0 text-[11px] text-muted-foreground sm:text-xs">
                    {totals.kcal.toFixed(0)} kcal · P{totals.p.toFixed(0)}g C{totals.cb.toFixed(0)}g F{totals.f.toFixed(0)}g
                  </p>
                </div>
                <ul className="divide-y divide-border/40">
                  {cart.map((item, idx) => {
                    const grams = toGrams(item.amount, item.unit);
                    const r = grams / 100;
                    const k = item.food.kcal_per_100g * r;
                    const p = item.food.protein_g_per_100g * r;
                    const c = item.food.carbs_g_per_100g * r;
                    const f = item.food.fat_g_per_100g * r;
                    const drink = isDrink(item.food);
                    const step = item.unit === "l" ? 0.05 : item.unit === "dl" ? 0.5 : 1;
                    return (
                      <li key={`cart-${idx}`} className="flex min-w-0 items-center gap-1.5 p-2.5 sm:gap-2 sm:p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{item.food.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {k.toFixed(0)} kcal · P{p.toFixed(0)} C{c.toFixed(0)} F{f.toFixed(0)}
                          </p>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={step}
                          placeholder="0"
                          value={item.amount === 0 ? "" : item.amount}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) => updateAmount(idx, e.target.value === "" ? 0 : Number(e.target.value))}
                          className="w-14 shrink-0 rounded-md border border-border bg-onyx-50 px-1.5 py-1 text-right text-xs sm:w-16 sm:px-2"
                        />
                        {drink ? (
                          <select
                            value={item.unit}
                            onChange={(e) => updateUnit(idx, e.target.value as Unit)}
                            className="shrink-0 rounded-md border border-border bg-onyx-50 px-1 py-1 text-[11px]"
                            aria-label="Unit"
                          >
                            <option value="ml">ml</option>
                            <option value="dl">dl</option>
                            <option value="l">L</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">g</span>
                        )}
                        <button onClick={() => removeAt(idx)} aria-label="Remove" className="p-1 text-muted-foreground hover:text-red-400">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}

                </ul>
              </div>
            )}

            <div className="border-t border-border p-3 sm:p-4">
              <button
                onClick={() => logMut.mutate()}
                disabled={logMut.isPending || cart.length === 0}
                className="w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
              >
                {logMut.isPending
                  ? "Logging…"
                  : cart.length === 0
                    ? "Pick foods to log"
                    : `Log ${cart.length} item${cart.length === 1 ? "" : "s"} · ${totals.kcal.toFixed(0)} kcal`}
              </button>
            </div>
          </>
        ) : (
          <QuickAddForm date={date} slot={slot} onLogged={onLogged} />
        )}
      </div>
    </div>
  );
}


// ============================================================
// Scan food dialog (AI photo → macros → log)
// ============================================================
function ScanFoodDialog({ date, slot, onClose, onLogged }: { date: string; slot: string; onClose: () => void; onLogged: () => void }) {
  useLockBodyScroll();
  const qc = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Auto-open camera as soon as the dialog mounts
    const t = setTimeout(() => fileInputRef.current?.click(), 50);
    return () => clearTimeout(t);
  }, []);

  const scanFn = useServerFn(scanFoodPhoto);
  const quotaFn = useServerFn(getScanQuota);
  const logFn = useServerFn(logFood);

  const { data: quota } = useQuery({
    queryKey: ["scan-quota"],
    queryFn: () => quotaFn(),
  });

  const readAsBase64 = (file: File) =>
    new Promise<{ base64: string; mime: string; dataUrl: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result);
        const [meta, b64] = dataUrl.split(",");
        const mime = /data:([^;]+);/.exec(meta)?.[1] ?? file.type ?? "image/jpeg";
        resolve({ base64: b64, mime, dataUrl });
      };
      reader.onerror = () => reject(new Error("Couldn't read image"));
      reader.readAsDataURL(file);
    });

  // Compress big camera photos so the base64 payload fits comfortably in
  // the server function request. Long side capped at 1280px, JPEG q=0.82.
  const compressImage = (file: File): Promise<{ base64: string; mime: string; dataUrl: string }> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const MAX = 1280;
          let { width, height } = img;
          const scale = Math.min(1, MAX / Math.max(width, height));
          width = Math.round(width * scale);
          height = Math.round(height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas not supported");
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          const [, b64] = dataUrl.split(",");
          URL.revokeObjectURL(url);
          resolve({ base64: b64, mime: "image/jpeg", dataUrl });
        } catch (e) {
          URL.revokeObjectURL(url);
          reject(e);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Couldn't decode image"));
      };
      img.src = url;
    });

  const handleFile = async (file: File) => {
    setError(null);
    setItems(null);
    setScanning(true);
    try {
      // Try to compress; fall back to raw read if canvas fails
      let payload: { base64: string; mime: string; dataUrl: string };
      try {
        payload = await compressImage(file);
      } catch {
        payload = await readAsBase64(file);
      }
      setPreview(payload.dataUrl);
      const res = await scanFn({ data: { imageBase64: payload.base64, mimeType: payload.mime } });
      setRemaining(res.remaining);
      if (!res.ok) {
        setError(res.reason);
        return;
      }
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const updateItem = (idx: number, patch: Partial<ScannedItem>) =>
    setItems((prev) => (prev ? prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)) : prev));
  const removeItem = (idx: number) => setItems((prev) => (prev ? prev.filter((_, i) => i !== idx) : prev));

  const totals = (items ?? []).reduce(
    (a, it) => ({
      kcal: a.kcal + it.kcal,
      p: a.p + it.protein_g,
      c: a.c + it.carbs_g,
      f: a.f + it.fat_g,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const logMut = useMutation({
    mutationFn: async () => {
      if (!items || items.length === 0) throw new Error("Nothing to log");
      for (const it of items) {
        await logFn({
          data: {
            date,
            meal_slot: slot as "breakfast" | "lunch" | "dinner" | "snack",
            name: it.name,
            grams: it.grams,
            kcal: it.kcal,
            protein_g: it.protein_g,
            carbs_g: it.carbs_g,
            fat_g: it.fat_g,
            source: "scan",
          },
        });
      }
    },
    onSuccess: () => {
      toast.success(`Saved ${items!.length} item${items!.length === 1 ? "" : "s"} to ${slot}`);
      qc.invalidateQueries({ queryKey: ["scan-quota"] });
      onLogged();
      // Reset so the user can scan another photo without reopening
      setPreview(null);
      setItems(null);
      setError(null);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to log"),
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden rounded-none border border-border bg-onyx-50 sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:rounded-2xl">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-3 sm:p-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 truncate font-display font-bold capitalize"><Camera className="h-4 w-4 shrink-0 text-electric" /> Scan food · {slot}</h3>
            {(() => {
              const left = remaining ?? quota?.remaining ?? null;
              const limit = quota?.limit ?? 10;
              return (
                <p className="truncate text-xs text-muted-foreground">
                  Snap your plate, AI reads it and estimates macros.{" "}
                  {left != null ? (
                    <span className={`font-semibold ${left === 0 ? "text-red-400" : "text-electric"}`}>
                      {left} / {limit} scans left today
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Loading quota…</span>
                  )}
                </p>
              );
            })()}
          </div>
          <button onClick={onClose} aria-label="Close" className="shrink-0 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-w-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
          {!preview && !scanning && (
            <label className="block cursor-pointer">
              <div className="rounded-xl border-2 border-dashed border-electric/40 bg-electric/5 p-8 text-center hover:bg-electric/10 transition-colors">
                <Camera className="h-10 w-10 text-electric mx-auto mb-2" />
                <p className="font-semibold text-sm">Take a photo of your meal</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to open camera or pick from gallery</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
            </label>
          )}

          {preview && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img src={preview} alt="Scanned meal" className="w-full max-h-64 object-cover" />
            </div>
          )}

          {scanning && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-electric" />
              Reading your plate…
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {items && items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-electric sm:tracking-wider">
                Found {items.length} item{items.length === 1 ? "" : "s"} · {totals.kcal.toFixed(0)} kcal · P{totals.p.toFixed(0)}g C{totals.c.toFixed(0)}g F{totals.f.toFixed(0)}g
              </p>
              <ul className="space-y-2">
                {items.map((it, idx) => (
                  <li key={idx} className="rounded-lg border border-border bg-onyx-100/60 p-3 space-y-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <input
                        value={it.name}
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                        className="min-w-0 flex-1 rounded-md border border-border bg-onyx-50 px-2 py-1.5 text-sm font-semibold"
                      />
                      <button onClick={() => removeItem(idx)} aria-label="Remove" className="shrink-0 p-1 text-muted-foreground hover:text-red-400">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-[11px] sm:gap-2">
                      {[
                        { l: "g", key: "grams" as const },
                        { l: "kcal", key: "kcal" as const },
                        { l: "P", key: "protein_g" as const },
                        { l: "C", key: "carbs_g" as const },
                        { l: "F", key: "fat_g" as const },
                      ].map((f) => (
                        <div key={f.l}>
                          <label className="text-muted-foreground">{f.l}</label>
                          <input
                            type="number"
                            min={0}
                            value={it[f.key]}
                            onChange={(e) => updateItem(idx, { [f.key]: Math.max(0, Number(e.target.value) || 0) })}
                            className="w-full min-w-0 rounded-md border border-border bg-onyx-50 px-1 py-1 text-right sm:px-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setPreview(null);
                  setItems(null);
                  setError(null);
                }}
                className="text-xs text-electric hover:underline"
              >
                Retake photo
              </button>
            </div>
          )}
        </div>

        {items && items.length > 0 && (
          <div className="border-t border-border p-3 sm:p-4">
            <button
              onClick={() => logMut.mutate()}
              disabled={logMut.isPending}
              className="w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
            >
              {logMut.isPending ? "Adding…" : `Add to ${slot} · ${totals.kcal.toFixed(0)} kcal`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



const QUICK_ADD_COPY = {
  en: { name: "Name", placeholder: "e.g. Grandma's stew", cal: "Cal", p: "P (g)", c: "C (g)", f: "F (g)", save: "Save to my foods for future use", saving: "Saving…", log: "Log it", saved: "Saved!", nameReq: "Name and calories are required", failed: "Failed to save" },
  no: { name: "Navn", placeholder: "f.eks. Bestemors lapskaus", cal: "Kcal", p: "P (g)", c: "K (g)", f: "F (g)", save: "Lagre til mine matvarer for senere", saving: "Lagrer…", log: "Logg", saved: "Lagret!", nameReq: "Navn og kalorier er påkrevd", failed: "Kunne ikke lagre" },
  es: { name: "Nombre", placeholder: "p. ej. Estofado de la abuela", cal: "Cal", p: "P (g)", c: "C (g)", f: "G (g)", save: "Guardar en mis alimentos", saving: "Guardando…", log: "Registrar", saved: "¡Guardado!", nameReq: "Nombre y calorías son obligatorios", failed: "No se pudo guardar" },
  "pt-BR": { name: "Nome", placeholder: "ex. Ensopado da vovó", cal: "Cal", p: "P (g)", c: "C (g)", f: "G (g)", save: "Salvar em meus alimentos", saving: "Salvando…", log: "Registrar", saved: "Salvo!", nameReq: "Nome e calorias são obrigatórios", failed: "Falha ao salvar" },
} as const;

function QuickAddForm({ date, slot, onLogged }: { date: string; slot: string; onLogged: () => void }) {
  const { lang } = useLang();
  const t = QUICK_ADD_COPY[lang] ?? QUICK_ADD_COPY.en;
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [save, setSave] = useState(false);

  const logFn = useServerFn(logFood);
  const createFn = useServerFn(createCustomFood);

  const mut = useMutation({
    mutationFn: async () => {
      if (!name.trim() || kcal < 0) throw new Error(t.nameReq);
      if (save) {
        await createFn({
          data: {
            name: name.trim(),
            kcal_per_100g: kcal,
            protein_g_per_100g: protein,
            carbs_g_per_100g: carbs,
            fat_g_per_100g: fat,
          },
        });
      }
      await logFn({
        data: {
          date,
          meal_slot: slot as "breakfast" | "lunch" | "dinner" | "snack",
          name: name.trim(),
          servings: 1,
          kcal,
          protein_g: protein,
          carbs_g: carbs,
          fat_g: fat,
          source: "manual",
        },
      });
    },
    onSuccess: () => {
      toast.success(t.saved);
      onLogged();
      setName("");
      setKcal(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : t.failed),
  });

  return (
    <div className="min-w-0 space-y-3 overflow-y-auto p-3 sm:p-4">
      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t.name}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.placeholder} className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-2 min-[390px]:grid-cols-4">
        {[
          { l: t.cal, v: kcal, s: setKcal },
          { l: t.p, v: protein, s: setProtein },
          { l: t.c, v: carbs, s: setCarbs },
          { l: t.f, v: fat, s: setFat },
        ].map((f) => (
          <div key={f.l}>
            <label className="text-xs font-semibold text-muted-foreground">{f.l}</label>
            <input
              type="number"
              min={0}
              value={f.v}
              onChange={(e) => f.s(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full min-w-0 rounded-md border border-border bg-onyx-100 px-2 py-2 text-sm text-right"
            />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
        {t.save}
      </label>
      <button
        onClick={() => mut.mutate()}
        disabled={mut.isPending || !name.trim()}
        className="w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
      >
        {mut.isPending ? t.saving : t.log}
      </button>
    </div>
  );
}

function TargetsDialog({
  current,
  dayCurrent,
  date,
  onClose,
}: {
  current: { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null } | null;
  dayCurrent: { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null } | null;
  date: string;
  onClose: () => void;
}) {
  useLockBodyScroll();
  const qc = useQueryClient();
  const { lang } = useLang();
  const L = ((): {
    dailyGoals: string; scopeAllDays: string; scopeOnlyThisDay: string; scopeDayHelp: string; scopeAllHelp: string;
    dgCalories: string; dgProtein: string; dgCarbs: string; dgFat: string;
    saveGoals: string; saving: string; goalsSaved: string; clearDayOverride: string; dayOverrideCleared: string;
  } => {
    if (lang === "no") return {
      dailyGoals: "Daglige mål", scopeAllDays: "Alle dager", scopeOnlyThisDay: "Kun denne dagen",
      scopeDayHelp: "Overstyrer målet kun for denne datoen. Andre dager endres ikke.",
      scopeAllHelp: "Setter standard daglig mål for alle dager.",
      dgCalories: "Kalorier (kcal)", dgProtein: "Protein (g)", dgCarbs: "Karbohydrater (g)", dgFat: "Fett (g)",
      saveGoals: "Lagre mål", saving: "Lagrer…", goalsSaved: "Mål lagret",
      clearDayOverride: "Tilbakestill denne dagen til standard", dayOverrideCleared: "Dagens overstyring fjernet",
    };
    if (lang === "es") return {
      dailyGoals: "Objetivos diarios", scopeAllDays: "Todos los días", scopeOnlyThisDay: "Solo este día",
      scopeDayHelp: "Sobrescribe el objetivo solo para esta fecha. Otros días no cambian.",
      scopeAllHelp: "Define tu objetivo diario predeterminado para todos los días.",
      dgCalories: "Calorías (kcal)", dgProtein: "Proteína (g)", dgCarbs: "Carbohidratos (g)", dgFat: "Grasa (g)",
      saveGoals: "Guardar objetivos", saving: "Guardando…", goalsSaved: "Objetivos guardados",
      clearDayOverride: "Restablecer este día al objetivo predeterminado", dayOverrideCleared: "Ajuste del día eliminado",
    };
    if (lang === "pt-BR") return {
      dailyGoals: "Metas diárias", scopeAllDays: "Todos os dias", scopeOnlyThisDay: "Somente este dia",
      scopeDayHelp: "Substitui a meta apenas para esta data. Outros dias não mudam.",
      scopeAllHelp: "Define sua meta diária padrão para todos os dias.",
      dgCalories: "Calorias (kcal)", dgProtein: "Proteína (g)", dgCarbs: "Carboidratos (g)", dgFat: "Gordura (g)",
      saveGoals: "Salvar metas", saving: "Salvando…", goalsSaved: "Metas salvas",
      clearDayOverride: "Redefinir este dia para a meta padrão", dayOverrideCleared: "Ajuste do dia removido",
    };
    return {
      dailyGoals: "Daily goals", scopeAllDays: "All days", scopeOnlyThisDay: "Only this day",
      scopeDayHelp: "Overrides your goal only for this date. Other days are unchanged.",
      scopeAllHelp: "Sets your default daily goal for every day.",
      dgCalories: "Calories (kcal)", dgProtein: "Protein (g)", dgCarbs: "Carbs (g)", dgFat: "Fat (g)",
      saveGoals: "Save goals", saving: "Saving…", goalsSaved: "Goals saved",
      clearDayOverride: "Reset this day to default goal", dayOverrideCleared: "Day override cleared",
    };
  })();
  const hasDayOverride = !!(dayCurrent && (dayCurrent.kcal || dayCurrent.protein_g || dayCurrent.carbs_g || dayCurrent.fat_g));
  const [scope, setScope] = useState<"all" | "day">(hasDayOverride ? "day" : "all");
  const source = scope === "day" ? (dayCurrent ?? current) : current;
  const [kcal, setKcal] = useState<number>(source?.kcal ?? 2200);
  const [protein, setProtein] = useState<number>(source?.protein_g ?? 150);
  const [carbs, setCarbs] = useState<number>(source?.carbs_g ?? 250);
  const [fat, setFat] = useState<number>(source?.fat_g ?? 70);

  useEffect(() => {
    const s = scope === "day" ? (dayCurrent ?? current) : current;
    setKcal(s?.kcal ?? 2200);
    setProtein(s?.protein_g ?? 150);
    setCarbs(s?.carbs_g ?? 250);
    setFat(s?.fat_g ?? 70);
  }, [scope, dayCurrent, current]);

  const saveAll = useServerFn(upsertTargets);
  const saveDay = useServerFn(upsertDayTargets);
  const clearDay = useServerFn(deleteDayTargets);

  const mut = useMutation({
    mutationFn: async () => {
      if (scope === "day") {
        await saveDay({ data: { date, kcal, protein_g: protein, carbs_g: carbs, fat_g: fat } });
      } else {
        await saveAll({ data: { kcal, protein_g: protein, carbs_g: carbs, fat_g: fat } });
      }
    },
    onSuccess: async () => {
      toast.success(L.goalsSaved);
      await qc.invalidateQueries({ queryKey: ["nutrition-targets"] });
      await qc.invalidateQueries({ queryKey: ["nutrition-day-targets", date] });
      onClose();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not save goals"),
  });

  const clearMut = useMutation({
    mutationFn: () => clearDay({ data: { date } }),
    onSuccess: async () => {
      toast.success(L.dayOverrideCleared);
      await qc.invalidateQueries({ queryKey: ["nutrition-day-targets", date] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4">
      <div className="w-full min-w-0 max-w-sm rounded-2xl border border-border bg-onyx-50 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-bold">{L.dailyGoals}</h3>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`rounded-md border px-2 py-2 text-xs font-bold ${scope === "all" ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground"}`}
          >
            {L.scopeAllDays}
          </button>
          <button
            type="button"
            onClick={() => setScope("day")}
            className={`rounded-md border px-2 py-2 text-xs font-bold ${scope === "day" ? "border-electric bg-electric/15 text-electric" : "border-border bg-onyx-100 text-muted-foreground"}`}
          >
            {L.scopeOnlyThisDay}
          </button>
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground">
          {scope === "day"
            ? (L.scopeDayHelp)
            : (L.scopeAllHelp)}
        </p>
        <div className="space-y-3">
          {[
            { l: L.dgCalories, v: kcal, s: setKcal },
            { l: L.dgProtein, v: protein, s: setProtein },
            { l: L.dgCarbs, v: carbs, s: setCarbs },
            { l: L.dgFat, v: fat, s: setFat },
          ].map((f) => (
            <div key={f.l} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <label className="text-sm">{f.l}</label>
              <input
                type="number"
                min={0}
                value={f.v}
                onChange={(e) => f.s(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 rounded-md border border-border bg-onyx-100 px-2 py-1.5 text-right text-sm sm:w-24"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          className="mt-5 w-full rounded-md bg-electric px-4 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
        >
          {mut.isPending ? (L.saving) : (L.saveGoals)}
        </button>
        {scope === "day" && hasDayOverride && (
          <button
            onClick={() => clearMut.mutate()}
            disabled={clearMut.isPending}
            className="mt-2 w-full rounded-md border border-border bg-onyx-100 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            {L.clearDayOverride}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Week view
// ============================================================
function WeekView({ anchorDate }: { anchorDate?: string }) {
  const copy = useNutritionCopy();
  const dl = copy.dateLocale;
  // Anchor of the visible 7-day window. Defaults to "last 7 days ending today"
  // but users can shift backward / forward to inspect any week, including
  // future days they've added from a meal plan.
  const [anchor, setAnchor] = useState<string>(() => anchorDate ?? todayISO());
  useEffect(() => {
    if (anchorDate && anchorDate !== anchor) setAnchor(anchorDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorDate]);
  const start = useMemo(() => addDays(anchor, -6), [anchor]);
  const end = anchor;

  const listWeek = useServerFn(listWeekLog);
  const getTargetsFn = useServerFn(getTargets);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["nutrition-week", start, end],
    queryFn: () => listWeek({ data: { startDate: start, endDate: end } }),
  });
  const { data: targets } = useQuery({
    queryKey: ["nutrition-targets"],
    queryFn: () => getTargetsFn(),
  });

  const days = useMemo(() => {
    const arr: { date: string; label: string; kcal: number; protein: number; carbs: number; fat: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const iso = addDays(start, i);
      const dayRows = rows.filter((r) => r.logged_date === iso);
      const label = new Date(iso + "T00:00:00").toLocaleDateString(dl, { weekday: "short" });
      arr.push({
        date: iso,
        label,
        kcal: dayRows.reduce((s, r) => s + r.kcal, 0),
        protein: dayRows.reduce((s, r) => s + r.protein_g, 0),
        carbs: dayRows.reduce((s, r) => s + r.carbs_g, 0),
        fat: dayRows.reduce((s, r) => s + r.fat_g, 0),
      });
    }
    return arr;
  }, [rows, start, dl]);

  const loggedDays = days.filter((d) => d.kcal > 0).length;
  const avgKcal = loggedDays ? days.reduce((s, d) => s + d.kcal, 0) / loggedDays : 0;
  const avgP = loggedDays ? days.reduce((s, d) => s + d.protein, 0) / loggedDays : 0;
  const avgC = loggedDays ? days.reduce((s, d) => s + d.carbs, 0) / loggedDays : 0;
  const avgF = loggedDays ? days.reduce((s, d) => s + d.fat, 0) / loggedDays : 0;

  const maxKcal = Math.max(targets?.kcal ?? 0, ...days.map((d) => d.kcal), 1);

  if (isLoading) return <div className="surface-card rounded-xl p-8 text-center text-sm text-muted-foreground">{copy.week.loading}</div>;

  const rangeLabel = `${new Date(start + "T00:00:00").toLocaleDateString(dl, { month: "short", day: "numeric" })} – ${new Date(end + "T00:00:00").toLocaleDateString(dl, { month: "short", day: "numeric" })}`;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Week navigation, so users can inspect past AND future weeks
          (e.g. plan days they added ahead of today). */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-onyx-100 p-1.5">
        <button
          type="button"
          onClick={() => setAnchor(addDays(anchor, -7))}
          aria-label={copy.week.previous}
          className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-electric/10 hover:text-electric"
        >
          ←
        </button>
        <div className="flex-1 text-center text-xs sm:text-sm font-semibold">{rangeLabel}</div>
        <button
          type="button"
          onClick={() => setAnchor(todayISO())}
          className="rounded-md border border-border px-2 py-1.5 text-[11px] font-semibold hover:border-electric/60 hover:text-electric"
        >
          {copy.week.today}
        </button>
        <button
          type="button"
          onClick={() => setAnchor(addDays(anchor, 7))}
          aria-label={copy.week.next}
          className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-electric/10 hover:text-electric"
        >
          →
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <StatCard label={copy.week.daysLogged} value={`${loggedDays} / 7`} />
        <StatCard label={copy.week.avgCalories} value={`${avgKcal.toFixed(0)} kcal`} />
        <StatCard label={copy.week.avgProtein} value={`${avgP.toFixed(0)}g`} />
        <StatCard label={copy.week.avgCarbsFat} value={`${avgC.toFixed(0)} / ${avgF.toFixed(0)}g`} />
      </div>

      <div className="surface-card max-w-full rounded-xl p-3 sm:p-5">
        <h3 className="font-display font-bold mb-4">{rangeLabel} · {copy.week.caloriesTitle}</h3>
        <div className="flex h-44 items-end gap-1.5 sm:h-48 sm:gap-2">
          {days.map((d) => {
            const h = maxKcal > 0 ? (d.kcal / maxKcal) * 100 : 0;
            const targetH = targets?.kcal ? (targets.kcal / maxKcal) * 100 : 0;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 relative h-full">
                <div className="flex-1 w-full flex flex-col justify-end relative">
                  {targets?.kcal && (
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-electric/60"
                      style={{ bottom: `${targetH}%` }}
                      title={`Goal: ${targets.kcal} kcal`}
                    />
                  )}
                  <div
                    className={`w-full rounded-t transition-all ${d.kcal > 0 ? "bg-electric" : "bg-onyx-100"}`}
                    style={{ height: `${h}%`, minHeight: d.kcal > 0 ? "4px" : "2px" }}
                    title={`${d.kcal.toFixed(0)} kcal`}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
                <span className="text-[10px] font-semibold">{d.kcal > 0 ? d.kcal.toFixed(0) : "-"}</span>
              </div>
            );
          })}
        </div>
        {targets?.kcal && <p className="mt-3 text-xs text-muted-foreground">{copy.week.dashedGoal(targets.kcal)}</p>}
      </div>

      {/* Per-day breakdown, tap to see full details for any day */}
      <div className="surface-card max-w-full rounded-xl p-3 sm:p-5">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <h3 className="font-display font-bold">{copy.week.dailyDetails}</h3>
          <p className="hidden text-[11px] text-muted-foreground min-[380px]:block">{copy.week.tapForBreakdown}</p>
        </div>
        <div className="space-y-2">
          {[...days].reverse().map((d) => (
            <WeekDayCard key={d.date} date={d.date} label={d.label} kcal={d.kcal} protein={d.protein} carbs={d.carbs} fat={d.fat} targets={targets ?? null} />
          ))}
        </div>
      </div>

      <div className="surface-card rounded-xl p-3 text-sm sm:p-5">
        <p className="text-muted-foreground">
          {copy.week.sideBySide} <Link to="/my-library" className="text-electric font-semibold hover:underline">{copy.week.openLibrary}</Link>.
        </p>
      </div>
    </div>
  );
}

function WeekDayCard({ date, label, kcal, protein, carbs, fat, targets }: {
  date: string; label: string; kcal: number; protein: number; carbs: number; fat: number;
  targets: { kcal: number | null; protein_g: number | null; carbs_g: number | null; fat_g: number | null } | null;
}) {
  const copy = useNutritionCopy();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [glasses, setGlasses] = useState(0);
  const [steps, setSteps] = useState(0);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingSlot, setAddingSlot] = useState<string | null>(null);

  useEffect(() => {
    setGlasses(readWaterGlasses(date));
    try {
      const s = localStorage.getItem(`onyx-steps-${date}`);
      setSteps(s ? Number(s) || 0 : 0);
    } catch { setSteps(0); }
    try { setSaved(!!localStorage.getItem(savedDayKey(date))); } catch { setSaved(false); }
  }, [date, open]);


  const listDay = useServerFn(listDayLog);
  const delFn = useServerFn(deleteLogEntry);
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["nutrition-day", date],
    queryFn: () => listDay({ data: { date } }),
    enabled: open,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["nutrition-day", date] });
    qc.invalidateQueries({ queryKey: ["nutrition-week"] });
  };

  const deleteMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: invalidate,
  });

  const unlockEdits = () => {
    try { localStorage.removeItem(savedDayKey(date)); } catch { /* noop */ }
    setSaved(false);
    setEditing(true);
    toast.success("Day unlocked, add, remove or fix entries and log it again when done.");
  };

  const isToday = date === todayISO();
  const nice = new Date(date + "T00:00:00").toLocaleDateString(copy.dateLocale, { weekday: "short", month: "short", day: "numeric" });
  const pct = targets?.kcal ? Math.min(100, (kcal / targets.kcal) * 100) : 0;
  const hasData = kcal > 0;
  const canEdit = editing || !saved;

  return (
    <div className={`rounded-lg border ${saved ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-onyx-100/40"} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 p-2.5 text-left transition-colors hover:bg-onyx-100/70 sm:gap-3 sm:p-3"
      >
        <div className={`h-9 w-9 shrink-0 rounded-md grid place-items-center text-xs font-bold ${hasData ? "bg-electric/15 text-electric" : "bg-onyx-100 text-muted-foreground"}`}>
          {label.slice(0, 3)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{nice}</p>
            {saved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {hasData ? `${kcal.toFixed(0)} kcal · P${protein.toFixed(0)}g C${carbs.toFixed(0)}g F${fat.toFixed(0)}g` : copy.week.nothingLogged}
              {glasses > 0 && ` · ${glasses * WATER_GLASS_ML}ml ${copy.water.toLowerCase()}`}
              {steps > 0 && ` · ${steps.toLocaleString()} ${copy.stepsUnit}`}
          </p>

          {targets?.kcal && hasData && (
            <div className="mt-1.5 h-1 rounded-full bg-onyx-100 overflow-hidden">
              <div className="h-full bg-electric" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-border/50 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center min-[390px]:grid-cols-4">
            {[
              { l: "kcal", v: kcal.toFixed(0), t: targets?.kcal ?? null, tone: "text-electric" },
              { l: copy.protein, v: `${protein.toFixed(0)}g`, t: targets?.protein_g ?? null, tone: "text-rose-400" },
              { l: copy.carbs, v: `${carbs.toFixed(0)}g`, t: targets?.carbs_g ?? null, tone: "text-amber-400" },
              { l: copy.fat, v: `${fat.toFixed(0)}g`, t: targets?.fat_g ?? null, tone: "text-sky-400" },
            ].map((s) => (
              <div key={s.l} className="min-w-0 rounded-md border border-border/50 bg-onyx-50 p-2">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                <p className={`text-sm font-bold ${s.tone}`}>{s.v}</p>
                {s.t != null && <p className="text-[9px] text-muted-foreground">/ {s.t.toFixed(0)}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-md border border-border/50 bg-onyx-50 p-3 min-[380px]:grid-cols-[auto_minmax(0,1fr)_auto]">
            <Droplet className="h-4 w-4 text-sky-400" fill="currentColor" />
            <div className="min-w-0">
              <p className="text-xs font-semibold">{copy.water}</p>
              <p className="text-[11px] text-muted-foreground">{glasses} {copy.of} {WATER_TOTAL_GLASSES} {copy.glass} · {glasses * WATER_GLASS_ML} ml</p>
            </div>
            <div className="col-span-2 h-1.5 w-full overflow-hidden rounded-full bg-onyx-100 min-[380px]:col-span-1 min-[380px]:w-20">
              <div className="h-full bg-sky-400" style={{ width: `${(glasses / WATER_TOTAL_GLASSES) * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-border/50 bg-onyx-50 p-3">
            <Footprints className="h-4 w-4 text-emerald-400" />
            <div className="min-w-0">
              <p className="text-xs font-semibold">{copy.steps}</p>
              <p className="text-[11px] text-muted-foreground">{steps > 0 ? `${steps.toLocaleString()} ${copy.stepsUnit}` : `0 ${copy.stepsUnit}`}</p>
            </div>
            <p className="text-sm font-bold tabular-nums text-emerald-400">{steps.toLocaleString()}</p>
          </div>


          {/* Edit controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/50 bg-onyx-50 p-2.5">
            <p className="text-[11px] text-muted-foreground">
              {saved
                ? "This day is locked. Unlock to fix meals or add missing food."
                : "Add, edit or remove any meal, changes save right away."}
            </p>
            {saved ? (
              <button
                type="button"
                onClick={unlockEdits}
                className="inline-flex items-center gap-1 rounded-md border border-electric/40 bg-electric/10 px-2.5 py-1.5 text-[11px] font-bold text-electric hover:bg-electric/20"
              >
                <Pencil className="h-3 w-3" /> Edit this day
              </button>
            ) : null}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">Meals</p>
            {isLoading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : (
              <div className="space-y-2">
                {MEAL_SLOTS.map((slot) => {
                  const slotEntries = entries.filter((e) => e.meal_slot === slot.key);
                  const slotKcal = slotEntries.reduce((s, e) => s + e.kcal, 0);
                  return (
                    <div key={slot.key} className="rounded-md bg-onyx-50 p-2">
                      <div className="mb-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                        <p className="text-xs font-bold">{copy.meals[slot.key]}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] text-muted-foreground tabular-nums">{slotKcal.toFixed(0)} kcal</p>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => setAddingSlot(slot.key)}
                              className="inline-flex items-center gap-0.5 rounded bg-electric px-1.5 py-0.5 text-[10px] font-bold text-onyx-50 hover:bg-electric-glow"
                              title={`Add food to ${copy.meals[slot.key]}`}
                            >
                              <Plus className="h-3 w-3" /> Add
                            </button>
                          )}
                        </div>
                      </div>
                      {slotEntries.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">{copy.week.nothingLoggedShort}</p>
                      ) : (
                        <ul className="space-y-0.5">
                          {slotEntries.map((e) => (
                            <li key={e.id} className="text-[11px] text-muted-foreground flex items-center justify-between gap-2">
                              <span className="truncate">{e.name}</span>
                              <span className="flex items-center gap-2 shrink-0">
                                <span className="tabular-nums">{e.kcal.toFixed(0)} kcal</span>
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Remove "${e.name}" from ${copy.meals[slot.key]}?`)) deleteMut.mutate(e.id);
                                    }}
                                    aria-label={`Delete ${e.name}`}
                                    className="p-0.5 text-muted-foreground hover:text-red-400"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {addingSlot && (
        <AddFoodDialog
          date={date}
          slot={addingSlot}
          onClose={() => setAddingSlot(null)}
          onLogged={invalidate}
        />
      )}
    </div>
  );
}


function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card min-w-0 rounded-xl p-3 sm:p-4">
      <p className="truncate text-[9px] uppercase text-muted-foreground sm:text-[10px] sm:tracking-wider">{label}</p>
      <p className="mt-1 truncate font-display text-base font-bold sm:text-xl">{value}</p>
    </div>
  );
}

// ============================================================
// Paywall, locked preview for non-members
// ============================================================
function NutritionPaywall() {
  const { openCheckout, loading: checkoutLoading } = useCheckout();
  const monthlyPriceId = useStripePriceId("monthly");
  const yearlyPriceId = useStripePriceId("yearly");
  const lifetimePriceId = useStripePriceId("lifetime");
  const prices = usePrices();
  const monthlyIntro = usePrice("monthlyIntro");

  const isIOS = Capacitor.getPlatform() === "ios";

  const features = [
    { icon: Utensils, title: "Full food diary", desc: "Log every meal, breakfast, lunch, dinner, snacks, with a searchable database of 120+ foods." },
    { icon: Flame, title: "Calories + macros, live", desc: "Watch your calories, protein, carbs and fat update in real time as you log." },
    { icon: Target, title: "Set your own goals", desc: "Personal daily targets for calories and every macro, tuned to your body and phase." },
    { icon: BarChart3, title: "Weekly progress chart", desc: "See the last 7 days of intake against your goal so you know exactly where you stand." },
    { icon: Apple, title: "Save your own foods", desc: "Add grandma's stew or your protein shake once, reuse it forever with one tap." },
    { icon: CalendarCheck, title: "Log recipes in one tap", desc: "Every Onyx recipe has a Log this meal button, no typing, no guessing." },
  ];

  const plans = [
    { kind: "monthly" as const, priceId: monthlyPriceId, label: "Monthly", price: monthlyIntro, sub: "first month", perks: ["Cancel anytime", "Full nutrition tracker", "All programs & meal plans", "Onyx app included", "All future drops"] },
    { kind: "yearly" as const, priceId: yearlyPriceId, label: "Yearly", price: prices.yearly, sub: "per year", perks: [...(!isIOSNative() ? [`Or split in 3× ${prices.yearly3x}`] : []), "Full nutrition tracker", "All programs & meal plans", "Onyx app included", "All future drops"], highlight: true, savings: "Save 55%+ vs monthly" },
    { kind: "lifetime" as const, priceId: lifetimePriceId, label: "Lifetime", price: prices.lifetime, originalPrice: prices.bundleOriginal, sub: "one-time payment", savings: "Save 55%", perks: ["Pay once, keep forever", "Full nutrition tracker", "All programs & meal plans", "Onyx app included", "All future drops forever"] },
  ];

  return (
    <div className="min-h-screen bg-onyx-50 pb-24">
      <header className="border-b border-border/60 bg-gradient-to-b from-electric/10 to-transparent">
        <div className="container-onyx py-8 md:py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-onyx-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-electric backdrop-blur">
            <Lock className="h-3.5 w-3.5" /> Members only
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold">Your food diary, unlocked with any Onyx membership</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Track every meal, hit your macros, and see your week alongside your training. Included in Monthly, Yearly and Lifetime, nothing extra to buy.
          </p>
        </div>
      </header>

      <div className="container-onyx pt-8 space-y-8">
        {/* Preview screenshot */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-onyx-100 p-6 md:p-8">
          <div className="grid md:grid-cols-[1fr_260px] gap-6 opacity-90 pointer-events-none select-none">
            <div className="space-y-3">
              {["Breakfast · 520 kcal", "Lunch · 780 kcal", "Dinner · 640 kcal", "Snacks · 210 kcal"].map((s) => (
                <div key={s} className="rounded-xl border border-border/60 bg-onyx-50 p-4">
                  <p className="font-display font-bold text-sm">{s.split(" · ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{s.split(" · ")[1]} · 3 items</p>
                  <div className="mt-2 h-1.5 rounded-full bg-onyx-100 overflow-hidden">
                    <div className="h-full bg-electric" style={{ width: `${40 + Math.random() * 50}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/60 bg-onyx-50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Today</p>
              <p className="mt-1 font-display text-3xl font-bold text-electric">2,150 <span className="text-sm text-muted-foreground">kcal</span></p>
              <div className="mt-2 h-2 rounded-full bg-onyx-100 overflow-hidden">
                <div className="h-full bg-electric" style={{ width: "78%" }} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[{l:"P",v:"142g"},{l:"C",v:"235g"},{l:"F",v:"68g"}].map((m) => (
                  <div key={m.l} className="rounded-md border border-border/60 bg-onyx-100/40 p-2">
                    <p className="text-[10px] text-muted-foreground">{m.l}</p>
                    <p className="text-xs font-bold">{m.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-onyx-50 via-onyx-50/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-onyx-50 border border-electric/40 px-4 py-2 text-xs font-semibold text-electric">
              <Sparkles className="h-3.5 w-3.5" /> Live preview, unlock to start logging
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-onyx-100 p-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-electric/10 text-electric ring-1 ring-electric/30">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-electric/30 bg-gradient-to-br from-electric/10 via-onyx-100 to-onyx-100 p-6 md:p-8">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-electric">Onyx Membership</div>
            <div className="mt-1 font-display text-xl font-bold md:text-2xl">Pick your plan to unlock Nutrition</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Every plan unlocks the food diary, plus every training program, meal plan and future release.
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.kind}
                className={`relative flex flex-col rounded-xl border p-5 ${plan.highlight ? "border-electric bg-onyx-50/80 ring-1 ring-electric/40" : "border-border bg-onyx-50/60"}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-electric px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-onyx-50 shadow-electric">
                    Most Popular
                  </span>
                )}
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-lg font-bold">{plan.label}</div>
                  {plan.savings && (
                    <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric">{plan.savings}</span>
                  )}
                </div>
                {plan.kind === "monthly" ? (
                  <>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.sub}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      then <span className="text-foreground/80">{prices.monthly}/mo</span>
                    </div>
                  </>
                ) : plan.kind === "lifetime" ? (
                  <>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">{plan.originalPrice}</span>
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold">{plan.price}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{plan.sub}</div>
                  </>
                ) : (
                  <>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold">{plan.price}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{plan.sub}</div>
                  </>
                )}
                <ul className="mt-3 space-y-1.5 text-sm">
                  {plan.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={checkoutLoading}
                  onClick={() =>
                    openCheckout({
                      priceId: plan.priceId,
                      productSlug: plan.kind === "lifetime" ? "all_access_lifetime" : plan.kind === "yearly" ? "all_access_yearly" : "all_access_monthly",
                      successUrl: `${window.location.origin}/my-nutrition?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
                      ...(plan.kind === "monthly" ? { firstMonthDiscount: true } : {}),
                    })
                  }
                  className={`mt-5 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${plan.highlight ? "bg-electric text-onyx-50 hover:bg-electric-glow shadow-electric" : "border border-electric/40 text-electric hover:bg-electric/10"} disabled:opacity-60`}
                >
                  {checkoutLoading ? "Loading…" : `Get ${plan.label}`}
                </button>
                {plan.kind === "monthly" && (
                  <div className="mt-2 text-[10px] text-center text-emerald-300 font-semibold">
                    50% off first month
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link to="/meal-plans" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Or browse meal plans first
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Progress view, weight tracking + calorie trend
// ============================================================
import { listMeasurements, addMeasurement, deleteMeasurement, type MeasurementRow } from "@/lib/engagement-extra";

function ProgressView() {
  const copy = useNutritionCopy();
  const p = copy.progress;
  const qc = useQueryClient();
  const [weight, setWeight] = useState<string>("");
  const [date, setDate] = useState(todayISO());
  const [notes, setNotes] = useState("");
  const [range, setRange] = useState<30 | 90 | 365>(90);

  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ["measurements"],
    queryFn: () => listMeasurements(),
  });

  // Also pull calorie history for the same range
  const startISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - (range - 1));
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }, [range]);
  const listWeek = useServerFn(listWeekLog);
  const { data: calRows = [] } = useQuery({
    queryKey: ["nutrition-range", startISO, todayISO()],
    queryFn: () => listWeek({ data: { startDate: startISO, endDate: todayISO() } }),
  });

  const addMut = useMutation({
    mutationFn: async () => {
      const w = parseFloat(weight);
      if (!w || w < 20 || w > 400) throw new Error(p.invalidWeight);
      await addMeasurement({ measured_on: date, weight_kg: w, notes: notes || null });
    },
    onSuccess: () => {
      toast.success(p.weightLogged);
      setWeight("");
      setNotes("");
      qc.invalidateQueries({ queryKey: ["measurements"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : p.failed),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteMeasurement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["measurements"] }),
  });

  // Filter weight points to range, oldest → newest
  const weightPoints = useMemo(() => {
    return measurements
      .filter((m) => m.weight_kg != null && m.measured_on >= startISO)
      .map((m) => ({ date: m.measured_on, value: Number(m.weight_kg) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [measurements, startISO]);

  // Aggregate calories per day in range
  const calPoints = useMemo(() => {
    const byDay = new Map<string, number>();
    for (const r of calRows) {
      byDay.set(r.logged_date, (byDay.get(r.logged_date) ?? 0) + r.kcal);
    }
    return Array.from(byDay.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [calRows]);

  const first = weightPoints[0];
  const last = weightPoints[weightPoints.length - 1];
  const delta = first && last ? last.value - first.value : 0;
  const avgKcal = calPoints.length ? calPoints.reduce((s, p) => s + p.value, 0) / calPoints.length : 0;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Log form */}
      <div className="surface-card max-w-full rounded-xl p-3 sm:p-5">
        <h3 className="font-display font-bold mb-3">{p.logWeight}</h3>
        <div className="grid min-w-0 grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">{p.weightKg}</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min={20}
              max={400}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={p.weightPlaceholder}
              className="mt-1 w-full min-w-0 rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">{p.date}</label>
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full min-w-0 rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
            />
          </div>
          <div className="min-[380px]:col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted-foreground">{p.note}</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={p.notePlaceholder}
              className="mt-1 w-full min-w-0 rounded-md border border-border bg-onyx-100 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end min-[380px]:col-span-2 sm:col-span-1">
            <button
              onClick={() => addMut.mutate()}
              disabled={addMut.isPending || !weight}
              className="w-full rounded-md bg-electric px-5 py-2.5 text-sm font-bold text-onyx-50 hover:bg-electric-glow disabled:opacity-60"
            >
              {addMut.isPending ? p.saving : p.logWeightBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Range selector */}
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.range}</span>
        {([30, 90, 365] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              range === r ? "border-electric bg-electric/10 text-electric" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === 30 ? p.days30 : r === 90 ? p.months3 : p.year1}
          </button>
        ))}
      </div>


      {/* Summary cards */}
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <StatCard label={p.currentWeight} value={last ? `${last.value.toFixed(1)} kg` : "-"} />
        <StatCard label={p.startOfRange} value={first ? `${first.value.toFixed(1)} kg` : "-"} />
        <StatCard
          label={p.change}
          value={first && last ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} kg` : "-"}
        />
        <StatCard label={p.avgDailyCalories} value={avgKcal ? `${avgKcal.toFixed(0)} kcal` : "-"} />
      </div>

      {/* Weight chart */}
      <div className="surface-card max-w-full rounded-xl p-3 sm:p-5">
        <h3 className="font-display font-bold mb-4">{p.weightTrend}</h3>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{p.loading}</p>
        ) : weightPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {p.noWeightYet}
          </p>
        ) : (
          <LineChart points={weightPoints} unit="kg" color="var(--electric, #00e5ff)" />
        )}
      </div>

      {/* Calorie chart */}
      <div className="surface-card max-w-full rounded-xl p-3 sm:p-5">
        <h3 className="font-display font-bold mb-4">{p.caloriesOverTime}</h3>
        {calPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{p.noCaloriesYet}</p>
        ) : (
          <LineChart points={calPoints} unit="kcal" color="var(--electric, #00e5ff)" />
        )}
      </div>

      {/* History list */}
      {measurements.length > 0 && (
        <div className="surface-card max-w-full overflow-hidden rounded-xl">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-display font-bold">{p.weightHistory}</h3>
          </div>
          <ul className="divide-y divide-border/40 max-h-80 overflow-y-auto">
            {measurements.filter((m) => m.weight_kg != null).map((m) => (
              <li key={m.id} className="flex min-w-0 items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {Number(m.weight_kg).toFixed(1)} kg
                    <span className="ml-2 text-xs text-muted-foreground">{m.measured_on}</span>
                  </p>
                  {m.notes && <p className="text-xs text-muted-foreground truncate">{m.notes}</p>}
                </div>
                <button
                  onClick={() => delMut.mutate(m.id)}
                  aria-label={p.deleteEntry}
                  className="text-muted-foreground hover:text-red-400 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LineChart({ points, unit, color }: { points: { date: string; value: number }[]; unit: string; color: string }) {
  const W = 720;
  const H = 220;
  const PAD_L = 44;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 28;
  const iw = W - PAD_L - PAD_R;
  const ih = H - PAD_T - PAD_B;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.1 || Math.max(1, max * 0.05);
  const yMin = Math.max(0, min - pad);
  const yMax = max + pad;

  const times = points.map((p) => new Date(p.date).getTime());
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const span = tMax - tMin || 1;

  const x = (t: number) => PAD_L + (points.length === 1 ? iw / 2 : ((t - tMin) / span) * iw);
  const y = (v: number) => PAD_T + ih - ((v - yMin) / (yMax - yMin || 1)) * ih;

  const coords = points.map((p) => ({ px: x(new Date(p.date).getTime()), py: y(p.value), ...p }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.px.toFixed(1)} ${c.py.toFixed(1)}`).join(" ");
  const area = `${path} L ${coords[coords.length - 1].px.toFixed(1)} ${(PAD_T + ih).toFixed(1)} L ${coords[0].px.toFixed(1)} ${(PAD_T + ih).toFixed(1)} Z`;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / ticks);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56" role="img" aria-label={`${unit} trend`}>
        <defs>
          <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((v, i) => {
          const py = y(v);
          return (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={py} y2={py} stroke="currentColor" strokeOpacity="0.08" />
              <text x={PAD_L - 6} y={py + 4} textAnchor="end" className="fill-muted-foreground" fontSize="10">
                {v.toFixed(unit === "kg" ? 1 : 0)}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#lc-fill)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.px} cy={c.py} r={3} fill={color}>
            <title>{`${c.date}: ${c.value.toFixed(unit === "kg" ? 1 : 0)} ${unit}`}</title>
          </circle>
        ))}
        <text x={PAD_L} y={H - 6} className="fill-muted-foreground" fontSize="10">
          {fmtDate(points[0].date)}
        </text>
        <text x={W - PAD_R} y={H - 6} textAnchor="end" className="fill-muted-foreground" fontSize="10">
          {fmtDate(points[points.length - 1].date)}
        </text>
      </svg>
    </div>
  );
}

function BurnedDialog(props: { date: string; current: number; onClose: () => void; onSave: (v: number) => void }) {
  const copy = useNutritionCopy();
  return (
    <ManualKcalDialog
      {...props}
      title={copy.burnedTitle}
      eyebrow={copy.manualLog}
      label={copy.kcalBurned}
      hint={copy.burnedHint}
    />
  );
}

function ManualKcalDialog({
  date,
  current,
  title,
  eyebrow,
  label,
  hint,
  onClose,
  onSave,
}: {
  date: string;
  current: number;
  title: string;
  eyebrow: string;
  label: string;
  hint: string;
  onClose: () => void;
  onSave: (v: number) => void;
}) {
  const copy = useNutritionCopy();
  const [val, setVal] = useState<number>(current);
  const quick = [100, 200, 300, 500];
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-onyx-50 p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{eyebrow}</p>
            <h3 className="mt-0.5 font-display text-lg font-bold">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-onyx-100" aria-label={copy.close}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
        <input
          type="number"
          min={0}
          value={Number.isFinite(val) ? val : 0}
          onChange={(e) => setVal(Math.max(0, Number(e.target.value) || 0))}
          className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-lg font-bold focus:border-electric focus:outline-none"
          autoFocus
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => setVal((v) => (Number(v) || 0) + q)}
              className="rounded-full border border-border bg-onyx-100 px-3 py-1 text-xs font-semibold hover:border-electric hover:text-electric"
            >
              +{q}
            </button>
          ))}
          <button
            onClick={() => setVal(0)}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {copy.reset}
          </button>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">{hint}</p>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-onyx-100">
            {copy.cancel}
          </button>
          <button onClick={() => onSave(val)} className="flex-1 rounded-md bg-electric px-4 py-2 text-sm font-bold text-onyx-50 hover:bg-electric/90">
            {copy.save}
          </button>
        </div>
      </div>
    </div>
  );
}


function StepsDialog({
  date,
  current,
  title,
  eyebrow,
  label,
  unit,
  hint,
  onClose,
  onSave,
}: {
  date: string;
  current: number;
  title: string;
  eyebrow: string;
  label: string;
  unit: string;
  hint: string;
  onClose: () => void;
  onSave: (v: number) => void;
}) {
  const copy = useNutritionCopy();
  const [val, setVal] = useState<number>(current);
  const quick = [1000, 2500, 5000, 10000];
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 p-3 sm:p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-onyx-50 p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">{eyebrow}</p>
            <h3 className="mt-0.5 font-display text-lg font-bold">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-onyx-100" aria-label={copy.close}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} ({unit})
        </label>
        <input
          type="number"
          min={0}
          value={Number.isFinite(val) ? val : 0}
          onChange={(e) => setVal(Math.max(0, Number(e.target.value) || 0))}
          className="mt-1 w-full rounded-md border border-border bg-onyx-100 px-3 py-2 text-lg font-bold focus:border-electric focus:outline-none"
          autoFocus
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => setVal((v) => (Number(v) || 0) + q)}
              className="rounded-full border border-border bg-onyx-100 px-3 py-1 text-xs font-semibold hover:border-electric hover:text-electric"
            >
              +{q.toLocaleString()}
            </button>
          ))}
          <button
            onClick={() => setVal(0)}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {copy.reset}
          </button>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">{hint}</p>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-onyx-100">
            {copy.cancel}
          </button>
          <button onClick={() => onSave(val)} className="flex-1 rounded-md bg-electric px-4 py-2 text-sm font-bold text-onyx-50 hover:bg-electric/90">
            {copy.save}
          </button>
        </div>
      </div>
    </div>
  );
}
