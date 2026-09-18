"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Locale, translate } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void }>({
  locale: "ru",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("fomouni-locale");
      if (stored === "ru" || stored === "en") setLocaleState(stored);
    } catch {
      // localStorage недоступен — остаёмся на ru по умолчанию
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem("fomouni-locale", l);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT() {
  const { locale } = useContext(LocaleContext);
  return useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );
}
