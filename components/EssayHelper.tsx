"use client";

import { useState } from "react";
import { UniversityProgram } from "@/lib/types";
import { StudentProfile } from "@/store/profileStore";
import { ErrorState } from "./states/ErrorState";
import { ExplanationSkeleton } from "./states/Skeletons";
import { useT, useLocale } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// v3: брейнсторм эссе — не пишет текст за абитуриента, а предлагает 3 угла,
// опираясь на анкету и essayPrompt программы. Раскрывается по клику, чтобы
// не грузить LLM-запрос там, где пользователь может им не воспользоваться.
// v5: локализовано через useT(), запрос передаёт locale для ответа LLM.
// ---------------------------------------------------------------------------

export function EssayHelper({ profile, program }: { profile: StudentProfile; program: UniversityProgram }) {
  const t = useT();
  const { locale } = useLocale();
  const [opened, setOpened] = useState(false);
  const [ideas, setIdeas] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<"llm" | "fallback" | null>(null);

  async function fetchIdeas() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/essay-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, program, locale }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setIdeas(data.ideas);
      setSource(data.source);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function open() {
    setOpened(true);
    if (!ideas) fetchIdeas();
  }

  if (!opened) {
    return (
      <button type="button" onClick={open} className="fu-btn-secondary !py-2.5 !px-5 text-sm">
        {t("essay.cta")}
      </button>
    );
  }

  return (
    <div className="fu-card !p-4 animate-fadeUp">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink600text">{t("essay.cta")}</p>
      {program.essayPrompt && (
        <p className="mb-3 rounded-xl bg-canvas-muted px-3 py-2 text-sm text-ink-900">
          <span className="font-semibold">{t("university.essayPromptLabel")}</span> {program.essayPrompt}
        </p>
      )}
      {loading && <ExplanationSkeleton />}
      {!loading && error && <ErrorState onRetry={fetchIdeas} />}
      {!loading && !error && ideas && (
        <ul className="space-y-2.5">
          {ideas.map((idea, i) => (
            <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-900">
              <span className="mt-0.5 shrink-0 font-bold text-brand-600">{i + 1}.</span>
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      )}
      {source === "fallback" && <p className="mt-2.5 text-xs text-ink600text">{t("essay.offline")}</p>}
    </div>
  );
}
