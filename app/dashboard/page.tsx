"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { EmptyState } from "@/components/states/ErrorState";
import { DemoTag } from "@/components/DemoTag";
import { UniversityLogo } from "@/components/UniversityLogo";
import { formatUSD } from "@/lib/matcher";
import { generateRoadmap } from "@/lib/roadmapGenerator";
import { useT, useLocale } from "@/components/LocaleProvider";
import { BgPattern } from "@/components/BgPattern";
import { countryLabel, localizeOption } from "@/lib/i18n";
import {
  ACTIVITY_OPTIONS,
  BUDGET_OPTIONS,
  CAMPUS_PREFERENCE_OPTIONS,
  EDUCATION_SYSTEM_OPTIONS,
  ENGLISH_LEVEL_OPTIONS,
  GRADE_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMELINE_OPTIONS,
  useProfileStore,
} from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { RoadmapTask, UniversitiesDataset } from "@/lib/types";

const dataset = universitiesData as UniversitiesDataset;

// ---------------------------------------------------------------------------
// v4 — /dashboard: личный кабинет ученика. Не хранит отдельное состояние —
// всё производное от уже существующих полей в profileStore (profile,
// selectedUniversityIds как "избранное", roadmapDone), чтобы не плодить
// новые источники правды и не раздувать persist-схему сверх необходимого.
// Roadmap-задачи по каждому избранному вузу объединяются в один список:
// RoadmapTask.id уже префиксован id вуза (program.id-exam, ...), поэтому
// конфликтов ключей между вузами не бывает.
// ---------------------------------------------------------------------------

function findLabel<T extends { value: string; label: string }>(
  opts: T[],
  value: unknown,
  locale: "ru" | "en"
): string | null {
  const found = opts.find((o) => o.value === value);
  if (!found) return null;
  return localizeOption(locale, found.value, found.label).label;
}

