"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { EmptyState } from "@/components/states/ErrorState";
import { CalendarMonthGrid } from "@/components/CalendarMonthGrid";
import { generateRoadmap } from "@/lib/roadmapGenerator";
import { buildWorkloadCalendar, toISODate } from "@/lib/deadlineCalendar";
import { useT, useLocale } from "@/components/LocaleProvider";
import { countryLabel } from "@/lib/i18n";
import { useProfileStore } from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { ROADMAP_CATEGORY_DOT, RoadmapTaskCategory, UniversitiesDataset } from "@/lib/types";

const dataset = universitiesData as UniversitiesDataset;

// ---------------------------------------------------------------------------
// /calendar — "Умный календарь нагрузки" (Smart Workload Calendar).
// Главная отличительная функция FomoUni. Собирает задачи roadmap по ВСЕМ
// избранным вузам сразу (не по одному) и показывает недели, где дедлайны
// нескольких вузов накладываются друг на друга — то, что обычный список
// рекомендаций или отдельный roadmap на один вуз в принципе не может
// показать. Строится полностью из уже существующих данных приложения
// (см. lib/deadlineCalendar.ts), без LLM и без новых источников данных.
//
// v9 — по запросу пользователя: классический прямоугольный календарь
// (сетка недель × дней с навигацией по месяцам, клик по дню — детали),
// вместо прежнего списка карточек-недель. Логика коллизий не изменилась,
// изменилось только визуальное представление (см. CalendarMonthGrid).
// ---------------------------------------------------------------------------

const LEGEND: { category: RoadmapTaskCategory; labelKey: string }[] = [
  { category: "deadline", labelKey: "roadmap.categoryDeadline" },
  { category: "exam", labelKey: "roadmap.categoryExam" },
  { category: "document", labelKey: "roadmap.categoryDocument" },
  { category: "academic", labelKey: "roadmap.categoryAcademic" },
  { category: "activity", labelKey: "roadmap.categoryActivity" },
];

