"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { MatchResult } from "@/lib/types";
import { formatUSD } from "@/lib/matcher";
import { UniversityLogo } from "./UniversityLogo";
import { StudentProfile, useProfileStore } from "@/store/profileStore";
import { DemoTag } from "./DemoTag";
import { ExplanationSkeleton } from "./states/Skeletons";
import { ErrorState } from "./states/ErrorState";
import { useT, useLocale } from "./LocaleProvider";
import { countryLabel, fitLabel, matchTierLabel } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Карточка рекомендации: rule-based факты рендерятся сразу (мгновенно,
// без LLM), а "почему подходит именно тебе" — LLM-объяснение с честными
// состояниями loading / error+retry. Единый стиль карточки (.fu-card).
//
// v2: монограмма вуза + tier-бейдж по скору (визуальный язык из референса),
// плюс явное указание, какой путь поступления (SAT/IB/ЕНТ/...) засчитан.
// v5: локализовано через useT()/lib/i18n.ts.
// ---------------------------------------------------------------------------

const FIT_LABEL_RU: Record<string, string> = {
  within: "В рамках бюджета",
  tight: "Чуть выше бюджета",
  over: "Дороже бюджета",
  meets: "Экзамен: порог достигнут",
  close: "Экзамен: почти достигнут",
  below: "Экзамен: пока ниже порога",
  unknown: "Балл ещё не указан",
};

const FIT_TONE: Record<string, string> = {
  within: "text-brand-700 bg-brand-50 border-brand-200",
  tight: "text-amber-700 bg-amber-50 border-amber-200",
  over: "text-coral-700 bg-coral-50 border-coral-200",
  meets: "text-emerald-700 bg-emerald-50 border-emerald-200",
  close: "text-amber-700 bg-amber-50 border-amber-200",
  below: "text-coral-700 bg-coral-50 border-coral-200",
  unknown: "text-ink600text bg-canvas-muted border-line",
};

const SELECTIVITY_TONE: Record<string, string> = {
  reach: "bg-coral-50 text-coral-700 border-coral-200",
  target: "bg-brand-50 text-brand-700 border-brand-200",
  safety: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function tierBadgeKey(score: number): { key: string; className: string } {
  if (score >= 80) return { key: "rec.tierTop", className: "fu-badge-tier-top" };
  if (score >= 65) return { key: "rec.tierHigh", className: "fu-badge-tier-high" };
  if (score >= 50) return { key: "rec.tierGood", className: "fu-badge-tier-good" };
  return { key: "rec.tierReview", className: "fu-badge-tier-review" };
}

export function RecommendationCard({
  result,
  profile,
  rank,
}: {
  result: MatchResult;
  profile: StudentProfile;
  rank: number;
}) {
  const t = useT();
  const { locale } = useLocale();
  const { program, reasons, budgetFit, examFit, matchedExam, score, tier } = result;
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [source, setSource] = useState<"llm" | "fallback" | null>(null);

  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const toggleSelection = useProfileStore((s) => s.toggleUniversitySelection);
  const isSelected = selectedIds.includes(program.id);
  const badge = tierBadgeKey(score);

  async function fetchExplanation() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, program, reasons, locale }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setExplanation(data.explanation);
      setSource(data.source);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id, locale]);

  return (
    <article className="fu-card-interactive">
      <div className="mb-3 flex items-start gap-3">
        <UniversityLogo university={program.university} />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink600text">#{rank}</p>
            {badge && <span className={badge.className}>{t(badge.key)}</span>}
            <span className={clsx("rounded-pill border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", SELECTIVITY_TONE[tier])}>
              {matchTierLabel(locale, tier)}
            </span>
          </div>
          <h3 className="truncate text-xl font-bold leading-tight text-ink-950 sm:text-2xl">{program.program}</h3>
          <p className="text-[15px] font-medium text-brand-700">
            {program.university} · {countryLabel(locale, program.country)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="fu-score-pill">{score}/100</span>
          <DemoTag sourceUrl={program.website} />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className="fu-chip">{program.city}, {countryLabel(locale, program.country)}</span>
        <span className="fu-chip">
          {formatUSD(program.tuitionPerYearUSD)}
          {t("explore.perYear")}
        </span>
        <span className="fu-chip">{program.languageOfInstruction.join(" / ")}</span>
        {program.acceptanceRatePercent !== null && (
          <span className="fu-chip">{t("explore.competition", { n: program.acceptanceRatePercent })}</span>
        )}
        {program.grantAvailable && <span className="fu-chip">{t("compare.grantAvailable")}</span>}
        <span className={clsx("rounded-pill border px-3 py-1 text-xs font-medium", FIT_TONE[budgetFit])}>
          {fitLabel(locale, budgetFit, FIT_LABEL_RU[budgetFit])}
        </span>
        <span className={clsx("rounded-pill border px-3 py-1 text-xs font-medium", FIT_TONE[examFit])}>
          {matchedExam
            ? `${fitLabel(locale, examFit, FIT_LABEL_RU[examFit])} (${matchedExam})`
            : fitLabel(locale, examFit, FIT_LABEL_RU[examFit])}
        </span>
      </div>

      {program.grantNote && (
        <p className="mb-4 text-sm leading-snug text-brand-700">{program.grantNote}</p>
      )}

      <div className="mb-4 rounded-2xl bg-canvas-muted p-4">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink600text">{t("rec.whyFits")}</p>
        {loading && <ExplanationSkeleton />}
        {!loading && error && <ErrorState onRetry={fetchExplanation} />}
        {!loading && !error && explanation && (
          <p className="text-[15px] leading-relaxed text-ink-900">
            {explanation}
            {source === "fallback" && (
              <span className="ml-1 text-xs font-medium text-ink600text">{t("rec.offlineExplanation")}</span>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => toggleSelection(program.id)}
          className={clsx(isSelected ? "fu-btn-primary" : "fu-btn-secondary", "!py-2.5 !px-5 text-sm")}
        >
          {isSelected ? t("common.favoriteAdded") : t("common.favoriteAdd")}
        </button>
        <Link href={`/university/${program.id}`} className="fu-btn-ghost text-sm">
          {t("common.more")}
        </Link>
        <a
          href={program.website}
          target="_blank"
          rel="noreferrer noopener"
          className="fu-btn-ghost text-sm"
        >
          {t("common.website")}
        </a>
      </div>
    </article>
  );
}
