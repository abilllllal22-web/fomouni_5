"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RecommendationCard } from "@/components/RecommendationCard";
import { matchUniversities } from "@/lib/matcher";
import { useProfileStore } from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { UniversitiesDataset } from "@/lib/types";
import { useT, useLocale } from "@/components/LocaleProvider";
import { matchTierLabel } from "@/lib/i18n";

const dataset = universitiesData as UniversitiesDataset;
const TOP_N = 6;

export default function RecommendationsPage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);

  useEffect(() => {
    markStageVisited("recommendations");
  }, [markStageVisited]);

  useEffect(() => {
    if (hasHydrated && !profile.grade) router.replace("/profile");
  }, [hasHydrated, profile.grade, router]);

  // ВАЖНО: derived state от profile (useMemo), а не сохранённый статичный
  // результат — при изменении анкеты список заметно пересчитывается.
  const matches = useMemo(() => matchUniversities(profile, dataset.universities), [profile]);
  const top = matches.slice(0, TOP_N);

  const tierCounts = useMemo(() => {
    const counts = { reach: 0, target: 0, safety: 0 };
    for (const m of top) counts[m.tier]++;
    return counts;
  }, [top]);
  const missingSafety = tierCounts.safety === 0;

  function goNext() {
    markStageVisited("compare");
    router.push("/compare");
  }

  return (
    <AppShell current="recommendations">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("rec.eyebrow")}</p>
          <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
            {t("rec.title")}
          </h1>
        </div>
      </div>
      <p className="mb-6 text-[15px] text-ink600text">
        {t("rec.subtitlePre")} {" "}
        <button onClick={() => router.push("/profile")} className="font-semibold text-brand-700 underline underline-offset-2">
          {t("rec.subtitleLink")}
        </button>{" "}
        {t("rec.subtitlePost")}
      </p>

      <div className="fu-card mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 !py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink600text">{t("rec.balance")}</p>
        <span className="text-sm text-ink-900">
          {matchTierLabel(locale, "reach").split(" (")[0]}: <b>{tierCounts.reach}</b>
        </span>
        <span className="text-sm text-ink-900">
          {matchTierLabel(locale, "target").split(" (")[0]}: <b>{tierCounts.target}</b>
        </span>
        <span className="text-sm text-ink-900">
          {matchTierLabel(locale, "safety").split(" (")[0]}: <b>{tierCounts.safety}</b>
        </span>
        {missingSafety && <span className="text-xs text-amber-700">{t("rec.missingSafety")}</span>}
      </div>

      <div className="space-y-4">
        {top.map((result, i) => (
          <RecommendationCard key={result.program.id} result={result} profile={profile} rank={i + 1} />
        ))}
      </div>

      <div className="fu-card mt-6 flex items-center justify-between gap-3 !py-4">
        <p className="text-sm text-ink-900">
          {t("rec.selectedCount")} <span className="font-bold">{selectedIds.length}</span> / 4
        </p>
        <button onClick={goNext} disabled={selectedIds.length < 2} className="fu-btn-primary !py-2.5 !px-5 text-sm">
          {t("rec.compare")}
        </button>
      </div>
      {selectedIds.length < 2 && (
        <p className="mt-2 text-center text-xs text-ink600text">{t("rec.selectMore")}</p>
      )}
    </AppShell>
  );
}
