import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildFallbackDiagnosis } from "@/lib/fallbackText";
import type { StudentProfile } from "@/store/profileStore";
import type { Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// POST /api/diagnosis
// Превращает анкету в краткую сводку: сильные стороны, ограничения,
// вероятная образовательная цель. Ключ читается только на сервере.
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

interface DiagnosisRequestBody {
  profile: StudentProfile;
  locale?: Locale;
}

function summarizeProfile(profile: StudentProfile): string {
  const bits: string[] = [];
  if (profile.grade) bits.push(`класс/статус: ${profile.grade}`);
  if (profile.directions.length) bits.push(`интересы: ${profile.directions.join(", ")}`);
  if (profile.educationSystem) bits.push(`система аттестации: ${profile.educationSystem}`);
  if (profile.gpa !== null) bits.push(`средний балл аттестата: ${profile.gpa}`);
  if (profile.entScore !== null) bits.push(`балл ЕНТ: ${profile.entScore}`);
  if (profile.ibScore !== null) bits.push(`балл IB: ${profile.ibScore}`);
  if (profile.aLevelBand) bits.push(`A-Level band: ${profile.aLevelBand}`);
  if (profile.apAverageScore !== null) bits.push(`средний балл AP: ${profile.apAverageScore} (${profile.apCount ?? 0} экзаменов)`);
  if (profile.satScore !== null) bits.push(`SAT: ${profile.satScore}`);
  if (profile.actScore !== null) bits.push(`ACT: ${profile.actScore}`);
  if (
    profile.entScore === null &&
    profile.ibScore === null &&
    !profile.aLevelBand &&
    profile.apAverageScore === null &&
    profile.satScore === null &&
    profile.actScore === null
  ) {
    bits.push("итоговые баллы ещё не сданы");
  }
  if (profile.languages.length) bits.push(`языки: ${profile.languages.join(", ")}`);
  if (profile.englishLevel) bits.push(`уровень английского: ${profile.englishLevel}`);
  if (profile.targetCountries.length) bits.push(`желаемые страны: ${profile.targetCountries.join(", ")}`);
  if (profile.budgetTier) bits.push(`бюджет: ${profile.budgetTier}`);
  if (profile.timeline) bits.push(`сроки: ${profile.timeline}`);
  if (profile.constraints.length) bits.push(`ограничения: ${profile.constraints.join(", ")}`);
  if (profile.priorities.length) bits.push(`приоритеты при выборе: ${profile.priorities.join(", ")}`);
  if (profile.activities.length) bits.push(`внеучебная активность: ${profile.activities.join(", ")}`);
  if (profile.campusPreference) bits.push(`предпочтение по кампусу: ${profile.campusPreference}`);
  return bits.join("; ");
}

export async function POST(req: NextRequest) {
  let body: DiagnosisRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const { profile, locale } = body;
  if (!profile) {
    return NextResponse.json({ error: "Не передан профиль" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ...buildFallbackDiagnosis(profile, locale),
      source: "fallback",
      note: "ANTHROPIC_API_KEY не задан — используется офлайн-диагностика на основе анкеты.",
    });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";

    const fieldLanguageInstruction =
      locale === "en"
        ? "Each field — 1-2 sentences in ENGLISH, human tone. "
        : "Каждое поле — 1-2 предложения на русском языке, человеческим тоном. ";

    const message = await anthropic.messages.create({
      model,
      max_tokens: 400,
      system:
        "Ты — диагностический модуль сервиса поступления FomoUni. На основе анкеты абитуриента верни СТРОГО валидный JSON " +
        'вида {"strengths": "...", "limitations": "...", "goal": "..."} без markdown и без пояснений вокруг. ' +
        fieldLanguageInstruction +
        "strengths — сильные стороны профиля; limitations — реальные ограничения (без драматизации); " +
        "goal — вероятная образовательная цель. Никогда не выдумывай факты, которых нет в анкете, не давай гарантий поступления.",
      messages: [
        {
          role: "user",
          content: `Анкета абитуриента: ${summarizeProfile(profile)}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    try {
      const cleaned = raw.replace(/^```json\s*|```$/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (!parsed.strengths || !parsed.limitations || !parsed.goal) throw new Error("incomplete JSON");
      return NextResponse.json({ ...parsed, source: "llm" });
    } catch (parseErr) {
      console.error("[/api/diagnosis] failed to parse LLM JSON:", parseErr, raw);
      return NextResponse.json({
        ...buildFallbackDiagnosis(profile, locale),
        source: "fallback",
        note: "Ответ модели не удалось разобрать — показан офлайн-фолбэк.",
      });
    }
  } catch (err) {
    console.error("[/api/diagnosis] Anthropic call failed:", err);
    return NextResponse.json({
      ...buildFallbackDiagnosis(profile, locale),
      source: "fallback",
      note: "Не удалось получить ответ от LLM — показан офлайн-фолбэк.",
    });
  }
}
