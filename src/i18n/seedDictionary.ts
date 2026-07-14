// Seed dictionary, translations applied INSTANTLY without waiting on AI gateway.
// Add the most visible UI strings here so the page changes language on first paint.
// Keys are the exact English source strings. Values are per-language translations.

type Lang = "pt-BR" | "es" | "no";

export const SEED: Record<string, Partial<Record<Lang, string>>> = {
  // Nav
  "Home": { "pt-BR": "Início", es: "Inicio", no: "Hjem" },
  "Exercises": { "pt-BR": "Exercícios", es: "Ejercicios", no: "Øvelser" },
  "exercises": { "pt-BR": "exercícios", es: "ejercicios", no: "øvelser" },
  "exercise": { "pt-BR": "exercício", es: "ejercicio", no: "øvelse" },
  "Exercise": { "pt-BR": "Exercício", es: "Ejercicio", no: "Øvelse" },
  "Exercise library": { "pt-BR": "Biblioteca de exercícios", es: "Biblioteca de ejercicios", no: "Øvelsesbibliotek" },
  "Exercise Library": { "pt-BR": "Biblioteca de Exercícios", es: "Biblioteca de Ejercicios", no: "Øvelsesbibliotek" },
  "Programs": { "pt-BR": "Programas", es: "Programas", no: "Programmer" },
  "Recipes": { "pt-BR": "Receitas", es: "Recetas", no: "Oppskrifter" },
  "Meal Plans": { "pt-BR": "Planos Alimentares", es: "Planes de comida", no: "Måltidsplaner" },
  "Coaches": { "pt-BR": "Treinadores", es: "Entrenadores", no: "Trenere" },
  "Articles": { "pt-BR": "Artigos", es: "Artículos", no: "Artikler" },
  "Guidelines": { "pt-BR": "Diretrizes", es: "Directrices", no: "Retningslinjer" },
  "Challenges": { "pt-BR": "Desafios", es: "Desafíos", no: "Utfordringer" },
  "Yoga & Mobility": { "pt-BR": "Yoga e Mobilidade", es: "Yoga y Movilidad", no: "Yoga og mobilitet" },
  "App": { "pt-BR": "Aplicativo", es: "App", no: "App" },
  "Quiz": { "pt-BR": "Quiz", es: "Test", no: "Quiz" },
  "Sign in": { "pt-BR": "Entrar", es: "Iniciar sesión", no: "Logg inn" },
  "Sign up": { "pt-BR": "Cadastre-se", es: "Registrarse", no: "Registrer deg" },
  "Sign out": { "pt-BR": "Sair", es: "Cerrar sesión", no: "Logg ut" },
  "My Library": { "pt-BR": "Minha Biblioteca", es: "Mi Biblioteca", no: "Mitt bibliotek" },
  "My Nutrition": { "pt-BR": "Minha Nutrição", es: "Mi Nutrición", no: "Min ernæring" },
  "Nutrition": { "pt-BR": "Nutrição", es: "Nutrición", no: "Ernæring" },
  "Min profil": { "pt-BR": "Meu perfil", es: "Mi perfil", no: "Min profil" },
  "Min ernæring": { "pt-BR": "Minha nutrição", es: "Mi nutrición", no: "Min ernæring" },
  "Mine programmer": { "pt-BR": "Meus programas", es: "Mis programas", no: "Mine programmer" },
  "Grupper": { "pt-BR": "Grupos", es: "Grupos", no: "Grupper" },
  "Logg ut": { "pt-BR": "Sair", es: "Cerrar sesión", no: "Logg ut" },
  "Logget inn som": { "pt-BR": "Conectado como", es: "Conectado como", no: "Logget inn som" },
  "Signed in as": { "pt-BR": "Conectado como", es: "Conectado como", no: "Logget inn som" },
  "Profile": { "pt-BR": "Perfil", es: "Perfil", no: "Profil" },
  "Your account preferences. Settings sync across every device you sign in on.": {
    "pt-BR": "Preferências da sua conta. As configurações sincronizam em todos os dispositivos em que você entra.",
    es: "Preferencias de tu cuenta. La configuración se sincroniza en todos los dispositivos donde inicias sesión.",
    no: "Kontoinnstillingene dine. Innstillinger synkroniseres på alle enheter du logger inn på.",
  },
  "Language": { "pt-BR": "Idioma", es: "Idioma", no: "Språk" },
  "Change": { "pt-BR": "Alterar", es: "Cambiar", no: "Endre" },

  // Buttons / Generic
  "Get started": { "pt-BR": "Começar", es: "Empezar", no: "Kom i gang" },
  "Get Started": { "pt-BR": "Começar", es: "Empezar", no: "Kom i gang" },
  "Open": { "pt-BR": "Abrir", es: "Abrir", no: "Åpne" },
  "Learn more": { "pt-BR": "Saiba mais", es: "Más información", no: "Lær mer" },
  "Read more": { "pt-BR": "Leia mais", es: "Leer más", no: "Les mer" },
  "Search": { "pt-BR": "Buscar", es: "Buscar", no: "Søk" },
  "Filter": { "pt-BR": "Filtrar", es: "Filtrar", no: "Filtrer" },
  "Filters": { "pt-BR": "Filtros", es: "Filtros", no: "Filtre" },
  "Clear": { "pt-BR": "Limpar", es: "Limpiar", no: "Tøm" },
  "Save": { "pt-BR": "Salvar", es: "Guardar", no: "Lagre" },
  // "Back" on this fitness site almost always means the muscle group (rows, pulls, deadlifts).
  // The navigation button uses "Go back" so it can be translated separately.
  "Back": { "pt-BR": "Costas", es: "Espalda", no: "Rygg" },
  "Go back": { "pt-BR": "Voltar", es: "Atrás", no: "Tilbake" },
  "Go back to previous page": { "pt-BR": "Voltar para a página anterior", es: "Volver a la página anterior", no: "Gå tilbake til forrige side" },
  "← Go back": { "pt-BR": "← Voltar", es: "← Atrás", no: "← Tilbake" },
  "Program not found": { "pt-BR": "Programa não encontrado", es: "Programa no encontrado", no: "Programmet ble ikke funnet" },
  "Back to programs": { "pt-BR": "Voltar aos programas", es: "Volver a programas", no: "Tilbake til programmer" },
  "Couldn't load this program.": { "pt-BR": "Não foi possível carregar este programa.", es: "No se pudo cargar este programa.", no: "Kunne ikke laste dette programmet." },
  "Full info": { "pt-BR": "Info completa", es: "Info completa", no: "Full informasjon" },
  "Under training": { "pt-BR": "Em treino", es: "En entrenamiento", no: "Under trening" },
  "In Training": { "pt-BR": "Em treino", es: "En entrenamiento", no: "Under trening" },
  "Onyx Member": { "pt-BR": "Membro Onyx", es: "Miembro Onyx", no: "Onyx-medlem" },
  "on": { "pt-BR": "em", es: "el", no: "den" },
  "active": { "pt-BR": "ativo", es: "activo", no: "aktiv" },
  "Your Dashboard": { "pt-BR": "Seu Painel", es: "Tu Panel", no: "Dashboardet ditt" },
  "Programs Active": { "pt-BR": "Programas ativos", es: "Programas activos", no: "Aktive programmer" },
  "Days Trained": { "pt-BR": "Dias treinados", es: "Días entrenados", no: "Dager trent" },
  "Challenges Done": { "pt-BR": "Desafios concluídos", es: "Desafíos completados", no: "Utfordringer fullført" },
  "Saved Items": { "pt-BR": "Itens salvos", es: "Elementos guardados", no: "Lagrede elementer" },
  "My Challenges": { "pt-BR": "Meus Desafios", es: "Mis Desafíos", no: "Mine utfordringer" },
  "Browse all →": { "pt-BR": "Ver todos →", es: "Ver todos →", no: "Se alle →" },
  "No challenges yet.": { "pt-BR": "Nenhum desafio ainda.", es: "Aún no hay desafíos.", no: "Ingen utfordringer ennå." },
  "Pick one and start a streak.": { "pt-BR": "Escolha um e comece uma sequência.", es: "Elige uno y empieza una racha.", no: "Velg en og start en streak." },
  "Tap the heart on any program, exercise, recipe or challenge to save it here.": {
    "pt-BR": "Toque no coração em qualquer programa, exercício, receita ou desafio para salvar aqui.",
    es: "Toca el corazón en cualquier programa, ejercicio, receta o desafío para guardarlo aquí.",
    no: "Trykk på hjertet på et program, en øvelse, oppskrift eller utfordring for å lagre det her.",
  },

  // Home / library hero surfaces
  "Elite training": { "pt-BR": "Treino de elite", es: "Entrenamiento de élite", no: "Elitetrening" },
  "for": { "pt-BR": "para", es: "para", no: "for" },
  "every athlete.": { "pt-BR": "todo atleta.", es: "cada atleta.", no: "alle utøvere." },
  "From competitive powerlifting to off-season conditioning - find the expert plan, coach and exercise breakdown that fits your goal, in minutes.": {
    "pt-BR": "Do powerlifting competitivo ao condicionamento fora de temporada, encontre em minutos o plano, o treinador e a análise de exercícios que combinam com sua meta.",
    es: "Desde powerlifting competitivo hasta acondicionamiento fuera de temporada: encuentra en minutos el plan experto, el coach y el desglose de ejercicios que encajan con tu objetivo.",
    no: "Fra konkurransestyrkeløft til offseason-kondisjon, finn ekspertplanen, coachen og øvelsesanalysen som passer målet ditt på minutter.",
  },
  "Find your program": { "pt-BR": "Encontre seu programa", es: "Encuentra tu programa", no: "Finn programmet ditt" },
  "Become a member": { "pt-BR": "Torne-se membro", es: "Hazte miembro", no: "Bli medlem" },
  "Not sure where to start?": { "pt-BR": "Não sabe por onde começar?", es: "¿No sabes por dónde empezar?", no: "Usikker på hvor du skal starte?" },
  "Take the 60-second quiz →": { "pt-BR": "Faça o quiz de 60 segundos →", es: "Haz el test de 60 segundos →", no: "Ta 60-sekunders quizen →" },
  "Elite coaches": { "pt-BR": "Treinadores de elite", es: "Entrenadores de élite", no: "Elitetrenere" },
  "training programs": { "pt-BR": "programas de treino", es: "programas de entrenamiento", no: "treningsprogrammer" },
  "Explore by training style": { "pt-BR": "Explore por estilo de treino", es: "Explora por estilo de entrenamiento", no: "Utforsk etter treningsstil" },
  "Choose a training style": { "pt-BR": "Escolha um estilo de treino", es: "Elige un estilo de entrenamiento", no: "Velg en treningsstil" },
  // Exercise library surface
  "Every lift, broken down.": { "pt-BR": "Cada exercício, explicado.", es: "Cada levantamiento, explicado.", no: "Hvert løft, forklart." },
  "500+ exercises across": { "pt-BR": "Mais de 500 exercícios em", es: "Más de 500 ejercicios en", no: "500+ øvelser fordelt på" },
  "categories. Search and filter to find your next lift.": {
    "pt-BR": "categorias. Busque e filtre para encontrar seu próximo exercício.",
    es: "categorías. Busca y filtra para encontrar tu próximo levantamiento.",
    no: "kategorier. Søk og filtrer for å finne neste løft.",
  },
  "Category": { "pt-BR": "Categoria", es: "Categoría", no: "Kategori" },
  "Search exercises…": { "pt-BR": "Buscar exercícios…", es: "Buscar ejercicios…", no: "Søk etter øvelser…" },
  "Muscle group": { "pt-BR": "Grupo muscular", es: "Grupo muscular", no: "Muskelgruppe" },
  "Equipment": { "pt-BR": "Equipamento", es: "Equipo", no: "Utstyr" },
  "Difficulty": { "pt-BR": "Dificuldade", es: "Dificultad", no: "Vanskelighetsgrad" },
  "Type": { "pt-BR": "Tipo", es: "Tipo", no: "Type" },
  "Clear all filters": { "pt-BR": "Limpar todos os filtros", es: "Limpiar todos los filtros", no: "Tøm alle filtre" },
  "free previews per category · sign in to unlock everything": {
    "pt-BR": "pré-visualizações grátis por categoria · entre para desbloquear tudo",
    es: "vistas previas gratis por categoría · inicia sesión para desbloquear todo",
    no: "gratis forhåndsvisninger per kategori · logg inn for å låse opp alt",
  },
  "All exercises stay free, a free account just keeps bots out of the video library.": {
    "pt-BR": "Todos os exercícios continuam grátis, uma conta gratuita só mantém bots fora da biblioteca de vídeos.",
    es: "Todos los ejercicios siguen siendo gratis; una cuenta gratuita solo mantiene los bots fuera de la biblioteca de vídeos.",
    no: "Alle øvelser forblir gratis, en gratis konto holder bare roboter ute av videobiblioteket.",
  },
  "Sign in free": { "pt-BR": "Entrar grátis", es: "Entrar gratis", no: "Logg inn gratis" },
  "Sign in free to unlock": { "pt-BR": "Entre grátis para desbloquear", es: "Inicia sesión gratis para desbloquear", no: "Logg inn gratis for å låse opp" },
  "Sign in, free": { "pt-BR": "Entrar, grátis", es: "Entrar, gratis", no: "Logg inn, gratis" },
  "Members only": { "pt-BR": "Somente membros", es: "Solo miembros", no: "Kun medlemmer" },
  "Every video is part of Onyx membership": {
    "pt-BR": "Cada vídeo faz parte da assinatura Onyx",
    es: "Cada vídeo es parte de la membresía Onyx",
    no: "Hver video er en del av Onyx-medlemskapet",
  },
  "Unlock the full exercise library, programs, quick workouts and nutrition tracker.": {
    "pt-BR": "Desbloqueie a biblioteca completa de exercícios, programas, treinos rápidos e o rastreador de nutrição.",
    es: "Desbloquea la biblioteca completa de ejercicios, programas, entrenamientos rápidos y el rastreador de nutrición.",
    no: "Lås opp hele øvelsesbiblioteket, programmer, hurtigøkter og ernæringssporing.",
  },
  "Unlock": { "pt-BR": "Desbloquear", es: "Desbloquear", no: "Lås opp" },
  "exercise demonstration": { "pt-BR": "demonstração do exercício", es: "demostración del ejercicio", no: "øvelsesdemonstrasjon" },
  "No exercises match these filters.": { "pt-BR": "Nenhum exercício corresponde a estes filtros.", es: "Ningún ejercicio coincide con estos filtros.", no: "Ingen øvelser matcher disse filtrene." },
  "Clear filters →": { "pt-BR": "Limpar filtros →", es: "Limpiar filtros →", no: "Tøm filtre →" },
  "Loading more": { "pt-BR": "Carregando mais", es: "Cargando más", no: "Laster mer" },
  "Don't see an exercise yet?": { "pt-BR": "Ainda não encontrou um exercício?", es: "¿No ves un ejercicio todavía?", no: "Ser du ikke en øvelse ennå?" },
  "It's in the Onyx app →": { "pt-BR": "Está no app Onyx →", es: "Está en la app de Onyx →", no: "Den ligger i Onyx-appen →" },

  // My Nutrition, pinned because this page mixes app labels with user data and must never flash Norwegian in Portuguese.
  "Your food diary & progress": { "pt-BR": "Seu diário alimentar e progresso", es: "Tu diario de comida y progreso", no: "Matdagboken og fremgangen din" },
  "Log every meal, track your weight, and see the full picture, calories, macros and body progress in one place.": {
    "pt-BR": "Registre cada refeição, acompanhe seu peso e veja tudo, calorias, macros e progresso corporal em um só lugar.",
    es: "Registra cada comida, controla tu peso y ve el panorama completo: calorías, macros y progreso corporal en un solo lugar.",
    no: "Logg hvert måltid, følg vekten din og se helheten, kalorier, makroer og kroppsfremgang på ett sted.",
  },
  "Today": { "pt-BR": "Hoje", es: "Hoy", no: "I dag" },
  "This week": { "pt-BR": "Esta semana", es: "Esta semana", no: "Denne uken" },
  "Progress": { "pt-BR": "Progresso", es: "Progreso", no: "Fremgang" },
  "I dag": { "pt-BR": "Hoje", es: "Hoy", no: "I dag" },
  "Denne uken": { "pt-BR": "Esta semana", es: "Esta semana", no: "Denne uken" },
  "Fremgang": { "pt-BR": "Progresso", es: "Progreso", no: "Fremgang" },
  "Kalorier": { "pt-BR": "Calorias", es: "Calorías", no: "Kalorier" },
  "Mål": { "pt-BR": "Meta", es: "Objetivo", no: "Mål" },
  "Spist": { "pt-BR": "Consumido", es: "Consumido", no: "Spist" },
  "Igjen": { "pt-BR": "Restante", es: "Restante", no: "Igjen" },
  "Forbrent": { "pt-BR": "Queimado", es: "Quemado", no: "Forbrent" },
  "kcal left": { "pt-BR": "kcal restantes", es: "kcal restantes", no: "kcal igjen" },
  "of": { "pt-BR": "de", es: "de", no: "av" },
  "Carbs": { "pt-BR": "Carboidratos", es: "Carbohidratos", no: "Karbohydrater" },
  "Protein": { "pt-BR": "Proteína", es: "Proteína", no: "Protein" },
  "Fat": { "pt-BR": "Gordura", es: "Grasa", no: "Fett" },
  "Breakfast": { "pt-BR": "Café da manhã", es: "Desayuno", no: "Frokost" },
  "Lunch": { "pt-BR": "Almoço", es: "Almuerzo", no: "Lunsj" },
  "Dinner": { "pt-BR": "Jantar", es: "Cena", no: "Middag" },
  "Snacks": { "pt-BR": "Lanches", es: "Snacks", no: "Snacks" },
  "Scan": { "pt-BR": "Escanear", es: "Escanear", no: "Skann" },
  "Scan food": { "pt-BR": "Escanear comida", es: "Escanear comida", no: "Skann mat" },
  "Barcode": { "pt-BR": "Código de barras", es: "Código de barras", no: "Strekkode" },
  "Food plate": { "pt-BR": "Prato de comida", es: "Plato de comida", no: "Matrett" },
  "Add": { "pt-BR": "Adicionar", es: "Añadir", no: "Legg til" },
  "Legg til": { "pt-BR": "Adicionar", es: "Añadir", no: "Legg til" },
  "Nothing logged yet.": { "pt-BR": "Nada registrado ainda.", es: "Aún no hay nada registrado.", no: "Ingenting loggført enda." },
  "Nothing logged yet, press Log on a pending item to add it here.": {
    "pt-BR": "Nada registrado ainda, toque em Registrar em um item pendente para adicioná-lo aqui.",
    es: "Aún no hay nada registrado, pulsa Registrar en un elemento pendiente para añadirlo aquí.",
    no: "Ingenting loggført enda, trykk Logg på et ventende element for å legge det til her.",
  },
  "Pending · save until you log or delete": {
    "pt-BR": "Pendente · salvo até você registrar ou excluir",
    es: "Pendiente · guardado hasta que lo registres o elimines",
    no: "Venter · lagret til du logger eller sletter",
  },
  "Log": { "pt-BR": "Registrar", es: "Registrar", no: "Logg" },
  "Logged": { "pt-BR": "Registrado", es: "Registrado", no: "Loggført" },
  "Logging…": { "pt-BR": "Registrando…", es: "Registrando…", no: "Logger…" },
  "Delete entry": { "pt-BR": "Excluir registro", es: "Eliminar registro", no: "Slett oppføring" },
  "Delete pending item": { "pt-BR": "Excluir item pendente", es: "Eliminar elemento pendiente", no: "Slett ventende element" },
  "Previous day": { "pt-BR": "Dia anterior", es: "Día anterior", no: "Forrige dag" },
  "Next day": { "pt-BR": "Próximo dia", es: "Día siguiente", no: "Neste dag" },
  "Tip": { "pt-BR": "Dica", es: "Consejo", no: "Tips" },
  "You can also log a recipe directly, open any recipe and tap": {
    "pt-BR": "Você também pode registrar uma receita diretamente, abra qualquer receita e toque em",
    es: "También puedes registrar una receta directamente: abre cualquier receta y toca",
    no: "Du kan også logge en oppskrift direkte, åpne en oppskrift og trykk på",
  },
  "Log this meal": { "pt-BR": "Registrar esta refeição", es: "Registrar esta comida", no: "Logg dette måltidet" },
  "Water": { "pt-BR": "Água", es: "Agua", no: "Vann" },
  "recipe": { "pt-BR": "receita", es: "receta", no: "oppskrift" },
  "Filter by category": { "pt-BR": "Filtrar por categoria", es: "Filtrar por categoría", no: "Filtrer etter kategori" },
  "Spist - manuelt": { "pt-BR": "Consumido, manual", es: "Consumido, manual", no: "Spist - manuelt" },
  "Forbrente kalorier": { "pt-BR": "Calorias queimadas", es: "Calorías quemadas", no: "Forbrente kalorier" },
  "Logg forbrente kalorier manuelt": { "pt-BR": "Registrar calorias queimadas manualmente", es: "Registrar calorías quemadas manualmente", no: "Logg forbrente kalorier manuelt" },
  "Legg til forbrente kalorier manuelt": { "pt-BR": "Adicionar calorias queimadas manualmente", es: "Añadir calorías quemadas manualmente", no: "Legg til forbrente kalorier manuelt" },
  "kcal spist": { "pt-BR": "kcal consumidas", es: "kcal consumidas", no: "kcal spist" },
  "Legg til kalorier du har spist uten å logge maten. Lagres på denne enheten for denne dagen.": {
    "pt-BR": "Adicione calorias que você consumiu sem registrar o alimento. Salvo neste dispositivo para este dia.",
    es: "Añade calorías que consumiste sin registrar la comida. Se guarda en este dispositivo para este día.",
    no: "Legg til kalorier du har spist uten å logge maten. Lagres på denne enheten for denne dagen.",
  },

  // Muscle groups, pin so AI never confuses them with anatomy translations
  "Chest": { "pt-BR": "Peito", es: "Pecho", no: "Bryst" },
  "Shoulders": { "pt-BR": "Ombros", es: "Hombros", no: "Skuldre" },
  "Biceps": { "pt-BR": "Bíceps", es: "Bíceps", no: "Biceps" },
  "Triceps": { "pt-BR": "Tríceps", es: "Tríceps", no: "Triceps" },
  "Legs": { "pt-BR": "Pernas", es: "Piernas", no: "Bein" },
  "Quads": { "pt-BR": "Quadríceps", es: "Cuádriceps", no: "Lår (quads)" },
  "Hamstrings": { "pt-BR": "Posteriores de coxa", es: "Isquiotibiales", no: "Hamstrings" },
  "Glutes": { "pt-BR": "Glúteos", es: "Glúteos", no: "Rumpe" },
  "Calves": { "pt-BR": "Panturrilhas", es: "Gemelos", no: "Legger" },
  "Core": { "pt-BR": "Core", es: "Core", no: "Kjernemuskulatur" },
  "Full Body": { "pt-BR": "Corpo Inteiro", es: "Cuerpo Completo", no: "Hele Kroppen" },
  "Cardio": { "pt-BR": "Cardio", es: "Cardio", no: "Kondisjon" },

  // Program exercise names, pinned so workout tables match the Norwegian exercise list.
  "Weighted Pull-Up": { "pt-BR": "Barra fixa com peso", es: "Dominada con peso", no: "Pull-up med vekt" },
  "Weighted Pull Up": { "pt-BR": "Barra fixa com peso", es: "Dominada con peso", no: "Pull-up med vekt" },
  "Barbell Row": { "pt-BR": "Remada com barra", es: "Remo con barra", no: "Stangroing" },
  "Chest-Supported Row": { "pt-BR": "Remada com apoio no peito", es: "Remo con pecho apoyado", no: "Bryststøttet roing" },
  "Chest-Supported Row Machine": { "pt-BR": "Remada máquina com apoio no peito", es: "Remo en máquina con pecho apoyado", no: "Bryststøttet romaskin" },
  "Face Pull": { "pt-BR": "Face pull", es: "Face pull", no: "Face pull" },
  "Face Pulls": { "pt-BR": "Face pulls", es: "Face pulls", no: "Face pulls" },
  "Incline DB Curl": { "pt-BR": "Rosca inclinada com halteres", es: "Curl inclinado con mancuernas", no: "Skrå hantelcurl" },
  "Stangbenkpress": { "pt-BR": "Supino com barra", es: "Press banca con barra", no: "Stangbenkpress" },
  "Barbell Bench Press": { "pt-BR": "Supino com barra", es: "Press banca con barra", no: "Stangbenkpress" },
  "Skrå Hantelpress": { "pt-BR": "Supino inclinado com halteres", es: "Press inclinado con mancuernas", no: "Skrå hantelpress" },
  "Incline Dumbbell Press": { "pt-BR": "Supino inclinado com halteres", es: "Press inclinado con mancuernas", no: "Skrå hantelpress" },
  "Sittende DB Skulderpress": { "pt-BR": "Desenvolvimento sentado com halteres", es: "Press de hombro sentado con mancuernas", no: "Sittende hantelpress" },
  "Seated Dumbbell Shoulder Press": { "pt-BR": "Desenvolvimento sentado com halteres", es: "Press de hombro sentado con mancuernas", no: "Sittende hantelpress" },
  "Kabel Sidehev": { "pt-BR": "Elevação lateral no cabo", es: "Elevación lateral en polea", no: "Kabel sidehev" },
  "Cable Lateral Raise": { "pt-BR": "Elevação lateral no cabo", es: "Elevación lateral en polea", no: "Kabel sidehev" },
  "Overhead Tau Triceps": { "pt-BR": "Tríceps overhead com corda", es: "Tríceps overhead con cuerda", no: "Overhead tau-triceps" },
  "Overhead Rope Triceps": { "pt-BR": "Tríceps overhead com corda", es: "Tríceps overhead con cuerda", no: "Overhead tau-triceps" },

  // Groups / chat UI
  "Chats": { "pt-BR": "Chats", es: "Chats", no: "Chatter" },
  "Search or start a new chat": { "pt-BR": "Buscar ou iniciar novo chat", es: "Buscar o iniciar un chat", no: "Søk eller start en ny chat" },
  "Unread": { "pt-BR": "Não lidas", es: "No leídos", no: "Ulest" },
  "Groups": { "pt-BR": "Grupos", es: "Grupos", no: "Grupper" },
  "No chats yet. Tap + to start one.": { "pt-BR": "Nenhum chat ainda. Toque + para começar.", es: "Aún no hay chats. Toca + para empezar.", no: "Ingen chatter ennå. Trykk + for å starte." },
  "Nothing here.": { "pt-BR": "Nada aqui.", es: "Nada aquí.", no: "Ingenting her." },
  "Direct message": { "pt-BR": "Mensagem direta", es: "Mensaje directo", no: "Direktemelding" },
  "No messages yet, send the first one 👋": { "pt-BR": "Nenhuma mensagem ainda, envie a primeira 👋", es: "Aún no hay mensajes, envía el primero 👋", no: "Ingen meldinger ennå, send den første 👋" },
  "Message": { "pt-BR": "Mensagem", es: "Mensaje", no: "Melding" },
  "Group settings": { "pt-BR": "Configurações do grupo", es: "Ajustes del grupo", no: "Gruppeinnstillinger" },
  "New direct message": { "pt-BR": "Nova mensagem direta", es: "Nuevo mensaje directo", no: "Ny direktemelding" },
  "New group": { "pt-BR": "Novo grupo", es: "Nuevo grupo", no: "Ny gruppe" },
  "Group name": { "pt-BR": "Nome do grupo", es: "Nombre del grupo", no: "Gruppenavn" },
  "Invite members (username or email, optional)": { "pt-BR": "Convidar membros (usuário ou email, opcional)", es: "Invitar miembros (usuario o email, opcional)", no: "Inviter medlemmer (brukernavn eller e-post, valgfritt)" },
  "+ Add another": { "pt-BR": "+ Adicionar outro", es: "+ Añadir otro", no: "+ Legg til en til" },
  "Community rules": { "pt-BR": "Regras da comunidade", es: "Reglas de comunidad", no: "Fellesskapsregler" },
  "Cancel": { "pt-BR": "Cancelar", es: "Cancelar", no: "Avbryt" },
  "Start chat": { "pt-BR": "Iniciar chat", es: "Iniciar chat", no: "Start chat" },
  "Create group": { "pt-BR": "Criar grupo", es: "Crear grupo", no: "Opprett gruppe" },
  "Members": { "pt-BR": "Membros", es: "Miembros", no: "Medlemmer" },
  "Owner": { "pt-BR": "Dono", es: "Eier", no: "Eier" },
  "(you)": { "pt-BR": "(você)", es: "(tú)", no: "(deg)" },
  "Remove": { "pt-BR": "Remover", es: "Quitar", no: "Fjern" },
  "Leave group": { "pt-BR": "Sair do grupo", es: "Salir del grupo", no: "Forlat gruppe" },
  "Delete group": { "pt-BR": "Excluir grupo", es: "Eliminar grupo", no: "Slett gruppe" },
  "Choose from library": { "pt-BR": "Escolher da galeria", es: "Elegir de la biblioteca", no: "Velg fra bibliotek" },
  "Take a photo": { "pt-BR": "Tirar foto", es: "Tomar foto", no: "Ta bilde" },
  "Onyx Groups is a Pro feature": { "pt-BR": "Grupos Onyx é um recurso Pro", es: "Grupos Onyx es una función Pro", no: "Onyx Grupper er en Pro-funksjon" },
  "Private group chats and DMs are included with Onyx Pro and All-Access. Invite your training partners, share programs, and stay in sync, no public feed, no strangers.": {
    "pt-BR": "Chats privados em grupo e mensagens diretas estão incluídos no Onyx Pro e All-Access. Convide seus parceiros de treino, compartilhe programas e mantenha tudo sincronizado, sem feed público, sem desconhecidos.",
    es: "Los chats privados de grupo y los DMs están incluidos con Onyx Pro y All-Access. Invita a tus compañeros de entrenamiento, comparte programas y mantente sincronizado: sin feed público, sin desconocidos.",
    no: "Private gruppechatter og DM-er er inkludert med Onyx Pro og All-Access. Inviter treningspartnerne dine, del programmer og hold dere synkronisert, ingen offentlig feed, ingen fremmede.",
  },
  "See membership options": { "pt-BR": "Ver opções de assinatura", es: "Ver opciones de membresía", no: "Se medlemskapsvalg" },
  "Pick a chat to start": { "pt-BR": "Escolha um chat para começar", es: "Elige un chat para empezar", no: "Velg en chat for å starte" },
  "Or start a new group / DM from the left panel.": {
    "pt-BR": "Ou comece um novo grupo / DM no painel esquerdo.",
    es: "O inicia un nuevo grupo / DM desde el panel izquierdo.",
    no: "Eller start en ny gruppe / DM fra venstre panel.",
  },

  // Food terms Gemini has mistranslated (Sirloin ≠ pork)
  "Sirloin": { "pt-BR": "Alcatra", es: "Solomillo de res", no: "Mørbrad av storfe" },
  "Sirloin & Jasmine Rice Power Plate": {
    "pt-BR": "Alcatra e Arroz Jasmim, Prato de Força",
    es: "Solomillo de res y arroz jazmín, plato power",
    no: "Mørbrad av storfe og jasminris, kraftmåltid",
  },
  "Sirloin is leaner than ribeye but still flavor-loaded.": {
    "pt-BR": "A alcatra é mais magra que o ribeye, mas ainda cheia de sabor.",
    es: "El solomillo de res es más magro que el ribeye pero igual de sabroso.",
    no: "Mørbrad av storfe er magrere enn ribeye, men fortsatt full av smak.",
  },
  "Close": { "pt-BR": "Fechar", es: "Cerrar", no: "Lukk" },
  "Next": { "pt-BR": "Próximo", es: "Siguiente", no: "Neste" },
  "Previous": { "pt-BR": "Anterior", es: "Anterior", no: "Forrige" },

  // Coach possessives, auto-translator merges names with Norwegian possessives
  "Lars's top tips": { "pt-BR": "Melhores dicas do Lars", es: "Mejores consejos de Lars", no: "Lars sine beste tips" },
  "Simen's top tips": { "pt-BR": "Melhores dicas do Simen", es: "Mejores consejos de Simen", no: "Simen sine beste tips" },
  "Thiago Deschamps's top tips": { "pt-BR": "Melhores dicas do Thiago Deschamps", es: "Mejores consejos de Thiago Deschamps", no: "Thiago Deschamps sine beste tips" },
  "Nick's top tips": { "pt-BR": "Melhores dicas do Nick", es: "Mejores consejos de Nick", no: "Nick sine beste tips" },
  "Trym's top tips": { "pt-BR": "Melhores dicas do Trym", es: "Mejores consejos de Trym", no: "Trym sine beste tips" },
  "Michael's top tips": { "pt-BR": "Melhores dicas do Michael", es: "Mejores consejos de Michael", no: "Michael sine beste tips" },
  "A week in Lars's training": { "pt-BR": "Uma semana no treinamento do Lars", es: "Una semana en el entrenamiento de Lars", no: "En uke i Lars sin trening" },
  "A week in Simen's training": { "pt-BR": "Uma semana no treinamento do Simen", es: "Una semana en el entrenamiento de Simen", no: "En uke i Simen sin trening" },
  "A week in Thiago Deschamps's training": { "pt-BR": "Uma semana no treinamento do Thiago Deschamps", es: "Una semana en el entrenamiento de Thiago Deschamps", no: "En uke i Thiago Deschamps sin trening" },
  "A week in Nick's training": { "pt-BR": "Uma semana no treinamento do Nick", es: "Una semana en el entrenamiento de Nick", no: "En uke i Nick sin trening" },
  "A week in Trym's training": { "pt-BR": "Uma semana no treinamento do Trym", es: "Una semana en el entrenamiento de Trym", no: "En uke i Trym sin trening" },
  "A week in Michael's training": { "pt-BR": "Uma semana no treinamento do Michael", es: "Una semana en el entrenamiento de Michael", no: "En uke i Michael sin trening" },
  "Loading…": { "pt-BR": "Carregando…", es: "Cargando…", no: "Laster…" },
  "Free": { "pt-BR": "Grátis", es: "Gratis", no: "Gratis" },
  "Premium": { "pt-BR": "Premium", es: "Premium", no: "Premium" },
  "Locked": { "pt-BR": "Bloqueado", es: "Bloqueado", no: "Låst" },
  "Unlocked": { "pt-BR": "Desbloqueado", es: "Desbloqueado", no: "Låst opp" },
  "Active": { "pt-BR": "Ativo", es: "Activo", no: "Aktiv" },
  "Inactive": { "pt-BR": "Inativo", es: "Inactivo", no: "Inaktiv" },
  "Monthly": { "pt-BR": "Mensal", es: "Mensual", no: "Månedlig" },
  "Yearly": { "pt-BR": "Anual", es: "Anual", no: "Årlig" },
  "Lifetime": { "pt-BR": "Vitalício", es: "Vitalicio", no: "Livstid" },
  "Membership & Billing": { "pt-BR": "Assinatura e Pagamento", es: "Membresía y Facturación", no: "Medlemskap og betaling" },
  "1-month subscription": { "pt-BR": "Assinatura de 1 mês", es: "Suscripción de 1 mes", no: "1 måneds abonnement" },
  "1-year subscription": { "pt-BR": "Assinatura de 1 ano", es: "Suscripción de 1 año", no: "1 års abonnement" },
  "Lifetime access": { "pt-BR": "Acesso vitalício", es: "Acceso vitalicio", no: "Livstidstilgang" },
  "No active subscription": { "pt-BR": "Nenhuma assinatura ativa", es: "Sin suscripción activa", no: "Ingen aktivt abonnement" },
  "Manage billing": { "pt-BR": "Gerenciar pagamento", es: "Gestionar facturación", no: "Administrer betaling" },
  "Cancel subscription": { "pt-BR": "Cancelar assinatura", es: "Cancelar suscripción", no: "Avbryt abonnement" },
  "Payment history": { "pt-BR": "Histórico de pagamentos", es: "Historial de pagos", no: "Betalingshistorikk" },
  "No payments yet.": { "pt-BR": "Nenhum pagamento ainda.", es: "Aún no hay pagos.", no: "Ingen betalinger ennå." },
  "Renews": { "pt-BR": "Renova", es: "Renueva", no: "Fornyes" },
  "Ends": { "pt-BR": "Termina", es: "Termina", no: "Slutter" },
  "Never expires, you own Onyx for life.": { "pt-BR": "Nunca expira, você tem Onyx para a vida toda.", es: "Nunca caduca, tienes Onyx de por vida.", no: "Utløper aldri, du eier Onyx livet ut." },
  "Cancel your Onyx subscription?": { "pt-BR": "Cancelar sua assinatura Onyx?", es: "¿Cancelar tu suscripción de Onyx?", no: "Avbryte Onyx-abonnementet ditt?" },
  "You'll keep full access until the end of your current billing period": {
    "pt-BR": "Você mantém acesso total até o fim do período de cobrança atual",
    es: "Mantendrás acceso completo hasta el final de tu periodo de facturación actual",
    no: "Du beholder full tilgang til slutten av gjeldende fakturaperiode",
  },
  "After that your membership will not renew.": { "pt-BR": "Depois disso, sua assinatura não será renovada.", es: "Después de eso tu membresía no se renovará.", no: "Etter det fornyes ikke medlemskapet ditt." },
  "Keep subscription": { "pt-BR": "Manter assinatura", es: "Mantener suscripción", no: "Behold abonnement" },
  "Cancelling…": { "pt-BR": "Cancelando…", es: "Cancelando…", no: "Avbryter…" },
  "Yes, cancel": { "pt-BR": "Sim, cancelar", es: "Sí, cancelar", no: "Ja, avbryt" },
  "Week": { "pt-BR": "Semana", es: "Semana", no: "Uke" },
  "Day": { "pt-BR": "Dia", es: "Día", no: "Dag" },
  "Nutrition · 8 Week Plans": { "pt-BR": "Nutrição · Planos de 8 semanas", es: "Nutrición · Planes de 8 semanas", no: "Ernæring · 8-ukers planer" },
  "Real plates. Real progress.": { "pt-BR": "Pratos reais. Progresso real.", es: "Platos reales. Progreso real.", no: "Ekte måltider. Ekte fremgang." },
  "Pick the plan that matches your goal. Each one is 8 full weeks of meals - breakfast, lunch, snack and dinner - with macros, recipes, grocery lists and weekly coach notes. One-time payment. Yours forever.": {
    "pt-BR": "Escolha o plano que combina com sua meta. Cada um tem 8 semanas completas de refeições, café da manhã, almoço, lanche e jantar, com macros, receitas, lista de compras e notas semanais do coach. Pagamento único. Seu para sempre.",
    es: "Elige el plan que coincide con tu objetivo. Cada uno incluye 8 semanas completas de comidas, desayuno, almuerzo, snack y cena, con macros, recetas, lista de compras y notas semanales del coach. Pago único. Tuyo para siempre.",
    no: "Velg planen som passer målet ditt. Hver plan har 8 hele uker med måltider, frokost, lunsj, snacks og middag, med makroer, oppskrifter, handlelister og ukentlige coach-notater. Engangsbetaling. Din for alltid.",
  },
  "You have full access to every plan.": { "pt-BR": "Você tem acesso total a todos os planos.", es: "Tienes acceso completo a todos los planes.", no: "Du har full tilgang til alle planer." },
  "All plans": { "pt-BR": "Todos os planos", es: "Todos los planes", no: "Alle planer" },
  "Week 1 free preview on every plan": { "pt-BR": "Prévia grátis da semana 1 em todos os planos", es: "Vista previa gratis de la semana 1 en todos los planes", no: "Gratis forhåndsvisning av uke 1 på alle planer" },
  "Your plan": { "pt-BR": "Seu plano", es: "Tu plan", no: "Din plan" },
  "One-time purchase": { "pt-BR": "Compra única", es: "Compra única", no: "Engangskjøp" },
  "How the plans work": { "pt-BR": "Como os planos funcionam", es: "Cómo funcionan los planes", no: "Slik fungerer planene" },
  "Pick your goal": { "pt-BR": "Escolha sua meta", es: "Elige tu objetivo", no: "Velg målet ditt" },
  "Fat loss, lean muscle or mass bulk. Each plan has its own calorie band and macros.": {
    "pt-BR": "Perda de gordura, músculo magro ou ganho de massa. Cada plano tem sua própria faixa de calorias e macros.",
    es: "Pérdida de grasa, músculo magro o volumen. Cada plan tiene su propia franja de calorías y macros.",
    no: "Fettforbrenning, lean muscle eller masseøkning. Hver plan har sitt eget kaloriområde og makroer.",
  },
  "Preview Week 1 free": { "pt-BR": "Veja a semana 1 grátis", es: "Previsualiza la semana 1 gratis", no: "Forhåndsvis uke 1 gratis" },
  "Open the plan and see all 7 days of Week 1 with full recipes - no payment needed.": {
    "pt-BR": "Abra o plano e veja todos os 7 dias da semana 1 com receitas completas, sem precisar pagar.",
    es: "Abre el plan y mira los 7 días de la semana 1 con recetas completas, sin pagar.",
    no: "Åpne planen og se alle 7 dagene i uke 1 med fulle oppskrifter, ingen betaling nødvendig.",
  },
  "Unlock Weeks 2-8": { "pt-BR": "Desbloqueie as semanas 2-8", es: "Desbloquea las semanas 2-8", no: "Lås opp uke 2-8" },
  "Secure checkout. Instant access in your browser.": { "pt-BR": "Checkout seguro. Acesso instantâneo no navegador.", es: "Pago seguro. Acceso instantáneo en tu navegador.", no: "Sikker betaling. Umiddelbar tilgang i nettleseren." },
  "Cook, eat, train": { "pt-BR": "Cozinhe, coma, treine", es: "Cocina, come, entrena", no: "Lag mat, spis, tren" },
  "Daily meals, macros, grocery staples, and a coach note for every week of the plan.": {
    "pt-BR": "Refeições diárias, macros, itens de mercado e uma nota do coach para cada semana do plano.",
    es: "Comidas diarias, macros, básicos de compra y una nota del coach para cada semana del plan.",
    no: "Daglige måltider, makroer, handlevarer og et coach-notat for hver uke av planen.",
  },
  "One-time": { "pt-BR": "Pagamento único", es: "Pago único", no: "Engangskjøp" },
  "one-time": { "pt-BR": "pagamento único", es: "pago único", no: "engangskjøp" },
  "View plan →": { "pt-BR": "Ver plano →", es: "Ver plan →", no: "Se planen →" },
  "Unlock full program": { "pt-BR": "Desbloquear programa completo", es: "Desbloquear programa completo", no: "Lås opp hele programmet" },
  "Opening checkout…": { "pt-BR": "Abrindo checkout…", es: "Abriendo pago…", no: "Åpner kassen…" },
  "free preview": { "pt-BR": "prévia grátis", es: "vista previa gratis", no: "gratis forhåndsvisning" },
  "Weeks": { "pt-BR": "Semanas", es: "Semanas", no: "Uker" },
  "weeks unlocked": { "pt-BR": "semanas desbloqueadas", es: "semanas desbloqueadas", no: "uker låst opp" },
  "Day-by-day schedule below": { "pt-BR": "cronograma dia a dia abaixo", es: "calendario día a día abajo", no: "dag-for-dag plan under" },
  "unlock after purchase": { "pt-BR": "desbloqueiam após a compra", es: "se desbloquean después de la compra", no: "låses opp etter kjøp" },
  "1 week plan": { "pt-BR": "plano de 1 semana", es: "plan de 1 semana", no: "1 ukes plan" },
  "week plan plural": { "pt-BR": "semanas de plano", es: "semanas de plan", no: "ukers plan" },
  "Unlock Week": { "pt-BR": "Desbloquear semana", es: "Desbloquear semana", no: "Lås opp uke" },
  "include progressive overload, intensity tweaks and new exercise variations so you never repeat the same week twice. One payment. Lifetime access on your account.": {
    "pt-BR": "incluem sobrecarga progressiva, ajustes de intensidade e novas variações de exercícios para você nunca repetir a mesma semana duas vezes. Um pagamento. Acesso vitalício na sua conta.",
    es: "incluyen sobrecarga progresiva, ajustes de intensidad y nuevas variaciones de ejercicios para que nunca repitas la misma semana dos veces. Un pago. Acceso de por vida en tu cuenta.",
    no: "inkluderer progressiv overbelastning, justeringer av intensitet og nye øvelsesvarianter så du aldri gjentar samme uke to ganger. Én betaling. Livstidstilgang på kontoen din."
  },
  "follows the same template as Week 1 with progressive overload applied, open the Onyx app to log your sets and see the exact loads for this week.": {
    "pt-BR": "segue o mesmo modelo da semana 1 com sobrecarga progressiva aplicada, abra o app Onyx para registrar suas séries e ver as cargas exatas desta semana.",
    es: "sigue la misma plantilla que la semana 1 con sobrecarga progresiva aplicada, abre la app de Onyx para registrar tus series y ver las cargas exactas de esta semana.",
    no: "følger samme mal som uke 1 med progressiv overbelastning, åpne Onyx-appen for å logge settene dine og se de nøyaktige vektene for denne uken."
  },
  "Secure checkout": { "pt-BR": "Pagamento seguro", es: "Pago seguro", no: "Sikker betaling" },
  "Instant access": { "pt-BR": "Acesso instantâneo", es: "Acceso instantáneo", no: "Umiddelbar tilgang" },
  "No subscription": { "pt-BR": "Sem assinatura", es: "Sin suscripción", no: "Ingen abonnement" },
  "Secure checkout · Instant access · No subscription": {
    "pt-BR": "Pagamento seguro · Acesso instantâneo · Sem assinatura",
    es: "Pago seguro · Acceso instantáneo · Sin suscripción",
    no: "Sikker betaling · Umiddelbar tilgang · Ingen abonnement",
  },

  // Bundle / Pricing surface
  "Onyx All Access Bundle": { "pt-BR": "Pacote Onyx All Access", es: "Pack Onyx All Access", no: "Onyx All Access-pakke" },
  "Unlock everything →": { "pt-BR": "Desbloqueie tudo →", es: "Desbloquéalo todo →", no: "Lås opp alt →" },
  "Secure payment · 30-day refund": {
    "pt-BR": "Pagamento seguro · Reembolso em 30 dias",
    es: "Pago seguro · Reembolso de 30 días",
    no: "Sikker betaling · 30-dagers refusjon",
  },

  // Common labels
  "Beginner": { "pt-BR": "Iniciante", es: "Principiante", no: "Nybegynner" },
  "Intermediate": { "pt-BR": "Intermediário", es: "Intermedio", no: "Middels" },
  "Advanced": { "pt-BR": "Avançado", es: "Avanzado", no: "Avansert" },
  "All": { "pt-BR": "Todos", es: "Todos", no: "Alle" },
  "All Levels": { "pt-BR": "Todos os Níveis", es: "Todos los niveles", no: "Alle nivåer" },
  "minutes": { "pt-BR": "minutos", es: "minutos", no: "minutter" },
  "weeks": { "pt-BR": "semanas", es: "semanas", no: "uker" },
  "days": { "pt-BR": "dias", es: "días", no: "dager" },
  "Optional": { "pt-BR": "Opcional", es: "Opcional", no: "Valgfritt" },
  "Core: On": { "pt-BR": "Core: ligado", es: "Core: activado", no: "Kjerne: på" },
  "Add optional core": { "pt-BR": "Adicionar core opcional", es: "Añadir core opcional", no: "Legg til valgfri kjerne" },
  "+ Core": { "pt-BR": "+ Core", es: "+ Core", no: "+ Kjerne" },
  "Watch demo video": { "pt-BR": "Ver vídeo demonstrativo", es: "Ver vídeo demo", no: "Se demovideo" },
  "Warm-up Protocol": { "pt-BR": "Protocolo de aquecimento", es: "Protocolo de calentamiento", no: "Oppvarmingsprotokoll" },
  "Weekly schedule": { "pt-BR": "Cronograma semanal", es: "Horario semanal", no: "Ukeplan" },
  "Your 7-day training split": { "pt-BR": "Sua divisão de treino de 7 dias", es: "Tu división de entrenamiento de 7 días", no: "Din 7-dagers treningssplit" },
  "Tap to see which day trains what": { "pt-BR": "Toque para ver o foco de cada dia", es: "Toca para ver qué se entrena cada día", no: "Trykk for å se hva du trener hver dag" },
  "Rest · optional 20-30 min walk or light mobility": { "pt-BR": "Descanso · caminhada opcional de 20-30 min ou mobilidade leve", es: "Descanso · caminata opcional de 20-30 min o movilidad ligera", no: "Hvile · valgfri 20-30 min gåtur eller lett mobilitet" },
  "keep it easy (Zone 1, nasal-breath pace)": { "pt-BR": "mantenha leve (zona 1, ritmo com respiração nasal)", es: "mantenlo suave (zona 1, ritmo con respiración nasal)", no: "hold det rolig (sone 1, nesepust-tempo)" },
  "Monday": { "pt-BR": "Segunda-feira", es: "Lunes", no: "Mandag" },
  "Tuesday": { "pt-BR": "Terça-feira", es: "Martes", no: "Tirsdag" },
  "Wednesday": { "pt-BR": "Quarta-feira", es: "Miércoles", no: "Onsdag" },
  "Thursday": { "pt-BR": "Quinta-feira", es: "Jueves", no: "Torsdag" },
  "Friday": { "pt-BR": "Sexta-feira", es: "Viernes", no: "Fredag" },
  "Saturday": { "pt-BR": "Sábado", es: "Sábado", no: "Lørdag" },
  "Sunday": { "pt-BR": "Domingo", es: "Domingo", no: "Søndag" },
  "Active recovery": { "pt-BR": "Recuperação ativa", es: "Recuperación activa", no: "Aktiv restitusjon" },
  "Zone-2 Walk": { "pt-BR": "Caminhada em zona 2", es: "Caminata en zona 2", no: "Sone 2-gange" },
  "Bike + Mobility": { "pt-BR": "Bicicleta + mobilidade", es: "Bicicleta + movilidad", no: "Sykkel + mobilitet" },
  "Mobility Flow": { "pt-BR": "Fluxo de mobilidade", es: "Flujo de movilidad", no: "Mobilitetsflyt" },
  "Full Rest or Light Walk": { "pt-BR": "Descanso total ou caminhada leve", es: "Descanso total o caminata ligera", no: "Full hvile eller rolig gåtur" },
  "Easy 30-40 min walk, outdoor or treadmill. Conversational pace, builds aerobic base and speeds recovery.": {
    "pt-BR": "Caminhada leve de 30-40 min, ao ar livre ou na esteira. Ritmo em que dá para conversar, constrói base aeróbica e acelera a recuperação.",
    es: "Caminata fácil de 30-40 min, al aire libre o en cinta. Ritmo conversacional, construye base aeróbica y acelera la recuperación.",
    no: "Rolig 30-40 min gåtur, ute eller på mølle. Pratetempo, bygger aerob base og gir raskere restitusjon."
  },
  "Light spin to flush the legs, then core and mobility to protect the joints for tomorrow's lift.": {
    "pt-BR": "Pedalada leve para soltar as pernas, depois core e mobilidade para proteger as articulações para o treino de amanhã.",
    es: "Pedaleo ligero para soltar las piernas, luego core y movilidad para proteger las articulaciones para el levantamiento de mañana.",
    no: "Rolig sykling for å løsne beina, deretter kjerne og mobilitet for å beskytte leddene før morgendagens økt."
  },
  "Take the day off, or just walk 20-30 min and stretch. Recovery is when the gains happen.": {
    "pt-BR": "Tire o dia de descanso, ou caminhe 20-30 min e alongue. É na recuperação que os ganhos acontecem.",
    es: "Tómate el día libre, o camina 20-30 min y estira. La recuperación es donde ocurren las ganancias.",
    no: "Ta fri, eller gå bare 20-30 min og tøy. Det er i restitusjonen fremgangen skjer."
  },

  // Program filter chips + training styles, pinned so AI never mangles them
  "All Programs": { "pt-BR": "Todos os Programas", es: "Todos los programas", no: "Alle programmer" },
  "Bodybuilding": { "pt-BR": "Musculação", es: "Culturismo", no: "Bodybuilding" },
  "Powerlifting": { "pt-BR": "Powerlifting", es: "Powerlifting", no: "Styrkeløft" },
  "Strength": { "pt-BR": "Força", es: "Fuerza", no: "Styrke" },
  "Hypertrophy": { "pt-BR": "Hipertrofia", es: "Hipertrofia", no: "Hypertrofi" },
  "Fat Loss": { "pt-BR": "Emagrecimento", es: "Pérdida de grasa", no: "Fettforbrenning" },
  "Endurance": { "pt-BR": "Resistência", es: "Resistencia", no: "Utholdenhet" },
  "Hybrid": { "pt-BR": "Híbrido", es: "Híbrido", no: "Hybrid" },
  "Hybrid · Hyrox & CrossFit": { "pt-BR": "Híbrido · Hyrox & CrossFit", es: "Híbrido · Hyrox y CrossFit", no: "Hybrid · Hyrox og CrossFit" },
  "Home Gym": { "pt-BR": "Treino em casa", es: "Gimnasio en casa", no: "Hjemmetrening" },
  "Home Training": { "pt-BR": "Treino em casa", es: "Entrenamiento en casa", no: "Hjemmetrening" },
  "Glute": { "pt-BR": "Glúteos", es: "Glúteos", no: "Rumpe" },
  "Women": { "pt-BR": "Mulheres", es: "Mujeres", no: "Kvinner" },
  "Conditioning": { "pt-BR": "Condicionamento", es: "Acondicionamiento", no: "Kondisjon" },
  "Build Muscle": { "pt-BR": "Ganhar Músculo", es: "Ganar Músculo", no: "Bygg muskler" },
  "Get Strong": { "pt-BR": "Fique Forte", es: "Ponte Fuerte", no: "Bli sterk" },

  // Product areas
  "Create Workout": { "pt-BR": "Criar Treino", es: "Crear Entrenamiento", no: "Lag program" },
  "Open Create Workout →": { "pt-BR": "Abrir Criar Treino →", es: "Abrir Crear Entrenamiento →", no: "Åpne Lag program →" },
  "Builder": { "pt-BR": "Criar Treino", es: "Crear Entrenamiento", no: "Lag program" },
  "The App": { "pt-BR": "O App", es: "La App", no: "Appen" },
  "Get the App": { "pt-BR": "Baixar o app", es: "Descargar la app", no: "Last ned appen" },
  "Main lift": { "pt-BR": "Levantamento principal", es: "Levantamiento principal", no: "Hovedløft" },
  "Main Lift": { "pt-BR": "Levantamento Principal", es: "Levantamiento Principal", no: "Hovedløft" },
  "Accessories": { "pt-BR": "Acessórios", es: "Accesorios", no: "Tilleggsøvelser" },
  "Accessory": { "pt-BR": "Acessório", es: "Accesorio", no: "Tilleggsøvelse" },

  // Article pull quotes, hand-translated so the AI never mangles them
  "You are not stuck. You just stopped pushing the lever that still had room to move.": {
    "pt-BR": "Você não está travado. Você só parou de puxar a alavanca que ainda tinha espaço para se mover.",
    es: "No estás estancado. Simplemente dejaste de accionar la palanca que aún tenía margen para moverse.",
    no: "Du står ikke fast. Du sluttet bare å bruke den spaken som fortsatt hadde rom til å bevege seg.",
  },
  "Nobody has ever failed at building muscle because their food wasn't 'clean' enough. Thousands have failed because they didn't hit their protein.": {
    "pt-BR": "Ninguém jamais falhou em ganhar músculo porque a comida não era 'limpa' o suficiente. Milhares falharam porque não bateram a meta de proteína.",
    es: "Nadie ha fracasado en ganar músculo porque su comida no fuera lo bastante 'limpia'. Miles han fracasado por no llegar a su proteína.",
    no: "Ingen har noen gang mislyktes med å bygge muskler fordi maten ikke var «ren» nok. Tusenvis har mislyktes fordi de ikke traff proteinmålet sitt.",
  },
  "You cannot out-train, out-supplement, or out-caffeinate a sleep deficit. Sleep is the training program.": {
    "pt-BR": "Você não consegue treinar mais, suplementar mais nem tomar mais cafeína para compensar a falta de sono. O sono é o programa de treino.",
    es: "No puedes compensar la falta de sueño entrenando más, suplementando más ni tomando más cafeína. El sueño es el programa de entrenamiento.",
    no: "Du kan ikke trene, tilskuddsdope eller koffeindose deg ut av søvnmangel. Søvnen er treningsprogrammet.",
  },
  "The bar doesn't come off the floor until the setup tells it to. If your setup is wrong, no amount of trying harder fixes the pull.": {
    "pt-BR": "A barra só sai do chão quando o setup mandar. Se o seu setup está errado, nenhum esforço extra vai consertar o levantamento.",
    es: "La barra no sale del suelo hasta que el setup lo indique. Si tu setup está mal, ningún esfuerzo extra arregla el tirón.",
    no: "Stanga forlater ikke gulvet før oppsettet gir grønt lys. Er oppsettet feil, redder ingen mengde ekstra innsats løftet.",
  },
  "The bar comes down at your speed. The moment it dictates the speed, you have already lost the lift.": {
    "pt-BR": "A barra desce na sua velocidade. No momento em que ela ditar o ritmo, você já perdeu o levantamento.",
    es: "La barra baja a tu ritmo. En el momento en que ella marque la velocidad, ya has perdido el levantamiento.",
    no: "Stanga går ned i ditt tempo. I det øyeblikket den bestemmer farten, har du allerede tapt løftet.",
  },
  "You cannot squat heavy weights with a weak brace. The brace is not optional. It is the lift.": {
    "pt-BR": "Você não agacha peso pesado com um core fraco. O brace não é opcional. Ele é o levantamento.",
    es: "No puedes hacer sentadillas pesadas con un brace débil. El brace no es opcional. Es la sentadilla.",
    no: "Du klarer ikke tunge knebøy med svak bukbrace. Bracen er ikke valgfri. Den er selve løftet.",
  },

  // ============ STATIC PAGES: About / Careers / Contact / FAQ / Legal ============
  // About page
  "About": { "pt-BR": "Sobre", es: "Sobre nosotros", no: "Om oss" },
  "Built by athletes.": { "pt-BR": "Feito por atletas.", es: "Hecho por atletas.", no: "Laget av utøvere." },
  "For everyone who trains.": { "pt-BR": "Para todos que treinam.", es: "Para todos los que entrenan.", no: "For alle som trener." },
  "Onyx Elevate exists because elite-level programming, coaching and education should not be locked behind a $200/month subscription or a private DM to an influencer. We're a team of competing athletes building the platform we wished we'd had when we started.": {
    "pt-BR": "A Onyx Elevate existe porque programação, coaching e educação de nível elite não deveriam estar trancados atrás de uma assinatura de US$ 200/mês ou de uma DM privada para um influenciador. Somos uma equipe de atletas competitivos construindo a plataforma que gostaríamos de ter tido quando começamos.",
    es: "Onyx Elevate existe porque la programación, el coaching y la educación de nivel élite no deberían estar bloqueados detrás de una suscripción de $200/mes ni un DM privado a un influencer. Somos un equipo de atletas que compiten, creando la plataforma que nos hubiera gustado tener cuando empezamos.",
    no: "Onyx Elevate finnes fordi programmering, coaching og utdanning på eliteniv\u00e5 ikke skal v\u00e6re l\u00e5st bak et abonnement til $200/m\u00e5ned eller en privat DM til en influencer. Vi er et team av utøvere som konkurrerer, og bygger plattformen vi skulle \u00f8nske vi hadde da vi startet."
  },
  "What we believe": { "pt-BR": "No que acreditamos", es: "En qué creemos", no: "Det vi tror på" },
  "Real coaches. Real platforms.": { "pt-BR": "Treinadores reais. Plataformas reais.", es: "Entrenadores reales. Plataformas reales.", no: "Ekte trenere. Ekte plattformer." },
  "Every Onyx program is written by athletes who actively compete or train alongside competitors - strongman, powerlifting, bodybuilding, boxing, running. No marketers in disguise.": {
    "pt-BR": "Todo programa Onyx é escrito por atletas que competem ativamente ou treinam ao lado de competidores - strongman, powerlifting, fisiculturismo, boxe, corrida. Nada de marqueteiros disfarçados.",
    es: "Cada programa Onyx está escrito por atletas que compiten activamente o entrenan junto a competidores - strongman, powerlifting, culturismo, boxeo, running. Sin marketeros disfrazados.",
    no: "Alle Onyx-programmer er skrevet av utøvere som konkurrerer aktivt eller trener sammen med konkurrenter - strongman, styrkeløft, kroppsbygging, boksing, løping. Ingen forkledde markedsførere."
  },
  "Free where it should be free.": { "pt-BR": "Grátis onde deve ser grátis.", es: "Gratis donde debe ser gratis.", no: "Gratis der det bør være gratis." },
  "The exercise library, articles and recipes are free forever. We only charge for programming and coaching - the work that genuinely takes our time.": {
    "pt-BR": "A biblioteca de exercícios, artigos e receitas são gratuitos para sempre. Só cobramos por programação e coaching - o trabalho que realmente toma o nosso tempo.",
    es: "La biblioteca de ejercicios, los artículos y las recetas son gratis para siempre. Solo cobramos por programación y coaching - el trabajo que realmente lleva nuestro tiempo.",
    no: "Øvelsesbiblioteket, artiklene og oppskriftene er gratis for alltid. Vi tar bare betalt for programmering og coaching - arbeidet som virkelig tar tiden vår."
  },
  "Sustainable over flashy.": { "pt-BR": "Sustentável em vez de chamativo.", es: "Sostenible en vez de llamativo.", no: "Bærekraftig fremfor prangende." },
  "We don't sell 6-week shreds or magic supplements. We build the boring, consistent training and nutrition systems that compound for decades.": {
    "pt-BR": "Não vendemos 'shreds' de 6 semanas nem suplementos mágicos. Construímos os sistemas chatos e consistentes de treino e nutrição que rendem juros por décadas.",
    es: "No vendemos definiciones de 6 semanas ni suplementos mágicos. Construimos los sistemas de entrenamiento y nutrición aburridos y constantes que se acumulan durante décadas.",
    no: "Vi selger ikke 6-ukers shred eller magiske kosttilskudd. Vi bygger de kjedelige, konsekvente trenings- og ernæringssystemene som gir avkastning i tiår."
  },
  "Train hard. Live well.": { "pt-BR": "Treine forte. Viva bem.", es: "Entrena duro. Vive bien.", no: "Tren hardt. Lev godt." },
  "Performance is the point - but only because a strong, healthy body lets you show up better everywhere else in your life.": {
    "pt-BR": "A performance é o objetivo - mas só porque um corpo forte e saudável faz você aparecer melhor em todos os outros lugares da sua vida.",
    es: "El rendimiento es el objetivo - pero solo porque un cuerpo fuerte y sano te permite estar mejor en todos los demás ámbitos de tu vida.",
    no: "Prestasjon er poenget - men bare fordi en sterk, sunn kropp lar deg vise deg fram bedre overalt ellers i livet."
  },
  "The story so far": { "pt-BR": "A história até aqui", es: "La historia hasta ahora", no: "Historien så langt" },
  "The idea": { "pt-BR": "A ideia", es: "La idea", no: "Idéen" },
  "Simen sketches the first version of Onyx after years of paying for templates that didn't fit his strongman training.": {
    "pt-BR": "Simen esboça a primeira versão do Onyx após anos pagando por planilhas que não serviam para o seu treino de strongman.",
    es: "Simen esboza la primera versión de Onyx tras años pagando por plantillas que no encajaban con su entrenamiento de strongman.",
    no: "Simen skisserer den første versjonen av Onyx etter år med å betale for maler som ikke passet hans strongman-trening."
  },
  "Coaches join": { "pt-BR": "Treinadores entram", es: "Se unen los entrenadores", no: "Trenerne blir med" },
  "Lars, Thiago, Trym and Michael come on board - every discipline covered from one team.": {
    "pt-BR": "Lars, Thiago, Trym e Michael entram para o time - todas as disciplinas cobertas por uma única equipe.",
    es: "Lars, Thiago, Trym y Michael se suman - cada disciplina cubierta desde un mismo equipo.",
    no: "Lars, Thiago, Trym og Michael blir med - alle disipliner dekket fra ett team."
  },
  "Public launch": { "pt-BR": "Lançamento público", es: "Lanzamiento público", no: "Offentlig lansering" },
  "Free exercise library, recipes, articles and the first wave of premium programs go live. App in soft launch.": {
    "pt-BR": "Biblioteca de exercícios gratuita, receitas, artigos e a primeira leva de programas premium entram no ar. App em soft launch.",
    es: "Biblioteca de ejercicios gratuita, recetas, artículos y la primera oleada de programas premium salen en vivo. App en lanzamiento suave.",
    no: "Gratis øvelsesbibliotek, oppskrifter, artikler og den første bølgen av premium-programmer går live. Appen i myk lansering."
  },
  
  "The Onyx app": { "pt-BR": "O app Onyx", es: "La app Onyx", no: "Onyx-appen" },
  "Full workout tracking, video logging and coach messaging - coming soon to iOS and Android.": {
    "pt-BR": "Registro completo de treinos, gravação de vídeos e mensagens com o treinador - em breve para iOS e Android.",
    es: "Seguimiento completo de entrenamientos, registro de vídeo y mensajería con el entrenador - próximamente en iOS y Android.",
    no: "Full treningslogg, videologging og trenerchat - kommer snart til iOS og Android."
  },
  "Want to train with us?": { "pt-BR": "Quer treinar com a gente?", es: "¿Quieres entrenar con nosotros?", no: "Vil du trene med oss?" },
  "Browse programs, meet a coach, or just dig into the free library.": {
    "pt-BR": "Explore programas, conheça um treinador ou apenas mergulhe na biblioteca gratuita.",
    es: "Explora programas, conoce a un entrenador o simplemente sumérgete en la biblioteca gratuita.",
    no: "Bla i programmer, møt en trener, eller grav deg bare inn i det gratis biblioteket."
  },
  "Browse programs": { "pt-BR": "Ver programas", es: "Ver programas", no: "Se programmer" },
  "Contact the team": { "pt-BR": "Fale com o time", es: "Contacta al equipo", no: "Kontakt teamet" },

  // Careers page
  "Careers": { "pt-BR": "Carreiras", es: "Carreras", no: "Karriere" },
  "Train. Build. Ship.": { "pt-BR": "Treine. Construa. Entregue.", es: "Entrena. Construye. Lanza.", no: "Tren. Bygg. Lever." },
  "We hire competing athletes, coaches who care, and engineers who actually use the gym. Remote-first, async-friendly, results-only.": {
    "pt-BR": "Contratamos atletas que competem, treinadores que se importam e engenheiros que realmente usam a academia. Remoto em primeiro lugar, assíncrono, focado em resultados.",
    es: "Contratamos atletas que compiten, entrenadores que se preocupan e ingenieros que realmente van al gimnasio. Primero remoto, amigable con lo asíncrono, solo resultados.",
    no: "Vi ansetter utøvere som konkurrerer, trenere som bryr seg, og ingeniører som faktisk bruker treningsstudioet. Fjernt først, asynkron-vennlig, kun resultater."
  },
  "Coach - Strength & Hypertrophy": { "pt-BR": "Treinador - Força & Hipertrofia", es: "Entrenador - Fuerza & Hipertrofia", no: "Trener - Styrke og hypertrofi" },
  "Contract · Remote": { "pt-BR": "Contrato · Remoto", es: "Contrato · Remoto", no: "Kontrakt · Fjern" },
  "Full-time · Remote": { "pt-BR": "Tempo integral · Remoto", es: "Tiempo completo · Remoto", no: "Fulltid · Fjern" },
  "Part-time · Remote": { "pt-BR": "Meio período · Remoto", es: "Medio tiempo · Remoto", no: "Deltid · Fjern" },
  "Bring 5+ athletes through a full block. Weekly check-ins, video form reviews, programming via the Onyx app.": {
    "pt-BR": "Leve 5+ atletas por um bloco completo. Check-ins semanais, análises de vídeo da execução, programação pelo app Onyx.",
    es: "Lleva a 5+ atletas por un bloque completo. Check-ins semanales, revisiones de vídeo de la técnica, programación vía la app Onyx.",
    no: "Ta med 5+ utøvere gjennom en full blokk. Ukentlige innsjekk, videoanalyser av teknikk, programmering via Onyx-appen."
  },
  "Coach - Endurance / Hybrid": { "pt-BR": "Treinador - Endurance / Híbrido", es: "Entrenador - Resistencia / Híbrido", no: "Trener - Utholdenhet / hybrid" },
  "Running, hybrid and conditioning programming. HR/pace zone fluency required.": {
    "pt-BR": "Programação de corrida, híbrido e condicionamento. Domínio de zonas de FC/pace obrigatório.",
    es: "Programación de running, híbrido y acondicionamiento. Se requiere fluidez en zonas de FC/ritmo.",
    no: "Programmering for løping, hybrid og kondisjon. Krav om trygghet med HR-/tempo-soner."
  },
  "Mobile Engineer (iOS / Android)": { "pt-BR": "Engenheiro Mobile (iOS / Android)", es: "Ingeniero móvil (iOS / Android)", no: "Mobilingeniør (iOS / Android)" },
  "Ship the Onyx app. Native or React Native experience, fitness product background a plus.": {
    "pt-BR": "Entregue o app Onyx. Experiência nativa ou React Native; background em produto fitness é um diferencial.",
    es: "Lanza la app Onyx. Experiencia nativa o React Native; experiencia en producto fitness es un plus.",
    no: "Lever Onyx-appen. Native- eller React Native-erfaring, treningsproduktbakgrunn er et pluss."
  },
  "Content Producer": { "pt-BR": "Produtor de Conteúdo", es: "Productor de contenido", no: "Innholdsprodusent" },
  "Film, edit and publish exercise demos and short-form athlete content. You train. Hard.": {
    "pt-BR": "Filme, edite e publique demonstrações de exercícios e conteúdo curto de atleta. Você treina. Pesado.",
    es: "Graba, edita y publica demos de ejercicios y contenido corto de atleta. Entrenas. Fuerte.",
    no: "Film, rediger og publiser øvelsesdemoer og kortformat-innhold. Du trener. Hardt."
  },
  "Apply now →": { "pt-BR": "Candidatar-se →", es: "Postular ahora →", no: "Søk nå →" },
  "Don't see your role?": { "pt-BR": "Não encontrou sua vaga?", es: "¿No ves tu puesto?", no: "Ser du ikke rollen din?" },
  "If you're elite at what you do and train hard, we want to hear from you. Tell us what you'd build.": {
    "pt-BR": "Se você é elite no que faz e treina pesado, queremos ouvir você. Conte o que você construiria.",
    es: "Si eres élite en lo que haces y entrenas fuerte, queremos saber de ti. Cuéntanos qué construirías.",
    no: "Hvis du er elite i det du gjør og trener hardt, vil vi høre fra deg. Fortell hva du ville bygd."
  },
  "Pitch yourself": { "pt-BR": "Apresente-se", es: "Preséntate", no: "Presenter deg selv" },

  // Contact page
  "Contact": { "pt-BR": "Contato", es: "Contacto", no: "Kontakt" },
  "Talk to the Onyx team.": { "pt-BR": "Fale com o time Onyx.", es: "Habla con el equipo Onyx.", no: "Snakk med Onyx-teamet." },
  "Real humans, real coaches. We reply within 48 hours - usually faster.": {
    "pt-BR": "Pessoas reais, treinadores reais. Respondemos em até 48 horas - normalmente mais rápido.",
    es: "Humanos reales, entrenadores reales. Respondemos en 48 horas - normalmente antes.",
    no: "Ekte mennesker, ekte trenere. Vi svarer innen 48 timer - som regel raskere."
  },
  "Coaching enquiry": { "pt-BR": "Consulta de coaching", es: "Consulta de coaching", no: "Coaching-forespørsel" },
  "Apply for 1-on-1 programming with an Onyx coach.": { "pt-BR": "Solicite programação individual com um treinador Onyx.", es: "Solicita programación 1 a 1 con un entrenador Onyx.", no: "Søk om 1-til-1-programmering med en Onyx-trener." },
  "App support": { "pt-BR": "Suporte do app", es: "Soporte de la app", no: "App-støtte" },
  "Bugs, feature requests, billing questions.": { "pt-BR": "Bugs, pedidos de recursos, dúvidas de cobrança.", es: "Errores, solicitudes de funciones, dudas de facturación.", no: "Feil, funksjonsønsker, faktureringsspørsmål." },
  "Partnerships": { "pt-BR": "Parcerias", es: "Colaboraciones", no: "Samarbeid" },
  "Brand collabs, gyms, supplements, athletes.": { "pt-BR": "Colabs de marca, academias, suplementos, atletas.", es: "Colaboraciones de marca, gimnasios, suplementos, atletas.", no: "Merkevaresamarbeid, treningssenter, kosttilskudd, utøvere." },
  "Press & media": { "pt-BR": "Imprensa & mídia", es: "Prensa y medios", no: "Presse og media" },
  "Interviews, quotes, athlete profiles.": { "pt-BR": "Entrevistas, citações, perfis de atletas.", es: "Entrevistas, citas, perfiles de atletas.", no: "Intervjuer, sitater, utøverprofiler." },
  "Direct channels": { "pt-BR": "Canais diretos", es: "Canales directos", no: "Direkte kanaler" },
  "Send us a message": { "pt-BR": "Envie-nos uma mensagem", es: "Envíanos un mensaje", no: "Send oss en melding" },
  "Message ready to send.": { "pt-BR": "Mensagem pronta para envio.", es: "Mensaje listo para enviar.", no: "Melding klar til å sende." },
  "Your email app just opened with the message pre-filled. Hit send and it lands straight in our inbox at OnyxPerformanceTeam@hotmail.com. We reply within 48 hours.": {
    "pt-BR": "Seu app de e-mail abriu com a mensagem já preenchida. Toque em enviar e ela chega direto na nossa caixa em OnyxPerformanceTeam@hotmail.com. Respondemos em até 48 horas.",
    es: "Tu app de correo se acaba de abrir con el mensaje ya escrito. Pulsa enviar y llegará directo a nuestro buzón en OnyxPerformanceTeam@hotmail.com. Respondemos en 48 horas.",
    no: "E-postappen din åpnet med meldingen ferdig utfylt. Trykk send og den lander rett i innboksen vår på OnyxPerformanceTeam@hotmail.com. Vi svarer innen 48 timer."
  },
  "Send another": { "pt-BR": "Enviar outra", es: "Enviar otro", no: "Send en til" },
  "Name": { "pt-BR": "Nome", es: "Nombre", no: "Navn" },
  "Your email": { "pt-BR": "Seu e-mail", es: "Tu correo", no: "E-posten din" },
  "Topic": { "pt-BR": "Assunto", es: "Tema", no: "Emne" },
  "Send message": { "pt-BR": "Enviar mensagem", es: "Enviar mensaje", no: "Send melding" },
  "Partnership": { "pt-BR": "Parceria", es: "Colaboración", no: "Samarbeid" },
  "Press": { "pt-BR": "Imprensa", es: "Prensa", no: "Presse" },
  "Other": { "pt-BR": "Outro", es: "Otro", no: "Annet" },
  "privacy policy": { "pt-BR": "política de privacidade", es: "política de privacidad", no: "personvernerklæringen" },

  // FAQ page
  "FAQ": { "pt-BR": "Perguntas frequentes", es: "Preguntas frecuentes", no: "Vanlige spørsmål" },
  "Frequently asked questions.": { "pt-BR": "Perguntas frequentes.", es: "Preguntas frecuentes.", no: "Vanlige spørsmål." },
  "message the team": { "pt-BR": "mande uma mensagem para o time", es: "escribe al equipo", no: "send teamet en melding" },
  "Categories": { "pt-BR": "Categorias", es: "Categorías", no: "Kategorier" },
  "Getting started": { "pt-BR": "Começando", es: "Empezando", no: "Kom i gang" },
  "Programs & pricing": { "pt-BR": "Programas e preços", es: "Programas y precios", no: "Programmer og priser" },
  "Coaching": { "pt-BR": "Coaching", es: "Coaching", no: "Coaching" },
  "The Onyx App": { "pt-BR": "O App Onyx", es: "La App Onyx", no: "Onyx-appen" },
  "Billing & refunds": { "pt-BR": "Cobrança e reembolsos", es: "Facturación y reembolsos", no: "Fakturering og refusjoner" },
  "Is the exercise library really free?": { "pt-BR": "A biblioteca de exercícios é mesmo grátis?", es: "¿La biblioteca de ejercicios es realmente gratis?", no: "Er øvelsesbiblioteket virkelig gratis?" },
  "Yes - 500+ exercises with full step-by-step instructions, pro tips and common mistakes are free forever. No login, no paywall.": {
    "pt-BR": "Sim - mais de 500 exercícios com instruções passo a passo, dicas profissionais e erros comuns são grátis para sempre. Sem login, sem paywall.",
    es: "Sí - más de 500 ejercicios con instrucciones paso a paso, consejos pro y errores comunes son gratis para siempre. Sin inicio de sesión, sin paywall.",
    no: "Ja - 500+ øvelser med steg-for-steg-instruksjoner, proffe tips og vanlige feil er gratis for alltid. Ingen innlogging, ingen betalingsmur."
  },
  "Do I need to download the app?": { "pt-BR": "Preciso baixar o app?", es: "¿Necesito descargar la app?", no: "Må jeg laste ned appen?" },
  "No. The full library, programs library and articles work in the browser. The Onyx app (coming soon) adds workout tracking, video logging and coach messaging.": {
    "pt-BR": "Não. A biblioteca completa, a biblioteca de programas e os artigos funcionam no navegador. O app Onyx (em breve) adiciona registro de treinos, gravação de vídeo e mensagens com o treinador.",
    es: "No. La biblioteca completa, la biblioteca de programas y los artículos funcionan en el navegador. La app Onyx (próximamente) añade seguimiento de entrenamiento, grabación de vídeo y mensajería con el entrenador.",
    no: "Nei. Hele biblioteket, programbiblioteket og artiklene fungerer i nettleseren. Onyx-appen (kommer snart) legger til treningslogg, videologging og trenerchat."
  },
  "What gear do I need to follow Onyx programs?": { "pt-BR": "Que equipamento eu preciso para seguir os programas Onyx?", es: "¿Qué equipo necesito para seguir los programas Onyx?", no: "Hvilket utstyr trenger jeg for å følge Onyx-programmer?" },
  "Most programs are written for a standard commercial gym. We also publish home-gym variants that need only a barbell, plates and a rack - or in some cases just dumbbells and bands.": {
    "pt-BR": "A maioria dos programas é escrita para uma academia comercial padrão. Também publicamos variantes de home gym que precisam apenas de barra, anilhas e rack - ou, em alguns casos, só halteres e elásticos.",
    es: "La mayoría de los programas están escritos para un gimnasio comercial estándar. También publicamos variantes de home gym que solo requieren barra, discos y rack - o en algunos casos, solo mancuernas y bandas.",
    no: "De fleste programmer er skrevet for et vanlig kommersielt treningssenter. Vi publiserer også hjemme-treningsvarianter som bare trenger stang, vekter og rack - eller i noen tilfeller bare manualer og strikker."
  },
  "How much do premium programs cost?": { "pt-BR": "Quanto custam os programas premium?", es: "¿Cuánto cuestan los programas premium?", no: "Hvor mye koster premium-programmer?" },
  "Every premium program is a one-time R$ 29,99. No subscription, no auto-renew. You own it forever.": {
    "pt-BR": "Todo programa premium é um pagamento único de R$ 29,99. Sem assinatura, sem renovação automática. É seu para sempre.",
    es: "Cada programa premium es un pago único de R$ 29,99. Sin suscripción, sin renovación automática. Es tuyo para siempre.",
    no: "Hvert premium-program er en engangsbetaling på R$ 29,99. Ingen abonnement, ingen automatisk fornyelse. Det er ditt for alltid."
  },
  "What is the free 1-week sampler?": { "pt-BR": "O que é o teste grátis de 1 semana?", es: "¿Qué es la muestra gratis de 1 semana?", no: "Hva er den gratis 1-ukers smakebiten?" },
  "Most premium programs come with a free 1-week sample so you can train through Week 1 before paying. If you like the structure and intensity, the full plan unlocks for R$ 29,99.": {
    "pt-BR": "A maioria dos programas premium vem com uma semana grátis de amostra para você treinar a Semana 1 antes de pagar. Se gostar da estrutura e intensidade, o plano completo desbloqueia por R$ 29,99.",
    es: "La mayoría de los programas premium incluyen una muestra gratis de 1 semana para que entrenes la Semana 1 antes de pagar. Si te gusta la estructura y la intensidad, el plan completo se desbloquea por R$ 29,99.",
    no: "De fleste premium-programmer kommer med en gratis 1-ukers smakebit slik at du kan trene gjennom uke 1 før du betaler. Liker du strukturen og intensiteten, låses hele planen opp for R$ 29,99."
  },
  "Can I switch programs mid-way?": { "pt-BR": "Posso trocar de programa no meio?", es: "¿Puedo cambiar de programa a mitad?", no: "Kan jeg bytte program underveis?" },
  "Yes. Finish the week you're on, deload 3-5 days, then start the new plan. We have a one-page 'how to transition' guide inside every program.": {
    "pt-BR": "Sim. Termine a semana em que está, faça um deload de 3 a 5 dias e comece o novo plano. Cada programa tem um guia de 'como fazer a transição' de uma página.",
    es: "Sí. Termina la semana en la que estás, haz un deload de 3 a 5 días y empieza el nuevo plan. Cada programa incluye una guía de 'cómo hacer la transición' de una página.",
    no: "Ja. Fullfør uken du er på, deload i 3-5 dager, og start den nye planen. Vi har en 'slik overgangen'-guide på én side inne i hvert program."
  },
  "What is 1-on-1 coaching?": { "pt-BR": "O que é coaching 1 a 1?", es: "¿Qué es el coaching 1 a 1?", no: "Hva er 1-til-1-coaching?" },
  "Custom programming written for you by an Onyx coach with weekly check-ins, video form review on every main lift and unlimited messaging. Prices range R$ 249-349/month depending on the coach.": {
    "pt-BR": "Programação personalizada escrita para você por um treinador Onyx com check-ins semanais, análise de vídeo em todo levantamento principal e mensagens ilimitadas. Preços de R$ 249 a R$ 349/mês dependendo do treinador.",
    es: "Programación personalizada escrita para ti por un entrenador Onyx con check-ins semanales, revisión de vídeo en cada levantamiento principal y mensajería ilimitada. Precios de R$ 249 a R$ 349/mes según el entrenador.",
    no: "Skreddersydd programmering skrevet for deg av en Onyx-trener med ukentlige innsjekk, videoanalyse på hvert hovedløft og ubegrenset melding. Priser fra R$ 249-349/måned avhengig av treneren."
  },
  "How do I apply for coaching?": { "pt-BR": "Como me candidato ao coaching?", es: "¿Cómo aplico al coaching?", no: "Hvordan søker jeg om coaching?" },
  "Pick a coach on the home page, hit 'Apply for coaching' and fill the short intake form. We reply within 48 hours and only take on athletes we can actually help.": {
    "pt-BR": "Escolha um treinador na página inicial, clique em 'Solicitar coaching' e preencha o formulário curto. Respondemos em até 48 horas e só aceitamos atletas que realmente conseguimos ajudar.",
    es: "Elige un entrenador en la página de inicio, pulsa 'Solicitar coaching' y rellena el formulario corto. Respondemos en 48 horas y solo aceptamos atletas a los que realmente podamos ayudar.",
    no: "Velg en trener på forsiden, trykk 'Søk om coaching' og fyll ut det korte skjemaet. Vi svarer innen 48 timer og tar bare inn utøvere vi faktisk kan hjelpe."
  },
  "What if my coach and I aren't a fit?": { "pt-BR": "E se eu e meu treinador não combinarmos?", es: "¿Y si mi entrenador y yo no encajamos?", no: "Hva om treneren min og jeg ikke passer?" },
  "We move you to a different Onyx coach at no extra cost in the first 30 days. After that, we'll prorate any unused time.": {
    "pt-BR": "Movemos você para outro treinador Onyx sem custo extra nos primeiros 30 dias. Depois disso, faremos o proporcional do tempo não utilizado.",
    es: "Te movemos a otro entrenador Onyx sin coste extra durante los primeros 30 días. Después, prorratearemos el tiempo no usado.",
    no: "Vi flytter deg til en annen Onyx-trener uten ekstra kostnad i de første 30 dagene. Etter det pro-raterer vi ubrukt tid."
  },
  "When does the app launch?": { "pt-BR": "Quando o app é lançado?", es: "¿Cuándo se lanza la app?", no: "Når lanseres appen?" },
  "Soft launch is rolling out now in waves. Join the waitlist on the App page to get early access plus the founder pricing locked for life.": {
    "pt-BR": "O soft launch está rolando em ondas agora. Entre na lista de espera na página do App para ter acesso antecipado e o preço de fundador travado para sempre.",
    es: "El soft launch se está desplegando ahora por oleadas. Únete a la lista de espera en la página de la App para tener acceso anticipado y el precio de fundador bloqueado de por vida.",
    no: "Myk lansering ruller ut i bølger nå. Bli med på ventelisten på App-siden for tidlig tilgang pluss grunnleggerpris låst for livet."
  },
  "What platforms is it on?": { "pt-BR": "Em quais plataformas está?", es: "¿En qué plataformas está?", no: "Hvilke plattformer er den på?" },
  "iOS and Android at launch. A lightweight web companion is available for desktop logging and program purchases.": {
    "pt-BR": "iOS e Android no lançamento. Um companion web leve está disponível para registro no desktop e compra de programas.",
    es: "iOS y Android en el lanzamiento. Un companion web ligero está disponible para el registro en escritorio y la compra de programas.",
    no: "iOS og Android ved lansering. En lett web-kompanion er tilgjengelig for skrivebordslogging og programkjøp."
  },
  "Will the free library stay free in the app?": { "pt-BR": "A biblioteca gratuita continua grátis no app?", es: "¿La biblioteca gratuita seguirá siendo gratis en la app?", no: "Vil det gratis biblioteket forbli gratis i appen?" },
  "Yes. The full exercise library, all articles and recipes stay free in-app. Premium programs and coaching remain the only paid items.": {
    "pt-BR": "Sim. A biblioteca completa de exercícios, todos os artigos e receitas continuam grátis no app. Programas premium e coaching continuam sendo os únicos itens pagos.",
    es: "Sí. La biblioteca completa de ejercicios, todos los artículos y recetas siguen gratis en la app. Los programas premium y el coaching siguen siendo los únicos elementos de pago.",
    no: "Ja. Hele øvelsesbiblioteket, alle artikler og oppskrifter forblir gratis i appen. Premium-programmer og coaching er fortsatt de eneste betalte elementene."
  },
  "What payment methods do you accept?": { "pt-BR": "Quais formas de pagamento vocês aceitam?", es: "¿Qué métodos de pago aceptáis?", no: "Hvilke betalingsmetoder aksepterer dere?" },
  "Credit / debit cards, Pix (Brazil) and Apple/Google Pay through the app. Receipts are emailed automatically.": {
    "pt-BR": "Cartões de crédito/débito, Pix (Brasil) e Apple/Google Pay pelo app. Os recibos são enviados por e-mail automaticamente.",
    es: "Tarjetas de crédito/débito, Pix (Brasil) y Apple/Google Pay a través de la app. Los recibos se envían por correo automáticamente.",
    no: "Kreditt-/debetkort, Pix (Brasil) og Apple/Google Pay via appen. Kvitteringer sendes automatisk på e-post."
  },
  "What's your refund policy?": { "pt-BR": "Qual é a política de reembolso?", es: "¿Cuál es vuestra política de reembolsos?", no: "Hva er refusjonspolicyen deres?" },
  "Programs: 7-day full refund, no questions asked. Coaching: prorated refund of any unused weeks in your first month.": {
    "pt-BR": "Programas: reembolso total em 7 dias, sem perguntas. Coaching: reembolso proporcional das semanas não usadas no primeiro mês.",
    es: "Programas: reembolso total en 7 días, sin preguntas. Coaching: reembolso prorrateado de las semanas no usadas del primer mes.",
    no: "Programmer: full refusjon i 7 dager, ingen spørsmål stilt. Coaching: pro-ratert refusjon av ubrukte uker i din første måned."
  },

  // Legal shared
  "Legal": { "pt-BR": "Legal", es: "Legal", no: "Juridisk" },
  "Last updated: July 2026": { "pt-BR": "Última atualização: julho de 2026", es: "Última actualización: julio de 2026", no: "Sist oppdatert: juli 2026" },
  "Privacy Notice": { "pt-BR": "Aviso de Privacidade", es: "Aviso de Privacidad", no: "Personvernerklæring" },
  "Terms & Conditions": { "pt-BR": "Termos e Condições", es: "Términos y condiciones", no: "Vilkår og betingelser" },
  "Refund Policy": { "pt-BR": "Política de reembolso", es: "Política de reembolsos", no: "Refusjonspolicy" },
  "Disclaimer": { "pt-BR": "Aviso legal", es: "Aviso legal", no: "Ansvarsfraskrivelse" },
  "Training and Nutrition Guidelines": { "pt-BR": "Diretrizes de treino e nutrição", es: "Directrices de entrenamiento y nutrición", no: "Retningslinjer for trening og ernæring" },

  // Refund page
  "30-day money-back guarantee": { "pt-BR": "Garantia de 30 dias com devolução do dinheiro", es: "Garantía de devolución de 30 días", no: "30-dagers pengene-tilbake-garanti" },
  "We want you to be happy with your Onyx Elevate purchase. If you are not satisfied with a training program, nutrition plan, bundle or subscription, you can request a full refund within 30 days of your order date.": {
    "pt-BR": "Queremos que você fique feliz com sua compra na Onyx Elevate. Se não estiver satisfeito com um programa de treino, plano nutricional, bundle ou assinatura, pode solicitar reembolso total em até 30 dias da data do pedido.",
    es: "Queremos que estés contento con tu compra en Onyx Elevate. Si no estás satisfecho con un programa de entrenamiento, plan de nutrición, pack o suscripción, puedes solicitar el reembolso total en 30 días desde la fecha de tu pedido.",
    no: "Vi vil at du skal være fornøyd med kjøpet ditt hos Onyx Elevate. Er du ikke fornøyd med et treningsprogram, kostholdsplan, pakke eller abonnement, kan du be om full refusjon innen 30 dager fra bestillingsdato."
  },
  "How to request a refund": { "pt-BR": "Como solicitar um reembolso", es: "Cómo solicitar un reembolso", no: "Slik ber du om refusjon" },
  "How you request a refund depends on where you bought:": {
    "pt-BR": "Como pedir um reembolso depende de onde você comprou:",
    es: "Cómo pedir un reembolso depende de dónde compraste:",
    no: "Hvordan du ber om refusjon avhenger av hvor du kjøpte:"
  },
  "Once approved, refunds are returned to the original payment method within 5-10 business days depending on your bank or card issuer.": {
    "pt-BR": "Uma vez aprovado, o reembolso volta ao método de pagamento original em 5 a 10 dias úteis, dependendo do seu banco ou emissor do cartão.",
    es: "Una vez aprobado, los reembolsos vuelven al método de pago original en 5 a 10 días hábiles dependiendo de tu banco o emisor de tarjeta.",
    no: "Når godkjent, går refusjonen tilbake til opprinnelig betalingsmetode innen 5-10 virkedager, avhengig av banken eller kortutstederen din."
  },
  "Subscriptions": { "pt-BR": "Assinaturas", es: "Suscripciones", no: "Abonnementer" },
  "Questions": { "pt-BR": "Dúvidas", es: "Preguntas", no: "Spørsmål" },

  // Disclaimer page
  "Fitness education & entertainment only": { "pt-BR": "Apenas educação e entretenimento fitness", es: "Solo educación y entretenimiento fitness", no: "Kun treningsutdanning og underholdning" },
  "Not medical advice": { "pt-BR": "Não é conselho médico", es: "No es consejo médico", no: "Ikke medisinsk råd" },
  "No guaranteed results": { "pt-BR": "Sem resultados garantidos", es: "Sin resultados garantizados", no: "Ingen garanterte resultater" },
  "Consult a qualified professional first": { "pt-BR": "Consulte um profissional qualificado primeiro", es: "Consulta primero a un profesional cualificado", no: "Konsulter en kvalifisert fagperson først" },
  "Supplement content": { "pt-BR": "Conteúdo sobre suplementos", es: "Contenido sobre suplementos", no: "Innhold om kosttilskudd" },
  "External links": { "pt-BR": "Links externos", es: "Enlaces externos", no: "Eksterne lenker" },

  // Guidelines page
  "We guide. You decide.": { "pt-BR": "Nós guiamos. Você decide.", es: "Nosotros guiamos. Tú decides.", no: "Vi guider. Du bestemmer." },
  "Exercise and injury responsibility": { "pt-BR": "Responsabilidade por exercícios e lesões", es: "Responsabilidad por ejercicio y lesiones", no: "Ansvar for trening og skader" },
  "Food, allergies and nutrition": { "pt-BR": "Comida, alergias e nutrição", es: "Comida, alergias y nutrición", no: "Mat, allergier og ernæring" },
  "Supplement references": { "pt-BR": "Referências a suplementos", es: "Referencias a suplementos", no: "Kosttilskuddsreferanser" },
  "In short": { "pt-BR": "Em resumo", es: "En resumen", no: "Kort sagt" },
  "We build the roadmap. You drive the car. Use your head, listen to your body, and when in doubt, ask a real professional in person.": {
    "pt-BR": "Nós construímos o mapa. Você dirige o carro. Use a cabeça, escute seu corpo e, na dúvida, pergunte a um profissional real pessoalmente.",
    es: "Nosotros construimos el mapa. Tú conduces el coche. Usa la cabeza, escucha a tu cuerpo y, en caso de duda, pregunta a un profesional real en persona.",
    no: "Vi bygger veikartet. Du kjører bilen. Bruk hodet, lytt til kroppen, og er du i tvil, spør en ekte fagperson personlig."
  },

  // Privacy / Terms section headings (numbered)
  "1. Who we are": { "pt-BR": "1. Quem somos", es: "1. Quiénes somos", no: "1. Hvem vi er" },
  "2. Personal data we collect": { "pt-BR": "2. Dados pessoais que coletamos", es: "2. Datos personales que recopilamos", no: "2. Personopplysninger vi samler inn" },
  "3. How we use your data & legal bases": { "pt-BR": "3. Como usamos seus dados e as bases legais", es: "3. Cómo usamos tus datos y bases legales", no: "3. Hvordan vi bruker dataene dine og rettslige grunnlag" },
  "4. Who we share data with": { "pt-BR": "4. Com quem compartilhamos dados", es: "4. Con quién compartimos datos", no: "4. Hvem vi deler data med" },
  "5. International transfers": { "pt-BR": "5. Transferências internacionais", es: "5. Transferencias internacionales", no: "5. Internasjonale overføringer" },
  "6. Payments": { "pt-BR": "6. Pagamentos", es: "6. Pagos", no: "6. Betalinger" },
  "7. Data retention": { "pt-BR": "7. Retenção de dados", es: "7. Retención de datos", no: "7. Datalagring" },
  "8. Cookies": { "pt-BR": "8. Cookies", es: "8. Cookies", no: "8. Informasjonskapsler" },
  "9. Your rights": { "pt-BR": "9. Seus direitos", es: "9. Tus derechos", no: "9. Rettighetene dine" },
  "10. Security": { "pt-BR": "10. Segurança", es: "10. Seguridad", no: "10. Sikkerhet" },
  "11. Children": { "pt-BR": "11. Crianças", es: "11. Menores", no: "11. Barn" },
  "12. Changes": { "pt-BR": "12. Alterações", es: "12. Cambios", no: "12. Endringer" },
  "13. Contact": { "pt-BR": "13. Contato", es: "13. Contacto", no: "13. Kontakt" },
  "2. The Service": { "pt-BR": "2. O Serviço", es: "2. El Servicio", no: "2. Tjenesten" },
  "3. Eligibility & accounts": { "pt-BR": "3. Elegibilidade e contas", es: "3. Elegibilidad y cuentas", no: "3. Kvalifisering og kontoer" },
  "4. Not medical advice · fitness education only": { "pt-BR": "4. Não é conselho médico · apenas educação fitness", es: "4. No es consejo médico · solo educación fitness", no: "4. Ikke medisinsk råd · kun treningsutdanning" },
  "5. Payments, billing & our reseller (Merchant of Record)": { "pt-BR": "5. Pagamentos, cobrança e nosso revendedor (Merchant of Record)", es: "5. Pagos, facturación y nuestro revendedor (Merchant of Record)", no: "5. Betalinger, fakturering og forhandleren vår (Merchant of Record)" },
  "6. Refunds": { "pt-BR": "6. Reembolsos", es: "6. Reembolsos", no: "6. Refusjoner" },
  "7. Licence to use the Service": { "pt-BR": "7. Licença de uso do Serviço", es: "7. Licencia para usar el Servicio", no: "7. Lisens til å bruke tjenesten" },
  "8. Intellectual property": { "pt-BR": "8. Propriedade intelectual", es: "8. Propiedad intelectual", no: "8. Immaterielle rettigheter" },
  "9. Acceptable use": { "pt-BR": "9. Uso aceitável", es: "9. Uso aceptable", no: "9. Akseptabel bruk" },
  "10. User content": { "pt-BR": "10. Conteúdo do usuário", es: "10. Contenido del usuario", no: "10. Brukerinnhold" },
  "11. Service availability": { "pt-BR": "11. Disponibilidade do Serviço", es: "11. Disponibilidad del Servicio", no: "11. Tjenestens tilgjengelighet" },
  "12. Suspension & termination": { "pt-BR": "12. Suspensão e encerramento", es: "12. Suspensión y terminación", no: "12. Suspensjon og oppsigelse" },
  "13. Warranties": { "pt-BR": "13. Garantias", es: "13. Garantías", no: "13. Garantier" },
  "14. Limitation of liability": { "pt-BR": "14. Limitação de responsabilidade", es: "14. Limitación de responsabilidad", no: "14. Ansvarsbegrensning" },
  "15. Indemnity": { "pt-BR": "15. Indenização", es: "15. Indemnización", no: "15. Skadesløsholdelse" },
  "16. Changes to these Terms": { "pt-BR": "16. Alterações destes Termos", es: "16. Cambios en estos Términos", no: "16. Endringer i disse vilkårene" },
  "17. Governing law": { "pt-BR": "17. Lei aplicável", es: "17. Ley aplicable", no: "17. Gjeldende lov" },
  "18. Contact": { "pt-BR": "18. Contato", es: "18. Contacto", no: "18. Kontakt" },

  // Meal plan data strings
  "Onyx Lean Cut": { "pt-BR": "Onyx Lean Cut", es: "Onyx Lean Cut", no: "Onyx Lean Cut" },
  "Onyx Lean Muscle": { "pt-BR": "Onyx Lean Muscle", es: "Onyx Lean Muscle", no: "Onyx Lean Muscle" },
  "Onyx Mass Bulk": { "pt-BR": "Onyx Mass Bulk", es: "Onyx Mass Bulk", no: "Onyx Mass Bulk" },
  "8 weeks. 1,200-1,500 kcal. Strip body fat without losing muscle.": {
    "pt-BR": "8 semanas. 1.200-1.500 kcal. Elimine gordura corporal sem perder músculo.",
    es: "8 semanas. 1.200-1.500 kcal. Elimina grasa corporal sin perder músculo.",
    no: "8 uker. 1 200-1 500 kcal. Fjern kroppsfett uten å miste muskler.",
  },
  "8 weeks. 1,800-2,200 kcal. Build lean muscle while staying defined.": {
    "pt-BR": "8 semanas. 1.800-2.200 kcal. Construa músculo magro enquanto se mantém definido.",
    es: "8 semanas. 1.800-2.200 kcal. Construye músculo magro manteniéndote definido.",
    no: "8 uker. 1 800-2 200 kcal. Bygg lean muskelmasse mens du holder deg definert.",
  },
  "8 weeks. 2,400-3,000 kcal. Build serious size with real, clean food.": {
    "pt-BR": "8 semanas. 2.400-3.000 kcal. Ganhe volume de verdade com comida real e limpa.",
    es: "8 semanas. 2.400-3.000 kcal. Aumenta tamaño de verdad con comida real y limpia.",
    no: "8 uker. 2 400-3 000 kcal. Bygg seriøs størrelse med ekte, ren mat.",
  },
  "Lean Muscle": { "pt-BR": "Músculo Definido", es: "Músculo Definido", no: "Lean muscle" },
  "Mass Bulk": { "pt-BR": "Volume Limpo", es: "Volumen Limpo", no: "Mass bulk" },
  "Beginner Friendly": { "pt-BR": "Iniciante", es: "Principiante", no: "Begynnervennlig" },
};

export function buildSeedCache(lang: string): Record<string, string> {
  if (lang === "en") return {};
  const out: Record<string, string> = {};
  for (const [src, map] of Object.entries(SEED)) {
    const v = (map as Record<string, string | undefined>)[lang];
    if (v) out[src] = v;
  }
  return out;
}
