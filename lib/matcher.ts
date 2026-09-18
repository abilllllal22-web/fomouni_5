import {
  ActivityTag,
  ALEVEL_BAND_OPTIONS,
  BUDGET_OPTIONS,
  DirectionTag,
  EducationSystem,
  ENGLISH_LEVEL_OPTIONS,
  LanguageTag,
  StudentProfile,
} from "@/store/profileStore";
import {
  AcademicExamType,
  Direction,
  EXAM_TYPE_LABEL,
  MatchReason,
  MatchResult,
  MatchTier,
  UniversityProgram,
} from "./types";

// ---------------------------------------------------------------------------
// lib/matcher.ts — ЧИСТАЯ детерминированная функция сопоставления.
// НЕ вызывает LLM: только rule-based фильтрация и скоринг, чтобы жюри могло
// повторить любой результат вручную и результат был объяснимым.
//
// v2: программа может принимать НЕСКОЛЬКО реальных путей поступления
// (SAT/ACT/IB/A-Level/AP/ЕНТ) — сравниваем профиль по каждому и берём
// лучший результат, а не один жёсткий порог. Итоговый скор 0..100:
//   направление        — 25
//   бюджет              — 20
//   академический экзамен — 20
//   английский язык (IELTS/TOEFL) — 15
//   язык обучения        — 10
//   страна               — 10
//   (+/- 5 модификатор, если для пользователя критичен грант)
// ---------------------------------------------------------------------------

const DIRECTION_TO_BROAD: Record<DirectionTag, Direction[]> = {
  programming: ["IT"],
  "data-science": ["IT"],
  "ai-ml": ["IT"],
  "robotics-engineering": ["Engineering"],
  "electrical-hardware": ["Engineering"],
  "telecom-networks": ["Engineering", "IT"],
  cybersecurity: ["IT"],
  "game-dev": ["IT"],
  "product-hci": ["IT"],
  "business-management": ["Business"],
  economics: ["Economics"],
  finance: ["Finance"],
};

const DIRECTION_KEYWORDS: Record<DirectionTag, string[]> = {
  programming: ["computer science", "software", "программ", "информационные системы", "информатика", "computing", "computer engineering"],
  "data-science": ["data science", "аналитик", "данных", "bioinformatics", "business informatics"],
  "ai-ml": ["artificial intelligence", "machine learning", " ai ", "ai &", "нейросет", "искусственн"],
  "robotics-engineering": ["робот", "мехатрон", "автоматизац", "engineering", "инженер", "mechanical", "industrial engineering"],
  "electrical-hardware": ["electrical", "электротехник", "электроэнергетик", "электроник", "hardware", "materials", "материаловедение", "chip"],
  "telecom-networks": ["телеком", "связь", "сет", "network", "transport"],
  cybersecurity: ["кибербезопасност", "безопасност", "cyber"],
  "game-dev": ["game", "геймдизайн", "геймдев"],
  "product-hci": ["ux", "ui", "hci", "human-computer", "product", "продуктов", "дизайн интерфейс"],
  "business-management": ["business", "management", "бизнес", "менеджмент", "entrepreneurship", "предпринимат", "strategy", "стратег"],
  economics: ["economics", "экономик", "econometrics", "политик", "policy"],
  finance: ["finance", "финанс", "accounting", "бухучет", "бухгалтер", "investment", "инвестиц", "banking", "банкинг"],
};

/**
 * v5 — переиспользуемая проверка "программа относится к направлению X" для
 * тонкого фильтра каталога /explore (раньше там было только грубое деление
 * IT/Engineering). Осознанно мягче, чем scoreDirection() выше (без строгого
 * требования keyword-совпадения в названии) — для каталога важнее не
 * потерять релевантную программу, чем показать одну лишнюю.
 */
export function programMatchesDirectionTag(program: UniversityProgram, dir: DirectionTag): boolean {
  const broad = DIRECTION_TO_BROAD[dir];
  return broad.some((b) => program.direction.includes(b));
}

