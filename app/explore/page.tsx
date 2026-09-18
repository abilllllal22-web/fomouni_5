"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoTag } from "@/components/DemoTag";
import { UniversityLogo } from "@/components/UniversityLogo";
import { formatUSD, programMatchesDirectionTag } from "@/lib/matcher";
import { UniversitiesDataset, UniversityProgram } from "@/lib/types";
import universitiesData from "@/data/universities.json";
import { DIRECTION_OPTIONS, DirectionTag } from "@/store/profileStore";
import { useT, useLocale } from "@/components/LocaleProvider";
import { BgPattern } from "@/components/BgPattern";
import { countryLabel, localizeOption } from "@/lib/i18n";

const dataset = universitiesData as UniversitiesDataset;

// ---------------------------------------------------------------------------
// /explore — открытый каталог всей базы (доступен ДО анкеты, как у Niche/
// Unigo/Scoir): поиск, фильтр по стране/направлению/стоимости, сортировка.
// Не заменяет персональные рекомендации, а даёт "оглядеться" по масштабу
// базы и попасть на детальную карточку вуза.
// v5 — фильтр по направлению расширен с грубого IT/Engineering до всех
// тонких направлений анкеты (включая Бизнес/Экономику/Финансы), через
// programMatchesDirectionTag() из lib/matcher.ts — та же логика, что
// использует скоринг рекомендаций.
// ---------------------------------------------------------------------------

type SortKey = "score-default" | "cost-asc" | "cost-desc" | "acceptance-asc" | "acceptance-desc";

export default function ExplorePage() {
  const t = useT();
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>("all");
  const [direction, setDirection] = useState<DirectionTag | "all">("all");
  const [sort, setSort] = useState<SortKey>("score-default");

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "score-default", label: t("explore.sortDefault") },
    { value: "cost-asc", label: t("explore.sortCostAsc") },
    { value: "cost-desc", label: t("explore.sortCostDesc") },
    { value: "acceptance-asc", label: t("explore.sortAcceptanceAsc") },
    { value: "acceptance-desc", label: t("explore.sortAcceptanceDesc") },
  ];

  const countries = useMemo(
    () => Array.from(new Set(dataset.universities.map((u) => u.country))).sort((a, b) => a.localeCompare(b, "ru")),
    []
  );

  const filtered = useMemo(() => {
    let list = dataset.universities.filter((u) => {
      if (country !== "all" && u.country !== country) return false;
      if (direction !== "all" && !programMatchesDirectionTag(u, direction)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = `${u.university} ${u.program} ${u.city} ${u.country}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    if (sort === "cost-asc") list = [...list].sort((a, b) => a.tuitionPerYearUSD - b.tuitionPerYearUSD);
    if (sort === "cost-desc") list = [...list].sort((a, b) => b.tuitionPerYearUSD - a.tuitionPerYearUSD);
    if (sort === "acceptance-asc")
      list = [...list].sort((a, b) => (a.acceptanceRatePercent ?? 100) - (b.acceptanceRatePercent ?? 100));
    if (sort === "acceptance-desc")
      list = [...list].sort((a, b) => (b.acceptanceRatePercent ?? 0) - (a.acceptanceRatePercent ?? 0));
    return list;
  }, [country, direction, query, sort]);

  // v7-fix: несколько вузов в датасете (HKUST, LSE, NUS, Melbourne, Toronto)
  // ведут в базе 2 программы (например, CS и Economics) — раньше это
  // рендерилось как два отдельных, визуально почти неотличимых квадратика
  // в каталоге и выглядело как случайный дубль. Группируем по названию
  // вуза: одна карточка = один вуз, а разные программы внутри — отдельные
  // строки. Ни одна программа при этом не теряется.
  const grouped = useMemo(() => {
    const map = new Map<string, UniversityProgram[]>();
    for (const u of filtered) {
      const list = map.get(u.university);
      if (list) list.push(u);
      else map.set(u.university, [u]);
    }
    return Array.from(map.values());
  }, [filtered]);

  return (
    <main className="min-h-dvh bg-canvas pb-20">
      <SiteHeader active="explore" />
      <div className="relative mx-auto max-w-6xl overflow-hidden px-5 pt-8 sm:px-8">
        <BgPattern />
        <p className="relative mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {dataset.universities.length} {t("explore.eyebrow", { c: dataset.meta.countriesCovered.length })}
        </p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {t("explore.title")}
        </h1>
        <p className="mb-6 max-w-2xl text-[15px] text-ink600text">
          {t("explore.subtitlePre")} {" "}
          <Link href="/profile" className="font-semibold text-brand-700 underline underline-offset-2">
            {t("explore.subtitleLink")}
          </Link>
          .
        </p>

        <div className="fu-card mb-6 flex flex-col gap-3 !p-4 sm:flex-row sm:items-center sm:flex-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("explore.searchPlaceholder")}
            className="fu-focus-ring w-full rounded-xl border border-line bg-canvas-card px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink600text sm:max-w-xs"
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="fu-focus-ring rounded-xl border border-line bg-canvas-card px-3 py-2.5 text-sm text-ink-900"
          >
            <option value="all">{t("explore.allCountries")}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryLabel(locale, c)}
              </option>
            ))}
          </select>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as DirectionTag | "all")}
            className="fu-focus-ring rounded-xl border border-line bg-canvas-card px-3 py-2.5 text-sm text-ink-900"
          >
            <option value="all">{t("explore.allDirections")}</option>
            {DIRECTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {localizeOption(locale, o.value, o.label).label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="fu-focus-ring rounded-xl border border-line bg-canvas-card px-3 py-2.5 text-sm text-ink-900 sm:ml-auto"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-ink600text">{t("explore.found", { n: filtered.length })}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.map((programs) => {
            const first = programs[0];
            return (
              <div key={first.university} className="fu-card-interactive flex flex-col">
                <div className="mb-3 flex items-start gap-3">
                  <UniversityLogo university={first.university} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold leading-tight text-ink-950">{first.university}</h3>
                    <p className="truncate text-sm font-medium text-brand-700">
                      {countryLabel(locale, first.country)}, {first.city}
                    </p>
                  </div>
                </div>

                <div className="mb-3 flex flex-col gap-1">
                  {programs.map((u) => (
                    <Link
                      key={u.id}
                      href={`/university/${u.id}`}
                      className="fu-focus-ring flex flex-col gap-0.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-canvas-muted"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{u.program}</span>
                        <span className="shrink-0 text-right text-xs text-ink600text">
                          {formatUSD(u.tuitionPerYearUSD)}
                          {t("explore.perYear")}
                          {u.acceptanceRatePercent !== null && (
                            <> · {t("explore.competition", { n: u.acceptanceRatePercent })}</>
                          )}
                        </span>
                      </span>
                      {u.grantNote && (
                        <span className="truncate text-xs text-brand-700">{u.grantNote}</span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto border-t border-line pt-3">
                  <DemoTag sourceUrl={first.website} />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="fu-card mt-4 py-10 text-center text-[15px] text-ink600text">{t("explore.empty")}</div>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
