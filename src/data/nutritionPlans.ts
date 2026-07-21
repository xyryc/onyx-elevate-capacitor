import proteinBowl from "@/assets/recipe-protein-bowl.jpg";
import salmon from "@/assets/recipe-salmon.jpg";
import oats from "@/assets/recipe-oats.jpg";
import beefStirfry from "@/assets/recipe-beef-stirfry.jpg";
import parfait from "@/assets/recipe-parfait.jpg";

export const NUTRITION_PRICE_BRL = 14.99;

export type Macros = { kcal: number; p: number; c: number; f: number };

export interface Meal {
  id: string;
  slot: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  name: string;
  recipe?: string; // human description / quick recipe
  ingredients: string[];
  macros: Macros;
}

export interface DayTemplate {
  id: string;
  label: string; // e.g. "Push Day"
  mealIds: string[];
}

export interface WeekPlan {
  week: number; // 1..8
  focus: string;
  coachNote: string;
  /** 7 day template IDs - one per day */
  dayIds: string[];
}

export interface NutritionPlan {
  slug: string;
  title: string;
  tagline: string;
  goal: "Fat Loss" | "Lean Muscle" | "Mass Bulk";
  calorieRange: string; // "1200-1500"
  targetMacros: { protein: string; carbs: string; fat: string };
  durationWeeks: number;
  difficulty: "Beginner Friendly" | "Intermediate" | "Advanced";
  priceBRL: number;
  priceId: string;
  image: string;
  heroPitch: string;
  whoItsFor: string[];
  whatYouGet: string[];
  groceryStaples: string[];
  cookingTips: string[];
  weeks: WeekPlan[];
  dayTemplates: DayTemplate[];
  meals: Meal[];
}

/* ============================================================
   PLAN 1 - LEAN CUT (Fat Loss) - 1,200-1,500 kcal
   ============================================================ */

