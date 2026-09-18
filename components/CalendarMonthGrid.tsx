"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { RoadmapTask, ROADMAP_CATEGORY_DOT } from "@/lib/types";
import { isoWeekBounds, toISODate } from "@/lib/deadlineCalendar";
import { Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// v9 — классический прямоугольный календарь (сетка недель × дней), вместо
// прежнего списка карточек-недель. Общий компонент для /calendar (реальные
// данные пользователя) и для demo-превью на лендинге (компактный, read-only).
// Коллизии по-прежнему считаются НА УРОВНЕ НЕДЕЛИ (не дня) — это не
// изменилось, изменилось только визуальное представление: вся строка недели
// подсвечивается мягким коралловым фоном, если в ней есть коллизия.
// ---------------------------------------------------------------------------

function buildMonthWeeks(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const firstWeekday = firstOfMonth.getUTCDay() || 7; // 1..7, Пн=1
  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(firstOfMonth.getUTCDate() - (firstWeekday - 1));

  const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const lastWeekday = lastOfMonth.getUTCDay() || 7;
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setUTCDate(lastOfMonth.getUTCDate() + (7 - lastWeekday));

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  while (cursor.getTime() <= gridEnd.getTime()) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function CalendarMonthGrid({
  year,
  month,
  tasks,
  locale,
  selectedDate,
  onSelectDate,
  compact = false,
  variant = "light",
}: {
  year: number;
  month: number; // 0-11
  tasks: RoadmapTask[];
  locale: Locale;
  selectedDate?: string | null;
  onSelectDate?: (iso: string | null) => void;
  compact?: boolean;
  // "dark" — для встраивания на фиксированно-тёмный hero лендинга (там
  // theme-реактивные классы ink-900/canvas-card дают плохой контраст).
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  const todayISO = toISODate(new Date());

  const tasksByDate = useMemo(() => {
    const map = new Map<string, RoadmapTask[]>();
    for (const task of tasks) {
      if (!task.date) continue;
      const list = map.get(task.date);
      if (list) list.push(task);
      else map.set(task.date, [task]);
    }
    return map;
  }, [tasks]);

  const collisionWeekKeys = useMemo(() => {
    const deadlinesByWeek = new Map<string, Set<string>>();
    for (const task of tasks) {
      if (!task.date || task.category !== "deadline") continue;
      const d = new Date(task.date);
      if (Number.isNaN(d.getTime())) continue;
      const { key } = isoWeekBounds(d);
      const set = deadlinesByWeek.get(key) ?? new Set<string>();
      if (task.universityId) set.add(task.universityId);
      deadlinesByWeek.set(key, set);
    }
    const collisions = new Set<string>();
    for (const [key, unis] of deadlinesByWeek) {
      if (unis.size >= 2) collisions.add(key);
    }
    return collisions;
  }, [tasks]);

  const weeks = useMemo(() => buildMonthWeeks(year, month), [year, month]);
  const weekdayLabels = useMemo(
    () => weeks[0].map((d) => new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ru-RU", { weekday: "short" }).format(d)),
    [weeks, locale]
  );

  return (
    <div>
      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {weekdayLabels.map((label, i) => (
          <div
            key={i}
            className={clsx(
              "text-center font-semibold uppercase tracking-wide",
              dark ? "text-white/45" : "text-ink600text",
              compact ? "text-[9px]" : "text-[11px]"
            )}
          >
            {label}
          </div>
        ))}
      </div>
      <div className={clsx("space-y-1", compact && "space-y-0.5")}>
        {weeks.map((week, wi) => {
          const weekKey = isoWeekBounds(week[0]).key;
          const isCollisionWeek = collisionWeekKeys.has(weekKey);
          return (
            <div
              key={wi}
              className={clsx("grid grid-cols-7 gap-1 rounded-lg", isCollisionWeek && "bg-coral-500/10")}
            >
              {week.map((day) => {
                const iso = toISODate(day);
                const inMonth = day.getUTCMonth() === month;
                const dayTasks = tasksByDate.get(iso) ?? [];
                const isToday = iso === todayISO;
                const isSelected = selectedDate === iso;
                const clickable = !!onSelectDate && dayTasks.length > 0;
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!clickable}
                    onClick={() => onSelectDate?.(isSelected ? null : iso)}
                    className={clsx(
                      "fu-focus-ring flex flex-col items-center gap-0.5 rounded-lg py-1 transition-colors",
                      compact ? "min-h-[30px]" : "min-h-[44px] sm:min-h-[52px]",
                      !inMonth && "opacity-30",
                      clickable && !dark && "cursor-pointer hover:bg-canvas-muted",
                      clickable && dark && "cursor-pointer hover:bg-white/10",
                      !clickable && "cursor-default",
                      isSelected && "ring-2 ring-brand-500",
                      isToday && !isSelected && (dark ? "ring-1 ring-white/40" : "ring-1 ring-brand-300")
                    )}
                  >
                    <span
                      className={clsx(
                        "text-xs font-semibold",
                        isToday ? (dark ? "text-brand-300" : "text-brand-700") : dark ? "text-white/80" : "text-ink-900"
                      )}
                    >
                      {day.getUTCDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="flex items-center gap-0.5">
                        {dayTasks.slice(0, 3).map((t) => (
                          <span key={t.id} className={clsx("h-1.5 w-1.5 rounded-full", ROADMAP_CATEGORY_DOT[t.category])} />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className={clsx("text-[9px]", dark ? "text-white/50" : "text-ink600text")}>
                            +{dayTasks.length - 3}
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
