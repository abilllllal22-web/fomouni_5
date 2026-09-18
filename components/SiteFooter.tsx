"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useT } from "./LocaleProvider";
import { useCurrentAccount } from "@/store/authStore";

// ---------------------------------------------------------------------------
// v4 — общий футер для страниц вне анкетной воронки (лендинг, каталог,
// карточка вуза, кабинет, about/faq/support). AppShell (страницы анкеты)
// футер не использует — там нужен максимум пространства под форму.
// v5 — переведён через useT().
// ---------------------------------------------------------------------------

export function SiteFooter() {
  const t = useT();
  const account = useCurrentAccount();
  return (
    <footer className="border-t border-line bg-canvas-card">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo variant="full" className="h-6 w-auto" />
            <p className="mt-3 max-w-xs text-sm text-ink600text">{t("footer.tagline")}</p>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink600text">{t("footer.product")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="text-ink-900 hover:text-brand-700">{t("footer.linkCatalog")}</Link></li>
              <li><Link href="/profile" className="text-ink-900 hover:text-brand-700">{t("footer.linkProfile")}</Link></li>
              <li><Link href="/dashboard" className="text-ink-900 hover:text-brand-700">{t("footer.linkDashboard")}</Link></li>
              <li><Link href="/calendar" className="text-ink-900 hover:text-brand-700">{t("footer.linkCalendar")}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink600text">{t("footer.company")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-ink-900 hover:text-brand-700">{t("footer.linkAbout")}</Link></li>
              <li><Link href="/faq" className="text-ink-900 hover:text-brand-700">{t("footer.linkFaq")}</Link></li>
              <li><Link href="/support" className="text-ink-900 hover:text-brand-700">{t("footer.linkSupport")}</Link></li>
              <li>
                <Link href={account ? "/account" : "/login"} className="text-ink-900 hover:text-brand-700">
                  {account ? account.name : t("nav.login")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink600text">{t("footer.legal")}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-ink-900 hover:text-brand-700">{t("footer.linkPrivacy")}</Link></li>
              <li><Link href="/cookies" className="text-ink-900 hover:text-brand-700">{t("footer.linkCookies")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs text-ink600text">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
