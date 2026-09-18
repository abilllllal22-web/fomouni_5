"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { STAGES, STAGE_PATH, useProfileStore } from "@/store/profileStore";
import { useCurrentAccount } from "@/store/authStore";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { useT } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// v3: лёгкий header для страниц вне воронки (вход, каталог, карточка вуза) —
// каталог доступен без анкеты (как у Niche/Unigo/Scoir), CTA ведёт в анкету
// или продолжает с последнего пройденного этапа.
// v6: добавлено мобильное меню (бургер) — раньше часть ссылок навигации
// просто скрывалась на маленьких экранах и была недостижима; плюс ссылка
// на календарь нагрузки и индикатор локального аккаунта.
// ---------------------------------------------------------------------------

export function SiteHeader({
  active,
}: {
  active?: "explore" | "dashboard" | "calendar" | "about" | "faq" | "support" | "login";
}) {
  const router = useRouter();
  const t = useT();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const furthestStageIndex = useProfileStore((s) => s.furthestStageIndex);
  const hasProgress = hasHydrated && furthestStageIndex > 0;
  const account = useCurrentAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  function goToProfile() {
    setMenuOpen(false);
    if (hasProgress) {
      const stage = STAGES[furthestStageIndex];
      router.push(STAGE_PATH[stage]);
    } else {
      router.push("/profile");
    }
  }

  const navLinks = [
    { href: "/explore", key: "explore", label: t("nav.catalog") },
    { href: "/calendar", key: "calendar", label: t("nav.calendar") },
    ...(hasProgress ? [{ href: "/dashboard", key: "dashboard", label: t("nav.dashboard") }] : []),
    { href: "/about", key: "about", label: t("nav.about") },
    { href: "/faq", key: "faq", label: t("nav.faq") },
    { href: "/support", key: "support", label: t("nav.support") },
  ] as const;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="fu-focus-ring flex items-center rounded-lg">
          <Logo variant="full" className="h-7 w-auto sm:h-8" />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/explore"
            className={clsx(
              "fu-btn-ghost hidden text-sm sm:inline-flex",
              active === "explore" && "bg-canvas-muted text-ink-900"
            )}
          >
            {t("nav.catalog")}
          </Link>
          <Link
            href="/calendar"
            className={clsx(
              "fu-btn-ghost hidden text-sm sm:inline-flex",
              active === "calendar" && "bg-canvas-muted text-ink-900"
            )}
          >
            {t("nav.calendar")}
          </Link>
          {hasProgress && (
            <Link
              href="/dashboard"
              className={clsx(
                "fu-btn-ghost hidden text-sm lg:inline-flex",
                active === "dashboard" && "bg-canvas-muted text-ink-900"
              )}
            >
              {t("nav.dashboard")}
            </Link>
          )}
          <Link
            href="/about"
            className={clsx(
              "fu-btn-ghost hidden text-sm md:inline-flex",
              active === "about" && "bg-canvas-muted text-ink-900"
            )}
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/faq"
            className={clsx(
              "fu-btn-ghost hidden text-sm md:inline-flex",
              active === "faq" && "bg-canvas-muted text-ink-900"
            )}
          >
            {t("nav.faq")}
          </Link>
          <Link
            href={account ? "/account" : "/login"}
            className={clsx(
              "fu-btn-ghost hidden text-sm lg:inline-flex",
              active === "login" && "bg-canvas-muted text-ink-900"
            )}
          >
            {account ? account.name.split(" ")[0] : t("nav.login")}
          </Link>
          <LanguageToggle className="hidden sm:flex" />
          <ThemeToggle />
          <button type="button" onClick={goToProfile} className="fu-btn-primary hidden !py-2.5 !px-5 text-sm sm:inline-flex">
            {hasProgress ? t("nav.continue") : t("nav.start")}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="fu-icon-btn sm:hidden"
            aria-label={t("nav.menu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-canvas-card px-5 py-4 sm:hidden">
          <nav className="mb-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "fu-focus-ring rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink-900",
                  active === link.key ? "bg-canvas-muted font-semibold" : "hover:bg-canvas-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={account ? "/account" : "/login"}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "fu-focus-ring rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink-900",
                active === "login" ? "bg-canvas-muted font-semibold" : "hover:bg-canvas-muted"
              )}
            >
              {account ? account.name : t("nav.login")}
            </Link>
          </nav>
          <div className="mb-4 flex items-center justify-between">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <button type="button" onClick={goToProfile} className="fu-btn-primary w-full !py-3 text-sm">
            {hasProgress ? t("nav.continue") : t("nav.start")}
          </button>
        </div>
      )}
    </header>
  );
}
