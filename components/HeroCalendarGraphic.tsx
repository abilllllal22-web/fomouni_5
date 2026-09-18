"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { useT, useLocale } from "./LocaleProvider";
import { CalendarMonthGrid } from "./CalendarMonthGrid";
import { toISODate } from "@/lib/deadlineCalendar";
import { RoadmapTask, ROADMAP_CATEGORY_DOT } from "@/lib/types";
import { countryLabel } from "@/lib/i18n";
import { CalendarIcon } from "./CalendarIcon";

// ---------------------------------------------------------------------------
// v9 — по запросу пользователя: не статичная картинка-мокап, а по-настоящему
// интерактивный (кликабельный, с навигацией по месяцам) мини-календарь прямо
// в hero — тот же компонент CalendarMonthGrid, что и на реальной /calendar,
// просто на demo-задачах (у гостя на лендинге ещё нет своего профиля/
// избранного). Даты считаются от "сегодня", поэтому превью не протухает.
// ---------------------------------------------------------------------------

function mondayOfWeek(base: Date, weeksAhead: number): Date {
  const d = new Date(base);
  const day = d.getDay() || 7; // 1..7, Пн=1
  d.setDate(d.getDate() + (8 - day) + (weeksAhead - 1) * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Значения country — точно как в data/universities.json (там страны на
// русском, countryLabel() сам переводит на EN при необходимости).
const DEMO_UNIS: Record<string, { name: string; country: string }> = {
  "demo-mit": { name: "MIT", country: "США" },
  "demo-oxford": { name: "Oxford", country: "Великобритания" },
  "demo-kaist": { name: "KAIST", country: "Южная Корея" },
  "demo-lse": { name: "LSE", country: "Великобритания" },
  "demo-waterloo": { name: "Waterloo", country: "Канада" },
};

export function HeroCalendarGraphic() {
  const t = useT();
  const { locale } = useLocale();

  const { tasks, initialCursor } = useMemo(() => {
    const today = new Date();
    const collisionMonday = mondayOfWeek(today, 4);
    const normalMonday1 = mondayOfWeek(today, 2);
    const normalMonday2 = mondayOfWeek(today, 6);

    const demoTasks: RoadmapTask[] = [
      {
        id: "demo-lse-doc",
        category: "document",
        title: t("roadmap.categoryDocument"),
        description: "",
        date: toISODate(addDays(normalMonday1, 1)),
        isDemoDate: true,
        universityId: "demo-lse",
      },
      {
        id: "demo-mit-deadline",
        category: "deadline",
        title: t("roadmap.categoryDeadline"),
        description: "",
        date: toISODate(addDays(collisionMonday, 1)),
        isDemoDate: true,
        universityId: "demo-mit",
      },
      {
        id: "demo-oxford-deadline",
        category: "deadline",
        title: t("roadmap.categoryDeadline"),
        description: "",
        date: toISODate(addDays(collisionMonday, 2)),
        isDemoDate: true,
        universityId: "demo-oxford",
      },
      {
        id: "demo-kaist-exam",
        category: "exam",
        title: t("roadmap.categoryExam"),
        description: "",
        date: toISODate(addDays(collisionMonday, 3)),
        isDemoDate: true,
        universityId: "demo-kaist",
      },
      {
        id: "demo-waterloo-doc",
        category: "document",
        title: t("roadmap.categoryDocument"),
        description: "",
        date: toISODate(addDays(normalMonday2, 2)),
        isDemoDate: true,
        universityId: "demo-waterloo",
      },
    ];

    return {
      tasks: demoTasks,
      initialCursor: { year: collisionMonday.getFullYear(), month: collisionMonday.getMonth() },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const [cursor, setCursor] = useState(initialCursor);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const selectedTasks = selectedDate ? tasks.filter((task) => task.date === selectedDate) : [];

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="fu-glow-dot -right-10 -top-10" aria-hidden />

      <div className="relative mb-3 inline-flex items-center gap-1.5 rounded-pill border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-200">
        {t("landing.flagshipEyebrow")}
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur-sm sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <CalendarIcon className="h-4 w-4" />
            </span>
            {t("calendar.title")}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label={t("calendar.prevMonth")}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label={t("calendar.nextMonth")}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              ›
            </button>
          </div>
        </div>

        <p className="mb-2 text-center text-[11px] font-semibold capitalize text-white/50">{monthLabel}</p>

        <CalendarMonthGrid
          year={cursor.year}
          month={cursor.month}
          tasks={tasks}
          locale={locale}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          compact
          variant="dark"
        />

        <div className="mt-3 min-h-[46px] rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
          {selectedTasks.length > 0 ? (
            <div className="space-y-1.5">
              {selectedTasks.map((task) => {
                const uni = task.universityId ? DEMO_UNIS[task.universityId] : null;
                return (
                  <div key={task.id} className="flex items-center gap-2 text-[11px] text-white/70">
                    <span className={clsx("h-1.5 w-1.5 shrink-0 rounded-full", ROADMAP_CATEGORY_DOT[task.category])} />
                    <span className="font-semibold text-white">{task.title}</span>
                    {uni && (
                      <span className="truncate text-white/50">
                        — {uni.name}, {countryLabel(locale, uni.country)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] leading-snug text-white/45">{t("landing.heroGraphicCaption")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
