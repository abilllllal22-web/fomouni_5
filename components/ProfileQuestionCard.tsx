"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { useT } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// Единая "рамка" для карточки анкеты: заголовок, подсказка, мини-прогресс
// по шагам анкеты (точки), контент вопроса и навигация Назад/Далее.
// По требованиям: анкета — карточки по 1-2 вопроса, а не одна длинная форма.
// ---------------------------------------------------------------------------

export function ProfileQuestionCard({
  stepIndex,
  totalSteps,
  title,
  hint,
  children,
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  skippable,
  onSkip,
}: {
  stepIndex: number;
  totalSteps: number;
  title: string;
  hint?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  skippable?: boolean;
  onSkip?: () => void;
}) {
  const t = useT();
  return (
    <div className="animate-fadeUp">
      <div className="mb-4 flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={clsx(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < stepIndex ? "bg-brand-500" : i === stepIndex ? "bg-brand-300" : "bg-line"
            )}
          />
        ))}
      </div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
        {t("profile.stepOf", { n: stepIndex + 1, m: totalSteps })}
      </p>
      <h2 className="mb-1.5 text-2xl font-bold leading-tight sm:text-[28px]">{title}</h2>
      {hint && <p className="mb-5 text-[15px] text-ink600text">{hint}</p>}

      <div className="mb-8">{children}</div>

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} disabled={!onBack} className="fu-btn-ghost disabled:opacity-0">
          {t("common.back")}
        </button>
        <div className="flex items-center gap-2">
          {skippable && (
            <button type="button" onClick={onSkip} className="fu-btn-ghost">
              {t("common.skip")}
            </button>
          )}
          <button type="button" onClick={onNext} disabled={nextDisabled} className="fu-btn-primary">
            {nextLabel ?? t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
