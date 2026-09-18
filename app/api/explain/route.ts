import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildFallbackExplanation } from "@/lib/fallbackText";
import type { StudentProfile } from "@/store/profileStore";
import type { MatchReason, UniversityProgram } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// POST /api/explain
// Единственная задача роута: превратить машинные причины совпадения
// (из lib/matcher.ts, не LLM) в 2-3 предложения человеческим языком.
// Ключ ANTHROPIC_API_KEY читается только здесь, на сервере — в браузер
// не передаётся ни при каких обстоятельствах.
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

interface ExplainRequestBody {
  profile: StudentProfile;
  program: UniversityProgram;
  reasons: MatchReason[];
  locale?: Locale;
}

function summarizeProfile(profile: StudentProfile): string {
  const bits: string[] = [];
  if (profile.grade) bits.push(`класс/статус: ${profile.grade}`);
  if (profile.directions.length) bits.push(`интересы: ${profile.directions.join(", ")}`);
  if (profile.educationSystem) bits.push(`система аттестации: ${profile.educationSystem}`);
  if (profile.entScore !== null) bits.push(`балл ЕНТ: ${profile.entScore}`);
  if (profile.ibScore !== null) bits.push(`балл IB: ${profile.ibScore}`);
  if (profile.aLevelBand) bits.push(`A-Level: ${profile.aLevelBand}`);
  if (profile.apAverageScore !== null) bits.push(`средний балл AP: ${profile.apAverageScore}`);
  if (profile.satScore !== null) bits.push(`SAT: ${profile.satScore}`);
  if (profile.actScore !== null) bits.push(`ACT: ${profile.actScore}`);
  if (profile.englishLevel) bits.push(`английский: ${profile.englishLevel}`);
  if (profile.budgetTier) bits.push(`бюджет: ${profile.budgetTier}`);
  if (profile.targetCountries.length) bits.push(`страны: ${profile.targetCountries.join(", ")}`);
  if (profile.priorities.length) bits.push(`приоритеты: ${profile.priorities.join(", ")}`);
  if (profile.activities.length) bits.push(`активность: ${profile.activities.join(", ")}`);
  return bits.join("; ") || "анкета заполнена частично";
}

export async function POST(req: NextRequest) {
  let body: ExplainRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const { profile, program, reasons, locale } = body;
  if (!program) {
    return NextResponse.json({ error: "Не передана программа" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      explanation: buildFallbackExplanation(profile, program, reasons ?? [], locale),
      source: "fallback",
      note: "ANTHROPIC_API_KEY не задан — используется офлайн-объяснение на основе rule-based причин.",
    });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";

    const reasonsText = (reasons ?? []).map((r) => `- ${r.label}`).join("\n") || "- явных причин не найдено, оцени по общим данным";
    const languageInstruction =
      locale === "en"
        ? "Write in English, warmly and specifically, 2-3 short sentences. "
        : "Пиши по-русски, тепло и конкретно, 2-3 коротких предложения. ";

    const message = await anthropic.messages.create({
      model,
      max_tokens: 220,
      system:
        "Ты — помощник сервиса поступления FomoUni. " +
        languageInstruction +
        "Объясняй, почему программа подходит именно этому абитуриенту, опираясь ТОЛЬКО на переданные факты анкеты и причины совпадения (эти факты — на русском, это нормально, отвечай в указанном языке). " +
        "Никогда не выдумывай баллы, дедлайны или гарантии поступления. Не используй проценты шансов поступления. " +
        "Не используй markdown, списки или заголовки — только связный текст.",
      messages: [
        {
          role: "user",
          content:
            `Анкета абитуриента: ${summarizeProfile(profile)}\n\n` +
            `Программа: ${program.program}, ${program.university}, город ${program.city}.\n\n` +
            `Причины совпадения (из rule-based скоринга):\n${reasonsText}\n\n` +
            `Напиши объяснение "почему подходит именно тебе".`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const explanation = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    if (!explanation) {
      return NextResponse.json({
        explanation: buildFallbackExplanation(profile, program, reasons ?? [], locale),
        source: "fallback",
      });
    }

    return NextResponse.json({ explanation, source: "llm" });
  } catch (err) {
    console.error("[/api/explain] Anthropic call failed:", err);
    return NextResponse.json({
      explanation: buildFallbackExplanation(profile, program, reasons ?? [], locale),
      source: "fallback",
      note: "Не удалось получить ответ от LLM — показан офлайн-фолбэк.",
    });
  }
}
