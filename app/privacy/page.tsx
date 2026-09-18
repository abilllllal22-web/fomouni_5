"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { useLocale } from "@/components/LocaleProvider";

// ---------------------------------------------------------------------------
// /privacy — честное описание того, как FomoUni реально хранит данные:
// анкета/избранное/roadmap/локальный аккаунт/отзывы — всё в localStorage
// браузера, ничего не отправляется на сервер, кроме трёх точечных вызовов
// Anthropic Claude API (текст объяснения/эссе — без личных данных сверх
// уже введённых ответов анкеты). Никаких сторонних трекеров/аналитики/
// рекламных пикселей в проекте нет — поэтому и написано так, а не общими
// шаблонными фразами.
// ---------------------------------------------------------------------------

type Section = { title: string; body: string };

const CONTENT: Record<"ru" | "en", { intro: string; updated: string; sections: Section[] }> = {
  ru: {
    updated: "Последнее обновление: сентябрь 2026",
    intro:
      "FomoUni — учебный продукт (хакатон-проект), а не коммерческий сервис с выделенной командой по защите данных. Ниже — точное и честное описание того, какие данные использует сайт и где они хранятся, без общих юридических шаблонов.",
    sections: [
      {
        title: "Что хранится и где",
        body:
          "Анкета, избранные вузы, прогресс по roadmap, настройки темы/языка, локальный аккаунт (если вы зарегистрировались) и отзывы, которые вы оставляете — всё хранится ТОЛЬКО в localStorage вашего браузера, на вашем устройстве. У FomoUni нет базы данных и нет сервера, куда эти данные отправлялись бы или где бы они хранились централизованно. Если вы очистите данные сайта в браузере, откроете FomoUni в приватном режиме или на другом устройстве — всё это исчезнет или не будет видно, и это ожидаемо.",
      },
      {
        title: "Локальный аккаунт (вход / регистрация)",
        body:
          "Регистрация и вход полностью локальны: email, имя и пароль (точнее, его хеш SHA-256, не сам пароль в открытом виде) сохраняются в localStorage вашего браузера. Это демонстрационная система для одного устройства — она не заменяет промышленный сервер аутентификации, не поддерживает восстановление пароля по почте и не синхронизирует аккаунт между устройствами. Не используйте пароль, которым вы пользуетесь где-либо ещё.",
      },
      {
        title: "Отзывы на вузы",
        body:
          "Отзыв, который вы оставляете на странице вуза, сохраняется локально в вашем браузере и виден только в нём — общей публичной базы отзывов у демо-версии нет. Не указывайте в тексте отзыва данные, по которым вас можно однозначно идентифицировать, если не хотите, чтобы они сохранялись на вашем устройстве.",
      },
      {
        title: "Вызовы Anthropic Claude API",
        body:
          "Три функции — текстовое объяснение «почему подходит», диагностика профиля и идеи для эссе — отправляют на сервер FomoUni уже введённые вами ответы анкеты (не email и не пароль), а сервер, в свою очередь, обращается к Anthropic Claude API, чтобы сгенерировать текст. Ключ API хранится только на сервере и никогда не передаётся в браузер. При недоступности сети или лимитах используется заранее подготовленный офлайн-текст на основе тех же данных — страница не ломается.",
      },
      {
        title: "Файлы cookie и аналитика",
        body:
          "FomoUni не использует cookie для отслеживания, рекламные пиксели или сторонние сервисы аналитики (Google Analytics, Meta Pixel и т.п.). Подробнее — на отдельной странице Cookies Policy.",
      },
      {
        title: "Удаление данных",
        body:
          "Поскольку все данные лежат в вашем браузере, удалить их можно самостоятельно и мгновенно: очистить данные сайта в настройках браузера, либо использовать кнопку «Удалить аккаунт» в личном кабинете (/account) — она удаляет локальный аккаунт немедленно и без дополнительных запросов, потому что нет сервера, который нужно об этом уведомлять.",
      },
      {
        title: "Дети и несовершеннолетние пользователи",
        body:
          "Продукт ориентирован на абитуриентов школьного возраста. Мы не запрашиваем данные сверх того, что нужно для анкеты (класс/возрастная группа как диапазон, академические баллы, предпочтения) и не запрашиваем полное имя, адрес или документы.",
      },
    ],
  },
  en: {
    updated: "Last updated: September 2026",
    intro:
      "FomoUni is a student hackathon project, not a commercial service with a dedicated data-protection team. Below is an accurate, plain description of what data the site uses and where it lives — no generic legal boilerplate.",
    sections: [
      {
        title: "What is stored, and where",
        body:
          "Your questionnaire answers, favorited universities, roadmap progress, theme/language settings, local account (if you signed up), and any reviews you write are stored ONLY in your browser's localStorage, on your own device. FomoUni has no database and no server where this data is sent or centrally stored. If you clear the site's data, use a private/incognito window, or open FomoUni on another device, this data disappears or isn't visible there — that's expected.",
      },
      {
        title: "Local account (log in / sign up)",
        body:
          "Sign-up and login are fully local: your email, name, and password (specifically, its SHA-256 hash, not the raw password) are saved in your browser's localStorage. This is a single-device demo system — it does not replace a production authentication server, doesn't support email-based password recovery, and doesn't sync your account across devices. Don't reuse a password you use anywhere else.",
      },
      {
        title: "University reviews",
        body:
          "A review you leave on a university page is stored locally in your browser and is only visible there — this demo has no shared public review database. Avoid including anything in the review text that would identify you if you don't want it kept on your device.",
      },
      {
        title: "Anthropic Claude API calls",
        body:
          "Three features — the \"why it fits\" explanation, profile diagnosis, and essay ideas — send your already-entered questionnaire answers (not your email or password) to the FomoUni server, which in turn calls the Anthropic Claude API to generate text. The API key lives only on the server and never reaches the browser. If the network is unavailable or a limit is hit, a pre-written offline fallback based on the same data is shown instead, so the page doesn't break.",
      },
      {
        title: "Cookies and analytics",
        body:
          "FomoUni does not use tracking cookies, ad pixels, or third-party analytics (Google Analytics, Meta Pixel, etc). See the separate Cookies Policy page for details.",
      },
      {
        title: "Deleting your data",
        body:
          "Since everything lives in your browser, you can delete it yourself, instantly: clear the site's data in your browser settings, or use the \"Delete account\" button on your account page (/account) — it removes the local account immediately, with no extra request needed, because there's no server to notify.",
      },
      {
        title: "Children and minor users",
        body:
          "The product targets school-age applicants. We only ask for what the questionnaire needs (grade/age range, academic scores, preferences) and never ask for a full legal name, address, or ID documents.",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useLocale();
  const c = CONTENT[locale];
  const isRu = locale === "ru";
  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="about" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">FomoUni</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
        </h1>
        <p className="mb-6 text-xs font-medium text-ink600text">{c.updated}</p>
        <p className="mb-8 max-w-2xl text-[15px] text-ink600text">{c.intro}</p>

        <div className="space-y-5">
          {c.sections.map((s) => (
            <section key={s.title} className="fu-card">
              <h2 className="mb-2 text-base font-bold text-ink-950">{s.title}</h2>
              <p className="text-sm leading-relaxed text-ink600text">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
