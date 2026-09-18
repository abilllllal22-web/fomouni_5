"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// v6 — небольшое честное уведомление про хранение данных (localStorage, не
// cookie — см. /cookies), с прямыми ссылками на Privacy/Cookies. Не блокирует
// страницу, запоминается на устройстве, чтобы не показываться повторно.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "fomouni-cookie-notice-dismissed";

export function CookieNotice() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas-card px-4 py-3.5 shadow-cardHover sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink600text sm:max-w-2xl sm:text-sm">
          {t("cookieNotice.text")}{" "}
          <Link href="/cookies" className="font-semibold text-brand-700 underline underline-offset-2">
            {t("cookieNotice.linkCookies")}
          </Link>
          {" · "}
          <Link href="/privacy" className="font-semibold text-brand-700 underline underline-offset-2">
            {t("cookieNotice.linkPrivacy")}
          </Link>
        </p>
        <button type="button" onClick={dismiss} className="fu-btn-secondary shrink-0 !py-2 !px-4 text-xs">
          {t("cookieNotice.dismiss")}
        </button>
      </div>
    </div>
  );
}
