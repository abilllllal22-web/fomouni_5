"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { useLocale } from "@/components/LocaleProvider";

// ---------------------------------------------------------------------------
// v4 — /support: честная self-service страница с частыми техническими
// проблемами. Без вымышленного онлайн-чата или контактов "поддержки 24/7" —
// это хакатон-демо, а не реальный сервис с командой поддержки.
// v5 — двуязычный контент.
// ---------------------------------------------------------------------------

const ISSUES: Record<"ru" | "en", { problem: string; fix: string }[]> = {
  ru: [
    {
      problem: "Прогресс анкеты пропал после перезагрузки страницы",
      fix: "Анкета хранится в localStorage браузера. Она сбрасывается, если вы используете приватный/инкогнито-режим, вручную очистили данные сайта, или открыли FomoUni в другом браузере/устройстве — прогресс не синхронизируется между ними. Решение: заполняйте анкету в обычном (не приватном) окне одного и того же браузера.",
    },
    {
      problem: "Кнопка «Далее» в анкете неактивна",
      fix: "Шаг считается пройденным только когда заполнено обязательное поле (не все шаги — например, SAT/ACT и внеучебная активность помечены как необязательные и их можно пропустить кнопкой «Пропустить»). Проверьте, выбран ли хотя бы один вариант на текущем шаге.",
    },
    {
      problem: "Объяснение «Почему подходит именно тебе» долго грузится или показывает офлайн-текст",
      fix: "Это ожидаемое поведение: объяснение генерируется через внешний ИИ-сервис, у которого могут быть задержки или временная недоступность. При сбое или таймауте автоматически показывается офлайн-объяснение на основе тех же причин подбора — страница не должна зависать. Если совсем не грузится ни один из вариантов, обновите страницу.",
    },
    {
      problem: "Вуз не появляется в личном кабинете в разделе «Избранное»",
      fix: "В кабинет попадают только вузы, добавленные кнопкой «В избранное и сравнение» на карточке рекомендации, странице сравнения или карточке вуза. Само по себе открытие карточки вуза в избранное не добавляет.",
    },
    {
      problem: "После смены темы или языка интерфейс на секунду мигает старым вариантом",
      fix: "Настройки темы и языка хранятся локально и применяются сразу при следующей загрузке страницы. Если мигание всё же заметно — попробуйте обновить страницу (Ctrl/Cmd+R); это не влияет на сохранённые данные анкеты.",
    },
    {
      problem: "Сайт выглядит «сломанным» или без стилей",
      fix: "Проверьте, включён ли JavaScript в браузере — сайт использует его для интерактивности анкеты, тем и языка. Также попробуйте обновить браузер до актуальной версии или открыть сайт в другом браузере.",
    },
    {
      problem: "Данные о вузе кажутся неточными или устаревшими",
      fix: "Это ожидаемо для демо-версии: цифры (стоимость, конкурс, дедлайны, пороги баллов) — иллюстративные ориентиры, а не данные в реальном времени. У каждой карточки есть пометка «демо» со ссылкой на официальный сайт вуза — используйте её для проверки актуальной информации перед подачей документов.",
    },
    {
      problem: "В каталоге вузов не вижу направление бизнеса/экономики/финансов",
      fix: "Убедитесь, что в фильтре «Направление» на странице каталога (/explore) выбрано конкретное направление (например, «Финансы») или «Все направления» — раньше там были только IT и инженерия, но фильтр расширен до всех направлений анкеты, включая бизнес, экономику и финансы.",
    },
  ],
  en: [
    {
      problem: "My questionnaire progress disappeared after reloading the page",
      fix: "The questionnaire is stored in your browser's localStorage. It resets if you use private/incognito mode, manually clear site data, or open FomoUni in a different browser or device — progress doesn't sync between them. Fix: fill out the questionnaire in a regular (non-private) window of the same browser.",
    },
    {
      problem: "The \"Next\" button in the questionnaire is disabled",
      fix: "A step counts as complete only once its required field is filled in (not every step is required — for example, SAT/ACT and extracurricular activities are marked optional and can be skipped with the \"Skip\" button). Check whether at least one option is selected on the current step.",
    },
    {
      problem: "\"Why this fits you\" takes a long time to load or shows offline text",
      fix: "This is expected behavior: the explanation is generated through an external AI service, which can have delays or brief downtime. On a failure or timeout, an offline explanation based on the same matching reasons is shown automatically — the page shouldn't freeze. If nothing loads at all, refresh the page.",
    },
    {
      problem: "A university isn't showing up in the dashboard's Favorites section",
      fix: "Only universities added via the \"Add to favorites & compare\" button — on a recommendation card, the comparison page, or a university page — appear in the dashboard. Simply opening a university's page doesn't add it to favorites.",
    },
    {
      problem: "After switching theme or language, the interface briefly flashes the old version",
      fix: "Theme and language settings are stored locally and apply immediately on the next page load. If the flash is still noticeable, try refreshing the page (Ctrl/Cmd+R) — this doesn't affect your saved questionnaire data.",
    },
    {
      problem: "The site looks \"broken\" or unstyled",
      fix: "Check whether JavaScript is enabled in your browser — the site relies on it for the questionnaire, theme, and language interactivity. Also try updating your browser to the latest version or opening the site in a different browser.",
    },
    {
      problem: "The university data looks inaccurate or outdated",
      fix: "This is expected for a demo version: the numbers (cost, acceptance rate, deadlines, score thresholds) are illustrative reference points, not a real-time feed. Every card has a \"demo\" label with a link to the university's official website — use it to check current information before applying.",
    },
    {
      problem: "I don't see business/economics/finance in the university catalog",
      fix: "Make sure the \"Major\" filter on the catalog page (/explore) is set to a specific major (e.g. \"Finance\") or \"All majors\" — it used to only offer IT and engineering, but the filter now covers every major from the questionnaire, including business, economics and finance.",
    },
  ],
};

