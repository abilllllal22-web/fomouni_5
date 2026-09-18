"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";
import { STAGES, STAGE_LABEL, STAGE_PATH, Stage, useProfileStore } from "@/store/profileStore";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { BgPattern } from "./BgPattern";
import { useT } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// AppShell — единый каркас всех этапов после входа: sidebar-навигация на
// десктопе (как в референсных макетах), компактный горизонтальный степпер на
// мобильном. Логика "что доступно/пройдено" общая для обоих представлений.
// ---------------------------------------------------------------------------

const NAV_STAGES = STAGES.filter((s) => s !== "entry" && s !== "next-action");

const STAGE_LABEL_KEY: Record<Stage, string> = {
  entry: "stage.entry",
  profile: "stage.profile",
  diagnosis: "stage.diagnosis",
  recommendations: "stage.recommendations",
  compare: "stage.compare",
  roadmap: "stage.roadmap",
  "next-action": "stage.nextAction",
};

export function AppShell({
  current,
  children,
  maxWidth = "max-w-lg",
}: {
  current: Stage;
  children: ReactNode;
  maxWidth?: string;
}) {
  const router = useRouter();
  const t = useT();
  const furthest = useProfileStore((s) => s.furthestStageIndex);
  const resetAll = useProfileStore((s) => s.resetAll);
  const currentIndex = STAGES.indexOf(current);

  function go(stage: Stage, reachable: boolean) {
    if (reachable) router.push(STAGE_PATH[stage]);
  }

  function startOver() {
    if (typeof window !== "undefined" && !window.confirm(t("appshell.confirmRestart"))) return;
    resetAll();
    router.push("/profile");
  }

  return (
    <div className="min-h-dvh bg-canvas md:flex">
      {/* Sidebar — десктоп */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-hidden border-r border-line bg-canvas-card px-5 py-6 md:flex">
        <BgPattern />
        <button type="button" onClick={() => router.push("/")} className="fu-focus-ring relative mb-10 rounded-lg text-left">
          <Logo variant="full" className="h-7 w-auto" />
        </button>
        <nav className="relative flex-1 space-y-1">
          {NAV_STAGES.map((stage, i) => {
            const idx = STAGES.indexOf(stage);
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isReachable = idx <= furthest;
            return (
              <button
                key={stage}
                type="button"
                disabled={!isReachable}
                onClick={() => go(stage, isReachable)}
                aria-current={isCurrent ? "step" : undefined}
                className={clsx(
                  "fu-focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                  isCurrent && "bg-brand-600 text-white shadow-sm",
                  !isCurrent && isDone && "text-brand-700 hover:bg-brand-50",
                  !isCurrent && !isDone && isReachable && "text-ink600text hover:bg-canvas-muted",
                  !isReachable && "cursor-not-allowed text-line-strong"
                )}
              >
                <span
                  className={clsx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    isCurrent && "bg-white/20 text-white",
                    !isCurrent && isDone && "bg-brand-100 text-brand-700",
                    !isCurrent && !isDone && "bg-canvas-muted text-ink600text"
                  )}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                {t(STAGE_LABEL_KEY[stage])}
              </button>
            );
          })}
        </nav>
        <Link href="/dashboard" className="fu-btn-ghost justify-start !px-3 text-sm">
          {t("appshell.dashboard")}
        </Link>
        <Link href="/explore" className="fu-btn-ghost justify-start !px-3 text-sm">
          {t("appshell.catalog")}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-3">
          <button type="button" onClick={startOver} className="fu-btn-ghost justify-start !px-3 text-xs">
            {t("nav.restart")}
          </button>
          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Топ-бар со степпером — мобильный/планшетный */}
        <div className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/70 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button type="button" onClick={() => router.push("/")} className="fu-focus-ring rounded-lg">
              <Logo variant="full" className="h-7 w-auto" />
            </button>
            <div className="flex items-center gap-1.5">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div className="px-3 pb-3">
            <ol className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {NAV_STAGES.map((stage, i) => {
                const idx = STAGES.indexOf(stage);
                const isDone = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isReachable = idx <= furthest;
                return (
                  <li key={stage} className="flex shrink-0 items-center">
                    <button
                      type="button"
                      disabled={!isReachable}
                      onClick={() => go(stage, isReachable)}
                      aria-current={isCurrent ? "step" : undefined}
                      className={clsx(
                        "fu-focus-ring flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-xs font-semibold transition-colors",
                        isCurrent && "bg-brand-600 text-white",
                        !isCurrent && isDone && "text-brand-700 hover:bg-brand-50",
                        !isCurrent && !isDone && isReachable && "text-ink600text hover:bg-canvas-muted",
                        !isReachable && "cursor-not-allowed text-line-strong"
                      )}
                    >
                      <span
                        className={clsx(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                          isCurrent && "bg-white/20 text-white",
                          !isCurrent && isDone && "bg-brand-100 text-brand-700",
                          !isCurrent && !isDone && "bg-canvas-muted text-ink600text"
                        )}
                      >
                        {isDone ? "✓" : i + 1}
                      </span>
                      <span className="whitespace-nowrap">{t(STAGE_LABEL_KEY[stage])}</span>
                    </button>
                    {i < NAV_STAGES.length - 1 && (
                      <span className="mx-0.5 h-px w-3 shrink-0 bg-line-strong" aria-hidden />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <main className="flex-1 pb-16">
          <div className={clsx("mx-auto px-5 pt-8 sm:px-6", maxWidth)}>{children}</div>
        </main>
      </div>
    </div>
  );
}
