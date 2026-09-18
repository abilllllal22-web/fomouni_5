"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ComparisonTable } from "@/components/ComparisonTable";
import { EmptyState } from "@/components/states/ErrorState";
import { useProfileStore } from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { UniversitiesDataset } from "@/lib/types";
import { useT } from "@/components/LocaleProvider";

const dataset = universitiesData as UniversitiesDataset;

export default function ComparePage() {
  const router = useRouter();
  const t = useT();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const setPrimaryUniversity = useProfileStore((s) => s.setPrimaryUniversity);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);

  useEffect(() => {
    markStageVisited("compare");
  }, [markStageVisited]);

  useEffect(() => {
    if (hasHydrated && selectedIds.length < 2) router.replace("/recommendations");
  }, [hasHydrated, selectedIds.length, router]);

  const programs = useMemo(
    () => selectedIds.map((id) => dataset.universities.find((u) => u.id === id)).filter((p): p is (typeof dataset.universities)[number] => !!p),
    [selectedIds]
  );

  function chooseForRoadmap(id: string) {
    setPrimaryUniversity(id);
    markStageVisited("roadmap");
    router.push("/roadmap");
  }

  return (
    <AppShell current="compare" maxWidth="max-w-3xl">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("compare.eyebrow")}</p>
      <h1 className="mb-5 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
        {t("compare.title")}
      </h1>

      {programs.length < 2 ? (
        <EmptyState title={t("compare.emptyTitle")} hint={t("compare.emptyHint")} />
      ) : (
        <>
          <ComparisonTable programs={programs} priorities={profile.priorities} />

          <div className="fu-card mt-6">
            <p className="mb-3 text-sm font-semibold text-ink-900">{t("compare.pickRoadmap")}</p>
            <div className="flex flex-col gap-2">
              {programs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => chooseForRoadmap(p.id)}
                  className="fu-focus-ring flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/40"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-ink-900">{p.program}</span>
                    <span className="block text-sm text-brand-700">{p.university}</span>
                  </span>
                  <span className="fu-btn-secondary !py-2 !px-4 text-sm">{t("compare.roadmapBtn")}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