const fatLossMeals: Meal[] = [
  {
    id: "fl-b1",
    slot: "Breakfast",
    name: "Egg White Veggie Scramble + Berries",
    recipe:
      "Whisk 4 egg whites + 1 whole egg. Saute spinach, tomato, onion in 1 tsp olive oil. Fold in eggs. Serve with 1 cup berries.",
    ingredients: [
      "4 egg whites",
      "1 whole egg",
      "1 cup spinach",
      "1/2 tomato",
      "1/4 onion",
      "1 tsp olive oil",
      "1 cup mixed berries",
    ],
    macros: { kcal: 240, p: 28, c: 18, f: 7 },
  },
  {
    id: "fl-b2",
    slot: "Breakfast",
    name: "Greek Yogurt Power Parfait",
    recipe:
      "Layer 200g 0% Greek yogurt with 1/2 banana, 20g granola, 1 tbsp chia, drizzle of honey.",
    ingredients: [
      "200g 0% Greek yogurt",
      "1/2 banana",
      "20g granola",
      "1 tbsp chia seeds",
      "1 tsp honey",
    ],
    macros: { kcal: 290, p: 26, c: 38, f: 5 },
  },
  {
    id: "fl-b3",
    slot: "Breakfast",
    name: "Overnight Protein Oats",
    recipe:
      "Mix 40g oats, 1 scoop whey, 200ml almond milk, 1 tsp cocoa, cinnamon. Fridge overnight. Top with raspberries.",
    ingredients: [
      "40g rolled oats",
      "1 scoop whey protein",
      "200ml unsweetened almond milk",
      "1 tsp cocoa",
      "Cinnamon",
      "1/2 cup raspberries",
    ],
    macros: { kcal: 310, p: 30, c: 36, f: 5 },
  },
  {
    id: "fl-l1",
    slot: "Lunch",
    name: "Grilled Chicken Power Bowl",
    recipe:
      "120g grilled chicken breast, 80g cooked quinoa, mixed greens, cucumber, cherry tomatoes, 1/4 avocado, lemon-tahini drizzle.",
    ingredients: [
      "120g chicken breast",
      "80g cooked quinoa",
      "Mixed greens",
      "Cucumber",
      "Cherry tomatoes",
      "1/4 avocado",
      "1 tsp tahini",
      "Lemon",
    ],
    macros: { kcal: 430, p: 38, c: 32, f: 14 },
  },
  {
    id: "fl-l2",
    slot: "Lunch",
    name: "Lean Beef & Greens Stir-Fry",
    recipe:
      "100g lean beef strips stir-fried with broccoli, bell pepper, garlic, ginger, low-sodium soy. Serve with 60g jasmine rice.",
    ingredients: [
      "100g lean beef strips",
      "150g broccoli",
      "1/2 bell pepper",
      "Garlic, ginger",
      "1 tbsp low-sodium soy",
      "60g jasmine rice",
      "1 tsp sesame oil",
    ],
    macros: { kcal: 410, p: 32, c: 38, f: 12 },
  },
  {
    id: "fl-l3",
    slot: "Lunch",
    name: "Tuna White Bean Salad",
    recipe:
      "1 can light tuna (in water), 80g cannellini beans, arugula, red onion, cherry tomatoes, 1 tsp olive oil, lemon.",
    ingredients: [
      "1 can light tuna",
      "80g cannellini beans",
      "Handful arugula",
      "Red onion",
      "Cherry tomatoes",
      "1 tsp olive oil",
      "Lemon",
    ],
    macros: { kcal: 350, p: 35, c: 28, f: 8 },
  },
  {
    id: "fl-l4",
    slot: "Lunch",
    name: "Turkey Hummus Wrap",
    recipe:
      "Whole-wheat low-carb tortilla, 100g sliced turkey, 2 tbsp hummus, spinach, cucumber, roasted red pepper.",
    ingredients: [
      "1 low-carb tortilla",
      "100g sliced turkey breast",
      "2 tbsp hummus",
      "Spinach",
      "Cucumber",
      "Roasted red pepper",
    ],
    macros: { kcal: 380, p: 32, c: 30, f: 12 },
  },
  {
    id: "fl-s1",
    slot: "Snack",
    name: "Apple + 15g Almonds",
    recipe: "1 medium apple sliced with 15g raw almonds.",
    ingredients: ["1 medium apple", "15g raw almonds"],
    macros: { kcal: 180, p: 4, c: 22, f: 9 },
  },
  {
    id: "fl-s2",
    slot: "Snack",
    name: "Cottage Cheese + Cucumber",
    recipe: "150g low-fat cottage cheese with sliced cucumber and cracked pepper.",
    ingredients: ["150g low-fat cottage cheese", "1/2 cucumber", "Black pepper"],
    macros: { kcal: 150, p: 22, c: 8, f: 3 },
  },
  {
    id: "fl-s3",
    slot: "Snack",
    name: "Whey Shake + Rice Cake",
    recipe: "1 scoop whey in water + 1 plain rice cake with 1 tsp almond butter.",
    ingredients: ["1 scoop whey protein", "Water", "1 rice cake", "1 tsp almond butter"],
    macros: { kcal: 180, p: 26, c: 12, f: 4 },
  },
  {
    id: "fl-d1",
    slot: "Dinner",
    name: "Baked Salmon, Asparagus, Sweet Potato",
    recipe:
      "Preheat oven to 200°C / 400°F. Rub salmon with lemon and dill, place on parchment. Toss asparagus and cubed sweet potato with 1 tsp olive oil, salt, pepper on the same tray. Bake 15-18 min until salmon flakes and potato is fork-tender.",
    ingredients: [
      "120g salmon fillet",
      "Lemon, dill",
      "150g asparagus",
      "120g sweet potato",
      "1 tsp olive oil",
    ],
    macros: { kcal: 440, p: 32, c: 30, f: 18 },
  },
  {
    id: "fl-d2",
    slot: "Dinner",
    name: "Shrimp Zucchini Pasta",
    recipe:
      "150g shrimp sauteed in garlic + 200g spiralized zucchini + 40g whole-wheat pasta, cherry tomatoes, basil, 1 tsp olive oil.",
    ingredients: [
      "150g shrimp",
      "200g zucchini noodles",
      "40g whole-wheat pasta",
      "Cherry tomatoes",
      "Garlic, basil",
      "1 tsp olive oil",
    ],
    macros: { kcal: 380, p: 34, c: 36, f: 9 },
  },
  {
    id: "fl-d3",
    slot: "Dinner",
    name: "Turkey Chili Bowl",
    recipe:
      "120g lean ground turkey, 80g kidney beans, diced tomatoes, onion, cumin, paprika. Top with 2 tbsp Greek yogurt.",
    ingredients: [
      "120g lean ground turkey",
      "80g kidney beans",
      "1/2 can diced tomatoes",
      "Onion",
      "Cumin, paprika",
      "2 tbsp 0% Greek yogurt",
    ],
    macros: { kcal: 400, p: 38, c: 32, f: 9 },
  },
  {
    id: "fl-d4",
    slot: "Dinner",
    name: "Cod en Papillote + Quinoa Greens",
    recipe:
      "Preheat oven to 200°C / 400°F. Place cod on parchment paper, top with cherry tomatoes, olives, capers, lemon. Fold parchment into a sealed pouch. Bake 12-15 min until cod is opaque and flakes. Serve over quinoa with steamed kale.",
    ingredients: [
      "150g cod",
      "Cherry tomatoes",
      "5 olives",
      "1 tsp capers",
      "70g cooked quinoa",
      "Kale",
      "Lemon, 1 tsp olive oil",
    ],
    macros: { kcal: 410, p: 36, c: 30, f: 12 },
  },
];

const fatLossDays: DayTemplate[] = [
  { id: "fl-da", label: "Higher Carb Day", mealIds: ["fl-b1", "fl-l1", "fl-s1", "fl-d1"] },
  { id: "fl-db", label: "Moderate Carb Day", mealIds: ["fl-b3", "fl-l2", "fl-s2", "fl-d2"] },
  { id: "fl-dc", label: "Higher Fat Day", mealIds: ["fl-b2", "fl-l4", "fl-s3", "fl-d3"] },
  { id: "fl-dd", label: "Rest Day", mealIds: ["fl-b1", "fl-l3", "fl-s1", "fl-d4"] },
  { id: "fl-de", label: "Conditioning Day", mealIds: ["fl-b3", "fl-l1", "fl-s2", "fl-d2"] },
  { id: "fl-df", label: "Weekend Refeed", mealIds: ["fl-b2", "fl-l2", "fl-s3", "fl-d1"] },
  { id: "fl-dg", label: "Easy Sunday", mealIds: ["fl-b1", "fl-l4", "fl-s1", "fl-d4"] },
];

