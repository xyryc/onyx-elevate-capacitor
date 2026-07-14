// Beginner-friendly definitions for common training/nutrition jargon.
// Rendered by <GlossaryText> as tap-to-define blue words.

import type { Lang } from "@/i18n/translations";

export interface GlossaryEntry {
  /** Canonical term (also the match key, case-insensitive). */
  term: string;
  /** Alternate spellings/aliases that should also be highlighted. */
  aliases?: string[];
  /** Short plain-language definitions, one per language. English is required. */
  definitions: Partial<Record<Lang, string>> & { en: string };
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "hypertrophy",
    definitions: {
      en: "Muscle growth, training to make muscles bigger.",
      no: "Muskelvekst, trening for å gjøre musklene større.",
      "pt-BR": "Crescimento muscular, treino para deixar os músculos maiores.",
      es: "Crecimiento muscular, entrenar para hacer los músculos más grandes.",
    },
  },
  {
    term: "RPE",
    definitions: {
      en: "Rate of Perceived Exertion (1-10). How hard the set felt. RPE 8 = you could do 2 more reps.",
      no: "Opplevd anstrengelse (1-10). Hvor tungt settet føltes. RPE 8 = du kunne tatt 2 reps til.",
      "pt-BR": "Nível de esforço percebido (1-10). RPE 8 = você conseguiria fazer mais 2 repetições.",
      es: "Esfuerzo percibido (1-10). RPE 8 = podrías hacer 2 repeticiones más.",
    },
  },
  {
    term: "RIR",
    definitions: {
      en: "Reps In Reserve, how many more reps you could have done. RIR 2 means you stopped 2 reps short of failure.",
      no: "Reps i reserve, hvor mange reps du hadde igjen. RIR 2 = du stoppet 2 reps før du ikke klarte mer.",
      "pt-BR": "Repetições em reserva. RIR 2 = você parou 2 reps antes da falha.",
      es: "Repeticiones en reserva. RIR 2 = paraste 2 reps antes del fallo.",
    },
  },
  {
    term: "AMRAP",
    definitions: {
      en: "As Many Reps (or Rounds) As Possible in a set time, go until you can't.",
      no: "Så mange reps (eller runder) som mulig innen en gitt tid.",
      "pt-BR": "O máximo de repetições (ou rounds) possível em um tempo dado.",
      es: "Tantas repeticiones (o rondas) como sea posible en un tiempo dado.",
    },
  },
  {
    term: "EMOM",
    definitions: {
      en: "Every Minute On the Minute, start a set at the top of each minute, rest with the time you have left.",
      no: "Hvert minutt, på minuttet, start settet ved starten av hvert minutt, hvil resten av minuttet.",
      "pt-BR": "A cada minuto, no minuto, comece a série no início do minuto e descanse no tempo que sobrar.",
      es: "Cada minuto en el minuto, empieza la serie al inicio del minuto y descansa el tiempo restante.",
    },
  },
  {
    term: "superset",
    aliases: ["supersets"],
    definitions: {
      en: "Two exercises done back-to-back with no rest between them.",
      no: "To øvelser gjort rett etter hverandre uten pause.",
      "pt-BR": "Dois exercícios feitos em sequência sem descanso entre eles.",
      es: "Dos ejercicios hechos seguidos sin descanso entre ellos.",
    },
  },
  {
    term: "drop set",
    aliases: ["dropset", "drop sets", "dropsets"],
    definitions: {
      en: "Do a set to near-failure, drop the weight, keep going. Repeat.",
      no: "Kjør settet nesten til slutt, senk vekten, fortsett.",
      "pt-BR": "Fazer a série quase até a falha, reduzir a carga e continuar.",
      es: "Hacer la serie casi al fallo, bajar el peso y seguir.",
    },
  },
  {
    term: "tempo",
    definitions: {
      en: "How slow or fast you move each part of a rep (e.g. 3 seconds down, 1 second up).",
      no: "Hvor sakte eller raskt du beveger deg i hver del av en rep.",
      "pt-BR": "Ritmo do movimento em cada parte da repetição (ex.: 3s descendo, 1s subindo).",
      es: "Ritmo de cada parte de la repetición (ej.: 3s bajando, 1s subiendo).",
    },
  },
  {
    term: "deload",
    definitions: {
      en: "A lighter week to let your body recover so you can push hard again next week.",
      no: "En lettere uke der kroppen får hvile før du pusher hardt igjen.",
      "pt-BR": "Uma semana mais leve para o corpo se recuperar antes de voltar a treinar pesado.",
      es: "Una semana más ligera para que el cuerpo se recupere antes de volver a entrenar fuerte.",
    },
  },
  {
    term: "PR",
    definitions: {
      en: "Personal Record, your best-ever lift, time, or performance.",
      no: "Personlig rekord, din beste løft, tid eller prestasjon.",
      "pt-BR": "Recorde pessoal, o seu melhor levantamento, tempo ou marca.",
      es: "Récord personal, tu mejor levantamiento, tiempo o marca.",
    },
  },
  {
    term: "1RM",
    definitions: {
      en: "One-Rep Max, the heaviest weight you can lift for a single rep with good form.",
      no: "Én-reps maks, den tyngste vekten du kan løfte én gang med god teknikk.",
      "pt-BR": "Máxima repetição, o peso mais pesado que você levanta uma vez com boa técnica.",
      es: "Máximo de una repetición, el peso más pesado que puedes levantar una vez con buena técnica.",
    },
  },
  {
    term: "compound",
    aliases: ["compound lift", "compound lifts", "compound exercise", "compound exercises"],
    definitions: {
      en: "A big exercise that trains many muscles at once, squat, deadlift, bench, row, overhead press.",
      no: "En stor øvelse som trener mange muskler samtidig, knebøy, markløft, benkpress.",
      "pt-BR": "Um exercício grande que trabalha vários músculos ao mesmo tempo, agachamento, levantamento terra, supino.",
      es: "Un ejercicio grande que trabaja varios músculos a la vez, sentadilla, peso muerto, press banca.",
    },
  },
  {
    term: "isolation",
    aliases: ["isolation exercise", "isolation exercises"],
    definitions: {
      en: "An exercise that focuses on one muscle, bicep curl, leg extension, lateral raise.",
      no: "En øvelse som fokuserer på én muskel, bicepscurl, leg extension.",
      "pt-BR": "Um exercício que foca em um músculo, rosca direta, cadeira extensora.",
      es: "Un ejercicio que aísla un músculo, curl de bíceps, extensión de pierna.",
    },
  },
  {
    term: "warm-up set",
    aliases: ["warmup set", "warm-up sets", "warmup sets"],
    definitions: {
      en: "Lighter sets before your real work, get blood flowing and rehearse the movement.",
      no: "Lettere sett før hovedøkta, få i gang blodet og øv teknikken.",
      "pt-BR": "Séries mais leves antes das séries reais, ativa o corpo e ensaia o movimento.",
      es: "Series más ligeras antes de las series reales, activan el cuerpo y ensayan el movimiento.",
    },
  },
  {
    term: "working set",
    aliases: ["working sets"],
    definitions: {
      en: "The real sets that count, heavy enough to actually cause the training effect.",
      no: "De virkelige settene, tunge nok til å gi treningseffekt.",
      "pt-BR": "As séries que contam, pesadas o suficiente para gerar o efeito do treino.",
      es: "Las series que cuentan, suficientemente pesadas para causar el efecto del entrenamiento.",
    },
  },
  {
    term: "progressive overload",
    definitions: {
      en: "Slowly adding weight, reps, or difficulty over time, the #1 rule to keep making progress.",
      no: "Legg gradvis på vekt, reps eller vanskelighet, regel nr. 1 for framgang.",
      "pt-BR": "Aumentar aos poucos carga, reps ou dificuldade, a regra nº 1 do progresso.",
      es: "Aumentar poco a poco peso, reps o dificultad, la regla nº 1 para progresar.",
    },
  },
  {
    term: "failure",
    aliases: ["muscle failure", "training to failure"],
    definitions: {
      en: "The point where you literally cannot do another rep with good form.",
      no: "Punktet der du ikke klarer én rep til med god teknikk.",
      "pt-BR": "O ponto em que você não consegue mais uma rep com boa técnica.",
      es: "El punto en que no puedes hacer otra rep con buena técnica.",
    },
  },
  {
    term: "rep",
    aliases: ["reps", "repetition", "repetitions"],
    definitions: {
      en: "One full movement of an exercise, one squat down and up = one rep.",
      no: "Én hel bevegelse av øvelsen, ett knebøy ned og opp = én rep.",
      "pt-BR": "Um movimento completo do exercício, descer e subir em um agachamento = 1 rep.",
      es: "Un movimiento completo del ejercicio, bajar y subir una sentadilla = 1 rep.",
    },
  },
  {
    term: "set",
    aliases: ["sets"],
    definitions: {
      en: "A group of reps done in a row before you rest. e.g. \"3 sets of 10\" = 10 reps, rest, 10 reps, rest, 10 reps.",
      no: "En gruppe reps gjort etter hverandre før du hviler.",
      "pt-BR": "Um grupo de repetições feitas seguidas antes de descansar.",
      es: "Un grupo de repeticiones hechas seguidas antes de descansar.",
    },
  },
  {
    term: "cardio",
    definitions: {
      en: "Any exercise that raises your heart rate for a while, running, cycling, rowing, walking uphill.",
      no: "Enhver øvelse som holder pulsen oppe en stund, løping, sykling, roing.",
      "pt-BR": "Qualquer exercício que mantém a frequência cardíaca elevada, corrida, bike, remo.",
      es: "Cualquier ejercicio que mantiene el pulso elevado, correr, bicicleta, remo.",
    },
  },
  {
    term: "macros",
    aliases: ["macronutrients"],
    definitions: {
      en: "The three big nutrients: protein, carbs, and fat. Together they make up your total calories.",
      no: "De tre store næringsstoffene: protein, karbohydrater og fett.",
      "pt-BR": "Os três grandes nutrientes: proteína, carboidrato e gordura.",
      es: "Los tres grandes nutrientes: proteína, carbohidratos y grasa.",
    },
  },
  {
    term: "calorie deficit",
    definitions: {
      en: "Eating less energy than your body uses. Required to lose fat.",
      no: "Å spise mindre energi enn kroppen bruker. Nødvendig for å gå ned i fett.",
      "pt-BR": "Comer menos energia do que o corpo gasta. Necessário para perder gordura.",
      es: "Comer menos energía de la que el cuerpo gasta. Necesario para perder grasa.",
    },
  },
  {
    term: "calorie surplus",
    definitions: {
      en: "Eating more energy than your body uses. Needed to build muscle over time.",
      no: "Å spise mer energi enn kroppen bruker. Trengs for å bygge muskler.",
      "pt-BR": "Comer mais energia do que o corpo gasta. Preciso para ganhar músculo.",
      es: "Comer más energía de la que el cuerpo gasta. Necesario para ganar músculo.",
    },
  },
  {
    term: "protein",
    definitions: {
      en: "The nutrient that repairs and builds muscle. Meat, eggs, fish, dairy, beans, whey powder.",
      no: "Næringsstoffet som bygger og reparerer muskler.",
      "pt-BR": "O nutriente que constrói e repara músculo.",
      es: "El nutriente que construye y repara el músculo.",
    },
  },
  {
    term: "form",
    aliases: ["good form", "proper form"],
    definitions: {
      en: "The correct technique of an exercise, safer joints and better muscle work.",
      no: "Riktig teknikk i øvelsen, trygge ledd og bedre muskelarbeid.",
      "pt-BR": "A técnica correta do exercício, mais seguro para as articulações e melhor trabalho muscular.",
      es: "La técnica correcta del ejercicio, más seguro para las articulaciones.",
    },
  },
  {
    term: "range of motion",
    aliases: ["ROM"],
    definitions: {
      en: "How far you move through an exercise. Full range = all the way down and all the way up.",
      no: "Hvor langt du beveger deg gjennom øvelsen.",
      "pt-BR": "O quanto você percorre no exercício.",
      es: "Cuánto recorres en el ejercicio.",
    },
  },
  {
    term: "rest",
    aliases: ["rest time", "rest period"],
    definitions: {
      en: "The pause between sets. Short rest (30-60s) = pump. Long rest (2-3 min) = strength.",
      no: "Pausen mellom sett. Kort pause = pump. Lang pause = styrke.",
      "pt-BR": "Pausa entre séries. Curta = pump. Longa = força.",
      es: "Pausa entre series. Corta = bombeo. Larga = fuerza.",
    },
  },
  {
    term: "cal",
    aliases: ["cals", "calories on the rower", "kcal on rower"],
    definitions: {
      en: "Calories on the rower or bike, a workload target. 15 cal = keep going until the machine display shows 15 calories.",
      no: "Kalorier på romaskin eller sykkel, et arbeidsmål. 15 cal = ro/sykle til displayet viser 15 kalorier.",
      "pt-BR": "Calorias no remo ou bike, uma meta de trabalho. 15 cal = continue até o painel mostrar 15 calorias.",
      es: "Calorías en el remo o la bici, un objetivo de trabajo. 15 cal = sigue hasta que el marcador muestre 15 calorías.",
    },
  },
  {
    term: "meters",
    aliases: ["metres"],
    definitions: {
      en: "Distance on the rower or sled, 500 m on the rower means row until the screen reads 500 meters.",
      no: "Distanse på romaskin eller slede, 500 m på romaskin betyr å ro til skjermen viser 500 meter.",
      "pt-BR": "Distância no remo ou sled, 500 m no remo significa remar até o painel marcar 500 metros.",
      es: "Distancia en el remo o el trineo, 500 m en el remo significa remar hasta que la pantalla marque 500 metros.",
    },
  },
  {
    term: "sled push",
    aliases: ["sled"],
    definitions: {
      en: "Push a weighted sled across the floor for a set distance. Low body position, drive with the legs.",
      no: "Skyv en vektet slede over gulvet en gitt distanse. Lav kroppsstilling, dytt med beina.",
      "pt-BR": "Empurre um trenó com carga por uma distância. Postura baixa e força nas pernas.",
      es: "Empuja un trineo con peso una distancia dada. Postura baja y empuja con las piernas.",
    },
  },
  {
    term: "rest of the minute",
    aliases: ["rest the remainder", "remainder of the minute"],
    definitions: {
      en: "In an EMOM: finish the reps as fast as you can, then rest for whatever time is left before the next minute starts.",
      no: "I EMOM: gjør ferdig repsene så raskt du kan, hvil resten av minuttet før neste minutt starter.",
      "pt-BR": "No EMOM: complete as reps o mais rápido possível e descanse o tempo que sobrar até o próximo minuto.",
      es: "En un EMOM: termina las reps lo más rápido posible y descansa el tiempo que quede hasta el siguiente minuto.",
    },
  },
];

export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
  const lower = term.toLowerCase();
  return GLOSSARY.find(
    (g) =>
      g.term.toLowerCase() === lower ||
      g.aliases?.some((a) => a.toLowerCase() === lower),
  );
}
