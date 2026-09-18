"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BgPattern } from "@/components/BgPattern";
import { useLocale } from "@/components/LocaleProvider";

// ---------------------------------------------------------------------------
// v4 — /faq: честные ответы про то, как считается скоринг, откуда данные и
// что демо, а что нет. <details>/<summary> — доступный аккордеон без JS.
// v5 — двуязычный контент (длинный текст, не через плоский словарь); ответ
// про язык интерфейса обновлён под новый охват перевода этой версии.
// ---------------------------------------------------------------------------

const FAQ_ITEMS: Record<"ru" | "en", { q: string; a: string }[]> = {
  ru: [
    {
      q: "Как считаются рекомендации? Это ИИ выбирает вузы?",
      a: "Нет. Подбор и скоринг (0–100 баллов по каждой программе) — детерминированная rule-based формула: направление, бюджет, академический экзамен, английский язык, язык обучения, страна, плюс небольшие бонусы за активности и предпочтение по кампусу. ИИ (Claude) используется только для текстового объяснения «почему подходит» и помощи с идеями для эссе — не для самого скоринга. Это сделано специально: результат воспроизводим и его можно проверить вручную.",
    },
    {
      q: "Что значат категории Reach / Target / Safety?",
      a: "Это реальная терминология college-консультирования (её использует, например, CollegeVine). Reach — амбициозный вариант с низкой предсказуемостью поступления, Target — реалистичный при вашем профиле, Safety — вариант с высокой вероятностью зачисления. Сбалансированный список обычно включает все три категории.",
    },
    {
      q: "Данные о вузах настоящие?",
      a: "Названия вузов и стран настоящие, но конкретные цифры (стоимость, конкурс, пороги по баллам, дедлайны) — демонстрационные ориентиры, а не выгрузка из официальных источников в реальном времени. Каждая карточка помечена как демо-данные со ссылкой на официальный сайт — перед подачей документов всегда проверяйте актуальные условия там.",
    },
    {
      q: "Почему объяснение иногда «офлайн», а не от ИИ?",
      a: "Если сервис объяснений временно недоступен (сеть, лимиты, сбой), показывается заранее подготовленный текстовый фолбэк на основе тех же rule-based причин — чтобы страница не ломалась и вы всё равно видели, почему программа попала в список.",
    },
    {
      q: "Куда сохраняется анкета?",
      a: "Локально в браузере (localStorage) — прогресс не отправляется на сервер и сохраняется между визитами на этом устройстве. Если очистить данные браузера или открыть сайт в приватном режиме/на другом устройстве, анкету нужно будет заполнить заново.",
    },
    {
      q: "Что попадает в личный кабинет?",
      a: "Кабинет собирает то, что уже есть в вашей анкете и действиях: сводку профиля, вузы, добавленные в избранное (кнопка «В избранное и сравнение» на карточке рекомендации или на странице вуза), и объединённый план задач/дедлайнов по всем избранным вузам сразу.",
    },
    {
      q: "Можно поступать не по ЕНТ?",
      a: "Да. Анкета поддерживает IB Diploma, A-Level, американскую систему (AP/GPA), казахстанский ЕНТ и «другую национальную программу» — вопросы про конкретные баллы подстраиваются под выбранную систему, плюс отдельно можно указать SAT/ACT, если они сдавались.",
    },
    {
      q: "Можно ли смотреть направления бизнеса, экономики и финансов, а не только IT/инженерию?",
      a: "Да. Анкета и каталог вузов (/explore) поддерживают полный набор направлений: несколько IT-направлений (программирование, Data Science, AI/ML, кибербезопасность, game dev, product/UX), инженерию/робототехнику/hardware/телеком, а также бизнес, экономику и финансы — с реальными программами (Wharton, LSE, HEC Paris, NUS Business School, Bocconi и другими).",
    },
    {
      q: "Зачем нужен календарь нагрузки, если уже есть roadmap для одного вуза?",
      a: "Roadmap на странице /roadmap строится для ОДНОГО выбранного вуза. Календарь нагрузки (/calendar) собирает задачи ВСЕХ избранных вузов сразу и показывает недели, где дедлайны нескольких вузов накладываются друг на друга — это видно только при взгляде на весь список избранного одновременно, а не по одному вузу за раз.",
    },
    {
      q: "Нужен ли аккаунт, чтобы пользоваться сайтом?",
      a: "Нет — анкета, рекомендации, каталог, сравнение и roadmap работают без регистрации (прогресс сохраняется локально в браузере). Аккаунт нужен только для одной функции — публикации отзыва на вуз, — и он полностью локальный: email и пароль (точнее, его хеш) хранятся в этом браузере, без внешнего сервера.",
    },
    {
      q: "Сайт поддерживает английский язык и светлую тему?",
      a: "Да — переключатели языка (RU/EN) и темы (тёмная/светлая) есть в шапке сайта. Интерфейс переведён полностью: навигация, анкета, каталог, рекомендации, сравнение, roadmap, личный кабинет и служебные страницы. Сам демо-датасет вузов (названия программ, описания, темы эссе — 46+ программ) сознательно оставлен на русском, чтобы не исказить авторский контент машинным переводом; текстовые объяснения от ИИ (Claude) генерируются на выбранном языке интерфейса.",
    },
  ],
  en: [
    {
      q: "How are the recommendations calculated? Does the AI pick universities?",
      a: "No. Matching and scoring (a 0–100 score per program) is a deterministic rule-based formula: major, budget, academic exam, English level, language of instruction, country, plus small bonuses for activities and campus preference. AI (Claude) is used only for the \"why it fits\" text explanation and essay idea help — not for the scoring itself. This is intentional: the result is reproducible and can be checked by hand.",
    },
    {
      q: "What do the Reach / Target / Safety categories mean?",
      a: "This is real college-counseling terminology (used, for example, by CollegeVine). Reach is an ambitious option with lower admission predictability, Target is realistic given your profile, and Safety is an option with a high chance of admission. A balanced list usually includes all three categories.",
    },
    {
      q: "Is the university data real?",
      a: "University and country names are real, but the specific numbers (cost, acceptance rate, score thresholds, deadlines) are demonstration reference points, not a real-time feed from official sources. Every card is labeled as demo data with a link to the official website — always verify current terms there before applying.",
    },
    {
      q: "Why does the explanation sometimes say \"offline\" instead of coming from AI?",
      a: "If the explanation service is temporarily unavailable (network, limits, an outage), a pre-written text fallback based on the same rule-based reasons is shown instead — so the page doesn't break and you still see why the program made the list.",
    },
    {
      q: "Where is my questionnaire saved?",
      a: "Locally in your browser (localStorage) — your progress is never sent to a server and persists between visits on this device. If you clear your browser data or open the site in private mode or on another device, you'll need to fill out the questionnaire again.",
    },
    {
      q: "What shows up in the dashboard?",
      a: "The dashboard pulls together what's already in your questionnaire and actions: a profile summary, universities you've favorited (via the \"Add to favorites & compare\" button on a recommendation card or a university page), and a combined task/deadline plan across all your favorited universities.",
    },
    {
      q: "Can I apply without the ENT?",
      a: "Yes. The questionnaire supports IB Diploma, A-Level, the US system (AP/GPA), the Kazakhstani ENT, and \"another national program\" — the score questions adapt to whichever system you pick, and you can separately enter SAT/ACT scores if you've taken them.",
    },
    {
      q: "Can I browse business, economics and finance majors, not just IT/engineering?",
      a: "Yes. The questionnaire and the university catalog (/explore) support the full set of majors: several IT tracks (programming, data science, AI/ML, cybersecurity, game dev, product/UX), engineering/robotics/hardware/telecom, and also business, economics and finance — with real programs (Wharton, LSE, HEC Paris, NUS Business School, Bocconi and others).",
    },
    {
      q: "Why do I need a workload calendar if there's already a roadmap for one university?",
      a: "The roadmap on /roadmap is built for ONE selected university. The workload calendar (/calendar) pulls tasks from ALL your favorited universities at once and flags weeks where several universities' deadlines overlap — something you can only see by looking at your whole favorites list together, not one university at a time.",
    },
    {
      q: "Do I need an account to use the site?",
      a: "No — the questionnaire, recommendations, catalog, comparison and roadmap all work without signing up (progress is saved locally in your browser). An account is only needed for one feature — posting a university review — and it's fully local: your email and password (specifically, its hash) are stored in this browser, with no external server.",
    },
    {
      q: "Does the site support English and a light theme?",
      a: "Yes — language (RU/EN) and theme (dark/light) toggles are in the site header. The interface is fully translated: navigation, the questionnaire, the catalog, recommendations, comparison, the roadmap, the dashboard, and the informational pages. The demo university dataset itself (program names, descriptions, essay prompts — 46+ programs) is intentionally kept in Russian so machine translation doesn't distort the authored content; AI (Claude) text explanations are generated in whichever interface language you've selected.",
    },
  ],
};

export default function FaqPage() {
  const { locale } = useLocale();
  const items = FAQ_ITEMS[locale];
  const isRu = locale === "ru";
  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas">
      <BgPattern />
      <SiteHeader active="faq" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{isRu ? "Помощь" : "Help"}</p>
        <h1 className="mb-2 font-display text-[28px] font-extrabold leading-tight text-ink-950 sm:text-3xl">
          {isRu ? "Частые вопросы" : "Frequently Asked Questions"}
        </h1>
        <p className="mb-8 max-w-2xl text-[15px] text-ink600text">
          {isRu
            ? "Как FomoUni считает рекомендации, откуда данные и что стоит знать перед тем, как полагаться на результат."
            : "How FomoUni calculates recommendations, where the data comes from, and what's worth knowing before relying on the result."}
        </p>

        <div className="space-y-3">
          {items.map((item) => (
            <details key={item.q} className="fu-card group !py-4 open:!pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-ink-900 marker:content-none">
                {item.q}
                <span className="shrink-0 text-brand-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink600text">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