const LANGUAGE_LABEL_TO_TAG: Record<string, LanguageTag> = {
  "Казахский": "kazakh",
  "Русский": "russian",
  "Английский": "english",
  "Немецкий": "german",
  "Французский": "french",
  "Китайский": "chinese",
  "Испанский": "spanish",
};

export function formatUSD(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })}k`;
  }
  return `$${value}`;
}

function scoreDirection(profile: StudentProfile, program: UniversityProgram) {
  if (profile.directions.length === 0) return { points: 12, reason: null as MatchReason | null };
  let best = 0;
  let matchedLabel: string | null = null;
  for (const dir of profile.directions) {
    const broad = DIRECTION_TO_BROAD[dir];
    if (!broad.some((b) => program.direction.includes(b))) continue;
    const keywords = DIRECTION_KEYWORDS[dir];
    // v4: ищем совпадение не только в названии программы/факультета, но и
    // среди смежных майджоров вуза (majorsOffered) — расширенный список
    // направлений (AI/ML, game-dev, HCI, hardware) иначе почти никогда бы
    // не находил ключевое слово в узком поле program+faculty.
    const text = `${program.program} ${program.faculty} ${program.majorsOffered.join(" ")}`.toLowerCase();
    const keywordHit = keywords.some((k) => text.includes(k));
    const points = keywordHit ? 25 : 15;
    if (points > best) {
      best = points;
      matchedLabel = program.program;
    }
  }
  if (best === 0) return { points: 0, reason: null };
  return {
    points: best,
    reason: { field: "direction", label: `Программа «${matchedLabel}» совпадает с выбранным направлением` } as MatchReason,
  };
}

function scoreBudget(profile: StudentProfile, program: UniversityProgram) {
  if (!profile.budgetTier) return { points: 10, fit: "within" as const, reason: null };
  const tier = BUDGET_OPTIONS.find((b) => b.value === profile.budgetTier)!;
  const ratio = program.tuitionPerYearUSD / tier.maxUSD;
  if (ratio <= 1) {
    return {
      points: 20,
      fit: "within" as const,
      reason: { field: "budget", label: `Стоимость ~${formatUSD(program.tuitionPerYearUSD)}/год укладывается в указанный бюджет` } as MatchReason,
    };
  }
  if (ratio <= 1.25) {
    return {
      points: 9,
      fit: "tight" as const,
      reason: { field: "budget", label: `Стоимость немного выше бюджета, но реалистична при гранте` } as MatchReason,
    };
  }
  return {
    points: program.grantAvailable ? 5 : 0,
    fit: "over" as const,
    reason: program.grantAvailable
      ? ({ field: "budget", label: `Дороже указанного бюджета, но доступны гранты/стипендии` } as MatchReason)
      : null,
  };
}

/** Какой тип экзамена дневник/аттестат пользователя делает «основным» —
 * используется для roadmap и диагностики, чтобы не спрашивать про SAT
 * IB-шника или про ЕНТ американского школьника. */
export function primaryExamForEducationSystem(system: EducationSystem | null): AcademicExamType | null {
  switch (system) {
    case "kz-ent":
      return "ENT";
    case "ib":
      return "IB";
    case "a-level":
      return "A-LEVEL";
    case "ap-us":
      return "AP";
    default:
      return null;
  }
}

export function getUserScoreForExamType(profile: StudentProfile, type: AcademicExamType): number | null {
  switch (type) {
    case "ENT":
      return profile.entScore;
    case "SAT":
      return profile.satScore;
    case "ACT":
      return profile.actScore;
    case "IB":
      return profile.ibScore;
    case "A-LEVEL":
      return profile.aLevelBand ? ALEVEL_BAND_OPTIONS.find((b) => b.value === profile.aLevelBand)!.index : null;
    case "AP":
      return profile.apAverageScore;
  }
}

function scoreAcademicExam(profile: StudentProfile, program: UniversityProgram) {
  let best: { ratio: number; type: AcademicExamType } | null = null;
  for (const req of program.academicExams) {
    const userScore = getUserScoreForExamType(profile, req.type);
    if (userScore === null) continue;
    const ratio = userScore / req.minScore;
    if (!best || ratio > best.ratio) best = { ratio, type: req.type };
  }
  if (!best) {
    // Профиль не даёт ни одного балла из принимаемых вузом путей — это не
    // повод занижать оценку до нуля (например, ЕНТ ещё не сдан): честно
    // считаем это нейтральным, а не провалом.
    return { points: 8, fit: "unknown" as const, matchedExam: null as AcademicExamType | null, reason: null };
  }
  if (best.ratio >= 1) {
    return {
      points: 20,
      fit: "meets" as const,
      matchedExam: best.type,
      reason: { field: "exam", label: `Балл ${EXAM_TYPE_LABEL[best.type]} соответствует порогу программы` } as MatchReason,
    };
  }
  if (best.ratio >= 0.85) {
    return {
      points: 10,
      fit: "close" as const,
      matchedExam: best.type,
      reason: { field: "exam", label: `Балл ${EXAM_TYPE_LABEL[best.type]} близок к порогу программы` } as MatchReason,
    };
  }
  return { points: 2, fit: "below" as const, matchedExam: best.type, reason: null };
}

function scoreEnglish(profile: StudentProfile, program: UniversityProgram) {
  if (program.ieltsMin === null) return { points: 12, reason: null };
  if (!profile.englishLevel) return { points: 6, reason: null };
  const userIelts = ENGLISH_LEVEL_OPTIONS.find((e) => e.value === profile.englishLevel)!.ielts;
  if (userIelts >= program.ieltsMin) {
    return {
      points: 15,
      reason: { field: "language", label: `Уровень английского соответствует требованию IELTS ${program.ieltsMin}+` } as MatchReason,
    };
  }
  if (userIelts >= program.ieltsMin - 1) {
    return {
      points: 7,
      reason: { field: "language", label: `Уровень английского почти достигает требования IELTS ${program.ieltsMin}` } as MatchReason,
    };
  }
  return { points: 1, reason: null };
}

function scoreLanguageOfInstruction(profile: StudentProfile, program: UniversityProgram) {
  if (profile.languages.length === 0) return { points: 6, reason: null };
  const programTags = program.languageOfInstruction.map((l) => LANGUAGE_LABEL_TO_TAG[l]).filter(Boolean);
  const overlap = programTags.filter((t) => profile.languages.includes(t));
  if (overlap.length > 0) {
    return {
      points: 10,
      reason: { field: "language", label: `Обучение доступно на языке, которым вы владеете (${program.languageOfInstruction.join(", ")})` } as MatchReason,
    };
  }
  return { points: 0, reason: null };
}

function scoreCountry(profile: StudentProfile, program: UniversityProgram) {
  if (profile.targetCountries.length === 0) return { points: 6, reason: null };
  if (profile.targetCountries.includes(program.country)) {
    return { points: 10, reason: { field: "country", label: `Программа в стране, которую вы указали (${program.country})` } as MatchReason };
  }
  return { points: 0, reason: null };
}

function scoreGrantModifier(profile: StudentProfile, program: UniversityProgram) {
  if (!profile.constraints.includes("grant-required")) return { points: 0, reason: null };
  if (program.grantAvailable) {
    return { points: 5, reason: { field: "grant", label: `Доступны гранты/стипендии — важно для вашего бюджета` } as MatchReason };
  }
  return { points: -5, reason: null };
}

// v4: лёгкие бонусные модификаторы — не входят в основные 100 очков-баллов,
// а слегка подталкивают итоговый скор, отражая реальную практику отбора
// (сильное портфолио активностей важнее для selective-программ; тип кампуса
// влияет на субъективный "fit", но не должен жёстко отсекать программу).
const SELECTIVE_ACTIVITY_TAGS: ActivityTag[] = ["olympiads", "research-projects", "open-source"];

function scoreActivitiesModifier(profile: StudentProfile, program: UniversityProgram) {
  if (profile.activities.length === 0) return { points: 0, reason: null };
  const isSelective = program.acceptanceRatePercent !== null && program.acceptanceRatePercent <= 25;
  const hasStrongActivity = profile.activities.some((a) => SELECTIVE_ACTIVITY_TAGS.includes(a));
  if (isSelective && hasStrongActivity) {
    return {
      points: 4,
      reason: { field: "ranking", label: `Портфолио активностей (олимпиады/проекты) усиливает заявку на конкурсную программу` } as MatchReason,
    };
  }
  if (profile.activities.includes("internships-work") && program.direction.includes("IT")) {
    return { points: 2, reason: null };
  }
  return { points: 0, reason: null };
}

function scoreCampusPreferenceModifier(profile: StudentProfile, program: UniversityProgram) {
  if (!profile.campusPreference || profile.campusPreference === "no-preference") return { points: 0, reason: null };
  if (!program.campusSetting) return { points: 0, reason: null };
  if (profile.campusPreference === program.campusSetting) {
    return { points: 3, reason: { field: "ranking", label: `Тип кампуса совпадает с вашим предпочтением` } as MatchReason };
  }
  return { points: 0, reason: null };
}

/**
 * Reach / Target / Safety — реальная практика college-counseling (так
 * называет свои категории и CollegeVine): не наш скор сам по себе, а
 * сочетание конкурса программы (acceptanceRatePercent) и того, насколько
 * профиль соответствует программе (score). Явная эвристика — комментируется
 * в интерфейсе как ориентир, а не гарантия поступления.
 */
export function classifyTier(score: number, acceptanceRatePercent: number | null): MatchTier {
  if (acceptanceRatePercent === null) {
    return score >= 55 ? "target" : "reach";
  }
  if (acceptanceRatePercent <= 15) return "reach";
  if (acceptanceRatePercent <= 35) return score >= 70 ? "target" : "reach";
  if (acceptanceRatePercent <= 60) return score >= 55 ? "target" : "reach";
  return score >= 60 ? "safety" : "target";
}

/**
 * Основная функция сопоставления. Возвращает ВСЕ программы из датасета,
 * отсортированные по убыванию скора — компонент рекомендаций сам решает,
 * сколько показать (минимум 3 по требованиям кейса).
 */
export function matchUniversities(
  profile: StudentProfile,
  universities: UniversityProgram[]
): MatchResult[] {
  const results = universities.map((program) => {
    const direction = scoreDirection(profile, program);
    const budget = scoreBudget(profile, program);
    const exam = scoreAcademicExam(profile, program);
    const english = scoreEnglish(profile, program);
    const language = scoreLanguageOfInstruction(profile, program);
    const country = scoreCountry(profile, program);
    const grant = scoreGrantModifier(profile, program);
    const activities = scoreActivitiesModifier(profile, program);
    const campus = scoreCampusPreferenceModifier(profile, program);

    const score = Math.max(
      0,
      Math.min(
        100,
        direction.points +
          budget.points +
          exam.points +
          english.points +
          language.points +
          country.points +
          grant.points +
          activities.points +
          campus.points
      )
    );

    const reasons = [
      direction.reason,
      budget.reason,
      exam.reason,
      english.reason,
      language.reason,
      country.reason,
      grant.reason,
      activities.reason,
      campus.reason,
    ].filter((r): r is MatchReason => r !== null);

    const result: MatchResult = {
      program,
      score,
      reasons,
      budgetFit: budget.fit,
      examFit: exam.fit,
      matchedExam: exam.matchedExam,
      tier: classifyTier(score, program.acceptanceRatePercent),
    };
    return result;
  });

  return results.sort((a, b) => b.score - a.score);
}
