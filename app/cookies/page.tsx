"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { useLocale } from "@/components/LocaleProvider";

// ---------------------------------------------------------------------------
// /cookies — отдельная страница, т.к. пользователь явно запросил Cookies
// Policy отдельно от Privacy Policy. Содержание честно отражает реальность
// проекта: сайт НЕ использует cookie для трекинга — только localStorage для
// хранения на устройстве, что технически не является HTTP cookie, но мы
// всё равно объясняем это прямо, чтобы не оставлять вопрос без ответа.
// ---------------------------------------------------------------------------

const CONTENT: Record<"ru" | "en", { title: string; updated: string; body: { title: string; text: string }[] }> = {
  ru: {
    title: "Политика использования cookie",
    updated: "Последнее обновление: сентябрь 2026",
    body: [
      {
        title: "Короткий ответ",
        text: "FomoUni не устанавливает cookie для отслеживания, рекламы или аналитики. Сайт вообще не использует HTTP cookie в привычном смысле.",
      },
      {
        title: "Что используется вместо cookie",
        text:
          "Для сохранения анкеты, избранного, темы, языка, локального аккаунта и отзывов сайт использует localStorage браузера — технологию хранения данных на стороне устройства, отдельную от cookie. Эти данные не передаются автоматически на сервер при каждом запросе (в отличие от cookie) и остаются только в вашем браузере, пока вы их не очистите.",
      },
      {
        title: "Сторонние сервисы",
        text:
          "На сайте нет Google Analytics, Яндекс.Метрики, рекламных пикселей Meta/TikTok или других сторонних трекеров. Единственный внешний сетевой вызов — запрос с сервера FomoUni (не из вашего браузера напрямую) к Anthropic Claude API для трёх текстовых функций, описанных в Privacy Policy.",
      },
      {
        title: "Как очистить локальные данные",
        text:
          "Откройте настройки браузера → «Конфиденциальность» → «Очистить данные сайта» для fomouni (или аналогичный пункт в вашем браузере). Это мгновенно удалит анкету, избранное, аккаунт и отзывы, сохранённые локально.",
      },
    ],
  },
  en: {
    title: "Cookies Policy",
    updated: "Last updated: September 2026",
    body: [
      {
        title: "Short answer",
        text: "FomoUni does not set cookies for tracking, advertising, or analytics. The site doesn't use HTTP cookies in the conventional sense at all.",
      },
      {
        title: "What we use instead of cookies",
        text:
          "To save your questionnaire, favorites, theme, language, local account, and reviews, the site uses your browser's localStorage — an on-device storage technology, separate from cookies. Unlike cookies, this data is not automatically sent to a server on every request, and it stays only in your browser until you clear it.",
      },
      {
        title: "Third-party services",
        text:
          "There is no Google Analytics, Yandex Metrica, Meta/TikTok ad pixels, or any other third-party tracker on this site. The only outbound network call is from the FomoUni server (not directly from your browser) to the Anthropic Claude API, for the three text features described in the Privacy Policy.",
      },
      {
        title: "How to clear local data",
        text:
          "Open your browser settings → Privacy → \"Clear site data\" for this site (wording varies by browser). This instantly removes the questionnaire, favorites, account, and reviews saved locally.",
      },
    ],
  },
};

export default function CookiesPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale];
  const isRu = locale === "ru";
  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="about" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">FomoUni</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">{c.title}</h1>
        <p className="mb-6 text-xs font-medium text-ink600text">{c.updated}</p>

        <div className="space-y-5">
          {c.body.map((s) => (
            <section key={s.title} className="fu-card">
              <h2 className="mb-2 text-base font-bold text-ink-950">{s.title}</h2>
              <p className="text-sm leading-relaxed text-ink600text">{s.text}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink600text">
          {isRu ? "См. также: " : "See also: "}
          <Link href="/privacy" className="font-semibold text-brand-700 underline underline-offset-2">
            {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
          </Link>
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}
