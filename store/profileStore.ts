"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// FomoUni — единый источник правды приложения.
// v2: профиль поддерживает реальные системы аттестации (ЕНТ / IB / A-Level /
// AP) и поступление в любую страну из датасета, а не только в Казахстан.
// Persist-middleware сохраняет всё в localStorage.
// ---------------------------------------------------------------------------

export const STAGES = [
  "entry",
  "profile",
  "diagnosis",
  "recommendations",
  "compare",
  "roadmap",
  "next-action",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_PATH: Record<Stage, string> = {
  entry: "/",
  profile: "/profile",
  diagnosis: "/diagnosis",
  recommendations: "/recommendations",
  compare: "/compare",
  roadmap: "/roadmap",
  "next-action": "/roadmap#next-action",
};

export const STAGE_LABEL: Record<Stage, string> = {
  entry: "Вход",
  profile: "Профиль",
  diagnosis: "Диагностика",
  recommendations: "Рекомендации",
  compare: "Сравнение",
  roadmap: "Roadmap",
  "next-action": "Следующий шаг",
};

// --- Значения полей анкеты -------------------------------------------------

export type GradeOption = "grade-9-10" | "grade-11" | "graduate-no-exam" | "graduate-has-exam";

export const GRADE_OPTIONS: { value: GradeOption; label: string }[] = [
  { value: "grade-9-10", label: "9–10 класс" },
  { value: "grade-11", label: "11–12 класс, итоговые экзамены ещё впереди" },
  { value: "graduate-no-exam", label: "Выпускник(ца), итоговые баллы ещё не готовы" },
  { value: "graduate-has-exam", label: "Выпускник(ца), итоговые баллы уже есть" },
];

export type DirectionTag =
  | "programming"
  | "data-science"
  | "ai-ml"
  | "robotics-engineering"
  | "electrical-hardware"
  | "telecom-networks"
  | "cybersecurity"
  | "game-dev"
  | "product-hci"
  | "business-management"
  | "economics"
  | "finance";

export const DIRECTION_OPTIONS: { value: DirectionTag; label: string; hint: string }[] = [
  { value: "programming", label: "Программирование / Computer Science", hint: "Разработка ПО, алгоритмы" },
  { value: "data-science", label: "Data Science", hint: "Данные, статистика, аналитика" },
  { value: "ai-ml", label: "AI / Machine Learning", hint: "Нейросети, ML-инженерия" },
  { value: "robotics-engineering", label: "Робототехника / инженерия", hint: "Механика, автоматизация" },
  { value: "electrical-hardware", label: "Электротехника / Hardware", hint: "Электроэнергетика, электроника, чипы" },
  { value: "telecom-networks", label: "Телеком / сети", hint: "Связь, инфраструктура" },
  { value: "cybersecurity", label: "Кибербезопасность", hint: "Защита систем и данных" },
  { value: "game-dev", label: "Game Development", hint: "Разработка игр, геймдизайн" },
  { value: "product-hci", label: "Product / UX / HCI", hint: "Дизайн интерфейсов, продуктовая разработка" },
  { value: "business-management", label: "Бизнес / менеджмент", hint: "Предпринимательство, стратегия, операции" },
  { value: "economics", label: "Экономика", hint: "Рынки, политика, количественный анализ" },
  { value: "finance", label: "Финансы", hint: "Банкинг, инвестиции, корпоративные финансы" },
];

// Система школьной аттестации — определяет, какие баллы реально спрашивать
// и по каким экзаменам вуз будет оценивать абитуриента.
export type EducationSystem = "kz-ent" | "ib" | "a-level" | "ap-us" | "other";

export const EDUCATION_SYSTEM_OPTIONS: { value: EducationSystem; label: string; hint: string }[] = [
  { value: "kz-ent", label: "Казахстанская программа (ЕНТ)", hint: "Аттестат + Единое национальное тестирование" },
  { value: "ib", label: "IB Diploma Programme", hint: "Международный бакалавриат, баллы 0–45" },
  { value: "a-level", label: "A-Levels / Cambridge", hint: "Британская система, 2–4 предмета" },
  { value: "ap-us", label: "Американская программа (AP / US High School)", hint: "AP-экзамены + GPA по 4-балльной шкале" },
  { value: "other", label: "Другая национальная программа", hint: "Например, Abitur, Baccalauréat и т.д." },
];

export type ALevelBand = "a-star-aa" | "aab-abb" | "bbc-bcc" | "below-bcc";

// value → нормализованный индекс 0–100, с которым сравнивается порог вуза
export const ALEVEL_BAND_OPTIONS: { value: ALevelBand; label: string; index: number }[] = [
  { value: "a-star-aa", label: "A*AA и выше", index: 95 },
  { value: "aab-abb", label: "AAB – ABB", index: 82 },
  { value: "bbc-bcc", label: "BBC – BCC", index: 68 },
  { value: "below-bcc", label: "Ниже BCC", index: 50 },
];

export type EnglishLevel = "none" | "basic" | "ielts-5" | "ielts-6" | "ielts-7plus";

export const ENGLISH_LEVEL_OPTIONS: { value: EnglishLevel; label: string; ielts: number }[] = [
  { value: "none", label: "Почти не говорю", ielts: 0 },
  { value: "basic", label: "Базовый (A2–B1)", ielts: 4.0 },
  { value: "ielts-5", label: "Средний (примерно IELTS 5.0–5.5)", ielts: 5.0 },
  { value: "ielts-6", label: "Уверенный (примерно IELTS 6.0)", ielts: 6.0 },
  { value: "ielts-7plus", label: "Продвинутый (IELTS 7.0+)", ielts: 7.0 },
];

export type LanguageTag = "kazakh" | "russian" | "english" | "german" | "french" | "chinese" | "spanish";

export const LANGUAGE_OPTIONS: { value: LanguageTag; label: string }[] = [
  { value: "kazakh", label: "Казахский" },
  { value: "russian", label: "Русский" },
  { value: "english", label: "Английский" },
  { value: "german", label: "Немецкий" },
  { value: "french", label: "Французский" },
  { value: "chinese", label: "Китайский" },
  { value: "spanish", label: "Испанский" },
];

// Страны из демо-датасета — список сознательно не «весь мир», а
// курируемый набор реальных направлений, по которым в датасете есть
// программы (см. data/universities.json → meta.countriesCovered).
export const TARGET_COUNTRY_OPTIONS: string[] = [
  "Казахстан",
  "США",
  "Великобритания",
  "Канада",
  "Германия",
  "Нидерланды",
  "Сингапур",
  "Южная Корея",
  "Япония",
  "Австралия",
  "ОАЭ",
  "Турция",
  "Франция",
  "Швейцария",
  "Гонконг",
  "Китай",
  "Малайзия",
  "Швеция",
  "Италия",
  "Чехия",
];

export type BudgetTier = "under-15k" | "15k-30k" | "30k-55k" | "55k-plus";

export const BUDGET_OPTIONS: { value: BudgetTier; label: string; maxUSD: number }[] = [
  { value: "under-15k", label: "До $15,000/год — нужен грант или стипендия", maxUSD: 15_000 },
  { value: "15k-30k", label: "$15,000–30,000/год", maxUSD: 30_000 },
  { value: "30k-55k", label: "$30,000–55,000/год", maxUSD: 55_000 },
  { value: "55k-plus", label: "$55,000+/год — готов(а) к топовым вузам США/Великобритании", maxUSD: 500_000 },
];

export type TimelineOption = "next-year" | "this-year" | "urgent";

export const TIMELINE_OPTIONS: { value: TimelineOption; label: string }[] = [
  { value: "next-year", label: "Через год-два, времени на подготовку много" },
  { value: "this-year", label: "В этом учебном году" },
  { value: "urgent", label: "Итоговые баллы уже есть — выбираю вуз прямо сейчас" },
];

export type ConstraintTag =
  | "needs-dorm"
  | "stay-in-region"
  | "work-while-study"
  | "grant-required"
  | "visa-support";

export const CONSTRAINT_OPTIONS: { value: ConstraintTag; label: string }[] = [
  { value: "needs-dorm", label: "Нужно общежитие" },
  { value: "stay-in-region", label: "Хочу остаться ближе к дому (СНГ / соседние страны)" },
  { value: "work-while-study", label: "Важно совмещать с подработкой" },
  { value: "grant-required", label: "Без гранта/стипендии поступление не потяну" },
  { value: "visa-support", label: "Нужна помощь с визой/иммиграционными вопросами" },
];

// v4: внеучебная активность и предпочтения по кампусу — реальные факторы
// college-admissions консультирования (olympiad/research-résumé усиливает
// профиль для selective-программ; предпочтение по типу кампуса влияет на
// то, насколько комфортным будет опыт обучения). Используются как лёгкие
// бонусные модификаторы скоринга, а не как жёсткий фильтр.
export type ActivityTag =
  | "olympiads"
  | "research-projects"
  | "hackathons"
  | "leadership-volunteering"
  | "sports"
  | "arts-creative"
  | "internships-work"
  | "open-source";

export const ACTIVITY_OPTIONS: { value: ActivityTag; label: string; hint: string }[] = [
  { value: "olympiads", label: "Олимпиады", hint: "Предметные, международные (IOI, IMO и т.д.)" },
  { value: "research-projects", label: "Исследовательские проекты", hint: "Научная работа, публикации, конференции" },
  { value: "hackathons", label: "Хакатоны", hint: "Командные проекты за ограниченное время" },
  { value: "open-source", label: "Open-source / pet-проекты", hint: "GitHub, личные и командные разработки" },
  { value: "internships-work", label: "Стажировки / работа", hint: "Опыт в IT-компаниях или проектах" },
  { value: "leadership-volunteering", label: "Лидерство / волонтёрство", hint: "Организация мероприятий, соц. проекты" },
  { value: "sports", label: "Спорт", hint: "Соревнования, спортивные достижения" },
  { value: "arts-creative", label: "Творчество", hint: "Музыка, дизайн, искусство" },
];

export type CampusPreference = "urban" | "suburban" | "campus-town" | "rural" | "no-preference";

export const CAMPUS_PREFERENCE_OPTIONS: { value: CampusPreference; label: string; hint: string }[] = [
  { value: "urban", label: "Большой город", hint: "Мегаполис, много возможностей вне учёбы" },
  { value: "suburban", label: "Пригород", hint: "Спокойнее, но рядом с крупным городом" },
  { value: "campus-town", label: "Университетский городок", hint: "Компактный кампус, студенческая атмосфера" },
  { value: "rural", label: "Сельская местность", hint: "Тихо, природа, минимум городской суеты" },
  { value: "no-preference", label: "Не принципиально", hint: "Готов(а) рассмотреть любой формат" },
];

export type PriorityTag = "cost" | "language" | "grant-chance" | "country" | "duration" | "career" | "ranking";

export const PRIORITY_OPTIONS: { value: PriorityTag; label: string }[] = [
  { value: "cost", label: "Стоимость обучения" },
  { value: "grant-chance", label: "Шанс на грант/стипендию" },
  { value: "language", label: "Язык обучения" },
  { value: "country", label: "Страна / расположение" },
  { value: "duration", label: "Формат и длительность" },
  { value: "career", label: "Перспективы трудоустройства" },
  { value: "ranking", label: "Репутация / рейтинг вуза" },
];

export interface StudentProfile {
  grade: GradeOption | null;
  directions: DirectionTag[];
  educationSystem: EducationSystem | null;
  gpa: number | null; // средний балл аттестата, 0-5 (или аналог)
  entScore: number | null; // 0-140, только для kz-ent
  ibScore: number | null; // 0-45, только для ib
  aLevelBand: ALevelBand | null; // только для a-level
  apCount: number | null; // 0-6, только для ap-us
  apAverageScore: number | null; // 1-5, только для ap-us
  satScore: number | null; // 400-1600, опционально для любой системы
  actScore: number | null; // 1-36, опционально для любой системы
  languages: LanguageTag[];
  englishLevel: EnglishLevel | null;
  targetCountries: string[]; // до 3 стран из TARGET_COUNTRY_OPTIONS
  budgetTier: BudgetTier | null;
  timeline: TimelineOption | null;
  constraints: ConstraintTag[];
  priorities: PriorityTag[]; // до 3, порядок = важность
  activities: ActivityTag[]; // v4: внеучебная активность
  campusPreference: CampusPreference | null; // v4: предпочтение по типу кампуса
}

export const EMPTY_PROFILE: StudentProfile = {
  grade: null,
  directions: [],
  educationSystem: null,
  gpa: null,
  entScore: null,
  ibScore: null,
  aLevelBand: null,
  apCount: null,
  apAverageScore: null,
  satScore: null,
  actScore: null,
  languages: [],
  englishLevel: null,
  targetCountries: [],
  budgetTier: null,
  timeline: null,
  constraints: [],
  priorities: [],
  activities: [],
  campusPreference: null,
};

export const PROFILE_FIELD_COUNT = 12; // количество карточек-шагов анкеты (для степпера)

interface ProfileState {
  profile: StudentProfile;
  profileStepIndex: number;
  furthestStageIndex: number; // самый дальний посещённый индекс в STAGES
  selectedUniversityIds: string[]; // выбраны пользователем для сравнения
  primaryUniversityId: string | null; // из чего строится roadmap
  roadmapDone: Record<string, boolean>;
  hasHydrated: boolean;

  updateProfile: (patch: Partial<StudentProfile>) => void;
  setProfileStepIndex: (i: number) => void;
  markStageVisited: (stage: Stage) => void;
  toggleUniversitySelection: (id: string) => void;
  setPrimaryUniversity: (id: string) => void;
  toggleRoadmapTask: (taskId: string) => void;
  resetAll: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_PROFILE,
      profileStepIndex: 0,
      furthestStageIndex: 0,
      selectedUniversityIds: [],
      primaryUniversityId: null,
      roadmapDone: {},
      hasHydrated: false,

      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),

      setProfileStepIndex: (i) => set({ profileStepIndex: i }),

      markStageVisited: (stage) => {
        const idx = STAGES.indexOf(stage);
        if (idx > get().furthestStageIndex) {
          set({ furthestStageIndex: idx });
        }
      },

      toggleUniversitySelection: (id) =>
        set((state) => {
          const exists = state.selectedUniversityIds.includes(id);
          const next = exists
            ? state.selectedUniversityIds.filter((x) => x !== id)
            : [...state.selectedUniversityIds, id].slice(-4); // максимум 4 в сравнении
          return { selectedUniversityIds: next };
        }),

      setPrimaryUniversity: (id) => set({ primaryUniversityId: id }),

      toggleRoadmapTask: (taskId) =>
        set((state) => ({
          roadmapDone: { ...state.roadmapDone, [taskId]: !state.roadmapDone[taskId] },
        })),

      resetAll: () =>
        set({
          profile: EMPTY_PROFILE,
          profileStepIndex: 0,
          furthestStageIndex: 0,
          selectedUniversityIds: [],
          primaryUniversityId: null,
          roadmapDone: {},
        }),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "fomouni-profile-store",
      version: 3,
      migrate: () => ({
        profile: EMPTY_PROFILE,
        profileStepIndex: 0,
        furthestStageIndex: 0,
        selectedUniversityIds: [],
        primaryUniversityId: null,
        roadmapDone: {},
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