const fatLossWeeks: WeekPlan[] = [
  {
    week: 1,
    focus: "Adapt & Hydrate",
    coachNote: "Hit 3L water daily. Step count target: 8,000+. Don't skip protein.",
    dayIds: ["fl-da", "fl-db", "fl-dc", "fl-dd", "fl-de", "fl-df", "fl-dg"],
  },
  {
    week: 2,
    focus: "Lock the Habit",
    coachNote: "Same meals, prep 2x per week (Sun + Wed). Measure portions with a scale.",
    dayIds: ["fl-db", "fl-da", "fl-dd", "fl-dc", "fl-de", "fl-df", "fl-dg"],
  },
  {
    week: 3,
    focus: "First Adjustment",
    coachNote: "If weight unchanged 7 days, cut snack calories by 50. If down, hold steady.",
    dayIds: ["fl-da", "fl-dc", "fl-db", "fl-dd", "fl-de", "fl-dg", "fl-df"],
  },
  {
    week: 4,
    focus: "Midpoint Refeed",
    coachNote:
      "One full carb day (swap dinner to fl-d2 + extra 60g rice). Resets leptin and training output.",
    dayIds: ["fl-db", "fl-da", "fl-df", "fl-dd", "fl-dc", "fl-de", "fl-dg"],
  },
  {
    week: 5,
    focus: "Push Protein Higher",
    coachNote: "Add an extra 20g whey post-training. Recovery suffers when bodyfat drops.",
    dayIds: ["fl-dc", "fl-db", "fl-da", "fl-dd", "fl-de", "fl-df", "fl-dg"],
  },
  {
    week: 6,
    focus: "Sharpen Discipline",
    coachNote: "Zero alcohol week. Track everything. Photos at the end of the week.",
    dayIds: ["fl-da", "fl-db", "fl-dc", "fl-dd", "fl-de", "fl-df", "fl-dg"],
  },
  {
    week: 7,
    focus: "Final Push",
    coachNote: "Lower starchy carb portions by 20g on rest days only. Keep training fueled.",
    dayIds: ["fl-db", "fl-dc", "fl-da", "fl-dd", "fl-de", "fl-dg", "fl-df"],
  },
  {
    week: 8,
    focus: "Reveal Week",
    coachNote: "Maintain protein. Sodium normal. Sleep 8h+ for the reveal. Photos Sunday AM.",
    dayIds: ["fl-da", "fl-db", "fl-dc", "fl-dd", "fl-de", "fl-df", "fl-dg"],
  },
];

const fatLossPlan: NutritionPlan = {
  slug: "lean-cut-8-week",
  title: "Onyx Lean Cut",
  tagline: "8 weeks. 1,200-1,500 kcal. Strip body fat without losing muscle.",
  goal: "Fat Loss",
  calorieRange: "1,200-1,500 kcal/day",
  targetMacros: { protein: "140-160g", carbs: "110-140g", fat: "35-45g" },
  durationWeeks: 8,
  difficulty: "Beginner Friendly",
  priceBRL: NUTRITION_PRICE_BRL,
  priceId: "nutrition_fatloss_one_time",
  image: salmon,
  heroPitch:
    "Built for women and men who want a clean, sustainable cut. High protein keeps muscle on while you lose fat. No starvation, no fads - real food, real plates, every day.",
  whoItsFor: [
    "Women and men targeting visible fat loss in 8 weeks",
    "Anyone returning to training after a break",
    "Lifters who want to see abs without crashing energy",
    "Beginners who need structure, not guesswork",
  ],
  whatYouGet: [
    "8 weeks of daily meal plans (4 meals/day)",
    "Macro-locked recipes with full ingredient lists",
    "Smart weekly progression - not the same week 8 times",
    "Mid-program refeed protocol",
    "Grocery staples & batch-prep tips",
    "Coach notes for every week",
  ],
  groceryStaples: [
    "Chicken breast, lean ground turkey, lean beef, white fish, salmon",
    "Egg whites + whole eggs",
    "0% Greek yogurt, low-fat cottage cheese, whey protein",
    "Quinoa, jasmine rice, rolled oats, sweet potato, low-carb tortillas",
    "Spinach, broccoli, kale, asparagus, zucchini, peppers, cucumber",
    "Berries, apples, banana, lemon",
    "Olive oil, tahini, almond butter, raw almonds",
  ],
  cookingTips: [
    "Batch cook 3 proteins on Sunday: chicken, ground turkey, salmon.",
    "Pre-portion snacks into baggies so you grab and go.",
    "Always weigh rice, oats and oils dry - eyeballing kills cuts.",
    "Drink water 20 min before each meal to manage hunger.",
  ],
  weeks: fatLossWeeks,
  dayTemplates: fatLossDays,
  meals: fatLossMeals,
};

/* ============================================================
   PLAN 2 - LEAN MUSCLE (Recomp) - 1,800-2,200 kcal
   ============================================================ */

