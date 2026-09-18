import { ENGLISH_LEVEL_OPTIONS, StudentProfile } from "@/store/profileStore";
import { getUserScoreForExamType, primaryExamForEducationSystem } from "./matcher";
import {
  AcademicExamRequirement,
  AcademicExamType,
  EXAM_TYPE_LABEL,
  ROUND_TYPE_LABEL,
  RoadmapTask,
  TEST_POLICY_LABEL,
  UniversityProgram,
} from "./types";
import { Locale, examTypeLabel, roundTypeLabel, testPolicyLabel } from "./i18n";

// ---------------------------------------------------------------------------
// lib/roadmapGenerator.ts — rule-based построение персонального плана.
// НЕ вызывает LLM: даты и шаги выводятся из данных выбранной программы
// (dataset помечен как demo) и из ответов анкеты. Любая дата, взятая из
// датасета, помечается isDemoDate=true и снабжается sourceUrl на сайт вуза —
// того требуют правила кейса ("демонстрационные данные, уточняйте на сайте").
//
// v2: программа принимает несколько путей поступления (ЕНТ/SAT/ACT/IB/
// A-Level/AP). Roadmap выбирает путь, реально относящийся к системе
// аттестации пользователя (profile.educationSystem), а не жёстко ЕНТ+IELTS.
//
// v3: добавлены задачи, которые реально есть в любой заявке — эссе/личное
// заявление (essayPrompt) и рекомендательные письма — и дедлайны берутся из
// applicationRounds (несколько раундов: EA/ED/RD/UCAS/Rolling), а не из
// одного applicationDeadline, чтобы roadmap отражал реальный процесс подачи.
//
// v5: locale-параметризовано — эти title/description рендерятся напрямую
// (не через LLM), поэтому при locale === "en" нужны реальные английские
// шаблоны, а не перевод "на лету".
// ---------------------------------------------------------------------------

