"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DemoTag } from "@/components/DemoTag";
import { EssayHelper } from "@/components/EssayHelper";
import { ReviewsSection } from "@/components/ReviewsSection";
import { formatUSD } from "@/lib/matcher";
import { UniversityLogo } from "@/components/UniversityLogo";
import { UniversitiesDataset } from "@/lib/types";
import { useProfileStore } from "@/store/profileStore";
import universitiesData from "@/data/universities.json";
import { useT, useLocale } from "@/components/LocaleProvider";
import { campusSettingLabel, countryLabel, examTypeLabel, roundTypeLabel, testPolicyLabel } from "@/lib/i18n";

const dataset = universitiesData as UniversitiesDataset;

// ---------------------------------------------------------------------------
// v3: развёрнутая карточка вуза — конкурс, кампус, раунды подачи, эссе,
// смежные программы, стипендии. Доступна и из каталога, и из рекомендаций/
// сравнения. Essay-helper показывается только если анкета уже заполнена —
// брейнсторм эссе без контекста профиля был бы бесполезен.
// ---------------------------------------------------------------------------

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const selectedIds = useProfileStore((s) => s.selectedUniversityIds);
  const toggleSelection = useProfileStore((s) => s.toggleUniversitySelection);

  const program = useMemo(() => dataset.universities.find((u) => u.id === params.id) ?? null, [params.id]);
  const hasProfile = hasHydrated && !!profile.grade;
  const isSelected = program ? selectedIds.includes(program.id) : false;

  if (!program) {
    return (
      <main className="min-h-dvh bg-canvas">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink-900">{t("university.notFound")}</p>
          <button type="button" onClick={() => router.push("/explore")} className="fu-btn-secondary mt-4">
            {t("university.backToCatalog")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-canvas pb-20">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-6">
        <button type="button" onClick={() => router.back()} className="fu-btn-ghost mb-4 !px-0 text-sm">
          {t("common.back")}
        </button>

        <div className="mb-5 flex items-start gap-4">
          <UniversityLogo university={program.university} className="!h-14 !w-14 !text-lg" iconClassName="h-7 w-7" />
          <div className="min-w-0 flex-1">
            {program.prestigeTag && (
              <span className="fu-badge-tier-top mb-1.5 inline-flex">{program.prestigeTag}</span>
            )}
            <h1 className="font-display text-[26px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
              {program.program}
            </h1>
            <p className="text-[15px] font-medium text-brand-700">
              {program.university} · {program.city}, {countryLabel(locale, program.country)}
            </p>
          </div>
          <div className="shrink-0">
            <DemoTag sourceUrl={program.website} />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="fu-card !p-3 text-center">
            <p className="font-display text-lg font-extrabold text-ink-950">
              {program.acceptanceRatePercent !== null ? `~${program.acceptanceRatePercent}%` : "—"}
            </p>
            <p className="text-xs text-ink600text">{t("university.competitionDemo")}</p>
          </div>
          <div className="fu-card !p-3 text-center">
            <p className="font-display text-lg font-extrabold text-ink-950">{formatUSD(program.tuitionPerYearUSD)}</p>
            <p className="text-xs text-ink600text">{t("university.perYear")}</p>
          </div>
          <div className="fu-card !p-3 text-center">
            <p className="font-display text-lg font-extrabold text-ink-950">
              {program.studentPopulation !== null ? program.studentPopulation.toLocaleString("ru-RU") : "—"}
            </p>
            <p className="text-xs text-ink600text">{t("university.students")}</p>
          </div>
          <div className="fu-card !p-3 text-center">
            <p className="font-display text-sm font-extrabold leading-tight text-ink-950">
              {program.campusSetting ? campusSettingLabel(locale, program.campusSetting) : "—"}
            </p>
            <p className="text-xs text-ink600text">{t("university.campusFormat")}</p>
          </div>
        </div>

        {program.highlights.length > 0 && (
          <section className="fu-card mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink600text">{t("university.about")}</p>
            <ul className="space-y-1.5">
              {program.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] text-ink-900">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="fu-card mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink600text">
            {t("university.examsAndLanguage")}
          </p>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {program.academicExams.map((r) => (
              <span key={r.type} className="fu-chip">
                {examTypeLabel(locale, r.type)} {locale === "en" ? "from" : "от"} {r.minScore}
              </span>
            ))}
            {program.ieltsMin !== null && (
              <span className="fu-chip">IELTS {locale === "en" ? "from" : "от"} {program.ieltsMin}</span>
            )}
            {program.toeflMin !== null && (
              <span className="fu-chip">TOEFL {locale === "en" ? "from" : "от"} {program.toeflMin}</span>
            )}
          </div>
          <p className="text-sm text-ink600text">{testPolicyLabel(locale, program.testPolicy)}</p>
        </section>

        <section className="fu-card mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink600text">
            {t("university.roundsPortal", { portal: program.officialPortal })}
          </p>
          <div className="space-y-2.5">
            {program.applicationRounds.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-xl bg-canvas-muted px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{roundTypeLabel(locale, r.type)}</p>
                  {r.note && <p className="text-xs text-ink600text">{r.note}</p>}
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-700">{formatDate(r.deadline, locale)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="fu-card mb-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink600text">{t("university.scholarships")}</p>
            <span
              className={clsx(
                "shrink-0 rounded-pill border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                program.grantAvailable
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-line bg-canvas-muted text-ink600text"
              )}
            >
              {program.grantAvailable ? t("compare.grantAvailable") : t("compare.grantUnlikely")}
            </span>
          </div>
          {program.grantNote && (
            <p className="mb-3 text-[15px] leading-relaxed text-ink-900">{program.grantNote}</p>
          )}
          {program.scholarships.length > 0 && (
            <div className="space-y-2.5">
              {program.scholarships.map((s, i) => (
                <div key={i} className="rounded-xl bg-canvas-muted px-3.5 py-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="text-[15px] font-semibold text-ink-900">{s.name}</p>
                    <span className="shrink-0 text-sm font-bold text-brand-700">{s.coverage}</span>
                  </div>
                  <p className="text-sm text-ink600text">{s.note}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {program.majorsOffered.length > 0 && (
          <section className="fu-card mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink600text">{t("university.relatedPrograms")}</p>
            <div className="flex flex-wrap gap-1.5">
              {program.majorsOffered.map((m) => (
                <span key={m} className="fu-chip">
                  {m}
                </span>
              ))}
            </div>
          </section>
        )}

        <ReviewsSection universityId={program.id} />

        <section className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink600text">
            {t("university.essay")}
          </p>
          {hasProfile ? (
            <EssayHelper profile={profile} program={program} />
          ) : (
            <div className="fu-card !p-4 text-sm text-ink600text">
              {program.essayPrompt && (
                <p className="mb-2 text-[15px] text-ink-900">
                  <span className="font-semibold">{t("university.essayPromptLabel")}</span> {program.essayPrompt}
                </p>
              )}
              {t("university.essayNoProfile")}
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleSelection(program.id)}
            className={clsx(isSelected ? "fu-btn-primary" : "fu-btn-secondary", "!py-2.5 !px-5 text-sm")}
          >
            {isSelected ? t("common.favoriteAdded") : t("common.favoriteAdd")}
          </button>
          <a href={program.website} target="_blank" rel="noreferrer noopener" className="fu-btn-ghost text-sm">
            {t("common.website")}
          </a>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