const leanMeals: Meal[] = [
  {
    id: "lm-b1",
    slot: "Breakfast",
    name: "3-Egg Avocado Toast + Fruit",
    recipe: "3 eggs scrambled, 2 slices sourdough, 1/2 avocado, side of berries.",
    ingredients: [
      "3 eggs",
      "2 slices sourdough",
      "1/2 avocado",
      "1 cup mixed berries",
      "Salt, pepper, chives",
    ],
    macros: { kcal: 540, p: 28, c: 50, f: 22 },
  },
  {
    id: "lm-b2",
    slot: "Breakfast",
    name: "Protein Pancakes + Banana",
    recipe:
      "Blend 50g oats, 1 scoop whey, 1 banana, 3 egg whites, 1 tsp baking powder. Cook in non-stick. Top with 1 tbsp peanut butter.",
    ingredients: [
      "50g oats",
      "1 scoop whey protein",
      "1 banana",
      "3 egg whites",
      "1 tsp baking powder",
      "1 tbsp peanut butter",
    ],
    macros: { kcal: 510, p: 42, c: 58, f: 12 },
  },
  {
    id: "lm-b3",
    slot: "Breakfast",
    name: "Greek Yogurt Granola Bowl",
    recipe: "300g 2% Greek yogurt, 40g granola, 1/2 cup blueberries, 1 tbsp honey, 10g almonds.",
    ingredients: [
      "300g 2% Greek yogurt",
      "40g granola",
      "1/2 cup blueberries",
      "1 tbsp honey",
      "10g almonds",
    ],
    macros: { kcal: 480, p: 32, c: 60, f: 11 },
  },
  {
    id: "lm-l1",
    slot: "Lunch",
    name: "Chicken Pesto Pasta Bowl",
    recipe:
      "150g grilled chicken, 90g cooked whole-wheat pasta, 1 tbsp pesto, cherry tomatoes, spinach, parmesan.",
    ingredients: [
      "150g chicken breast",
      "90g cooked whole-wheat pasta",
      "1 tbsp pesto",
      "Cherry tomatoes",
      "Handful spinach",
      "10g parmesan",
    ],
    macros: { kcal: 610, p: 48, c: 60, f: 18 },
  },
  {
    id: "lm-l2",
    slot: "Lunch",
    name: "Steak & Sweet Potato Plate",
    recipe:
      "Preheat oven to 220°C / 425°F. Toss sweet potato wedges with 1 tsp olive oil, salt, pepper, paprika. Roast 25-30 min, flipping halfway. Sear flank steak in a hot pan 3-4 min per side to medium, rest 5 min before slicing. Serve with salad, olive oil, balsamic.",
    ingredients: [
      "150g flank steak",
      "200g sweet potato",
      "Mixed greens",
      "Tomato, cucumber",
      "1 tbsp olive oil",
      "Balsamic",
    ],
    macros: { kcal: 620, p: 42, c: 55, f: 22 },
  },
  {
    id: "lm-l3",
    slot: "Lunch",
    name: "Salmon Poke Bowl",
    recipe:
      "120g cooked salmon over 120g jasmine rice, edamame, cucumber, carrot, 1/2 avocado, soy-sesame drizzle.",
    ingredients: [
      "120g salmon",
      "120g cooked jasmine rice",
      "60g edamame",
      "Cucumber",
      "Carrot",
      "1/2 avocado",
      "1 tbsp soy sauce",
      "1 tsp sesame oil",
    ],
    macros: { kcal: 640, p: 36, c: 58, f: 24 },
  },
  {
    id: "lm-l4",
    slot: "Lunch",
    name: "Quinoa Chickpea Mediterranean Bowl",
    recipe:
      "120g cooked quinoa, 100g chickpeas, cherry tomatoes, cucumber, olives, 60g feta, 1 tbsp olive oil, lemon.",
    ingredients: [
      "120g cooked quinoa",
      "100g chickpeas",
      "Cherry tomatoes",
      "Cucumber",
      "8 olives",
      "60g feta",
      "1 tbsp olive oil",
      "Lemon",
    ],
    macros: { kcal: 590, p: 26, c: 62, f: 24 },
  },
  {
    id: "lm-s1",
    slot: "Snack",
    name: "Whey Shake + Banana",
    recipe: "1.5 scoops whey blended with 1 banana + 250ml low-fat milk.",
    ingredients: ["1.5 scoops whey", "1 banana", "250ml low-fat milk"],
    macros: { kcal: 340, p: 38, c: 38, f: 5 },
  },
  {
    id: "lm-s2",
    slot: "Snack",
    name: "Rice Cakes + Cottage Cheese + Berries",
    recipe: "3 rice cakes topped with 150g cottage cheese and strawberries.",
    ingredients: ["3 plain rice cakes", "150g cottage cheese", "1/2 cup strawberries"],
    macros: { kcal: 280, p: 24, c: 36, f: 3 },
  },
  {
    id: "lm-s3",
    slot: "Snack",
    name: "Hummus Veggie Plate + Pita",
    recipe: "60g hummus, 1 small whole-wheat pita, carrots, cucumber, bell pepper sticks.",
    ingredients: [
      "60g hummus",
      "1 small whole-wheat pita",
      "Carrot sticks",
      "Cucumber",
      "Bell pepper",
    ],
    macros: { kcal: 320, p: 12, c: 42, f: 12 },
  },
  {
    id: "lm-d1",
    slot: "Dinner",
    name: "Lean Beef Bolognese over Penne",
    recipe:
      "150g lean ground beef, 1 cup marinara, garlic, onion, served over 90g cooked penne. Side of green salad.",
    ingredients: [
      "150g lean ground beef",
      "1 cup marinara sauce",
      "90g cooked penne",
      "Garlic, onion",
      "Green salad",
      "1 tsp olive oil",
    ],
    macros: { kcal: 620, p: 44, c: 65, f: 16 },
  },
  {
    id: "lm-d2",
    slot: "Dinner",
    name: "Teriyaki Chicken Rice Bowl",
    recipe:
      "150g chicken thigh (skinless), 120g cooked rice, broccoli, carrots, 1 tbsp low-sodium teriyaki, sesame seeds.",
    ingredients: [
      "150g chicken thigh, skinless",
      "120g cooked jasmine rice",
      "150g broccoli",
      "Carrots",
      "1 tbsp low-sodium teriyaki",
      "Sesame seeds",
    ],
    macros: { kcal: 580, p: 42, c: 60, f: 16 },
  },
  {
    id: "lm-d3",
    slot: "Dinner",
    name: "Shrimp Tacos (3)",
    recipe:
      "150g shrimp seasoned with chili-lime, 3 corn tortillas, slaw, 2 tbsp Greek yogurt-lime sauce, side of black beans.",
    ingredients: [
      "150g shrimp",
      "3 corn tortillas",
      "Slaw mix",
      "2 tbsp 2% Greek yogurt",
      "Lime",
      "100g black beans",
    ],
    macros: { kcal: 560, p: 42, c: 65, f: 12 },
  },
  {
    id: "lm-d4",
    slot: "Dinner",
    name: "Baked Salmon Greens Plate",
    recipe:
      "Preheat oven to 220°C / 425°F. Halve baby potatoes, toss with 1 tsp olive oil, salt, rosemary. Roast 20 min. Push potatoes aside, place salmon (skin-down) on the tray, drizzle with lemon and olive oil. Roast a further 10-12 min until salmon is cooked through. Serve over greens.",
    ingredients: ["150g salmon", "200g baby potatoes", "Mixed greens", "Lemon", "1 tbsp olive oil"],
    macros: { kcal: 620, p: 40, c: 50, f: 24 },
  },
];

