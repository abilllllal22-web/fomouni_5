"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Logo } from "@/components/Logo";
import { BgPattern } from "@/components/BgPattern";
import { useT, useLocale } from "@/components/LocaleProvider";

// ---------------------------------------------------------------------------
// v4 — рассказ о продукте и команде. Явно указаны все четыре
// основателя (по запросу пользователя) — без вымышленных ролей/биографий,
// только имена.
// v5 — двуязычный контент (длинный текст, не через плоский словарь).
// v6 — реальные фото основателей (загружены пользователем, соответствие
// фото↔имя подтверждено им явно) вместо инициалов-монограммы.
// ---------------------------------------------------------------------------

const FOUNDERS = [
  { name: "Билал Абильмансур", photo: "/founders/bilal.jpg" },
  { name: "Кабиев Ансар", photo: "/founders/ansar.jpg" },
  { name: "Наурзбаев Тамирлан", photo: "/founders/tamirlan.jpg" },
  { name: "Сагат Темирлан", photo: "/founders/temirlan.jpg" },
];

const HOW_IT_WORKS = {
  ru: [
    {
      title: "1. Анкета",
      text: "Подробная анкета учитывает систему аттестации (ЕНТ, IB, A-Level, AP или другую), баллы, языки, бюджет, сроки, внеучебную активность и предпочтения по кампусу — 12 шагов вместо одной общей формы.",
    },
    {
      title: "2. Диагностика",
      text: "Короткая сводка сильных сторон и рисков профиля — до того, как показать конкретные вузы, чтобы было понятно, на что вообще опирается подборка.",
    },
    {
      title: "3. Рекомендации",
      text: "Прозрачный rule-based скоринг (направление, бюджет, экзамен, язык, страна, активности, кампус) — 0–100 баллов по каждой программе, плюс классификация Reach / Target / Safety, как у профессиональных college-консультантов.",
    },
    {
      title: "4. Сравнение и план",
      text: "Выбранные варианты сравниваются по ключевым параметрам, а для основного варианта строится пошаговый roadmap: экзамены, эссе, рекомендательные письма, документы, дедлайны по раундам подачи.",
    },
    {
      title: "5. Календарь нагрузки",
      text: "Задачи всех избранных вузов собираются на одной неделю-за-неделей шкале, и система заранее подсвечивает недели, где дедлайны нескольких вузов накладываются друг на друга — этого не видно, если вести каждый вуз по отдельности.",
    },
  ],
  en: [
    {
      title: "1. Questionnaire",
      text: "A detailed questionnaire accounts for your grading system (ENT, IB, A-Level, AP, or another), scores, languages, budget, timeline, extracurriculars and campus preferences — 12 steps instead of one generic form.",
    },
    {
      title: "2. Diagnosis",
      text: "A short summary of your profile's strengths and risks — before you even see specific universities, so it's clear what the list is actually based on.",
    },
    {
      title: "3. Recommendations",
      text: "Transparent rule-based scoring (major, budget, exam, language, country, activities, campus) — a 0–100 score per program, plus a Reach / Target / Safety classification, the way professional college counselors work.",
    },
    {
      title: "4. Compare and plan",
      text: "Your selected options are compared across key parameters, and for your top choice we build a step-by-step roadmap: exams, essays, recommendation letters, documents, and deadlines by application round.",
    },
    {
      title: "5. Workload calendar",
      text: "Tasks from every favorited university land on one week-by-week timeline, and the system flags in advance the weeks where several universities' deadlines collide — something you can't see when tracking each school separately.",
    },
  ],
};

