"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { ProfileQuestionCard } from "@/components/ProfileQuestionCard";
import { OptionButton, OptionGrid } from "@/components/OptionButton";
import {
  ACTIVITY_OPTIONS,
  ALEVEL_BAND_OPTIONS,
  BUDGET_OPTIONS,
  CAMPUS_PREFERENCE_OPTIONS,
  CONSTRAINT_OPTIONS,
  DIRECTION_OPTIONS,
  EDUCATION_SYSTEM_OPTIONS,
  ENGLISH_LEVEL_OPTIONS,
  GRADE_OPTIONS,
  LANGUAGE_OPTIONS,
  PRIORITY_OPTIONS,
  PROFILE_FIELD_COUNT,
  TARGET_COUNTRY_OPTIONS,
  TIMELINE_OPTIONS,
  useProfileStore,
} from "@/store/profileStore";
import { useT, useLocale } from "@/components/LocaleProvider";
import { countryLabel, localizeOption } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Анкета — 12 карточек-шагов. v2: добавлена система аттестации
// (educationSystem), которая определяет, какой именно балл реально спросить
// (ЕНТ / IB / A-Level / AP), плюс отдельный опциональный шаг SAT/ACT —
// поддержка учеников без ЕНТ и без 12-классной системы, и выбор до 3 стран
// поступления вместо одного города в Казахстане. v4: + внеучебная активность
// и предпочтение по типу кампуса (см. store/profileStore.ts) — небольшие
// бонусные модификаторы скоринга для более точного результата.
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const lo = (value: string, ruLabel: string, ruHint?: string) => localizeOption(locale, value, ruLabel, ruHint);
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const stepIndex = useProfileStore((s) => s.profileStepIndex);
  const setStepIndex = useProfileStore((s) => s.setProfileStepIndex);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);

  useEffect(() => {
    markStageVisited("profile");
  }, [markStageVisited]);

  const total = PROFILE_FIELD_COUNT;

  function goNext() {
    if (stepIndex < total - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      markStageVisited("diagnosis");
      router.push("/diagnosis");
    }
  }
  function goBack() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  function toggleMulti<T>(list: T[], value: T, max?: number): T[] {
    if (list.includes(value)) return list.filter((v) => v !== value);
    if (max && list.length >= max) return [...list.slice(1), value];
    return [...list, value];
  }

  function renderAcademicScoreStep() {
    switch (profile.educationSystem) {
      case "ib":
        return (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-900">{t("profile.ibScoreLabel")}</label>
              <span className="font-display text-lg font-bold text-brand-700">{profile.ibScore ?? "—"}</span>
            </div>
            <input
              type="range"
              min={0}
              max={45}
              step={1}
              disabled={profile.ibScore === null}
              value={profile.ibScore ?? 30}
              onChange={(e) => updateProfile({ ibScore: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-600 disabled:opacity-40"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-ink600text">
              <input
                type="checkbox"
                checked={profile.ibScore === null}
                onChange={(e) => updateProfile({ ibScore: e.target.checked ? null : 30 })}
                className="h-4 w-4 accent-brand-600"
              />
              {t("profile.ibScoreNone")}
            </label>
          </div>
        );
      case "a-level":
        return (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">{t("profile.alevelLabel")}</p>
            <OptionGrid>
              {ALEVEL_BAND_OPTIONS.map((o) => (
                <OptionButton
                  key={o.value}
                  label={lo(o.value, o.label).label}
                  selected={profile.aLevelBand === o.value}
                  onClick={() => updateProfile({ aLevelBand: o.value })}
                />
              ))}
            </OptionGrid>
          </div>
        );
      case "ap-us":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-ink-900">{t("profile.apCountLabel")}</label>
                <span className="font-display text-lg font-bold text-brand-700">{profile.apCount ?? "—"}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={profile.apCount ?? 0}
                onChange={(e) => updateProfile({ apCount: parseInt(e.target.value, 10) })}
                className="w-full accent-brand-600"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-semibold text-ink-900">{t("profile.apAvgLabel")}</label>
                <span className="font-display text-lg font-bold text-brand-700">
                  {profile.apAverageScore !== null ? profile.apAverageScore.toFixed(1) : "—"}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.1}
                disabled={profile.apAverageScore === null}
                value={profile.apAverageScore ?? 3.5}
                onChange={(e) => updateProfile({ apAverageScore: parseFloat(e.target.value) })}
                className="w-full accent-brand-600 disabled:opacity-40"
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-ink600text">
                <input
                  type="checkbox"
                  checked={profile.apAverageScore === null}
                  onChange={(e) => updateProfile({ apAverageScore: e.target.checked ? null : 3.5 })}
                  className="h-4 w-4 accent-brand-600"
                />
                {t("profile.apNone")}
              </label>
            </div>
          </div>
        );
      case "kz-ent":
        return (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-900">{t("profile.entLabel")}</label>
              <span className="font-display text-lg font-bold text-brand-700">{profile.entScore ?? "—"}</span>
            </div>
            <input
              type="range"
              min={0}
              max={140}
              step={1}
              disabled={profile.entScore === null}
              value={profile.entScore ?? 70}
              onChange={(e) => updateProfile({ entScore: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-600 disabled:opacity-40"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-ink600text">
              <input
                type="checkbox"
                checked={profile.entScore === null}
                onChange={(e) => updateProfile({ entScore: e.target.checked ? null : 70 })}
                className="h-4 w-4 accent-brand-600"
              />
              {t("profile.entNone")}
            </label>
          </div>
        );
      default:
        return (
          <p className="rounded-2xl bg-canvas-muted p-4 text-[15px] text-ink600text">{t("profile.otherSystemHint")}</p>
        );
    }
  }

  const gpaIsUsScale = profile.educationSystem === "ap-us";

  const steps: { title: string; hint?: string; valid: boolean; skippable?: boolean; content: React.ReactNode }[] = [
    {
      title: t("profile.step1.title"),
      hint: t("profile.step1.hint"),
      valid: !!profile.grade,
      content: (
        <OptionGrid>
          {GRADE_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              label={lo(o.value, o.label).label}
              selected={profile.grade === o.value}
              onClick={() => updateProfile({ grade: o.value })}
            />
          ))}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step2.title"),
      hint: t("profile.step2.hint"),
      valid: profile.directions.length > 0,
      content: (
        <OptionGrid>
          {DIRECTION_OPTIONS.map((o) => {
            const l = lo(o.value, o.label, o.hint);
            return (
              <OptionButton
                key={o.value}
                label={l.label}
                hint={l.hint}
                multi
                selected={profile.directions.includes(o.value)}
                onClick={() => updateProfile({ directions: toggleMulti(profile.directions, o.value, 2) })}
              />
            );
          })}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step3.title"),
      hint: t("profile.step3.hint"),
      valid: !!profile.educationSystem,
      content: (
        <OptionGrid>
          {EDUCATION_SYSTEM_OPTIONS.map((o) => {
            const l = lo(o.value, o.label, o.hint);
            return (
              <OptionButton
                key={o.value}
                label={l.label}
                hint={l.hint}
                selected={profile.educationSystem === o.value}
                onClick={() => updateProfile({ educationSystem: o.value })}
              />
            );
          })}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step4.title"),
      hint: t("profile.step4.hint"),
      valid: true,
      content: (
        <div className="space-y-6">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-900">
                {gpaIsUsScale ? t("profile.gpaLabelUs") : t("profile.gpaLabelOther")}
              </label>
              <span className="font-display text-lg font-bold text-brand-700">
                {profile.gpa !== null ? profile.gpa.toFixed(1) : "—"}
              </span>
            </div>
            <input
              type="range"
              min={gpaIsUsScale ? 1.5 : 2}
              max={gpaIsUsScale ? 4 : 5}
              step={0.1}
              value={profile.gpa ?? (gpaIsUsScale ? 3.3 : 4)}
              onChange={(e) => updateProfile({ gpa: parseFloat(e.target.value) })}
              className="w-full accent-brand-600"
            />
          </div>
          {renderAcademicScoreStep()}
        </div>
      ),
    },
    {
      title: t("profile.step5.title"),
      hint: t("profile.step5.hint"),
      valid: true,
      skippable: true,
      content: (
        <div className="space-y-6">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-900">{t("profile.satLabel")}</label>
              <span className="font-display text-lg font-bold text-brand-700">{profile.satScore ?? "—"}</span>
            </div>
            <input
              type="range"
              min={400}
              max={1600}
              step={10}
              disabled={profile.satScore === null}
              value={profile.satScore ?? 1100}
              onChange={(e) => updateProfile({ satScore: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-600 disabled:opacity-40"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-ink600text">
              <input
                type="checkbox"
                checked={profile.satScore === null}
                onChange={(e) => updateProfile({ satScore: e.target.checked ? null : 1100 })}
                className="h-4 w-4 accent-brand-600"
              />
              {t("profile.satNone")}
            </label>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink-900">{t("profile.actLabel")}</label>
              <span className="font-display text-lg font-bold text-brand-700">{profile.actScore ?? "—"}</span>
            </div>
            <input
              type="range"
              min={1}
              max={36}
              step={1}
              disabled={profile.actScore === null}
              value={profile.actScore ?? 22}
              onChange={(e) => updateProfile({ actScore: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-600 disabled:opacity-40"
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-ink600text">
              <input
                type="checkbox"
                checked={profile.actScore === null}
                onChange={(e) => updateProfile({ actScore: e.target.checked ? null : 22 })}
                className="h-4 w-4 accent-brand-600"
              />
              {t("profile.actNone")}
            </label>
          </div>
        </div>
      ),
    },
    {
      title: t("profile.step6.title"),
      hint: t("profile.step6.hint"),
      valid: profile.languages.length > 0 && !!profile.englishLevel,
      content: (
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">{t("profile.languagesLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((o) => {
                const selected = profile.languages.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => updateProfile({ languages: toggleMulti(profile.languages, o.value) })}
                    className={`fu-focus-ring rounded-pill border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected ? "border-brand-500 bg-brand-600 text-white" : "border-line bg-canvas-card text-ink-900 hover:border-brand-300"
                    }`}
                  >
                    {lo(o.value, o.label).label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">{t("profile.englishLevelLabel")}</p>
            <OptionGrid>
              {ENGLISH_LEVEL_OPTIONS.map((o) => (
                <OptionButton
                  key={o.value}
                  label={lo(o.value, o.label).label}
                  selected={profile.englishLevel === o.value}
                  onClick={() => updateProfile({ englishLevel: o.value })}
                />
              ))}
            </OptionGrid>
          </div>
        </div>
      ),
    },
    {
      title: t("profile.step7.title"),
      hint: t("profile.step7.hint"),
      valid: profile.targetCountries.length > 0,
      content: (
        <div className="flex flex-wrap gap-2">
          {TARGET_COUNTRY_OPTIONS.map((country) => {
            const selected = profile.targetCountries.includes(country);
            return (
              <button
                key={country}
                type="button"
                onClick={() => updateProfile({ targetCountries: toggleMulti(profile.targetCountries, country, 3) })}
                className={`fu-focus-ring rounded-pill border px-4 py-2 text-sm font-semibold transition-colors ${
                  selected ? "border-brand-500 bg-brand-600 text-white" : "border-line bg-canvas-card text-ink-900 hover:border-brand-300"
                }`}
              >
                {countryLabel(locale, country)}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      title: t("profile.step8.title"),
      hint: t("profile.step8.hint"),
      valid: !!profile.budgetTier,
      content: (
        <OptionGrid>
          {BUDGET_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              label={lo(o.value, o.label).label}
              selected={profile.budgetTier === o.value}
              onClick={() => updateProfile({ budgetTier: o.value })}
            />
          ))}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step9.title"),
      valid: !!profile.timeline,
      content: (
        <OptionGrid>
          {TIMELINE_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              label={lo(o.value, o.label).label}
              selected={profile.timeline === o.value}
              onClick={() => updateProfile({ timeline: o.value })}
            />
          ))}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step10.title"),
      hint: t("profile.step10.hint"),
      valid: true,
      skippable: true,
      content: (
        <OptionGrid>
          {ACTIVITY_OPTIONS.map((o) => {
            const l = lo(o.value, o.label, o.hint);
            return (
              <OptionButton
                key={o.value}
                label={l.label}
                hint={l.hint}
                multi
                selected={profile.activities.includes(o.value)}
                onClick={() => updateProfile({ activities: toggleMulti(profile.activities, o.value) })}
              />
            );
          })}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step11.title"),
      hint: t("profile.step11.hint"),
      valid: !!profile.campusPreference,
      content: (
        <OptionGrid>
          {CAMPUS_PREFERENCE_OPTIONS.map((o) => {
            const l = lo(o.value, o.label, o.hint);
            return (
              <OptionButton
                key={o.value}
                label={l.label}
                hint={l.hint}
                selected={profile.campusPreference === o.value}
                onClick={() => updateProfile({ campusPreference: o.value })}
              />
            );
          })}
        </OptionGrid>
      ),
    },
    {
      title: t("profile.step12.title"),
      hint: t("profile.step12.hint"),
      valid: profile.priorities.length > 0,
      content: (
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">{t("profile.constraintsLabel")}</p>
            <div className="flex flex-col gap-2">
              {CONSTRAINT_OPTIONS.map((o) => (
                <OptionButton
                  key={o.value}
                  label={lo(o.value, o.label).label}
                  multi
                  selected={profile.constraints.includes(o.value)}
                  onClick={() => updateProfile({ constraints: toggleMulti(profile.constraints, o.value) })}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">{t("profile.prioritiesLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((o) => {
                const selected = profile.priorities.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => updateProfile({ priorities: toggleMulti(profile.priorities, o.value, 3) })}
                    className={`fu-focus-ring rounded-pill border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected ? "border-coral-500 bg-coral-500 text-white" : "border-line bg-canvas-card text-ink-900 hover:border-coral-300"
                    }`}
                  >
                    {lo(o.value, o.label).label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[stepIndex];

  return (
    <AppShell current="profile">
      <ProfileQuestionCard
        stepIndex={stepIndex}
        totalSteps={total}
        title={current.title}
        hint={current.hint}
        onBack={stepIndex > 0 ? goBack : undefined}
        onNext={goNext}
        nextDisabled={!current.valid}
        nextLabel={stepIndex === total - 1 ? t("profile.finalNext") : t("common.next")}
        skippable={current.skippable}
        onSkip={goNext}
      >
        {current.content}
      </ProfileQuestionCard>
    </AppShell>
  );
}