const leanDays: DayTemplate[] = [
  { id: "lm-da", label: "Higher Carb Day", mealIds: ["lm-b1", "lm-l1", "lm-s1", "lm-d1"] },
  { id: "lm-db", label: "Moderate Carb Day", mealIds: ["lm-b2", "lm-l2", "lm-s2", "lm-d2"] },
  { id: "lm-dc", label: "Higher Fat Day", mealIds: ["lm-b2", "lm-l3", "lm-s1", "lm-d4"] },
  { id: "lm-dd", label: "Active Recovery", mealIds: ["lm-b3", "lm-l4", "lm-s3", "lm-d3"] },
  { id: "lm-de", label: "Conditioning Day", mealIds: ["lm-b1", "lm-l1", "lm-s2", "lm-d2"] },
  { id: "lm-df", label: "Weekend Refuel", mealIds: ["lm-b1", "lm-l2", "lm-s1", "lm-d1"] },
  { id: "lm-dg", label: "Easy Sunday", mealIds: ["lm-b3", "lm-l4", "lm-s3", "lm-d4"] },
];

const leanWeeks: WeekPlan[] = [
  {
    week: 1,
    focus: "Establish Surplus",
    coachNote: "Eat at the top of the kcal range on training days, middle on rest days. Sleep 8h.",
    dayIds: ["lm-da", "lm-db", "lm-dc", "lm-dd", "lm-de", "lm-df", "lm-dg"],
  },
  {
    week: 2,
    focus: "Dial in Timing",
    coachNote: "Pre-workout meal 60-90 min out. Whey + carbs within 30 min after lifting.",
    dayIds: ["lm-db", "lm-da", "lm-dd", "lm-dc", "lm-de", "lm-df", "lm-dg"],
  },
  {
    week: 3,
    focus: "Push the Carbs",
    coachNote:
      "Bump rice/pasta portion by 20-30g on training days. Track waist - should hold steady.",
    dayIds: ["lm-da", "lm-dc", "lm-db", "lm-dd", "lm-de", "lm-dg", "lm-df"],
  },
  {
    week: 4,
    focus: "Strength Check-In",
    coachNote:
      "Test top sets in your main lifts. If they're up, the food is working. Add 1 snack on legs day if not.",
    dayIds: ["lm-db", "lm-da", "lm-df", "lm-dd", "lm-dc", "lm-de", "lm-dg"],
  },
  {
    week: 5,
    focus: "Protein Distribution",
    coachNote: "Aim for ~40g protein per meal. Don't skip the post-training shake.",
    dayIds: ["lm-dc", "lm-db", "lm-da", "lm-dd", "lm-de", "lm-df", "lm-dg"],
  },
  {
    week: 6,
    focus: "Sleep & Recovery",
    coachNote:
      "8h+ in bed, screens off 60 min prior, magnesium glycinate. Recovery is the limiter now.",
    dayIds: ["lm-da", "lm-db", "lm-dc", "lm-dd", "lm-de", "lm-df", "lm-dg"],
  },
  {
    week: 7,
    focus: "Volume Week",
    coachNote: "Extra rice cake snack on training days. Carbs drive volume tolerance.",
    dayIds: ["lm-db", "lm-dc", "lm-da", "lm-dd", "lm-de", "lm-dg", "lm-df"],
  },
  {
    week: 8,
    focus: "Show Off the Work",
    coachNote: "Hold the line. Take measurements: waist, biceps, chest, thighs. Photos Sunday AM.",
    dayIds: ["lm-da", "lm-db", "lm-dc", "lm-dd", "lm-de", "lm-df", "lm-dg"],
  },
];