const CONTENT = {
  ru: {
    eyebrow: "О компании",
    title: "О FomoUni",
    intro:
      "FomoUni — сервис, который превращает анкету абитуриента в понятный, объяснимый и практичный маршрут поступления: куда подавать документы, почему именно эти программы подходят, и что делать дальше — неделя за неделей, до самого дедлайна.",
    missionTitle: "Миссия",
    mission:
      "Выбор университета — одно из самых дорогих и необратимых решений в жизни подростка, и чаще всего оно принимается вслепую: по советам знакомых, случайным рейтингам или названию, которое просто на слуху. FomoUni делает этот выбор основанным на данных — с прозрачной логикой подбора, которую можно проверить вручную, а не «чёрным ящиком» на базе одной только нейросети. LLM в продукте используется только там, где это действительно уместно — для объяснений и помощи с эссе, а не для самого подбора и скоринга.",
    howTitle: "Как это работает",
    techTitle: "Технологии",
    tech: "Next.js (App Router) и TypeScript на фронтенде, Zustand с сохранением в localStorage — весь прогресс остаётся в браузере пользователя и никуда не отправляется без необходимости. Объяснения рекомендаций и помощь с эссе — через Anthropic Claude API на сервере (ключ никогда не попадает в браузер), с офлайн-фолбэком на случай сбоя или отсутствия сети. Скоринг, построение плана и календарь нагрузки — чистые детерминированные функции, без обращения к LLM, чтобы результат был воспроизводим и объясним. Локальный аккаунт и отзывы на вузы устроены так же — только localStorage, без отдельного backend (см. Privacy Policy).",
    foundersTitle: "Основатели",
    foundersNote:
      "Команда FomoUni — проект команды для LOCUS Startup Hackathon 2026 (кейс «Персональный маршрут поступления»).",
  },
  en: {
    eyebrow: "About the company",
    title: "About FomoUni",
    intro:
      "FomoUni is a service that turns an applicant's questionnaire into a clear, explainable, practical admissions route: where to apply, why these programs fit, and what to do next — week by week, all the way to the deadline.",
    missionTitle: "Mission",
    mission:
      "Choosing a university is one of the most expensive, irreversible decisions in a teenager's life, and it's usually made blind — on a friend's advice, a random ranking, or a name that's simply familiar. FomoUni makes that choice data-driven, with transparent matching logic you can verify by hand rather than a black box built on a neural network alone. The LLM in the product is used only where it's genuinely appropriate — for explanations and essay help, not for the matching and scoring itself.",
    howTitle: "How it works",
    techTitle: "Technology",
    tech: "Next.js (App Router) and TypeScript on the frontend, Zustand with localStorage persistence — all progress stays in the user's browser and is never sent anywhere unnecessarily. Recommendation explanations and essay help go through the Anthropic Claude API on the server (the key never reaches the browser), with an offline fallback in case of a network failure. Scoring, roadmap generation, and the workload calendar are pure deterministic functions, with no LLM call, so the result is reproducible and explainable. The local account system and university reviews work the same way — localStorage only, no separate backend (see the Privacy Policy).",
    foundersTitle: "Founders",
    foundersNote: "The FomoUni team — a project built for LOCUS Startup Hackathon 2026 (\"Personal Admissions Route\" case).",
  },
};

export default function AboutPage() {
  const t = useT();
  const { locale } = useLocale();
  const c = CONTENT[locale];
  const steps = HOW_IT_WORKS[locale];

  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="about" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <Logo variant="icon" className="mb-5 h-12 w-auto" />
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{c.eyebrow}</p>
        <h1 className="mb-3 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {c.title}
        </h1>
        <p className="mb-10 text-[17px] leading-relaxed text-ink600text">{c.intro}</p>

        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl font-bold text-ink-950">{c.missionTitle}</h2>
          <p className="text-[15px] leading-relaxed text-ink-900">{c.mission}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold text-ink-950">{c.howTitle}</h2>
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.title} className="fu-card">
                <p className="mb-1 text-sm font-bold text-brand-700">{step.title}</p>
                <p className="text-[15px] leading-relaxed text-ink-900">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 font-display text-xl font-bold text-ink-950">{c.techTitle}</h2>
          <p className="text-[15px] leading-relaxed text-ink-900">{c.tech}</p>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-ink-950">{c.foundersTitle}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FOUNDERS.map((founder) => (
              <div key={founder.name} className="fu-card flex items-center gap-3 !py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm"
                />
                <p className="text-[15px] font-semibold text-ink-900">{founder.name}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink600text">{c.foundersNote}</p>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
