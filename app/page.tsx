"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { STAGES, STAGE_PATH, useProfileStore } from "@/store/profileStore";
import { CalendarIcon } from "@/components/CalendarIcon";
import { CitySkyline } from "@/components/CitySkyline";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { BgPattern } from "@/components/BgPattern";
import { HeroCalendarGraphic } from "@/components/HeroCalendarGraphic";
import { useT } from "@/components/LocaleProvider";
import { useCurrentAccount } from "@/store/authStore";
import universitiesData from "@/data/universities.json";
import { UniversitiesDataset } from "@/lib/types";

const dataset = universitiesData as UniversitiesDataset;

// ---------------------------------------------------------------------------
// v4 — лендинг: hero остаётся тёмным (fu-hero-dark, не зависит от темы) как
// фирменный первый экран, но страница дополнена развёрнутыми секциями —
// "почему FomoUni", как считается скоринг, личный кабинет, компания/FAQ —
// вместо одного экрана с CTA. Toggle темы/языка — с explicit-белыми
// классами (className override), т.к. живут поверх фиксированно-тёмного
// hero, а не поверх theme-реактивного canvas.
// ---------------------------------------------------------------------------

const DARK_ICON_BTN =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-white/30";
const DARK_LANG_TOGGLE = "border-white/15 bg-white/5";

const VALUE_PROP_KEYS = [
  { titleKey: "landing.value1Title", textKey: "landing.value1Text" },
  { titleKey: "landing.value2Title", textKey: "landing.value2Text" },
  { titleKey: "landing.value3Title", textKey: "landing.value3Text" },
  { titleKey: "landing.value4Title", textKey: "landing.value4Text" },
  { titleKey: "landing.value5Title", textKey: "landing.value5Text" },
  { titleKey: "landing.value6Title", textKey: "landing.value6Text" },
];

const STEP_KEYS = [
  { n: "1", titleKey: "landing.step1Title", textKey: "landing.step1Text" },
  { n: "2", titleKey: "landing.step2Title", textKey: "landing.step2Text" },
  { n: "3", titleKey: "landing.step3Title", textKey: "landing.step3Text" },
  { n: "4", titleKey: "landing.step4Title", textKey: "landing.step4Text" },
];