export default function SupportPage() {
  const { locale } = useLocale();
  const issues = ISSUES[locale];
  const isRu = locale === "ru";
  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="support" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{isRu ? "Помощь" : "Help"}</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {isRu ? "Поддержка" : "Support"}
        </h1>
        <p className="mb-8 max-w-2xl text-[15px] text-ink600text">
          {isRu
            ? "FomoUni — хакатон-проект без выделенной команды поддержки в реальном времени. Здесь собраны частые технические проблемы и то, как их обычно можно решить самостоятельно."
            : "FomoUni is a hackathon project without a dedicated real-time support team. Here are the most common technical issues and how to usually resolve them yourself."}
        </p>

        <div className="space-y-4">
          {issues.map((item) => (
            <div key={item.problem} className="fu-card">
              <p className="mb-1.5 flex items-start gap-2 text-[15px] font-bold text-ink-950">
                <span className="mt-0.5 shrink-0 text-coral-600">⚠</span>
                {item.problem}
              </p>
              <p className="pl-6 text-sm leading-relaxed text-ink600text">{item.fix}</p>
            </div>
          ))}
        </div>

        <div className="fu-card mt-8 !bg-canvas-muted">
          <p className="text-sm text-ink600text">
            {isRu ? (
              <>
                Не нашли ответ на свой вопрос? Загляните в{" "}
                <a href="/faq" className="font-semibold text-brand-700 underline underline-offset-2">
                  частые вопросы
                </a>{" "}
                — там больше про то, как устроен подбор рекомендаций и логика продукта.
              </>
            ) : (
              <>
                Didn&apos;t find an answer to your question? Check out the{" "}
                <a href="/faq" className="font-semibold text-brand-700 underline underline-offset-2">
                  FAQ
                </a>{" "}
                — it covers more about how the recommendation matching and product logic work.
              </>
            )}
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
