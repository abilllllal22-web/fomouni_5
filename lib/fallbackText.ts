import { StudentProfile } from "@/store/profileStore";
import { getUserScoreForExamType, primaryExamForEducationSystem } from "./matcher";
import { EXAM_TYPE_LABEL, EXAM_TYPE_SCALE_MAX, MatchReason, UniversityProgram } from "./types";
import { Locale, examTypeLabel } from "./i18n";

// ---------------------------------------------------------------------------
// Детерминированные текстовые фолбэки на случай отсутствия ANTHROPIC_API_KEY
// или сбоя запроса к LLM. Гарантируют, что сценарий жюри работает даже без
// ключа — честно помечая источник текста как "fallback" в ответе API.
//
// v2: диагностика больше не завязана только на ЕНТ — смотрит на экзамен,
// релевантный education system пользователя (IB/A-Level/AP/SAT/ЕНТ).
// v5: locale-параметризовано — этот текст рендерится напрямую (не через
// LLM), поэтому при locale === "en" нужен реальный английский вывод, а не
// просто инструкция модели отвечать по-английски.
// ---------------------------------------------------------------------------

export function buildFallbackEssayIdeas(profile: StudentProfile, program: UniversityProgram, locale: Locale = "ru"): string[] {
  if (locale === "en") {
    const ideas: string[] = [];
    if (profile.directions.length > 0) {
      ideas.push(
        `Tell the story of a specific moment when you realized you were drawn to ${profile.directions.join(" / ")} — not in general terms, but through one episode (a project, a task, a competition).`
      );
    }
    ideas.push(
      `Connect your essay to something real at "${program.university}": a specific course, lab, professor, or feature of the "${program.program}" program — why there, not just any similar school.`
    );
    ideas.push(
      "Describe a difficulty you faced in your studies or a project, and what you actually DID about it, not just how you felt — admissions committees look for action, not only reflection."
    );
    if (program.essayPrompt) {
      ideas.push(`For the given prompt ("${program.essayPrompt}") — open with a concrete scene or moment, and save the reflection about yourself for the final paragraph.`);
    }
    return ideas.slice(0, 3);
  }

  const ideas: string[] = [];
  if (profile.directions.length > 0) {
    ideas.push(
      `Расскажите о конкретном моменте, когда вы поняли, что вас увлекает ${profile.directions.join(" / ")} — не общими словами, а через один эпизод (проект, задача, соревнование).`
    );
  }
  ideas.push(
    `Свяжите тему эссе с тем, что реально есть у вуза «${program.university}»: конкретный курс, лабораторию, профессора или проект программы «${program.program}» — почему именно там, а не в любом похожем вузе.`
  );
  ideas.push(
    "Опишите трудность, с которой столкнулись в учёбе или проекте, и что именно вы сделали, а не просто что почувствовали — приёмная комиссия ищет действие, а не только рефлексию."
  );
  if (program.essayPrompt) {
    ideas.push(`По заданной теме («${program.essayPrompt}») — начните с конкретной сцены/момента, а вывод про себя оставьте на последний абзац.`);
  }
  return ideas.slice(0, 3);
}

export function buildFallbackExplanation(
  _profile: StudentProfile,
  program: UniversityProgram,
  reasons: MatchReason[],
  locale: Locale = "ru"
): string {
  if (locale === "en") {
    if (reasons.length === 0) {
      return `"${program.program}" at ${program.university} makes the list based on your major — fill in more of the questionnaire for a more precise explanation.`;
    }
    const parts = reasons.slice(0, 3).map((r) => r.label.toLowerCase());
    return `This program matched on several points from your questionnaire: ${parts.join("; ")}. Still worth double-checking the final decision against the admissions office's website.`;
  }

  if (reasons.length === 0) {
    return `«${program.program}» в ${program.university} попадает в подборку по направлению — уточните анкету, чтобы получить более точное объяснение.`;
  }
  const parts = reasons.slice(0, 3).map((r) => r.label.toLowerCase());
  return `Эта программа подошла по нескольким пунктам вашей анкеты: ${parts.join("; ")}. Итоговое решение всё равно стоит сверить с сайтом приёмной комиссии.`;
}