export default function EntryPage() {
  const router = useRouter();
  const t = useT();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const furthestStageIndex = useProfileStore((s) => s.furthestStageIndex);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);
  const resetAll = useProfileStore((s) => s.resetAll);
  const account = useCurrentAccount();

  const hasProgress = hasHydrated && furthestStageIndex > 0;

  function start() {
    markStageVisited("profile");
    router.push("/profile");
  }

  function startOver() {
    resetAll();
    router.push("/profile");
  }

  function resume() {
    const stage = STAGES[furthestStageIndex];
    router.push(STAGE_PATH[stage]);
  }

  return (
    <main className="min-h-dvh bg-canvas">
      {/* Тёмный hero со скайлайном — глобальный масштаб продукта видно сразу */}
      <section className="fu-hero-dark px-6 pb-16 pt-6 sm:px-10 sm:pb-20 sm:pt-8">
        <div className="fu-glow-dot -right-20 -top-20" aria-hidden />

        <nav className="relative mx-auto mb-10 flex max-w-5xl items-center justify-between sm:mb-14">
          <span className="flex items-center">
            <img src="/logo-full-white.png" alt="FomoUni" className="h-7 w-auto sm:h-8" />
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/explore" className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white sm:inline-flex">
              {t("nav.catalog")}
            </Link>
            <Link href="/calendar" className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white sm:inline-flex">
              {t("nav.calendar")}
            </Link>
            <Link href="/about" className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white md:inline-flex">
              {t("nav.about")}
            </Link>
            <Link href="/faq" className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white md:inline-flex">
              {t("nav.faq")}
            </Link>
            <Link
              href={account ? "/account" : "/login"}
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white lg:inline-flex"
            >
              {account ? account.name.split(" ")[0] : t("nav.login")}
            </Link>
            <LanguageToggle className={DARK_LANG_TOGGLE} />
            <ThemeToggle className={DARK_ICON_BTN} />
          </div>
        </nav>

        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:gap-8">
          <div className="max-w-3xl lg:max-w-xl">
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-pill border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-brand-200">
              {dataset.meta.countriesCovered.length} {t("landing.heroEyebrow")}
            </p>

            <h1 className="mb-4 max-w-xl font-display text-[34px] font-extrabold leading-[1.08] text-white sm:text-5xl">
              {t("landing.heroTitle1")}
              <br /> {t("landing.heroTitle2")}
            </h1>

            <p className="mb-8 max-w-lg text-[17px] leading-relaxed text-white/65">{t("landing.heroSubtitle")}</p>

            <div className="mb-2 grid max-w-md grid-cols-3 gap-2.5 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="font-display text-xl font-extrabold text-white">{dataset.meta.countriesCovered.length}</p>
                <p className="text-xs text-white/55">{t("landing.statCountries")}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="font-display text-xl font-extrabold text-white">{dataset.universities.length}</p>
                <p className="text-xs text-white/55">{t("landing.statPrograms")}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="font-display text-xl font-extrabold text-white">{t("landing.statSteps")}</p>
                <p className="text-xs text-white/55">{t("landing.statStepsSub")}</p>
              </div>
            </div>

            <div className="mt-8 max-w-sm space-y-3">
              {hasProgress ? (
                <>
                  <button onClick={resume} className="fu-btn-primary w-full">
                    {t("landing.ctaResume")}
                  </button>
                  <button
                    onClick={startOver}
                    className="w-full rounded-pill px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {t("landing.ctaRestart")}
                  </button>
                </>
              ) : (
                <button onClick={start} className="fu-btn-primary w-full">
                  {t("landing.ctaStart")}
                </button>
              )}
              <Link
                href="/explore"
                className="block w-full rounded-pill border border-white/15 bg-white/5 px-6 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:border-white/30"
              >
                {t("landing.ctaCatalog")}
              </Link>
            </div>
          </div>

          {/* v8 — правая колонка hero: превью флагманской фичи (календарь
              нагрузки) вместо пустого места. Видно сразу, без скролла до
              секции ниже. На мобильных/планшетах скрыто — не мешает CTA. */}
          <div className="hidden shrink-0 lg:block lg:w-[360px]">
            <HeroCalendarGraphic />
          </div>
        </div>

        <div className="relative mt-10 h-24 sm:h-32">
          <CitySkyline className="absolute inset-x-0 bottom-0 h-full w-full" />
        </div>
      </section>

      {/* v6 — флагманская функция: календарь нагрузки. Отдельная, визуально
          выделенная секция сразу после hero — по прямому запросу "эта
          особенность должна стать нашим главным преимуществом". */}
      <section className="relative mx-auto max-w-5xl px-6 py-14 sm:px-10">
        <div className="fu-card-premium flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <CalendarIcon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              {t("landing.flagshipEyebrow")}
            </p>
            <h2 className="mb-2 font-display text-xl font-extrabold leading-tight text-ink-950 sm:text-2xl">
              {t("landing.flagshipTitle")}
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink600text">{t("landing.flagshipText")}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="/calendar" className="fu-btn-primary !py-2.5 !px-5 text-sm">
                {t("landing.flagshipCta")}
              </Link>
              <span className="text-xs text-ink600text">{t("landing.flagshipNote")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="relative mx-auto max-w-5xl overflow-hidden px-6 py-16 sm:px-10">
        <BgPattern />
        <p className="relative mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("landing.howEyebrow")}</p>
        <h2 className="mb-10 max-w-xl font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">
          {t("landing.howTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((s) => (
            <div key={s.n} className="fu-card">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {s.n}
              </span>
              <p className="mb-1.5 text-[15px] font-bold text-ink-950">{t(s.titleKey)}</p>
              <p className="text-sm leading-relaxed text-ink600text">{t(s.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Почему FomoUni */}
      <section className="relative overflow-hidden border-y border-line bg-canvas-card px-6 py-16 sm:px-10">
        <BgPattern />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("landing.whyEyebrow")}</p>
          <h2 className="mb-10 max-w-xl font-display text-2xl font-extrabold text-ink-950 sm:text-3xl">
            {t("landing.whyTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUE_PROP_KEYS.map((v) => (
              <div key={v.titleKey} className="fu-card-premium">
                <p className="mb-1.5 text-[15px] font-bold text-ink-950">{t(v.titleKey)}</p>
                <p className="text-sm leading-relaxed text-ink600text">{t(v.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* О компании / CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <div className="fu-card-premium flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("landing.aboutEyebrow")}</p>
            <p className="mb-1 max-w-md text-[17px] font-bold text-ink-950">{t("landing.aboutCtaTitle")}</p>
            <p className="max-w-md text-sm text-ink600text">{t("landing.aboutCtaText")}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/about" className="fu-btn-secondary text-sm">
              {t("landing.aboutCtaBtn")}
            </Link>
            <Link href="/faq" className="fu-btn-ghost text-sm">
              {t("landing.faqCtaBtn")}
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-ink600text">{t("landing.disclaimer")}</p>
      </section>

      <SiteFooter />
    </main>
  );
}