const leanPlan: NutritionPlan = {
  slug: "lean-muscle-8-week",
  title: "Onyx Lean Muscle",
  tagline: "8 weeks. 1,800-2,200 kcal. Build lean muscle while staying defined.",
  goal: "Lean Muscle",
  calorieRange: "1,800-2,200 kcal/day",
  targetMacros: { protein: "170-200g", carbs: "200-260g", fat: "55-70g" },
  durationWeeks: 8,
  difficulty: "Intermediate",
  priceBRL: NUTRITION_PRICE_BRL,
  priceId: "nutrition_lean_muscle_one_time",
  image: proteinBowl,
  heroPitch:
    "The recomposition sweet spot. Enough food to push hard sessions and grow lean tissue - not so much you lose your waistline. Bowls, pasta, lean meats, greens, every flavor profile covered.",
  whoItsFor: [
    "Intermediate lifters in a recomp phase",
    "Athletes leaving a cut and entering a build",
    "Anyone training 4-6x/week wanting visible results",
    "Hybrid athletes splitting strength and conditioning",
  ],
  whatYouGet: [
    "8 weeks of structured, training-day-aware meal plans",
    "Pasta, bowls, tacos, steak plates - real variety",
    "Pre/post workout fueling protocol",
    "Weekly progression notes from the coach",
    "Grocery staples + Sunday prep checklist",
    "Macro targets for every single meal",
  ],
  groceryStaples: [
    "Chicken breast & thigh, lean ground beef, flank steak, salmon, shrimp",
    "Whole eggs, egg whites, 2% Greek yogurt, cottage cheese, whey",
    "Sourdough, whole-wheat pasta, jasmine rice, oats, sweet potato, potatoes, corn tortillas, pita",
    "Quinoa, chickpeas, black beans, edamame, kidney beans",
    "Broccoli, spinach, kale, carrots, peppers, cherry tomatoes, cucumber, avocado, mixed greens",
    "Berries, banana, apple, lemon, lime",
    "Olive oil, sesame oil, pesto, marinara, tahini, hummus, peanut butter, almonds",
  ],
  cookingTips: [
    "Cook a tray of rice + a tray of roasted veg every Sunday - half the week is done.",
    "Marinate proteins the night before. 20 min wins.",
    "Use a kitchen scale - 'one scoop' is not a measurement.",
    "Front-load carbs around training, not at midnight.",
  ],
  weeks: leanWeeks,
  dayTemplates: leanDays,
  meals: leanMeals,
};

/* ============================================================
   PLAN 3 - MASS BULK (Clean Bulk) - 2,400-3,000 kcal
   ============================================================ */

const bulkMeals: Meal[] = [
  {
    id: "mb-b1",
    slot: "Breakfast",
    name: "Power Oats + Eggs",
    recipe:
      "80g oats cooked in 300ml milk, 1 scoop whey, 1 banana, 1 tbsp peanut butter. Side of 3 whole eggs scrambled.",
    ingredients: [
      "80g rolled oats",
      "300ml low-fat milk",
      "1 scoop whey",
      "1 banana",
      "1 tbsp peanut butter",
      "3 whole eggs",
    ],
    macros: { kcal: 880, p: 55, c: 95, f: 28 },
  },
  {
    id: "mb-b2",
    slot: "Breakfast",
    name: "Steak & Eggs Breakfast Bowl",
    recipe: "120g steak strips, 3 eggs, 150g potato hash, 1/2 avocado, salsa.",
    ingredients: [
      "120g flank steak",
      "3 whole eggs",
      "150g potato (hash)",
      "1/2 avocado",
      "Salsa",
      "1 tbsp olive oil",
    ],
    macros: { kcal: 820, p: 52, c: 50, f: 42 },
  },
  {
    id: "mb-b3",
    slot: "Breakfast",
    name: "Big Greek Parfait + Bagel",
    recipe:
      "300g 2% Greek yogurt, 60g granola, banana, honey + 1 plain bagel with 1 tbsp peanut butter.",
    ingredients: [
      "300g 2% Greek yogurt",
      "60g granola",
      "1 banana",
      "1 tbsp honey",
      "1 plain bagel",
      "1 tbsp peanut butter",
    ],
    macros: { kcal: 860, p: 42, c: 130, f: 18 },
  },
  {
    id: "mb-l1",
    slot: "Lunch",
    name: "Double Chicken Pesto Pasta",
    recipe:
      "200g grilled chicken, 130g cooked whole-wheat pasta, 1.5 tbsp pesto, sun-dried tomato, 15g parmesan, spinach.",
    ingredients: [
      "200g chicken breast",
      "130g cooked whole-wheat pasta",
      "1.5 tbsp pesto",
      "Sun-dried tomato",
      "15g parmesan",
      "Spinach",
    ],
    macros: { kcal: 820, p: 62, c: 85, f: 22 },
  },
  {
    id: "mb-l2",
    slot: "Lunch",
    name: "Beef & Rice Power Bowl",
    recipe:
      "180g lean ground beef, 150g cooked jasmine rice, black beans, corn, peppers, cheddar, salsa, Greek yogurt.",
    ingredients: [
      "180g lean ground beef",
      "150g cooked jasmine rice",
      "80g black beans",
      "60g corn",
      "Bell peppers",
      "30g cheddar",
      "Salsa",
      "2 tbsp Greek yogurt",
    ],
    macros: { kcal: 870, p: 60, c: 85, f: 26 },
  },
  {
    id: "mb-l3",
    slot: "Lunch",
    name: "Salmon Rice Bowl + Avocado",
    recipe:
      "180g salmon, 150g jasmine rice, edamame, cucumber, carrot, 1 avocado, soy-sesame drizzle.",
    ingredients: [
      "180g salmon",
      "150g cooked rice",
      "80g edamame",
      "Cucumber, carrot",
      "1 whole avocado",
      "1 tbsp soy",
      "1 tsp sesame oil",
    ],
    macros: { kcal: 900, p: 50, c: 75, f: 38 },
  },
  {
    id: "mb-l4",
    slot: "Lunch",
    name: "Chicken Burrito Wrap",
    recipe:
      "Large whole-wheat tortilla, 180g chicken, 100g rice, black beans, peppers, 30g cheese, guac, salsa.",
    ingredients: [
      "1 large whole-wheat tortilla",
      "180g chicken breast",
      "100g cooked rice",
      "80g black beans",
      "Peppers",
      "30g cheese",
      "1 tbsp guacamole",
      "Salsa",
    ],
    macros: { kcal: 820, p: 58, c: 90, f: 20 },
  },
  {
    id: "mb-s1",
    slot: "Snack",
    name: "Mass Shake",
    recipe: "2 scoops whey, 250ml whole milk, 1 banana, 40g oats, 1 tbsp peanut butter blended.",
    ingredients: [
      "2 scoops whey",
      "250ml whole milk",
      "1 banana",
      "40g oats",
      "1 tbsp peanut butter",
    ],
    macros: { kcal: 620, p: 55, c: 65, f: 16 },
  },
  {
    id: "mb-s2",
    slot: "Snack",
    name: "Trail Mix + Cottage Cheese",
    recipe: "200g cottage cheese + 50g trail mix (nuts, seeds, raisins).",
    ingredients: ["200g cottage cheese", "50g trail mix"],
    macros: { kcal: 480, p: 30, c: 30, f: 24 },
  },
  {
    id: "mb-s3",
    slot: "Snack",
    name: "Turkey Avocado Wrap",
    recipe: "1 whole-wheat tortilla, 100g turkey, 1/2 avocado, spinach, mustard.",
    ingredients: [
      "1 whole-wheat tortilla",
      "100g sliced turkey",
      "1/2 avocado",
      "Spinach",
      "Mustard",
    ],
    macros: { kcal: 420, p: 28, c: 40, f: 16 },
  },
  {
    id: "mb-d1",
    slot: "Dinner",
    name: "Big Bolognese Plate",
    recipe:
      "200g lean ground beef, 1 cup marinara, garlic, onion, 130g cooked penne, 15g parmesan, side salad with olive oil.",
    ingredients: [
      "200g lean ground beef",
      "1 cup marinara",
      "130g cooked penne",
      "Garlic, onion",
      "15g parmesan",
      "Salad",
      "1 tbsp olive oil",
    ],
    macros: { kcal: 880, p: 60, c: 95, f: 22 },
  },
  {
    id: "mb-d2",
    slot: "Dinner",
    name: "Teriyaki Chicken Mass Bowl",
    recipe: "200g chicken thigh, 180g cooked rice, broccoli, carrots, 1.5 tbsp teriyaki, sesame.",
    ingredients: [
      "200g chicken thigh",
      "180g cooked jasmine rice",
      "200g broccoli",
      "Carrots",
      "1.5 tbsp teriyaki",
      "Sesame seeds",
    ],
    macros: { kcal: 820, p: 58, c: 90, f: 18 },
  },
  {
    id: "mb-d3",
    slot: "Dinner",
    name: "Steak Frites Plate",
    recipe:
      "Preheat oven to 220°C / 425°F. Cut potatoes into fries, toss with 1 tsp olive oil, salt, paprika. Bake 25-30 min, flipping halfway, until golden. Sear sirloin in a hot pan 3-4 min per side, rest 5 min. Grill asparagus 4-5 min. Plate with chimichurri.",
    ingredients: [
      "180g sirloin steak",
      "250g potatoes (fries)",
      "200g asparagus",
      "1 tbsp chimichurri",
      "1 tbsp olive oil",
    ],
    macros: { kcal: 880, p: 50, c: 80, f: 36 },
  },
  {
    id: "mb-d4",
    slot: "Dinner",
    name: "Salmon Mass Plate",
    recipe:
      "Preheat oven to 220°C / 425°F. Cube sweet potato, toss with 1 tsp olive oil, salt, pepper. Roast 25-30 min. Season salmon with salt, pepper, lemon; pan-sear skin-down 4 min, then transfer to oven for a final 6-8 min. Serve with greens, avocado, olive oil.",
    ingredients: [
      "200g salmon",
      "250g sweet potato",
      "Mixed greens",
      "1/2 avocado",
      "1 tbsp olive oil",
    ],
    macros: { kcal: 860, p: 50, c: 70, f: 38 },
  },
];

