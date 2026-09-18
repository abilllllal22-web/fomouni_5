// Общие типы домена. Профиль пользователя живёт в store/profileStore.ts —
// здесь форма данных вуза/программы из демо-датасета + типы результата
// сопоставления. v2: глобальный охват стран + реальные системы экзаменов.

export type Direction = "IT" | "Engineering" | "Business" | "Economics" | "Finance";

// Реальные системы вступительных экзаменов/аттестации, которые действительно
// используются вузами при поступлении — не только казахстанский ЕНТ.
export type AcademicExamType = "ENT" | "SAT" | "ACT" | "IB" | "A-LEVEL" | "AP";

export const EXAM_TYPE_LABEL: Record<AcademicExamType, string> = {
  ENT: "ЕНТ (Казахстан)",
  SAT: "SAT",
  ACT: "ACT",
  IB: "IB Diploma",
  "A-LEVEL": "A-Level",
  AP: "AP (среднее по экзаменам)",
};

export const EXAM_TYPE_SCALE_MAX: Record<AcademicExamType, number> = {
  ENT: 140,
  SAT: 1600,
  ACT: 36,
  IB: 45,
  "A-LEVEL": 100, // нормализованный индекс A-Level (см. store: ALEVEL_BAND_OPTIONS)
  AP: 5,
};

// Программа принимает один или несколько путей поступления по баллам —
// это ближе к реальности, чем один жёсткий порог.
export interface AcademicExamRequirement {
  type: AcademicExamType;
  minScore: number;
}

export type CostTier = "low" | "medium" | "high" | "very-high";

// v3: поля, которые реально нужны для "серьёзного" продукта поступления —
// сложность конкурса, формат подачи (раунды), кампус, что ещё можно изучать,
// официальный портал подачи, тестовая политика (SAT/ACT: обязателен /
// опционален / не учитывается — часть вузов принципиально его не смотрит,
// например UC Berkeley — "test-blind"). Всё так же помечено как демо-ориентир.
export type CampusSetting = "urban" | "suburban" | "campus-town" | "rural";

export const CAMPUS_SETTING_LABEL: Record<CampusSetting, string> = {
  urban: "Большой город",
  suburban: "Пригород",
  "campus-town": "Компактный университетский город",
  rural: "Сельская местность",
};

export type TestPolicy = "required" | "optional" | "not-considered";

export const TEST_POLICY_LABEL: Record<TestPolicy, string> = {
  required: "SAT/ACT обязателен",
  optional: "SAT/ACT опционален (как один из путей)",
  "not-considered": "SAT/ACT не учитывается вузом",
};

export type ApplicationRoundType = "EA" | "ED" | "REA" | "RD" | "UCAS" | "Rolling";

export const ROUND_TYPE_LABEL: Record<ApplicationRoundType, string> = {
  EA: "Early Action (раньше, необязывающий)",
  ED: "Early Decision (раньше, обязывающий)",
  REA: "Restrictive Early Action",
  RD: "Regular Decision (основной поток)",
  UCAS: "UCAS (единая заявка UK)",
  Rolling: "Rolling (приём до заполнения мест)",
};

export interface ApplicationRound {
  type: ApplicationRoundType;
  deadline: string; // ISO date
  note?: string;
}

export interface Scholarship {
  name: string;
  coverage: string;
  note: string;
}

export interface UniversityProgram {
  id: string;
  university: string;
  program: string;
  faculty: string;
  direction: Direction[];
  degree: string;
  country: string;
  city: string;
  languageOfInstruction: string[];
  duration: string;
  tuitionPerYearUSD: number;
  costTier: CostTier;
  grantAvailable: boolean;
  grantNote: string;
  academicExams: AcademicExamRequirement[]; // принимаемые пути (ИЛИ между ними)
  ieltsMin: number | null;
  toeflMin: number | null;
  applicationDeadline: string; // ISO date — ближайший/основной дедлайн (для обратной совместимости)
  documentsDeadline: string; // ISO date
  website: string;
  isDemoData: boolean;
  highlights: string[];
  prestigeTag?: string; // например "Топ-20 мира по CS" — иллюстративно, помечено как демо

  // v3 —————————————————————————————————————————————————————————————
  acceptanceRatePercent: number | null; // демо-ориентир конкурса, не факт
  studentPopulation: number | null;
  campusSetting: CampusSetting | null;
  majorsOffered: string[]; // смежные программы того же вуза, для контекста
  applicationRounds: ApplicationRound[]; // раунды подачи (ED/EA/RD/UCAS/Rolling)
  essayPrompt: string | null; // ориентир по теме эссе/личного заявления (не дословная цитата вуза)
  scholarships: Scholarship[];
  testPolicy: TestPolicy;
  officialPortal: string; // например "Common App", "UCAS", "Портал вуза"
}

export interface UniversitiesDataset {
  meta: {
    audience: string;
    isDemoDataset: boolean;
    disclaimer: string;
    currency: string;
    intakeYear: string;
    countriesCovered: string[];
  };
  universities: UniversityProgram[];
}

// --- Результат сопоставления (matcher.ts) ---
// v3: классификация "reach/target/safety" — реальная практика college
// counseling (CollegeVine, Common App-консультанты) для сборки
// сбалансированного списка вузов. Эвристика на основе конкурса и скора
// совпадения — явно помечена как ориентир, не гарантия поступления.
export type MatchTier = "reach" | "target" | "safety";

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  reach: "Reach (амбициозный)",
  target: "Target (реалистичный)",
  safety: "Safety (надёжный)",
};

export interface MatchResult {
  program: UniversityProgram;
  score: number; // 0..100, относительный скор
  reasons: MatchReason[]; // машинные причины для читаемого объяснения без LLM
  budgetFit: "within" | "tight" | "over";
  examFit: "meets" | "close" | "below" | "unknown";
  matchedExam: AcademicExamType | null;
  tier: MatchTier;
}

export interface MatchReason {
  field: "direction" | "budget" | "exam" | "language" | "country" | "grant" | "ranking";
  label: string;
}

// --- Roadmap ---
export type RoadmapTaskCategory = "exam" | "document" | "academic" | "activity" | "deadline";
export type RoadmapTaskStatus = "not-started" | "in-progress" | "done";

export interface RoadmapTask {
  id: string;
  category: RoadmapTaskCategory;
  title: string;
  description: string;
  date: string | null; // ISO date или null, если не датировано
  isDemoDate: boolean;
  sourceUrl?: string;
  universityId?: string;
}

// v9: общий цвет-код категорий задач — раньше был продублирован в
// app/calendar/page.tsx; вынесен сюда, т.к. теперь используется и в
// CalendarMonthGrid, и в demo-превью календаря на лендинге.
export const ROADMAP_CATEGORY_DOT: Record<RoadmapTaskCategory, string> = {
  exam: "bg-coral-500",
  document: "bg-brand-500",
  academic: "bg-ink-600",
  activity: "bg-amber-500",
  deadline: "bg-emerald-600",
};
