"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { NextActionBanner } from "@/components/NextActionBanner";
import { EssayHelper } from "@/components/EssayHelper";
import { EmptyState } from "@/components/states/ErrorState";
import { generateRoadmap, getNextAction } from "@/lib/roadmapGenerator";
import { useProfileStore } from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { UniversitiesDataset } from "@/lib/types";
import { useT, useLocale } from "@/components/LocaleProvider";
import { countryLabel } from "@/lib/i18n";

const dataset = universitiesData as UniversitiesDataset;

export default function RoadmapPage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const primaryUniversityId = useProfileStore((s) => s.primaryUniversityId);
  const roadmapDone = useProfileStore((s) => s.roadmapDone);
  const toggleRoadmapTask = useProfileStore((s) => s.toggleRoadmapTask);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);

  useEffect(() => {
    markStageVisited("roadmap");
    markStageVisited("next-action");
  }, [markStageVisited]);

  useEffect(() => {
    if (hasHydrated && !primaryUniversityId) router.replace("/compare");
  }, [hasHydrated, primaryUniversityId, router]);

  const program = useMemo(
    () => dataset.universities.find((u) => u.id === primaryUniversityId) ?? null,
    [primaryUniversityId]
  );

  // Derived state: план пересчитывается при любом изменении анкеты или
  // выбранной программы — не сохранённый статичный результат.
  const tasks = useMemo(() => (program ? generateRoadmap(profile, program, locale) : []), [profile, program, locale]);
  const nextTask = useMemo(() => getNextAction(tasks, roadmapDone), [tasks, roadmapDone]);
  const doneCount = tasks.filter((t) => roadmapDone[t.id]).length;

  if (!program) {
    return (
      <AppShell current="roadmap">
        <EmptyState title={t("roadmap.emptyTitle")} hint={t("roadmap.emptyHint")} />
      </AppShell>
    );
  }

  return (
    <AppShell current="roadmap">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
        {t("roadmap.personalPlan")} · {program.university} ({countryLabel(locale, program.country)})
      </p>
      <h1 className="mb-1 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
        {program.program}
      </h1>
      <Link href={`/university/${program.id}`} className="mb-5 inline-block text-sm font-semibold text-brand-700 underline underline-offset-2">
        {t("roadmap.fullCard")}
      </Link>
      <div className="mb-7 flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-line">
          <div
            className="h-2 rounded-full bg-brand-500 transition-all"
            style={{ width: tasks.length ? `${(doneCount / tasks.length) * 100}%` : "0%" }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-ink600text">
          {doneCount}/{tasks.length} {t("roadmap.done")}
        </span>
      </div>

      <section id="next-action" className="mb-10 scroll-mt-20">
        <NextActionBanner task={nextTask} onComplete={() => nextTask && toggleRoadmapTask(nextTask.id)} />
      </section>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink600text">{t("roadmap.fullPlan")}</h2>
      <RoadmapTimeline tasks={tasks} doneMap={roadmapDone} onToggle={toggleRoadmapTask} />

      <h2 className="mb-3 mt-10 text-sm font-bold uppercase tracking-wide text-ink600text">{t("roadmap.essayHelp")}</h2>
      <EssayHelper profile={profile} program={program} />
    </AppShell>
  );
}