function daysBefore(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function examPrepDescription(type: AcademicExamType, locale: Locale): string {
  if (locale === "en") {
    switch (type) {
      case "ENT":
        return "Register for the ENT early and choose subject tests that match the program's field.";
      case "SAT":
        return "Register for the SAT through College Board, pick a date with buffer time (in case a retake is needed), and work through practice tests in math and English.";
      case "ACT":
        return "Register for the ACT and plan prep across all sections (Math, Science, English, Reading) with buffer time for a possible retake.";
      case "IB":
        return "Confirm predicted grades with your IB coordinator and focus on the HL subjects that matter most for the program.";
      case "A-LEVEL":
        return "Plan your A-Level subject combination so your final (or predicted) grades clear the program's threshold, and check the exam session deadlines.";
      case "AP":
        return "Choose AP exams relevant to the program's field and plan your prep so your average score clears the university's threshold.";
      default:
        return "Check the entrance exam format with the admissions office and build a prep plan early.";
    }
  }
  switch (type) {
    case "ENT":
      return "Зарегистрируйтесь на ЕНТ заранее и выберите профильные предметы в соответствии с направлением программы.";
    case "SAT":
      return "Запишитесь на SAT через College Board, выберите дату с запасом (при необходимости — на пересдачу) и проработайте пробные тесты по математике и english.";
    case "ACT":
      return "Запишитесь на ACT, распределите подготовку по всем секциям (Math, Science, English, Reading) с запасом на возможную пересдачу.";
    case "IB":
      return "Согласуйте с координатором IB предсказанные баллы (predicted grades) и держите фокус на профильных HL-предметах, важных для программы.";
    case "A-LEVEL":
      return "Спланируйте набор предметов A-Level так, чтобы итоговые оценки (или предсказанные грейды) закрывали порог программы, и уточните дедлайны экзаменационной сессии.";
    case "AP":
      return "Выберите профильные AP-экзамены по направлению программы и распределите подготовку так, чтобы средний балл был выше порога вуза.";
    default:
      return "Уточните формат вступительного экзамена в приёмной комиссии и составьте план подготовки заранее.";
  }
}

/**
 * Какое требование по экзамену из принимаемых вузом путей действительно
 * актуально для этого пользователя: сперва пробуем путь, соответствующий
 * его школьной системе (educationSystem), иначе берём первый принимаемый
 * вузом путь — так roadmap не потеряет экзаменационный шаг вовсе.
 */
function pickRelevantExamRequirement(
  profile: StudentProfile,
  program: UniversityProgram
): AcademicExamRequirement | null {
  if (program.academicExams.length === 0) return null;
  const primaryType = primaryExamForEducationSystem(profile.educationSystem);
  if (primaryType) {
    const matched = program.academicExams.find((r) => r.type === primaryType);
    if (matched) return matched;
  }
  return program.academicExams[0];
}

export function generateRoadmap(profile: StudentProfile, program: UniversityProgram, locale: Locale = "ru"): RoadmapTask[] {
  const en = locale === "en";
  const tasks: RoadmapTask[] = [];
  const rounds = program.applicationRounds.length > 0
    ? program.applicationRounds
    : [{ type: "RD" as const, deadline: program.applicationDeadline }];
  const earliestDeadline = rounds.map((r) => r.deadline).sort()[0];

  // 1. Экзамен — путь, релевантный системе аттестации пользователя
  const examReq = pickRelevantExamRequirement(profile, program);
  if (examReq) {
    const userScore = getUserScoreForExamType(profile, examReq.type);
    if (userScore === null) {
      tasks.push({
        id: `${program.id}-exam`,
        category: "exam",
        title: en
          ? `Take the ${examTypeLabel("en", examReq.type)} (program threshold: ${examReq.minScore}+)`
          : `Сдать ${EXAM_TYPE_LABEL[examReq.type]} (порог программы: от ${examReq.minScore})`,
        description: examPrepDescription(examReq.type, locale),
        date: daysBefore(earliestDeadline, 25),
        isDemoDate: true,
        sourceUrl: program.website,
        universityId: program.id,
      });
    }
  }
  if ((examReq?.type === "SAT" || examReq?.type === "ACT") && program.testPolicy === "not-considered") {
    tasks.push({
      id: `${program.id}-exam-note`,
      category: "exam",
      title: en
        ? `${program.university} does not consider SAT/ACT for admission`
        : `${program.university} не учитывает SAT/ACT при приёме`,
      description: en
        ? `${testPolicyLabel("en", program.testPolicy)} — don't spend time prepping for this test specifically for this program; focus on GPA/relevant subjects instead.`
        : `${TEST_POLICY_LABEL[program.testPolicy]} — не тратьте время на подготовку к этому тесту специально ради этой программы, сфокусируйтесь на GPA/профильных предметах.`,
      date: null,
      isDemoDate: true,
      sourceUrl: program.website,
      universityId: program.id,
    });
  }

  // 2. Английский язык — IELTS/TOEFL порог программы
  if (program.ieltsMin !== null) {
    const userIelts = profile.englishLevel
      ? ENGLISH_LEVEL_OPTIONS.find((e) => e.value === profile.englishLevel)!.ielts
      : 0;
    if (userIelts < program.ieltsMin) {
      tasks.push({
        id: `${program.id}-ielts`,
        category: "exam",
        title: en
          ? `Prepare for and take IELTS/TOEFL (need IELTS ${program.ieltsMin}+)`
          : `Подготовиться и сдать IELTS/TOEFL (нужно от IELTS ${program.ieltsMin})`,
        description: en
          ? "Plan for prep courses and book the exam with a 2-3 month buffer."
          : "Запланируйте подготовительные курсы и запись на экзамен с запасом в 2–3 месяца.",
        date: daysBefore(earliestDeadline, 60),
        isDemoDate: true,
        sourceUrl: program.website,
        universityId: program.id,
      });
    }
  }

  // 3. Эссе / личное заявление
  if (program.essayPrompt) {
    tasks.push({
      id: `${program.id}-essay`,
      category: "document",
      title: en
        ? `Write your essay / personal statement (${program.officialPortal})`
        : `Написать эссе / личное заявление (${program.officialPortal})`,
      description: en
        ? `Prompt reference: "${program.essayPrompt}". Budget at least 2-3 drafts and time for feedback from a teacher/mentor.`
        : `Ориентир по теме: «${program.essayPrompt}». Заложите минимум 2–3 черновика и время на обратную связь от учителя/наставника.`,
      date: daysBefore(earliestDeadline, 30),
      isDemoDate: true,
      sourceUrl: program.website,
      universityId: program.id,
    });
  }

  // 4. Рекомендательные письма — практически всегда нужны минимум 1-2
  tasks.push({
    id: `${program.id}-recommendations`,
    category: "document",
    title: en ? "Request recommendation letters from 1-2 teachers" : "Запросить рекомендательные письма у 1–2 учителей",
    description: en
      ? "Ask at least a month ahead — teachers in subjects relevant to your major write stronger, more specific letters. Give them context: your list of programs and deadlines."
      : "Попросите заранее (минимум за месяц) — учителя по профильным предметам направления пишут более сильные и конкретные письма. Дайте им контекст: список программ и дедлайны.",
    date: daysBefore(earliestDeadline, 35),
    isDemoDate: true,
    sourceUrl: program.website,
    universityId: program.id,
  });

  // 5. Документы — из дедлайна датасета (демо)
  tasks.push({
    id: `${program.id}-documents`,
    category: "document",
    title: en ? "Gather your document package" : "Собрать пакет документов",
    description: en
      ? "Transcript/diploma (or predicted grades), ID/passport, exam results, a photo — check the exact list with the admissions office."
      : "Аттестат/диплом (или предсказанные баллы), удостоверение личности/паспорт, результаты профильных экзаменов, фото — точный список уточняйте в приёмной комиссии.",
    date: program.documentsDeadline,
    isDemoDate: true,
    sourceUrl: program.website,
    universityId: program.id,
  });

  // 6. Подача заявления — по каждому раунду отдельно (EA/ED/RD/UCAS/Rolling)
  rounds.forEach((round, i) => {
    tasks.push({
      id: `${program.id}-application-${round.type}-${i}`,
      category: "deadline",
      title: en
        ? rounds.length > 1
          ? `Submit your application to ${program.university} — ${round.type} round`
          : `Submit your application to ${program.university}`
        : rounds.length > 1
          ? `Подать заявление в ${program.university} — раунд ${round.type}`
          : `Подать заявление в ${program.university}`,
      description: en
        ? `${roundTypeLabel("en", round.type)}${round.note ? " — " + round.note : ""}. Portal: ${program.officialPortal}.`
        : `${ROUND_TYPE_LABEL[round.type]}${round.note ? " — " + round.note : ""}. Портал: ${program.officialPortal}.`,
      date: round.deadline,
      isDemoDate: true,
      sourceUrl: program.website,
      universityId: program.id,
    });
  });

  // 7. Грант/стипендия — если для профиля это важно и она доступна
  if (profile.constraints.includes("grant-required") && program.scholarships.length > 0) {
    tasks.push({
      id: `${program.id}-grant`,
      category: "document",
      title: en ? "Check requirements and apply for a grant/scholarship" : "Уточнить условия и подать на грант/стипендию",
      description: program.scholarships[0].note,
      date: daysBefore(earliestDeadline, 10),
      isDemoDate: true,
      sourceUrl: program.website,
      universityId: program.id,
    });
  }

  // 8. Академический шаг — конкретный к пути поступления
  tasks.push({
    id: `${program.id}-academic`,
    category: "academic",
    title: en ? "Strengthen your core subjects" : "Подтянуть профильные предметы",
    description: en
      ? examReq
        ? `Focus on the subjects that matter most for ${examTypeLabel("en", examReq.type)} and the program's field — this is the foundation of your final result.`
        : "Deepen your math/physics and English — this is the foundation for the internal exam and interview."
      : examReq
        ? `Сфокусируйтесь на предметах, важных для ${EXAM_TYPE_LABEL[examReq.type]} и направления программы — это основа итогового результата.`
        : "Углубите профильную математику/физику и английский — это основа для внутреннего экзамена и собеседования.",
    date: null,
    isDemoDate: false,
    universityId: program.id,
  });

  // 9. Активность, усиливающая заявку
  tasks.push({
    id: `${program.id}-activity`,
    category: "activity",
    title: en ? "Strengthen your application with relevant activities" : "Усилить заявку профильной активностью",
    description: en
      ? "Participation in an olympiad, hackathon, research, or a project related to the program's field — adds to your portfolio, essay, and recommendation letters."
      : "Участие в олимпиаде, хакатоне, исследовательском или профильном проекте по направлению программы — плюс к портфолио, эссе и рекомендательным письмам.",
    date: null,
    isDemoDate: false,
    universityId: program.id,
  });

  // Сортировка: сначала задачи с датой (по возрастанию), затем без даты
  return tasks.sort((a, b) => {
    if (a.date && b.date) return a.date.localeCompare(b.date);
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return 0;
  });
}

/**
 * Следующее действие — первая невыполненная задача в отсортированном
 * порядке (сначала ближайшие по дате, затем недатированные).
 */
export function getNextAction(
  tasks: RoadmapTask[],
  doneMap: Record<string, boolean>
): RoadmapTask | null {
  return tasks.find((t) => !doneMap[t.id]) ?? null;
}