export default function DashboardPage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const toggleSelection = useProfileStore((s) => s.toggleUniversitySelection);
  const roadmapDone = useProfileStore((s) => s.roadmapDone);
  const toggleRoadmapTask = useProfileStore((s) => s.toggleRoadmapTask);
  const setPrimaryUniversity = useProfileStore((s) => s.setPrimaryUniversity);

  const favorites = useMemo(
    () => dataset.universities.filter((u) => selectedIds.includes(u.id)),
    [selectedIds]
  );

  const allTasks = useMemo<RoadmapTask[]>(() => {
    const merged = favorites.flatMap((program) => generateRoadmap(profile, program, locale));
    return merged.sort((a, b) => {
      if (a.date && b.date) return a.date.localeCompare(b.date);
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return 0;
    });
  }, [favorites, profile, locale]);

  const upcomingDeadlines = useMemo(
    () => allTasks.filter((task) => task.category === "deadline" && task.date && !roadmapDone[task.id]).slice(0, 5),
    [allTasks, roadmapDone]
  );

  const doneCount = allTasks.filter((task) => roadmapDone[task.id]).length;
  const hasProfile = hasHydrated && !!profile.grade;

  function goToRoadmap(programId: string) {
    setPrimaryUniversity(programId);
    router.push("/roadmap");
  }

  const gradeLabel = findLabel(GRADE_OPTIONS, profile.grade, locale);
  const systemLabel = findLabel(EDUCATION_SYSTEM_OPTIONS, profile.educationSystem, locale);
  const englishLabel = findLabel(ENGLISH_LEVEL_OPTIONS, profile.englishLevel, locale);
  const budgetLabel = findLabel(BUDGET_OPTIONS, profile.budgetTier, locale);
  const timelineLabel = findLabel(TIMELINE_OPTIONS, profile.timeline, locale);
  const campusLabel = findLabel(CAMPUS_PREFERENCE_OPTIONS, profile.campusPreference, locale);
  const languageLabels = profile.languages
    .map((l) => localizeOption(locale, l, LANGUAGE_OPTIONS.find((o) => o.value === l)?.label ?? l).label)
    .filter(Boolean);
  const activityLabels = profile.activities
    .map((a) => localizeOption(locale, a, ACTIVITY_OPTIONS.find((o) => o.value === a)?.label ?? a).label)
    .filter(Boolean);
  const countryLabels = profile.targetCountries.map((c) => countryLabel(locale, c));

  return (
    <main className="min-h-dvh bg-canvas pb-24">
      <SiteHeader active="dashboard" />
      <div className="relative mx-auto max-w-6xl overflow-hidden px-5 pt-8 sm:px-8">
        <BgPattern />
        <p className="relative mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">FomoUni</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {t("dashboard.title")}
        </h1>
        <p className="mb-8 max-w-2xl text-[15px] text-ink600text">{t("dashboard.subtitle")}</p>

        {!hasProfile ? (
          <EmptyState title={t("dashboard.emptyTitle")} hint={t("dashboard.emptyHint")} />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {/* Профиль абитуриента */}
              <section className="fu-card-premium">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-ink600text">{t("dashboard.profile")}</h2>
                  <Link href="/profile" className="text-xs font-semibold text-brand-700 underline underline-offset-2">
                    {t("dashboard.edit")}
                  </Link>
                </div>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {gradeLabel && <Field label={t("dashboard.fieldGrade")} value={gradeLabel} />}
                  {systemLabel && <Field label={t("dashboard.fieldSystem")} value={systemLabel} />}
                  {englishLabel && <Field label={t("dashboard.fieldEnglish")} value={englishLabel} />}
                  {languageLabels.length > 0 && (
                    <Field label={t("dashboard.fieldLanguages")} value={languageLabels.join(", ")} />
                  )}
                  {countryLabels.length > 0 && (
                    <Field label={t("dashboard.fieldCountries")} value={countryLabels.join(", ")} />
                  )}
                  {budgetLabel && <Field label={t("dashboard.fieldBudget")} value={budgetLabel} />}
                  {timelineLabel && <Field label={t("dashboard.fieldTimeline")} value={timelineLabel} />}
                  {campusLabel && <Field label={t("dashboard.fieldCampus")} value={campusLabel} />}
                  {activityLabels.length > 0 && (
                    <Field label={t("dashboard.fieldActivities")} value={activityLabels.join(", ")} />
                  )}
                </dl>
              </section>

              {/* Избранные вузы */}
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink600text">
                  {t("dashboard.favorites")} {favorites.length > 0 && `(${favorites.length})`}
                </h2>
                {favorites.length === 0 ? (
                  <div className="fu-card py-8 text-center text-[15px] text-ink600text">
                    {t("dashboard.favorites.empty")}
                    <div className="mt-3 flex justify-center gap-2">
                      <Link href="/recommendations" className="fu-btn-secondary !py-2 !px-4 text-sm">
                        {t("dashboard.toRecommendations")}
                      </Link>
                      <Link href="/explore" className="fu-btn-ghost text-sm">
                        {t("dashboard.toCatalog")}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {favorites.map((u) => (
                      <div key={u.id} className="fu-card">
                        <div className="mb-3 flex items-start gap-3">
                          <UniversityLogo university={u.university} />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-bold leading-tight text-ink-950">{u.program}</h3>
                            <p className="truncate text-sm font-medium text-brand-700">
                              {u.university} · {countryLabel(locale, u.country)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSelection(u.id)}
                            className="fu-focus-ring shrink-0 rounded-full p-1.5 text-ink600text hover:bg-canvas-muted hover:text-coral-600"
                            aria-label={t("dashboard.removeFavorite")}
                            title={t("dashboard.removeFavorite")}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          <span className="fu-chip">
                            {formatUSD(u.tuitionPerYearUSD)}
                            {t("explore.perYear")}
                          </span>
                          {u.acceptanceRatePercent !== null && (
                            <span className="fu-chip">{t("explore.competition", { n: u.acceptanceRatePercent })}</span>
                          )}
                        </div>
                        {u.grantNote && (
                          <p className="mb-3 truncate text-xs text-brand-700">{u.grantNote}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <DemoTag sourceUrl={u.website} />
                          <div className="flex gap-3">
                            <Link href={`/university/${u.id}`} className="text-xs font-semibold text-brand-700">
                              {t("common.more")}
                            </Link>
                            <button
                              type="button"
                              onClick={() => goToRoadmap(u.id)}
                              className="text-xs font-semibold text-brand-700"
                            >
                              {t("compare.roadmapBtn")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Объединённый план задач */}
              {allTasks.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-ink600text">{t("dashboard.tasks")}</h2>
                    <span className="text-xs font-semibold text-ink600text">
                      {doneCount}/{allTasks.length} {t("roadmap.done")}
                    </span>
                  </div>
                  <RoadmapTimeline tasks={allTasks} doneMap={roadmapDone} onToggle={toggleRoadmapTask} />
                </section>
              )}
              {favorites.length === 0 && <p className="text-sm text-ink600text">{t("dashboard.tasks.empty")}</p>}
            </div>

            {/* Правая колонка — ближайшие дедлайны */}
            <aside className="space-y-4">
              <div className="fu-card-premium">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink600text">
                  {t("dashboard.upcomingDeadlines")}
                </h2>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-ink600text">{t("dashboard.noDeadlines")}</p>
                ) : (
                  <ol className="space-y-3">
                    {upcomingDeadlines.map((task) => (
                      <li key={task.id} className="border-l-2 border-brand-400 pl-3">
                        <p className="text-xs font-semibold text-ink600text">
                          {task.date &&
                            new Date(task.date).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                        </p>
                        <p className="text-sm font-semibold text-ink-900">{task.title}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink600text">{label}</dt>
      <dd className="text-[15px] font-medium text-ink-900">{value}</dd>
    </div>
  );
}