const bulkDays: DayTemplate[] = [
  { id: "mb-da", label: "Heavy Fuel Day", mealIds: ["mb-b1", "mb-l1", "mb-s1", "mb-d1"] },
  { id: "mb-db", label: "Volume Fuel Day", mealIds: ["mb-b2", "mb-l2", "mb-s2", "mb-d2"] },
  { id: "mb-dc", label: "Growth Day", mealIds: ["mb-b1", "mb-l3", "mb-s1", "mb-d3"] },
  { id: "mb-dd", label: "Active Recovery", mealIds: ["mb-b3", "mb-l4", "mb-s3", "mb-d4"] },
  { id: "mb-de", label: "Upper Volume Day", mealIds: ["mb-b1", "mb-l1", "mb-s1", "mb-d2"] },
  { id: "mb-df", label: "Lower Volume Day", mealIds: ["mb-b2", "mb-l2", "mb-s2", "mb-d3"] },
  { id: "mb-dg", label: "Rest Day", mealIds: ["mb-b3", "mb-l4", "mb-s3", "mb-d4"] },
];

const bulkWeeks: WeekPlan[] = [
  {
    week: 1,
    focus: "Surplus Foundation",
    coachNote: "Eat every meal. Don't 'almost finish' plates. Weigh in Sat AM.",
    dayIds: ["mb-da", "mb-db", "mb-dc", "mb-dg", "mb-de", "mb-df", "mb-dg"],
  },
  {
    week: 2,
    focus: "Carb Front-Loading",
    coachNote: "Get carbs in before and after every session. Save fats for off-training meals.",
    dayIds: ["mb-db", "mb-da", "mb-dd", "mb-dc", "mb-de", "mb-df", "mb-dg"],
  },
  {
    week: 3,
    focus: "Strength Push",
    coachNote: "If main lifts haven't moved, add an extra Mass Shake on training days.",
    dayIds: ["mb-da", "mb-dc", "mb-db", "mb-dd", "mb-de", "mb-dg", "mb-df"],
  },
  {
    week: 4,
    focus: "Recovery Audit",
    coachNote:
      "Sleep, water, soreness check. If recovery is poor, prioritize whole milk + Greek yogurt for extra calories that digest easy.",
    dayIds: ["mb-db", "mb-da", "mb-df", "mb-dd", "mb-dc", "mb-de", "mb-dg"],
  },
  {
    week: 5,
    focus: "Push Toward Top of Range",
    coachNote:
      "Move to 2,800-3,000 kcal. Bigger lunch, extra rice with dinner. Track waist weekly.",
    dayIds: ["mb-dc", "mb-db", "mb-da", "mb-dd", "mb-de", "mb-df", "mb-dg"],
  },
  {
    week: 6,
    focus: "Protein Distribution",
    coachNote:
      "Aim for 50g+ protein per main meal. Lean meats over fatty cuts to keep digestion easy.",
    dayIds: ["mb-da", "mb-db", "mb-dc", "mb-dd", "mb-de", "mb-df", "mb-dg"],
  },
  {
    week: 7,
    focus: "Volume Spike",
    coachNote: "Heaviest training week. Add a second snack on push and legs days.",
    dayIds: ["mb-db", "mb-dc", "mb-da", "mb-dd", "mb-de", "mb-dg", "mb-df"],
  },
  {
    week: 8,
    focus: "Lock the Gains",
    coachNote:
      "Same calories, dial in form on top sets. Take photos and full measurements Sunday AM.",
    dayIds: ["mb-da", "mb-db", "mb-dc", "mb-dd", "mb-de", "mb-df", "mb-dg"],
  },
];

