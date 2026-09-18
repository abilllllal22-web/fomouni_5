"use client";

import clsx from "clsx";
import { RoadmapTask, RoadmapTaskCategory } from "@/lib/types";
import { DemoTag } from "./DemoTag";
import { useT, useLocale } from "./LocaleProvider";

const CATEGORY_KEY: Record<RoadmapTaskCategory, { labelKey: string; dot: string }> = {
  exam: { labelKey: "roadmap.categoryExam", dot: "bg-coral-500" },
  document: { labelKey: "roadmap.categoryDocument", dot: "bg-brand-500" },
  academic: { labelKey: "roadmap.categoryAcademic", dot: "bg-ink-600" },
  activity: { labelKey: "roadmap.categoryActivity", dot: "bg-amber-500" },
  deadline: { labelKey: "roadmap.categoryDeadline", dot: "bg-emerald-600" },
};

function formatDate(iso: string | null, locale: string, t: (k: string) => string) {
  if (!iso) return t("roadmap.noHardDate");
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RoadmapTimeline({
  tasks,
  doneMap,
  onToggle,
}: {
  tasks: RoadmapTask[];
  doneMap: Record<string, boolean>;
  onToggle: (taskId: string) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <ol className="relative space-y-3 pl-1">
      <div className="absolute bottom-2 left-[15px] top-2 w-px bg-line" aria-hidden />
      {tasks.map((task) => {
        const done = !!doneMap[task.id];
        const meta = CATEGORY_KEY[task.category];
        return (
          <li key={task.id} className="relative pl-9">
            <button
              type="button"
              onClick={() => onToggle(task.id)}
              aria-pressed={done}
              className={clsx(
                "fu-focus-ring absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-canvas-card transition-colors",
                done ? "border-brand-500 bg-brand-500 text-white" : "border-line-strong text-transparent hover:border-brand-400"
              )}
            >
              ✓
            </button>
            <div className={clsx("fu-card !py-3.5 transition-opacity", done && "opacity-60")}>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className={clsx("h-1.5 w-1.5 rounded-full", meta.dot)} />
                <span className="text-xs font-semibold uppercase tracking-wide text-ink600text">{t(meta.labelKey)}</span>
                <span className="text-xs text-ink600text">· {formatDate(task.date, locale, t)}</span>
                {task.isDemoDate && <DemoTag sourceUrl={task.sourceUrl} />}
              </div>
              <p className={clsx("text-[15px] font-semibold text-ink-900", done && "line-through")}>{task.title}</p>
              <p className="mt-0.5 text-sm text-ink600text">{task.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
