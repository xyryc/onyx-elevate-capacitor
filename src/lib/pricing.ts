import { useLang } from "@/i18n/LanguageProvider";

export type PriceKey =
  | "monthly"
  | "monthlyIntro"
  | "yearly"
  | "yearly3x"
  | "lifetime"
  | "bundle"
  | "bundleOriginal"
  | "program"
  | "mealPlan";

type Currency = "usd" | "brl" | "eur" | "nok";

function currencyFromLang(lang: string): Currency {
  if (lang === "pt-BR") return "brl";
  if (lang === "no") return "nok";
  if (lang === "es") return "eur";
  return "usd";
}

// Display prices per language, mirroring Stripe prices we created.
const PRICES: Record<PriceKey, Record<string, string>> = {
  monthly: {
    en: "$12.99",
    "pt-BR": "R$ 29,99",
    es: "€11.99",
    no: "99 kr",
  },
  monthlyIntro: {
    en: "$6.99",
    "pt-BR": "R$ 14,99",
    es: "€5.99",
    no: "49 kr",
  },
  yearly: {
    en: "$89",
    "pt-BR": "R$ 499",
    es: "€79",
    no: "899 kr",
  },
  yearly3x: {
    en: "3× $30",
    "pt-BR": "3× R$ 167",
    es: "3× €27",
    no: "3× 300 kr",
  },
  lifetime: {
    en: "$129",
    "pt-BR": "R$ 799",
    es: "€119",
    no: "1299 kr",
  },
  bundle: {
    en: "$129",
    "pt-BR": "R$ 799",
    es: "€119",
    no: "1299 kr",
  },
  bundleOriginal: {
    en: "$258",
    "pt-BR": "R$ 1598",
    es: "€238",
    no: "2598 kr",
  },
  // Legacy aliases pointing at the monthly subscription price.
  program: {
    en: "$12.99",
    "pt-BR": "R$ 29,99",
    es: "€11.99",
    no: "99 kr",
  },
  mealPlan: {
    en: "$12.99",
    "pt-BR": "R$ 29,99",
    es: "€11.99",
    no: "99 kr",
  },
};

export function getPrice(key: PriceKey, lang: string): string {
  return PRICES[key][lang] ?? PRICES[key].en;
}

export function usePrice(key: PriceKey): string {
  const { lang } = useLang();
  return getPrice(key, lang);
}

export function usePrices() {
  const { lang } = useLang();
  return {
    monthly: getPrice("monthly", lang),
    yearly: getPrice("yearly", lang),
    yearly3x: getPrice("yearly3x", lang),
    lifetime: getPrice("lifetime", lang),
    bundle: getPrice("bundle", lang),
    bundleOriginal: getPrice("bundleOriginal", lang),
    program: getPrice("monthly", lang),
    mealPlan: getPrice("monthly", lang),
  };
}

// ---------- Stripe price-id helpers ----------
// Maps a product kind + user's language to the Stripe lookup_key we created.

type ProductKind = "lifetime" | "monthly" | "yearly";

const PRODUCT_ID: Record<ProductKind, string> = {
  lifetime: "all_access_lifetime",
  monthly: "all_access_monthly",
  yearly: "all_access_yearly",
};

export function getStripePriceId(kind: ProductKind, lang: string): string {
  return `${PRODUCT_ID[kind]}_${currencyFromLang(lang)}`;
}

export function useStripePriceId(kind: ProductKind): string {
  const { lang } = useLang();
  return getStripePriceId(kind, lang);
}
