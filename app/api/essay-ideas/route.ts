import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildFallbackEssayIdeas } from "@/lib/fallbackText";
import type { StudentProfile } from "@/store/profileStore";
import type { UniversityProgram } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// POST /api/essay-ideas
// v3: брейнсторм 3 персональных углов для эссе/личного заявления по
// конкретной программе — не пишет эссе за абитуриента (это было бы нечестно
// по отношению к приёмной комиссии), а помогает найти о чём писать, опираясь
// на то, что реально есть в анкете. Ключ читается только на сервере.
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

interface EssayIdeasRequestBody {
  profile: StudentProfile;
  program: UniversityProgram;
  locale?: Locale;
}

function summarizeProfileForEssay(profile: StudentProfile): string {
  const bits: string[] = [];
  if (profile.directions.length) bits.push(`интересы/направление: ${profile.directions.join(", ")}`);
  if (profile.grade) bits.push(`этап: ${profile.grade}`);
  if (profile.languages.length) bits.push(`языки: ${profile.languages.join(", ")}`);
  if (profile.priorities.length) bits.push(`что важно при выборе: ${profile.priorities.join(", ")}`);
  if (profile.constraints.length) bits.push(`ограничения: ${profile.constraints.join(", ")}`);
  if (profile.activities.length) bits.push(`внеучебная активность (материал для эссе): ${profile.activities.join(", ")}`);
  return bits.join("; ") || "анкета заполнена частично";
}

export async function POST(req: NextRequest) {
  let body: EssayIdeasRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректное тело запроса" }, { status: 400 });
  }

  const { profile, program, locale } = body;
  if (!program) {
    return NextResponse.json({ error: "Не передана программа" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ideas: buildFallbackEssayIdeas(profile, program, locale),
      source: "fallback",
      note: "ANTHROPIC_API_KEY не задан — используется офлайн-брейнсторм на основе анкеты.",
    });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";

    const ideaLanguageInstruction =
      locale === "en"
        ? "Each angle — 1-2 sentences in ENGLISH, specific (not generic phrases like 'write about your passion for learning'), "
        : "Каждый угол — 1-2 предложения на русском, конкретный (не общие фразы вроде 'напишите о своей страсти к учёбе'), ";

    const message = await anthropic.messages.create({
      model,
      max_tokens: 420,
      system:
        "Ты — помощник по эссе сервиса поступления FomoUni. НЕ пиши эссе целиком и не выдумывай факты из жизни абитуриента. " +
        "Твоя задача — предложить РОВНО 3 конкретных, разных угла (о чём можно написать), опираясь только на переданные факты анкеты. " +
        ideaLanguageInstruction +
        "с советом, с чего начать текст (конкретная сцена/деталь, а не абстракция). " +
        'Верни СТРОГО валидный JSON вида {"ideas": ["...", "...", "..."]} без markdown и пояснений вокруг.',
      messages: [
        {
          role: "user",
          content:
            `Анкета абитуриента: ${summarizeProfileForEssay(profile)}\n\n` +
            `Программа: ${program.program}, ${program.university}, ${program.country}.\n` +
            `Тема эссе/личного заявления (ориентир): ${program.essayPrompt ?? "открытая тема"}\n\n` +
            `Предложи 3 угла для эссе.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    try {
      const cleaned = raw.replace(/^```json\s*|```$/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed.ideas) || parsed.ideas.length === 0) throw new Error("incomplete JSON");
      return NextResponse.json({ ideas: parsed.ideas.slice(0, 3), source: "llm" });
    } catch (parseErr) {
      console.error("[/api/essay-ideas] failed to parse LLM JSON:", parseErr, raw);
      return NextResponse.json({
        ideas: buildFallbackEssayIdeas(profile, program, locale),
        source: "fallback",
        note: "Ответ модели не удалось разобрать — показан офлайн-брейнсторм.",
      });
    }
  } catch (err) {
    console.error("[/api/essay-ideas] Anthropic call failed:", err);
    return NextResponse.json({
      ideas: buildFallbackEssayIdeas(profile, program, locale),
      source: "fallback",
      note: "Не удалось получить ответ от LLM — показан офлайн-брейнсторм.",
    });
  }
}
