"use client";

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

function formatDate(iso: string | null, locale: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// "Следующее действие" — один крупно выделенный шаг, а не список из десяти
// дел (этап 7 обязательного пути). v2: светлая карточка с цветным акцентом
// слева, ближе к референсному минималистичному стилю, чем сплошной тёмный
// баннер — визуально "premium продукт", а не промо-плашка.
// v5: локализовано через useT().
// ---------------------------------------------------------------------------

export function NextActionBanner({
  task,
  onComplete,
}: {
  task: RoadmapTask | null;
  onComplete: () => void;
}) {
  const t = useT();
  const { locale } = useLocale();

  if (!task) {
    return (
      <div className="fu-card flex flex-col items-start gap-2 border-l-4 border-l-emerald-500 bg-emerald-50/40">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{t("roadmap.done_banner_title")}</p>
        <h2 className="font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">{t("roadmap.done_banner_h2")}</h2>
        <p className="max-w-md text-[15px] text-ink600text">{t("roadmap.done_banner_text")}</p>
      </div>
    );
  }

  const dateLabel = formatDate(task.date, locale);
  const meta = CATEGORY_KEY[task.category];

  return (
    <div className="fu-card border-l-4 border-l-brand-600 !p-6 sm:!p-8">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
        {t("roadmap.nextStep")} · {t(meta.labelKey)}
      </p>
      <h2 className="mb-3 font-display text-2xl font-extrabold leading-[1.15] text-ink-950 sm:text-[32px]">
        {task.title}
      </h2>
      <p className="mb-6 max-w-xl text-[15px] leading-relaxed text-ink600text">{task.description}</p>

      <div className="mb-7 flex flex-wrap items-center gap-2.5 text-sm text-ink600text">
        {dateLabel && (
          <span className="rounded-pill border border-line px-3 py-1">
            {t("roadmap.until")} {dateLabel}
          </span>
        )}
        {task.isDemoDate && <DemoTag sourceUrl={task.sourceUrl} />}
      </div>

      <button type="button" onClick={onComplete} className="fu-btn-primary">
        {t("roadmap.markDone")}
      </button>
    </div>
  );
}