const bulkPlan: NutritionPlan = {
  slug: "mass-bulk-8-week",
  title: "Onyx Mass Bulk",
  tagline: "8 weeks. 2,400-3,000 kcal. Build serious size with real, clean food.",
  goal: "Mass Bulk",
  calorieRange: "2,400-3,000 kcal/day",
  targetMacros: { protein: "200-240g", carbs: "300-380g", fat: "70-95g" },
  durationWeeks: 8,
  difficulty: "Advanced",
  priceBRL: NUTRITION_PRICE_BRL,
  priceId: "nutrition_mass_bulk_one_time",
  image: beefStirfry,
  heroPitch:
    "A clean, aggressive bulk - not a dirty one. Steak and frites, salmon plates, pasta bolognese, mass shakes. Calories high, quality higher. Built for lifters that want to grow without losing the abs.",
  whoItsFor: [
    "Hardgainers who want to add mass without junk food",
    "Lifters in a hypertrophy block (8-12 weeks)",
    "Strength athletes building toward a meet",
    "Anyone post-cut ready to grow again",
  ],
  whatYouGet: [
    "8 weeks of calorie-dense, high-quality meal plans",
    "Pre/intra/post training fueling system",
    "Steak, salmon, pasta, bowls, recovery shakes",
    "Weekly progression toward the top of the calorie range",
    "Grocery staples + 'easy to eat' tips for big appetites",
    "Coach notes calibrated for hardgainers",
  ],
  groceryStaples: [
    "Chicken breast & thigh, lean ground beef, sirloin, flank steak, salmon, turkey breast",
    "Whole eggs, 2% Greek yogurt, cottage cheese, whole milk, whey protein",
    "Oats, jasmine rice, penne, whole-wheat pasta, sweet potato, potatoes, bagels, tortillas",
    "Black beans, edamame",
    "Broccoli, asparagus, peppers, spinach, mixed greens, carrots, sun-dried tomato",
    "Banana, berries, avocado",
    "Olive oil, sesame oil, peanut butter, pesto, marinara, teriyaki, chimichurri, granola, trail mix",
  ],
  cookingTips: [
    "If appetite is the limiter, blend a Mass Shake instead of a 4th plate.",
    "Cook proteins in olive oil to bump calories without volume.",
    "Salt your food - cramps + flat sessions are usually sodium.",
    "Keep snacks in your bag. Missed meals = missed gains.",
  ],
  weeks: bulkWeeks,
  dayTemplates: bulkDays,
  meals: bulkMeals,
};

export const nutritionPlans: NutritionPlan[] = [fatLossPlan, leanPlan, bulkPlan];

export function findNutritionPlan(slug: string): NutritionPlan | undefined {
  return nutritionPlans.find((p) => p.slug === slug);
}

export function getMealById(plan: NutritionPlan, id: string): Meal | undefined {
  return plan.meals.find((m) => m.id === id);
}

export function getDayById(plan: NutritionPlan, id: string): DayTemplate | undefined {
  return plan.dayTemplates.find((d) => d.id === id);
}

export function sumDayMacros(plan: NutritionPlan, dayId: string): Macros {
  const day = getDayById(plan, dayId);
  if (!day) return { kcal: 0, p: 0, c: 0, f: 0 };
  return day.mealIds.reduce<Macros>(
    (acc, id) => {
      const m = getMealById(plan, id);
      if (!m) return acc;
      return {
        kcal: acc.kcal + m.macros.kcal,
        p: acc.p + m.macros.p,
        c: acc.c + m.macros.c,
        f: acc.f + m.macros.f,
      };
    },
    { kcal: 0, p: 0, c: 0, f: 0 },
  );
}

// silence unused warnings for imports kept available for future use
void oats;
void parfait;