export default function CalendarPage() {
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const roadmapDone = useProfileStore((s) => s.roadmapDone);
  const toggleRoadmapTask = useProfileStore((s) => s.toggleRoadmapTask);

  const favorites = useMemo(
    () => dataset.universities.filter((u) => selectedIds.includes(u.id)),
    [selectedIds]
  );

  const allTasks = useMemo(
    () => favorites.flatMap((program) => generateRoadmap(profile, program, locale)),
    [favorites, profile, locale]
  );

  const datedTasks = useMemo(() => allTasks.filter((task) => !!task.date), [allTasks]);

  const weeks = useMemo(() => buildWorkloadCalendar(allTasks), [allTasks]);
  const todayISO = toISODate(new Date());
  const upcomingWeeks = weeks.filter((w) => w.weekEndISO >= todayISO);
  const collisionCount = upcomingWeeks.filter((w) => w.isCollision).length;

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [autoJumped, setAutoJumped] = useState(false);

  // Один раз после гидратации: если в текущем месяце нет задач, а есть
  // будущие — сразу открыть месяц с ближайшей из них, а не показывать
  // пользователю пустую сетку без объяснений.
  useEffect(() => {
    if (!hasHydrated || autoJumped || datedTasks.length === 0) return;
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const hasThisMonth = datedTasks.some((task) => task.date!.slice(0, 7) === currentYM);
    if (!hasThisMonth) {
      const sorted = [...datedTasks].sort((a, b) => a.date!.localeCompare(b.date!));
      const upcoming = sorted.find((task) => task.date! >= todayISO) ?? sorted[0];
      const d = new Date(upcoming.date as string);
      setCursor({ year: d.getUTCFullYear(), month: d.getUTCMonth() });
    }
    setAutoJumped(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, datedTasks.length]);

  function shiftMonth(delta: number) {
    setSelectedDate(null);
    setCursor((c) => {
      const d = new Date(Date.UTC(c.year, c.month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });
  }

  const monthLabel = new Date(Date.UTC(cursor.year, cursor.month, 1)).toLocaleDateString(
    locale === "en" ? "en-US" : "ru-RU",
    { month: "long", year: "numeric" }
  );

  const selectedDayTasks = selectedDate ? datedTasks.filter((task) => task.date === selectedDate) : [];

  return (
    <main className="min-h-dvh bg-canvas pb-24">
      <SiteHeader active="calendar" />
      <div className="relative mx-auto max-w-4xl overflow-hidden px-5 pt-8 sm:px-8">
        <BgPattern />
        <p className="relative mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">FomoUni</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {t("calendar.title")}
        </h1>
        <p className="mb-6 max-w-2xl text-[15px] text-ink600text">{t("calendar.subtitle")}</p>

        {favorites.length === 0 ? (
          <EmptyState title={t("calendar.emptyTitle")} hint={t("calendar.emptyHint")} />
        ) : datedTasks.length === 0 ? (
          <div className="fu-card py-8 text-center text-[15px] text-ink600text">{t("calendar.noDeadlines")}</div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="fu-card !p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-ink-950">{favorites.length}</p>
                <p className="text-xs text-ink600text">{t("calendar.statUniversities")}</p>
              </div>
              <div className="fu-card !p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-ink-950">{upcomingWeeks.length}</p>
                <p className="text-xs text-ink600text">{t("calendar.statWeeks")}</p>
              </div>
              <div className="fu-card !p-4 text-center col-span-2 sm:col-span-1">
                <p
                  className={clsx(
                    "font-display text-2xl font-extrabold",
                    collisionCount > 0 ? "text-coral-600" : "text-ink-950"
                  )}
                >
                  {collisionCount}
                </p>
                <p className="text-xs text-ink600text">{t("calendar.statCollisions")}</p>
              </div>
            </div>

            <div className="fu-card">
              <div className="mb-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="fu-icon-btn"
                  aria-label={t("calendar.prevMonth")}
                >
                  ‹
                </button>
                <p className="text-sm font-bold capitalize text-ink-950">{monthLabel}</p>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="fu-icon-btn"
                  aria-label={t("calendar.nextMonth")}
                >
                  ›
                </button>
              </div>

              <CalendarMonthGrid
                year={cursor.year}
                month={cursor.month}
                tasks={datedTasks}
                locale={locale}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3.5">
                {LEGEND.map((l) => (
                  <span key={l.category} className="flex items-center gap-1.5 text-xs text-ink600text">
                    <span className={clsx("h-1.5 w-1.5 rounded-full", ROADMAP_CATEGORY_DOT[l.category])} />
                    {t(l.labelKey)}
                  </span>
                ))}
              </div>
            </div>

            {selectedDate && selectedDayTasks.length > 0 ? (
              <div className="fu-card mt-4">
                <p className="mb-3 text-sm font-bold text-ink-950">
                  {new Date(selectedDate).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="space-y-2">
                  {selectedDayTasks.map((task) => {
                    const program = dataset.universities.find((u) => u.id === task.universityId);
                    const done = !!roadmapDone[task.id];
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleRoadmapTask(task.id)}
                        className={clsx(
                          "fu-focus-ring flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-canvas-muted",
                          done && "opacity-55"
                        )}
                      >
                        <span className={clsx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", ROADMAP_CATEGORY_DOT[task.category])} />
                        <span className="min-w-0 flex-1">
                          <span className={clsx("block text-sm font-semibold text-ink-900", done && "line-through")}>
                            {task.title}
                          </span>
                          {program && (
                            <span className="block truncate text-xs text-ink600text">
                              {program.university} · {countryLabel(locale, program.country)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-center text-xs text-ink600text">{t("calendar.selectDayHint")}</p>
            )}
          </>
        )}

        {favorites.length > 0 && (
          <p className="relative mt-8 text-center text-sm text-ink600text">
            <Link href="/dashboard" className="font-semibold text-brand-700 underline underline-offset-2">
              {t("calendar.backToDashboard")}
            </Link>
          </p>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
