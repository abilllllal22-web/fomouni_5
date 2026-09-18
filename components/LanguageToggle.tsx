"use client";

import clsx from "clsx";
import { LOCALES, LOCALE_LABEL } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={clsx("flex items-center rounded-full border border-line-strong bg-canvas-card p-0.5", className)}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={clsx(
            "fu-focus-ring rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors",
            locale === l ? "bg-brand-600 text-white" : "text-ink600text hover:text-ink-900"
          )}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
