"use client";

import clsx from "clsx";
import { UniversityProgram } from "@/lib/types";
import { formatUSD } from "@/lib/matcher";
import { UniversityLogo } from "./UniversityLogo";
import { PRIORITY_OPTIONS, PriorityTag } from "@/store/profileStore";
import { DemoTag } from "./DemoTag";
import { useT, useLocale } from "./LocaleProvider";
import { countryLabel, examTypeLabel, localizeOption, roundTypeLabel, testPolicyLabel, Locale } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Сравнение выбранных вариантов по параметрам, которые пользователь САМ
// назвал приоритетными в анкете (profile.priorities). Такие строки
// визуально подсвечены — это и есть персонализация сравнения.
// Мобильный формат: горизонтальный скролл с "залипающей" колонкой подписей —
// работает на телефоне без переверстки в отдельный десктоп-layout.
//
// v2: колонка "Город" заменена на "Страна", экзамен — по всем принимаемым
// вузом путям поступления (SAT/IB/A-Level/AP/ЕНТ), а не только ЕНТ/IELTS.
// v5: локализовано через useT()/lib/i18n.ts.
// ---------------------------------------------------------------------------

type RowKey =
  | "cost"
  | "acceptance"
  | "grant"
  | "language"
  | "country"
  | "duration"
  | "exam"
  | "testPolicy"
  | "english"
  | "rounds"
  | "deadline";

const ROW_TO_PRIORITY: Partial<Record<RowKey, PriorityTag>> = {
  cost: "cost",
  grant: "grant-chance",
  language: "language",
  country: "country",
  duration: "duration",
};

const ROW_KEYS: { key: RowKey; labelKey: string }[] = [
  { key: "cost", labelKey: "compare.rowCost" },
  { key: "acceptance", labelKey: "compare.rowAcceptance" },
  { key: "grant", labelKey: "compare.rowGrant" },
  { key: "language", labelKey: "compare.rowLanguage" },
  { key: "country", labelKey: "compare.rowCountry" },
  { key: "duration", labelKey: "compare.rowDuration" },
  { key: "exam", labelKey: "compare.rowExam" },
  { key: "testPolicy", labelKey: "compare.rowTestPolicy" },
  { key: "english", labelKey: "compare.rowEnglish" },
  { key: "rounds", labelKey: "compare.rowRounds" },
  { key: "deadline", labelKey: "compare.rowDeadline" },
];

function cellValue(
  program: UniversityProgram,
  key: RowKey,
  locale: Locale,
  t: (k: string, vars?: Record<string, string | number>) => string
): string {
  switch (key) {
    case "cost":
      return formatUSD(program.tuitionPerYearUSD);
    case "acceptance":
      return program.acceptanceRatePercent !== null ? `~${program.acceptanceRatePercent}%` : t("common.notSpecified");
    case "grant":
      return program.grantNote || (program.grantAvailable ? t("compare.grantAvailable") : t("compare.grantUnlikely"));
    case "language":
      return program.languageOfInstruction.join(", ");
    case "country":
      return `${countryLabel(locale, program.country)}, ${program.city}`;
    case "duration":
      return program.duration;
    case "exam":
      return program.academicExams.length > 0
        ? program.academicExams
            .map((r) => `${examTypeLabel(locale, r.type)} ${locale === "en" ? "from" : "от"} ${r.minScore}`)
            .join(" · ")
        : t("compare.examTba");
    case "testPolicy":
      return testPolicyLabel(locale, program.testPolicy);
    case "english":
      return program.ieltsMin !== null ? `IELTS ${locale === "en" ? "from" : "от"} ${program.ieltsMin}` : t("compare.englishTba");
    case "rounds":
      return program.applicationRounds.map((r) => roundTypeLabel(locale, r.type).split(" (")[0]).join(" · ");
    case "deadline":
      return new Date(program.applicationDeadline).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
  }
}

export function ComparisonTable({
  programs,
  priorities,
}: {
  programs: UniversityProgram[];
  priorities: PriorityTag[];
}) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <div className="fu-card overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-36 min-w-36 bg-canvas-card px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink600text">
                {t("compare.param")}
              </th>
              {programs.map((p) => (
                <th key={p.id} className="min-w-[210px] border-l border-line px-4 py-3.5 text-left align-top">
                  <div className="mb-2 flex items-center gap-2.5">
                    <UniversityLogo university={p.university} className="!h-9 !w-9 !text-xs" iconClassName="h-4 w-4" />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold leading-tight text-ink-950">{p.program}</p>
                      <p className="truncate text-xs font-medium text-brand-700">{p.university}</p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_KEYS.map((row, i) => {
              const priorityKey = ROW_TO_PRIORITY[row.key];
              const isPriority = priorityKey ? priorities.includes(priorityKey) : false;
              return (
                <tr key={row.key} className={clsx(i % 2 === 1 && "bg-canvas-muted/50")}>
                  <td
                    className={clsx(
                      "sticky left-0 z-10 px-4 py-3 text-xs font-semibold",
                      isPriority ? "bg-brand-50 text-brand-800" : "bg-canvas-card text-ink600text"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {t(row.labelKey)}
                      {isPriority && <span className="text-coral-500" title="★">★</span>}
                    </span>
                  </td>
                  {programs.map((p) => (
                    <td
                      key={p.id}
                      className={clsx(
                        "border-l border-line px-4 py-3 align-top text-[14px] text-ink-900",
                        isPriority && "bg-brand-50/40 font-semibold"
                      )}
                    >
                      {cellValue(p, row.key, locale, t)}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <td className="sticky left-0 z-10 bg-canvas-card px-4 py-3 text-xs font-semibold text-ink600text">
                {t("compare.source")}
              </td>
              {programs.map((p) => (
                <td key={p.id} className="border-l border-line px-4 py-3">
                  <DemoTag sourceUrl={p.website} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {priorities.length > 0 && (
        <p className="border-t border-line bg-canvas-muted px-4 py-2.5 text-xs text-ink600text">
          {t("compare.priorityNote")}{" "}
          {priorities
            .map((p) => {
              const o = PRIORITY_OPTIONS.find((opt) => opt.value === p);
              return o ? localizeOption(locale, o.value, o.label).label : p;
            })
            .join(", ")}
        </p>
      )}
    </div>
  );
}
