import type { Recipe } from "@/data/recipes";

export type Allergen =
  | "Peanuts"
  | "Tree Nuts"
  | "Dairy"
  | "Eggs"
  | "Gluten"
  | "Soy"
  | "Fish"
  | "Shellfish"
  | "Sesame"
  | "Sulfites";

const RULES: { allergen: Allergen; patterns: RegExp[] }[] = [
  {
    allergen: "Peanuts",
    patterns: [/\bpeanut/i, /\bPB\b/, /\bpb\s*(powder|fit)\b/i, /\bpb2\b/i],
  },
  {
    allergen: "Tree Nuts",
    patterns: [
      /\balmond/i,
      /\bcashew/i,
      /\bwalnut/i,
      /\bpecan/i,
      /\bpistachio/i,
      /\bhazelnut/i,
      /\bmacadamia/i,
      /\bbrazil nut/i,
      /\bpine nut/i,
      /\bnut butter\b/i,
      /\bmixed nuts\b/i,
      /\bcoconut\b/i,
    ],
  },
  {
    allergen: "Dairy",
    patterns: [
      /\bmilk\b/i,
      /\bcheese\b/i,
      /\bcheddar\b/i,
      /\bparmesan\b/i,
      /\bfeta\b/i,
      /\bmozzarella\b/i,
      /\bricotta\b/i,
      /\byogurt\b/i,
      /\bgreek yogurt\b/i,
      /\bbutter\b/i,
      /\bcream\b/i,
      /\bwhey\b/i,
      /\bcasein\b/i,
      /\bcottage cheese\b/i,
      /\bkefir\b/i,
      /\bghee\b/i,
    ],
  },
  {
    allergen: "Eggs",
    patterns: [/\begg\b/i, /\beggs\b/i, /\begg white/i, /\byolk/i, /\bmayonnaise\b/i, /\bmayo\b/i],
  },
  {
    allergen: "Gluten",
    patterns: [
      /\bwheat\b/i,
      /\bflour\b/i,
      /\bbread\b/i,
      /\btortilla/i,
      /\bwrap\b/i,
      /\bpasta\b/i,
      /\bnoodle/i,
      /\bcouscous\b/i,
      /\bbulgur\b/i,
      /\bbarley\b/i,
      /\brye\b/i,
      /\bsoy sauce\b/i,
      /\bseitan\b/i,
      /\bpanko\b/i,
      /\bbreadcrumb/i,
      /\bpita\b/i,
      /\bbagel\b/i,
      /\bcracker/i,
    ],
  },
  {
    allergen: "Soy",
    patterns: [
      /\bsoy\b/i,
      /\bsoya\b/i,
      /\btofu\b/i,
      /\btempeh\b/i,
      /\bedamame\b/i,
      /\bmiso\b/i,
      /\btamari\b/i,
    ],
  },
  {
    allergen: "Fish",
    patterns: [
      /\bsalmon\b/i,
      /\btuna\b/i,
      /\bcod\b/i,
      /\btilapia\b/i,
      /\btrout\b/i,
      /\bsardine/i,
      /\banchov/i,
      /\bmackerel\b/i,
      /\bfish sauce\b/i,
      /\bchar\b/i,
    ],
  },
  {
    allergen: "Shellfish",
    patterns: [
      /\bshrimp\b/i,
      /\bprawn/i,
      /\bcrab\b/i,
      /\blobster\b/i,
      /\bscallop/i,
      /\bmussel/i,
      /\bclam\b/i,
      /\boyster/i,
      /\bsquid\b/i,
      /\bcalamari\b/i,
    ],
  },
  {
    allergen: "Sesame",
    patterns: [/\bsesame\b/i, /\btahini\b/i],
  },
  {
    allergen: "Sulfites",
    patterns: [/\bwine\b/i, /\bdried apricot/i, /\bmolasses\b/i],
  },
];

// Ingredients that mention an allergen only as a swap/optional note shouldn't trigger.
const NEGATION = /\b(optional|or\s+swap|instead of|alternative|substitute|swap for)\b/i;

export function detectAllergens(recipe: Recipe): Allergen[] {
  const lines: string[] = [];
  for (const group of recipe.ingredients) {
    for (const item of group.items) lines.push(item);
  }
  const found = new Set<Allergen>();
  for (const line of lines) {
    if (NEGATION.test(line)) continue;
    for (const rule of RULES) {
      if (found.has(rule.allergen)) continue;
      if (rule.patterns.some((p) => p.test(line))) found.add(rule.allergen);
    }
  }
  return Array.from(found);
}

export function allergenSummary(list: Allergen[]): string {
  if (list.length === 0) return "No major allergens detected in the listed ingredients.";
  return `Contains: ${list.join(", ")}.`;
}
