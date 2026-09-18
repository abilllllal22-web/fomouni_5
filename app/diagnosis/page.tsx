"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DiagnosisSkeleton } from "@/components/states/Skeletons";
import { ErrorState } from "@/components/states/ErrorState";
import { useProfileStore } from "@/store/profileStore";
import { useT, useLocale } from "@/components/LocaleProvider";

interface DiagnosisResult {
  strengths: string;
  limitations: string;
  goal: string;
  source: "llm" | "fallback";
}

export default function DiagnosisPage() {
  const router = useRouter();
  const t = useT();
  const { locale } = useLocale();
  const profile = useProfileStore((s) => s.profile);
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const markStageVisited = useProfileStore((s) => s.markStageVisited);

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    markStageVisited("diagnosis");
  }, [markStageVisited]);

  useEffect(() => {
    if (hasHydrated && !profile.grade) {
      router.replace("/profile");
    }
  }, [hasHydrated, profile.grade, router]);

  async function fetchDiagnosis() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, locale }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasHydrated && profile.grade) fetchDiagnosis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  function goNext() {
    markStageVisited("recommendations");
    router.push("/recommendations");
  }

  return (
    <AppShell current="diagnosis">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("diagnosis.eyebrow")}</p>
      <h1 className="mb-5 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
        {t("diagnosis.title")}
      </h1>

      {loading && <DiagnosisSkeleton />}

      {!loading && error && (
        <div className="fu-card">
          <ErrorState message={t("diagnosis.error")} onRetry={fetchDiagnosis} />
        </div>
      )}

      {!loading && !error && result && (
        <div className="fu-card space-y-5 animate-fadeUp">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">{t("diagnosis.strengths")}</p>
            <p className="text-[15px] leading-relaxed text-ink-900">{result.strengths}</p>
          </div>
          <div className="h-px bg-line" />
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-coral-600">{t("diagnosis.limitations")}</p>
            <p className="text-[15px] leading-relaxed text-ink-900">{result.limitations}</p>
          </div>
          <div className="h-px bg-line" />
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink600text">{t("diagnosis.goal")}</p>
            <p className="text-[15px] leading-relaxed text-ink-900">{result.goal}</p>
          </div>
          {result.source === "fallback" && (
            <p className="text-xs text-ink600text">{t("diagnosis.offline")}</p>
          )}
        </div>
      )}

      {!loading && !error && result && (
        <button onClick={goNext} className="fu-btn-primary mt-6 w-full">
          {t("diagnosis.next")}
        </button>
      )}
    </AppShell>
  );
}
