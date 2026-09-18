"use client";

import clsx from "clsx";
import { ReactNode } from "react";

export function OptionButton({
  label,
  hint,
  selected,
  onClick,
  multi,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={clsx(
        "fu-focus-ring flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-150",
        selected
          ? "border-brand-500 bg-brand-50 shadow-sm"
          : "fu-option-btn border-line bg-canvas-card hover:border-brand-300 hover:bg-brand-50/40"
      )}
    >
      <span
        className={clsx(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[11px] font-bold",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-brand-600 bg-brand-600 text-white" : "border-line-strong text-transparent"
        )}
      >
        ✓
      </span>
      <span className="flex flex-col">
        {/* v6-fix: фон selected-состояния (bg-brand-50) фиксированный светлый
            в ОБЕИХ темах, а не theme-реактивный — поэтому текст на нём тоже
            должен быть фиксированного тёмного/фиолетового цвета, а не
            text-ink-900 (в тёмной теме это светло-серый — на белом фоне
            почти нечитаемо). Баг был именно в этом рассинхроне. */}
        <span className={clsx("fu-option-label text-[15px] font-semibold", selected ? "text-brand-900" : "text-ink-900")}>
          {label}
        </span>
        {hint && (
          <span className={clsx("fu-option-hint text-sm", selected ? "text-brand-800" : "text-ink600text")}>{hint}</span>
        )}
      </span>
    </button>
  );
}

export function OptionGrid({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}