export function buildFallbackDiagnosis(
  profile: StudentProfile,
  locale: Locale = "ru"
): {
  strengths: string;
  limitations: string;
  goal: string;
} {
  const primaryType = primaryExamForEducationSystem(profile.educationSystem);
  const primaryScore = primaryType ? getUserScoreForExamType(profile, primaryType) : null;

  if (locale === "en") {
    const strengthsParts: string[] = [];
    if (primaryType && primaryScore !== null) {
      const ratio = primaryScore / EXAM_TYPE_SCALE_MAX[primaryType];
      if (ratio >= 0.75) strengthsParts.push(`a high ${examTypeLabel("en", primaryType)} score (${primaryScore})`);
    }
    if (profile.gpa !== null) {
      const gpaScaleMax = profile.educationSystem === "ap-us" ? 4 : 5;
      if (profile.gpa / gpaScaleMax >= 0.9) strengthsParts.push(`a strong GPA (${profile.gpa})`);
    }
    if (profile.satScore && profile.satScore >= 1400) strengthsParts.push(`a high SAT score (${profile.satScore})`);
    if (profile.englishLevel === "ielts-6" || profile.englishLevel === "ielts-7plus")
      strengthsParts.push("confident English");
    if (profile.directions.length > 0) strengthsParts.push("a clearly defined area of interest");
    if (strengthsParts.length === 0) strengthsParts.push("a completed questionnaire with clear priorities");

    const limitationsParts: string[] = [];
    if (primaryType && primaryScore === null) {
      limitationsParts.push(`${examTypeLabel("en", primaryType)} not taken yet — program fit is a preliminary estimate`);
    } else if (!primaryType) {
      limitationsParts.push("grading system not specified — program fit is a preliminary estimate");
    }
    if (profile.budgetTier === "under-15k") limitationsParts.push("a limited budget — a grant or scholarship will be needed");
    if (profile.englishLevel === "none" || profile.englishLevel === "basic")
      limitationsParts.push("English is still at a basic level for programs with language requirements");
    if (limitationsParts.length === 0) limitationsParts.push("no significant limitations found in the questionnaire");

    const countryPart = profile.targetCountries.length > 0 ? ` in your priority countries (${profile.targetCountries.join(", ")})` : "";
    const goal =
      profile.directions.length > 0
        ? `It looks like the goal is to pursue an undergraduate degree in "${profile.directions.join(", ")}"${countryPart}, given the stated budget and timeline.`
        : "Your educational goal isn't fully specified by major yet — the recommendations below rely on the general parameters of your questionnaire.";

    return {
      strengths: `Strengths: ${strengthsParts.join(", ")}.`,
      limitations: `Limitations: ${limitationsParts.join(", ")}.`,
      goal,
    };
  }

  const strengthsParts: string[] = [];
  if (primaryType && primaryScore !== null) {
    const ratio = primaryScore / EXAM_TYPE_SCALE_MAX[primaryType];
    if (ratio >= 0.75) strengthsParts.push(`высокий балл ${EXAM_TYPE_LABEL[primaryType]} (${primaryScore})`);
  }
  if (profile.gpa !== null) {
    const gpaScaleMax = profile.educationSystem === "ap-us" ? 4 : 5;
    if (profile.gpa / gpaScaleMax >= 0.9) strengthsParts.push(`сильный средний балл аттестата (${profile.gpa})`);
  }
  if (profile.satScore && profile.satScore >= 1400) strengthsParts.push(`высокий балл SAT (${profile.satScore})`);
  if (profile.englishLevel === "ielts-6" || profile.englishLevel === "ielts-7plus")
    strengthsParts.push("уверенный английский язык");
  if (profile.directions.length > 0) strengthsParts.push("чётко определённое направление интересов");
  if (strengthsParts.length === 0) strengthsParts.push("заполненная анкета с понятными приоритетами");

  const limitationsParts: string[] = [];
  if (primaryType && primaryScore === null) {
    limitationsParts.push(`${EXAM_TYPE_LABEL[primaryType]} ещё не сдан(ы) — оценка соответствия программам предварительная`);
  } else if (!primaryType) {
    limitationsParts.push("система аттестации не уточнена — оценка соответствия программам предварительная");
  }
  if (profile.budgetTier === "under-15k") limitationsParts.push("ограниченный бюджет — потребуется грант или стипендия");
  if (profile.englishLevel === "none" || profile.englishLevel === "basic")
    limitationsParts.push("английский пока на базовом уровне для программ с языковыми требованиями");
  if (limitationsParts.length === 0) limitationsParts.push("существенных ограничений в анкете не выявлено");

  const countryPart = profile.targetCountries.length > 0 ? ` в приоритетных странах (${profile.targetCountries.join(", ")})` : "";
  const goal =
    profile.directions.length > 0
      ? `Похоже, цель — поступить на бакалавриат по направлению «${profile.directions.join(", ")}»${countryPart}, с учётом указанного бюджета и сроков.`
      : "Образовательная цель пока не уточнена по направлению — рекомендации ниже опираются на общие параметры анкеты.";

  return {
    strengths: `Сильные стороны: ${strengthsParts.join(", ")}.`,
    limitations: `Ограничения: ${limitationsParts.join(", ")}.`,
    goal,
  };
}
