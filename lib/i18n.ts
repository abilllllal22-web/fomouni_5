// ---------------------------------------------------------------------------
// v4/v5 — лёгкая система переводов (без сторонних библиотек, чтобы не раздувать
// бандл и сборку): словарь RU/EN + React-контекст (см. components/
// LocaleProvider.tsx) с хуком useT().
//
// v5 — охват СИЛЬНО расширен по прямому запросу пользователя (переключатель
// языка визуально "ничего не делал", т.к. был подключён только к шапке).
// Теперь переведён весь статический UI-текст (навигация, кнопки, заголовки,
// подсказки, лейблы) на КАЖДОЙ странице, включая все варианты анкеты
// (label/hint опций — через OPTION_TRANSLATIONS ниже) и общие карты меток
// (EXAM_TYPE_LABEL и т.п. из lib/types.ts — см. функции-обёртки внизу файла).
//
// Осознанно НЕ переведено (раскрыто в /faq): (1) сам демо-датасет —
// названия вузов/программ/города, тексты essayPrompt/highlights/grantNote —
// это авторский контент на 36+ программ, а не UI; (2) текст, который
// генерирует LLM (/api/explain, /api/diagnosis, /api/essay-ideas) —
// для него достаточно передать локаль в промпт (см. эти роуты), и модель
// сама отвечает на нужном языке, опираясь на те же (русские) rule-based
// факты — переводить сами факты не нужно.
// ---------------------------------------------------------------------------

export type Locale = "ru" | "en";

export const LOCALES: Locale[] = ["ru", "en"];

export const LOCALE_LABEL: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
};

type Dict = Record<string, string>;

const ru: Dict = {
  // --- Навигация / общее -----------------------------------------------
  "nav.catalog": "Каталог",
  "nav.dashboard": "Кабинет",
  "nav.calendar": "Календарь нагрузки",
  "nav.about": "О сайте",
  "nav.faq": "Вопросы",
  "nav.support": "Поддержка",
  "nav.login": "Войти",
  "nav.menu": "Меню",
  "nav.start": "Начать анкету →",
  "nav.continue": "Продолжить →",
  "nav.restart": "↺ Начать заново",
  "appshell.dashboard": "Личный кабинет",
  "appshell.catalog": "Каталог вузов",
  "appshell.confirmRestart": "Начать заново? Анкета и прогресс будут сброшены.",
  "stage.entry": "Вход",
  "stage.profile": "Профиль",
  "stage.diagnosis": "Диагностика",
  "stage.recommendations": "Рекомендации",
  "stage.compare": "Сравнение",
  "stage.roadmap": "Roadmap",
  "stage.nextAction": "Следующий шаг",
  "common.back": "← Назад",
  "common.next": "Далее",
  "common.skip": "Пропустить",
  "common.more": "Подробнее →",
  "common.website": "Сайт вуза ↗",
  "common.favoriteAdd": "В избранное и сравнение",
  "common.favoriteAdded": "✓ В избранном / сравнении",
  "common.notSpecified": "Не указано",
  "common.demoData": "демо-данные",
  "common.demoSource": "Подробнее",
  "common.demoSourceTitle": "Открыть официальный источник",
  "common.retry": "Повторить попытку",
  "common.errorDefault": "Не получилось загрузить объяснение. Попробуйте ещё раз.",

  // --- Футер --------------------------------------------------------------
  "footer.tagline": "Помогаем абитуриентам со всего мира находить вузы, которые им действительно подходят.",
  "footer.product": "Продукт",
  "footer.company": "Компания",
  "footer.legal": "Правовая информация",
  "footer.rights": "Хакатон-проект LOCUS Startup Hackathon 2026. Все данные о вузах — демонстрационные.",
  "footer.linkCatalog": "Каталог вузов",
  "footer.linkProfile": "Пройти анкету",
  "footer.linkDashboard": "Личный кабинет",
  "footer.linkCalendar": "Календарь нагрузки",
  "footer.linkAbout": "О сайте",
  "footer.linkFaq": "Частые вопросы",
  "footer.linkSupport": "Поддержка",
  "footer.linkPrivacy": "Конфиденциальность",
  "footer.linkCookies": "Cookies",

  // --- Лендинг --------------------------------------------------------------
  "landing.heroEyebrow": "стран · IT, инженерия, бизнес и другие направления · бакалавриат",
  "landing.heroTitle1": "Свой маршрут поступления,",
  "landing.heroTitle2": "а не список вузов",
  "landing.heroSubtitle":
    "FomoUni проведёт от короткой анкеты до понятного плана: какие программы в мире подходят именно вам, почему — и что сделать прямо сейчас, чтобы туда поступить.",
  "landing.statCountries": "стран",
  "landing.statPrograms": "программ в базе",
  "landing.statSteps": "12 шагов",
  "landing.statStepsSub": "анкета, ~5 мин",
  "landing.ctaResume": "Продолжить с того же места →",
  "landing.ctaRestart": "Начать заново",
  "landing.ctaStart": "Начать → 5 минут",
  "landing.ctaCatalog": "Посмотреть каталог вузов без анкеты",

  // --- v6: "флагманская" секция — календарь нагрузки как главное отличие --
  "landing.flagshipEyebrow": "Чего не хватает обычному списку вузов",
  "landing.flagshipTitle": "Календарь нагрузки: видно, где дедлайны сталкиваются",
  "landing.flagshipText": "Когда вы ведёте несколько вузов одновременно, самая частая проблема — не забытый дедлайн, а неделя, на которую случайно легли эссе одного вуза, документы другого и результаты экзамена третьего. FomoUni собирает задачи всех избранных вузов на одной шкале и заранее показывает такие перегруженные недели — это построено на ваших же данных, без гаданий и без новых источников.",
  "landing.flagshipCta": "Открыть календарь нагрузки →",
  "landing.flagshipNote": "Доступен после того, как вы добавите хотя бы один вуз в избранное.",

  // --- v8: мини-превью календаря нагрузки прямо в hero (справа) ----------
  "landing.heroGraphicCaption": "Нажмите на день с точками — например, на неделю пересечения ниже",

  "landing.howEyebrow": "Как это работает",
  "landing.howTitle": "От анкеты до плана подготовки за четыре шага",
  "landing.step1Title": "Анкета — 12 шагов",
  "landing.step1Text": "Система аттестации, интересы, успеваемость, языки, бюджет, сроки, внеучебная активность и предпочтение по кампусу.",
  "landing.step2Title": "Диагностика профиля",
  "landing.step2Text": "Человеческим языком — сильные стороны и на что обратить внимание, прежде чем смотреть конкретные вузы.",
  "landing.step3Title": "Reach / Target / Safety-подборка",
  "landing.step3Text": "Программы со всего мира с объяснением, почему каждая попала в список — и конкурентная категория для каждой.",
  "landing.step4Title": "Сравнение и roadmap",
  "landing.step4Text": "Сопоставьте варианты бок о бок и получите пошаговый план подготовки с дедлайнами для выбранной программы.",
  "landing.whyEyebrow": "Почему FomoUni",
  "landing.whyTitle": "Сделано так, как реально помогает выбрать вуз",
  "landing.value1Title": "Прозрачный скоринг, не чёрный ящик",
  "landing.value1Text": "Каждый балл 0–100 раскладывается на понятные причины: направление, бюджет, экзамен, язык, страна, активности. Результат можно проверить вручную — это не догадка нейросети.",
  "landing.value2Title": "Reach / Target / Safety",
  "landing.value2Text": "Та же логика, что используют профессиональные college-консультанты: сбалансированный список из амбициозных, реалистичных и надёжных вариантов — а не один «идеальный» вуз.",
  "landing.value3Title": "Любая система аттестации",
  "landing.value3Text": "ЕНТ, IB Diploma, A-Level, американская AP/GPA-система или другая национальная программа — анкета подстраивает вопросы под вашу реальную ситуацию, а не только под казахстанских выпускников.",
  "landing.value4Title": "Личный кабинет",
  "landing.value4Text": "Профиль и избранные вузы в одном месте — основа для календаря нагрузки и общего плана задач ниже.",
  "landing.value5Title": "План, а не просто список",
  "landing.value5Text": "Для каждого варианта — пошаговый roadmap: экзамены, эссе, рекомендательные письма, документы и дедлайны по раундам подачи (EA/ED/RD/UCAS/Rolling).",
  "landing.value6Title": "Помощь с эссе",
  "landing.value6Text": "Идеи для личного заявления на основе вашего профиля и темы конкретного вуза — черновик, а не готовый текст под копирование.",
  "landing.aboutEyebrow": "О компании",
  "landing.aboutCtaTitle": "FomoUni — проект команды для LOCUS Startup Hackathon 2026",
  "landing.aboutCtaText": "Узнайте больше о продукте, основателях и о том, как устроен скоринг рекомендаций.",
  "landing.aboutCtaBtn": "О сайте →",
  "landing.faqCtaBtn": "Частые вопросы",
  "landing.disclaimer": "Демо-продукт для LOCUS Hackathon 2026. Стоимость, баллы, конкурс и дедлайны — демонстрационные данные, уточняйте на сайте вуза.",

  // --- Анкета (шапка шагов) -------------------------------------------------
  "profile.stepOf": "Шаг {n} из {m}",
  "profile.finalNext": "Получить диагностику →",
  "profile.step1.title": "На каком ты сейчас этапе?",
  "profile.step1.hint": "Это поможет понять, сколько времени есть на подготовку.",
  "profile.step2.title": "Что тебе интереснее всего?",
  "profile.step2.hint": "Можно выбрать до двух направлений — они определят подборку программ.",
  "profile.step3.title": "По какой программе учишься?",
  "profile.step3.hint": "От этого зависит, какие именно баллы мы спросим дальше — ЕНТ подходит не всем.",
  "profile.step4.title": "Как дела с успеваемостью?",
  "profile.step4.hint": "Средний балл и итоговый результат вашей системы — приблизительно, это нормально.",
  "profile.step5.title": "Есть баллы SAT или ACT?",
  "profile.step5.hint": "Необязательно для всех программ, но некоторые вузы принимают их как дополнительный или основной путь — если ещё не сдавали, просто пропустите.",
  "profile.step6.title": "Языки и уровень английского",
  "profile.step6.hint": "На каких языках комфортно учиться, и насколько силён английский.",
  "profile.step7.title": "В каких странах хочешь учиться?",
  "profile.step7.hint": "Выберите до 3 стран — можно оставить только одну, если цель уже точная.",
  "profile.step8.title": "Какой бюджет на обучение в год?",
  "profile.step8.hint": "Ориентировочно, в долларах США — можно поменять позже, и рекомендации сразу пересчитаются.",
  "profile.step9.title": "Когда планируешь поступать?",
  "profile.step10.title": "Есть внеучебная активность?",
  "profile.step10.hint": "Олимпиады, исследования, хакатоны, стажировки — усиливают заявку на конкурсные программы. Необязательно, но повышает точность.",
  "profile.step11.title": "Какой формат кампуса тебе ближе?",
  "profile.step11.hint": "Это влияет на общий опыт учёбы — не отсекает программы, а слегка уточняет подборку.",
  "profile.step12.title": "Ограничения и приоритеты",
  "profile.step12.hint": "Что важно учесть — и что важнее всего при выборе (до 3 пунктов). Это определит, что подсветится в сравнении.",
  "profile.ibScoreLabel": "Балл IB Diploma (предсказанный или итоговый, из 45)",
  "profile.ibScoreNone": "Предсказанных баллов пока нет",
  "profile.alevelLabel": "Итоговые (или предсказанные) оценки A-Level",
  "profile.apCountLabel": "Количество сданных AP-экзаменов",
  "profile.apAvgLabel": "Средний балл по AP (из 5)",
  "profile.apNone": "AP ещё не сдавал(а)",
  "profile.entLabel": "Балл ЕНТ (из 140)",
  "profile.entNone": "ЕНТ ещё не сдавал(а)",
  "profile.otherSystemHint":
    "Ваша программа аттестации не входит в готовый список (например, Abitur, Baccalauréat) — итоговые баллы уточняйте требования каждой программы индивидуально на сайте вуза. Средний балл ниже поможет с общей оценкой профиля.",
  "profile.gpaLabelUs": "Средний балл аттестата (GPA, из 4.0)",
  "profile.gpaLabelOther": "Средний балл аттестата (из 5.0)",
  "profile.satLabel": "SAT (из 1600)",
  "profile.satNone": "SAT не сдавал(а)",
  "profile.actLabel": "ACT (из 36)",
  "profile.actNone": "ACT не сдавал(а)",
  "profile.languagesLabel": "Языки, на которых готов(а) учиться",
  "profile.englishLevelLabel": "Уровень английского",
  "profile.constraintsLabel": "Важные ограничения (необязательно)",
  "profile.prioritiesLabel": "Что важнее всего при выборе? (до 3)",

  // --- Каталог (/explore) ----------------------------------------------------
  "explore.eyebrow": "программ · {c} стран",
  "explore.title": "Каталог вузов",
  "explore.subtitlePre": "Вся демо-база доступна для изучения без анкеты. Чтобы получить персональный скоринг, объяснение «почему подходит» и roadmap —",
  "explore.subtitleLink": "пройдите анкету",
  "explore.searchPlaceholder": "Поиск: вуз, программа, город...",
  "explore.allCountries": "Все страны",
  "explore.allDirections": "Все направления",
  "explore.sortDefault": "По умолчанию",
  "explore.sortCostAsc": "Дешевле сначала",
  "explore.sortCostDesc": "Дороже сначала",
  "explore.sortAcceptanceAsc": "Ниже acceptance rate сначала",
  "explore.sortAcceptanceDesc": "Выше acceptance rate сначала",
  "explore.found": "Найдено программ: {n}",
  "explore.perYear": "/год",
  "explore.competition": "acceptance rate ~{n}%",
  "explore.empty": "Ничего не найдено — попробуйте изменить фильтры.",

  // --- Карточка вуза (/university/[id]) --------------------------------------
  "university.notFound": "Программа не найдена в демо-базе",
  "university.backToCatalog": "← В каталог",
  "university.competitionDemo": "acceptance rate (демо)",
  "university.perYear": "в год",
  "university.students": "студентов",
  "university.campusFormat": "формат кампуса",
  "university.about": "О программе",
  "university.examsAndLanguage": "Экзамены и языковые требования",
  "university.roundsPortal": "Раунды подачи · портал: {portal}",
  "university.scholarships": "Стипендии и гранты",
  "university.relatedPrograms": "Смежные программы вуза",
  "university.essay": "Эссе / личное заявление",
  "university.essayPromptLabel": "Тема-ориентир:",
  "university.essayNoProfile": "Пройдите анкету, чтобы получить персональные идеи для эссе по этой программе.",

  // --- Диагностика (/diagnosis) -----------------------------------------------
  "diagnosis.eyebrow": "Диагностика профиля",
  "diagnosis.title": "Вот как выглядит твой профиль",
  "diagnosis.error": "Не удалось сформировать диагностику. Попробуйте ещё раз.",
  "diagnosis.strengths": "Сильные стороны",
  "diagnosis.limitations": "Ограничения",
  "diagnosis.goal": "Вероятная цель",
  "diagnosis.offline": "Сформировано офлайн-правилами (без вызова LLM).",
  "diagnosis.next": "Смотреть рекомендации →",

  // --- Рекомендации (/recommendations) -----------------------------------------
  "rec.eyebrow": "Минимум 3 варианта · rule-based подбор по всей базе",
  "rec.title": "Подходящие программы",
  "rec.subtitlePre": "Отобрано и отсортировано по совпадению с анкетой: направление, бюджет, путь поступления (SAT/IB/A-Level/AP/ЕНТ), язык и страна. Изменили бюджет или направление?",
  "rec.subtitleLink": "Отредактируйте анкету",
  "rec.subtitlePost": "— список сразу пересчитается.",
  "rec.balance": "Баланс списка:",
  "rec.missingSafety": "В подборке пока нет ни одного safety-варианта — стоит добавить хотя бы один надёжный вариант в список.",
  "rec.selectedCount": "Выбрано для сравнения:",
  "rec.compare": "Сравнить →",
  "rec.selectMore": "Выберите минимум 2 варианта, чтобы перейти к сравнению.",
  "rec.whyFits": "Почему подходит именно тебе",
  "rec.offlineExplanation": "(офлайн-объяснение)",
  "rec.tierTop": "Топ выбор",
  "rec.tierHigh": "Высокий рейтинг",
  "rec.tierGood": "Хороший вариант",
  "rec.tierReview": "Стоит рассмотреть",

  // --- Сравнение (/compare) -----------------------------------------------------
  "compare.eyebrow": "По вашим приоритетам",
  "compare.title": "Сравнение вариантов",
  "compare.emptyTitle": "Недостаточно вариантов для сравнения",
  "compare.emptyHint": "Вернитесь к рекомендациям и выберите минимум 2.",
  "compare.pickRoadmap": "Для какого варианта построить roadmap?",
  "compare.roadmapBtn": "Roadmap →",
  "compare.param": "Параметр",
  "compare.source": "Источник",
  "compare.priorityNote": "★ Подсвечены параметры, которые вы отметили как приоритетные:",
  "compare.rowCost": "Стоимость / год",
  "compare.rowAcceptance": "Acceptance rate (демо-ориентир)",
  "compare.rowGrant": "Грант",
  "compare.rowLanguage": "Язык обучения",
  "compare.rowCountry": "Страна / город",
  "compare.rowDuration": "Длительность",
  "compare.rowExam": "Принимаемые пути поступления",
  "compare.rowTestPolicy": "Политика по SAT/ACT",
  "compare.rowEnglish": "Требование по английскому",
  "compare.rowRounds": "Раунды подачи",
  "compare.rowDeadline": "Дедлайн подачи",
  "compare.grantAvailable": "Доступен",
  "compare.grantUnlikely": "Маловероятен",
  "compare.examTba": "Уточняется у приёмной комиссии",
  "compare.englishTba": "Не указано в датасете",

  // --- Roadmap ------------------------------------------------------------------
  "roadmap.emptyTitle": "Сначала выберите вариант для roadmap",
  "roadmap.emptyHint": "Вернитесь к сравнению и нажмите «Roadmap →» у одного из вариантов.",
  "roadmap.personalPlan": "Персональный план",
  "roadmap.fullCard": "Полная карточка вуза →",
  "roadmap.done": "выполнено",
  "roadmap.fullPlan": "Полный план",
  "roadmap.essayHelp": "Помощь с эссе",
  "roadmap.categoryExam": "Экзамен",
  "roadmap.categoryDocument": "Документ",
  "roadmap.categoryAcademic": "Учебный шаг",
  "roadmap.categoryActivity": "Активность",
  "roadmap.categoryDeadline": "Дедлайн подачи",
  "roadmap.noHardDate": "Без жёсткой даты",
  "roadmap.done_banner_title": "Roadmap пройден",
  "roadmap.done_banner_h2": "Все шаги отмечены ✓",
  "roadmap.done_banner_text": "Вернитесь к roadmap, если появятся новые дедлайны, или пересмотрите анкету, если что-то в планах изменилось.",
  "roadmap.nextStep": "Ближайший шаг",
  "roadmap.until": "до",
  "roadmap.markDone": "Отметить как выполнено →",

  // --- Личный кабинет (/dashboard) -----------------------------------------------
  "dashboard.title": "Личный кабинет",
  "dashboard.subtitle": "Твой профиль, избранные вузы и задачи в одном месте",
  "dashboard.profile": "Профиль абитуриента",
  "dashboard.edit": "Изменить анкету",
  "dashboard.favorites": "Избранные вузы",
  "dashboard.favorites.empty": "Пока нет избранных вузов — добавляй их со страницы рекомендаций или каталога.",
  "dashboard.tasks": "Задачи и дедлайны",
  "dashboard.tasks.empty": "Добавь вуз в избранное, чтобы увидеть план подготовки.",
  "dashboard.emptyTitle": "Анкета ещё не заполнена",
  "dashboard.emptyHint": "Пройдите анкету, чтобы кабинет заполнился вашими данными, рекомендациями и планом подготовки.",
  "dashboard.fieldGrade": "Этап",
  "dashboard.fieldSystem": "Система аттестации",
  "dashboard.fieldEnglish": "Английский",
  "dashboard.fieldLanguages": "Языки обучения",
  "dashboard.fieldCountries": "Целевые страны",
  "dashboard.fieldBudget": "Бюджет",
  "dashboard.fieldTimeline": "Сроки",
  "dashboard.fieldCampus": "Предпочтение по кампусу",
  "dashboard.fieldActivities": "Активность",
  "dashboard.toRecommendations": "К рекомендациям",
  "dashboard.toCatalog": "В каталог",
  "dashboard.removeFavorite": "Убрать из избранного",
  "dashboard.upcomingDeadlines": "Ближайшие дедлайны",
  "dashboard.noDeadlines": "Пока нет предстоящих дедлайнов подачи.",

  // --- Помощник по эссе --------------------------------------------------------
  "essay.cta": "Идеи для эссе / личного заявления",
  "essay.offline": "(офлайн-брейнсторм, без LLM)",

  // --- v6: локальный аккаунт (вход/регистрация) --------------------------
  "auth.loginTitle": "Вход",
  "auth.signupTitle": "Регистрация",
  "auth.localNotice": "Локальный демо-аккаунт: email и пароль сохраняются только в этом браузере, без сервера-аутентификации. Подробнее — в Privacy Policy.",
  "auth.name": "Имя",
  "auth.namePlaceholder": "Как к вам обращаться",
  "auth.email": "Email",
  "auth.password": "Пароль",
  "auth.loginCta": "Войти",
  "auth.signupCta": "Зарегистрироваться",
  "auth.hasAccount": "Уже есть аккаунт?",
  "auth.noAccount": "Ещё нет аккаунта?",
  "auth.errorInvalid": "Проверьте email и пароль (минимум 4 символа).",
  "auth.errorExists": "Аккаунт с таким email уже зарегистрирован в этом браузере.",
  "auth.errorNotFound": "Аккаунт с таким email не найден в этом браузере.",
  "auth.errorWrongPassword": "Неверный пароль.",
  "auth.accountTitle": "Личный аккаунт",
  "auth.logout": "Выйти",
  "auth.deleteAccount": "Удалить аккаунт",
  "auth.confirmDelete": "Удалить локальный аккаунт и выйти? Это действие нельзя отменить.",

  // --- v6: отзывы на вузы -------------------------------------------------
  "reviews.title": "Отзывы",
  "reviews.empty": "Отзывов пока нет — будьте первым, кто поделится опытом об этой программе.",
  "reviews.loginToWrite": "Войдите в аккаунт, чтобы оставить отзыв →",
  "reviews.placeholder": "Что стоит знать будущим абитуриентам об этой программе?",
  "reviews.submit": "Опубликовать отзыв",
  "reviews.thanks": "Спасибо! Ваш отзыв сохранён в этом браузере.",

  // --- v6: умный календарь нагрузки (ключевая отличительная функция) -----
  "calendar.title": "Календарь нагрузки",
  "calendar.subtitle": "Дедлайны всех избранных вузов на одной шкале — с предупреждением о неделях, где несколько дедлайнов накладываются друг на друга.",
  "calendar.emptyTitle": "Пока нет избранных вузов",
  "calendar.emptyHint": "Добавьте вузы в избранное на странице рекомендаций или каталога — календарь соберёт их дедлайны автоматически.",
  "calendar.noDeadlines": "У избранных вузов пока нет датированных дедлайнов.",
  "calendar.statUniversities": "вузов в календаре",
  "calendar.statWeeks": "недель с задачами",
  "calendar.statCollisions": "перегруженных недель",
  "calendar.collisionBadge": "⚠ {n} вуза на этой неделе",
  "calendar.prevMonth": "Предыдущий месяц",
  "calendar.nextMonth": "Следующий месяц",
  "calendar.selectDayHint": "Нажмите на день с точками, чтобы увидеть задачи",
  "calendar.backToDashboard": "← Вернуться в личный кабинет",

  // --- v6: уведомление про локальное хранение данных ----------------------
  "cookieNotice.text": "FomoUni хранит анкету, аккаунт и отзывы локально в вашем браузере (не в трекинг-cookie).",
  "cookieNotice.linkCookies": "Cookies Policy",
  "cookieNotice.linkPrivacy": "Privacy Policy",
  "cookieNotice.dismiss": "Понятно",
};

const en: Dict = {
  "nav.catalog": "Catalog",
  "nav.dashboard": "Dashboard",
  "nav.calendar": "Workload calendar",
  "nav.about": "About",
  "nav.faq": "FAQ",
  "nav.support": "Support",
  "nav.login": "Log in",
  "nav.menu": "Menu",
  "nav.start": "Start questionnaire →",
  "nav.continue": "Continue →",
  "nav.restart": "↺ Start over",
  "appshell.dashboard": "Dashboard",
  "appshell.catalog": "University catalog",
  "appshell.confirmRestart": "Start over? Your questionnaire and progress will be reset.",
  "stage.entry": "Start",
  "stage.profile": "Profile",
  "stage.diagnosis": "Diagnosis",
  "stage.recommendations": "Recommendations",
  "stage.compare": "Compare",
  "stage.roadmap": "Roadmap",
  "stage.nextAction": "Next step",
  "common.back": "← Back",
  "common.next": "Next",
  "common.skip": "Skip",
  "common.more": "Details →",
  "common.website": "University website ↗",
  "common.favoriteAdd": "Add to favorites & compare",
  "common.favoriteAdded": "✓ Favorited / in comparison",
  "common.notSpecified": "Not specified",
  "common.demoData": "demo data",
  "common.demoSource": "Learn more",
  "common.demoSourceTitle": "Open the official source",
  "common.retry": "Try again",
  "common.errorDefault": "Couldn't load the explanation. Please try again.",

  "footer.tagline": "Helping students worldwide find universities that actually fit them.",
  "footer.product": "Product",
  "footer.company": "Company",
  "footer.legal": "Legal",
  "footer.rights": "LOCUS Startup Hackathon 2026 project. All university data is for demonstration purposes.",
  "footer.linkCatalog": "University catalog",
  "footer.linkProfile": "Take the questionnaire",
  "footer.linkDashboard": "Dashboard",
  "footer.linkCalendar": "Workload calendar",
  "footer.linkAbout": "About",
  "footer.linkFaq": "FAQ",
  "footer.linkSupport": "Support",
  "footer.linkPrivacy": "Privacy",
  "footer.linkCookies": "Cookies",

  "landing.heroEyebrow": "countries · IT, engineering, business and more · undergraduate",
  "landing.heroTitle1": "Your own admissions route,",
  "landing.heroTitle2": "not just a list of schools",
  "landing.heroSubtitle":
    "FomoUni takes you from a short questionnaire to a clear plan: which programs worldwide actually fit you, why — and what to do right now to get in.",
  "landing.statCountries": "countries",
  "landing.statPrograms": "programs in the database",
  "landing.statSteps": "12 steps",
  "landing.statStepsSub": "questionnaire, ~5 min",
  "landing.ctaResume": "Continue where you left off →",
  "landing.ctaRestart": "Start over",
  "landing.ctaStart": "Start → 5 minutes",
  "landing.ctaCatalog": "Browse the catalog without the questionnaire",

  // --- v6: flagship section — workload calendar as the key differentiator
  "landing.flagshipEyebrow": "What an ordinary university list won't show you",
  "landing.flagshipTitle": "Workload Calendar: see where deadlines collide",
  "landing.flagshipText": "When you're tracking several universities at once, the real problem usually isn't a forgotten deadline — it's a week that quietly ends up holding one school's essay, another's documents, and a third's exam results, all at once. FomoUni pulls every favorited university's tasks onto one timeline and flags those overloaded weeks in advance — built entirely from your own data, no guesswork, no new data sources.",
  "landing.flagshipCta": "Open the workload calendar →",
  "landing.flagshipNote": "Available once you've added at least one university to your favorites.",

  // --- v8: mini workload-calendar preview right inside the hero -----------
  "landing.heroGraphicCaption": "Click a day with dots — try the collision week below",

  "landing.howEyebrow": "How it works",
  "landing.howTitle": "From questionnaire to prep plan in four steps",
  "landing.step1Title": "Questionnaire — 12 steps",
  "landing.step1Text": "Grading system, interests, grades, languages, budget, timeline, extracurriculars and campus preference.",
  "landing.step2Title": "Profile diagnosis",
  "landing.step2Text": "In plain language — strengths and what to watch out for, before you even look at specific universities.",
  "landing.step3Title": "Reach / Target / Safety picks",
  "landing.step3Text": "Programs from around the world with an explanation of why each one made the list — and a competitiveness category for each.",
  "landing.step4Title": "Compare and roadmap",
  "landing.step4Text": "Compare options side by side and get a step-by-step prep plan with deadlines for your chosen program.",
  "landing.whyEyebrow": "Why FomoUni",
  "landing.whyTitle": "Built the way that actually helps you choose a university",
  "landing.value1Title": "Transparent scoring, not a black box",
  "landing.value1Text": "Every 0–100 score breaks down into clear reasons: major, budget, exam, language, country, activities. The result can be checked by hand — it's not a neural network's guess.",
  "landing.value2Title": "Reach / Target / Safety",
  "landing.value2Text": "The same approach professional college counselors use: a balanced list of ambitious, realistic and safe options — not one single \"perfect\" school.",
  "landing.value3Title": "Any grading system",
  "landing.value3Text": "ENT, IB Diploma, A-Level, the US AP/GPA system, or another national program — the questionnaire adapts its questions to your real situation, not just to Kazakhstani graduates.",
  "landing.value4Title": "Personal dashboard",
  "landing.value4Text": "Your profile and favorite universities in one place — the foundation for the workload calendar and combined task list below.",
  "landing.value5Title": "A plan, not just a list",
  "landing.value5Text": "For every option — a step-by-step roadmap: exams, essays, recommendation letters, documents, and deadlines by application round (EA/ED/RD/UCAS/Rolling).",
  "landing.value6Title": "Essay help",
  "landing.value6Text": "Ideas for your personal statement based on your profile and that university's prompt — a starting point, not a finished text to copy.",
  "landing.aboutEyebrow": "About the company",
  "landing.aboutCtaTitle": "FomoUni — a team project for LOCUS Startup Hackathon 2026",
  "landing.aboutCtaText": "Learn more about the product, the founders, and how the recommendation scoring works.",
  "landing.aboutCtaBtn": "About →",
  "landing.faqCtaBtn": "FAQ",
  "landing.disclaimer": "Demo product for LOCUS Hackathon 2026. Costs, scores, competitiveness and deadlines are demonstration data — verify on the university's website.",

  "profile.stepOf": "Step {n} of {m}",
  "profile.finalNext": "Get my diagnosis →",
  "profile.step1.title": "What stage are you at right now?",
  "profile.step1.hint": "This helps us understand how much time you have to prepare.",
  "profile.step2.title": "What interests you most?",
  "profile.step2.hint": "Pick up to two majors — they'll shape the program list.",
  "profile.step3.title": "What grading system are you in?",
  "profile.step3.hint": "This decides which scores we'll ask about next — ENT isn't for everyone.",
  "profile.step4.title": "How are your grades?",
  "profile.step4.hint": "Your GPA and your system's final result — approximate is fine.",
  "profile.step5.title": "Do you have SAT or ACT scores?",
  "profile.step5.hint": "Not required for every program, but some universities accept it as an extra or main path — skip it if you haven't taken it yet.",
  "profile.step6.title": "Languages and English level",
  "profile.step6.hint": "Which languages you're comfortable studying in, and how strong your English is.",
  "profile.step7.title": "Which countries do you want to study in?",
  "profile.step7.hint": "Pick up to 3 countries — one is fine if your target is already clear.",
  "profile.step8.title": "What's your yearly budget for tuition?",
  "profile.step8.hint": "Approximate, in US dollars — you can change it later and recommendations will recalculate.",
  "profile.step9.title": "When are you planning to apply?",
  "profile.step10.title": "Any extracurricular activities?",
  "profile.step10.hint": "Olympiads, research, hackathons, internships — these strengthen an application to competitive programs. Optional, but improves accuracy.",
  "profile.step11.title": "What kind of campus suits you best?",
  "profile.step11.hint": "This affects your overall experience — it won't rule out programs, it just fine-tunes the list.",
  "profile.step12.title": "Constraints and priorities",
  "profile.step12.hint": "What matters to you — and what matters most when choosing (up to 3). This decides what gets highlighted in comparisons.",
  "profile.ibScoreLabel": "IB Diploma score (predicted or final, out of 45)",
  "profile.ibScoreNone": "No predicted score yet",
  "profile.alevelLabel": "Final (or predicted) A-Level grades",
  "profile.apCountLabel": "Number of AP exams taken",
  "profile.apAvgLabel": "Average AP score (out of 5)",
  "profile.apNone": "Haven't taken AP exams yet",
  "profile.entLabel": "ENT score (out of 140)",
  "profile.entNone": "Haven't taken the ENT yet",
  "profile.otherSystemHint":
    "Your grading program isn't in our ready-made list (e.g. Abitur, Baccalauréat) — check each program's requirements individually on the university's website. Your GPA below still helps with the overall profile assessment.",
  "profile.gpaLabelUs": "GPA (out of 4.0)",
  "profile.gpaLabelOther": "Average grade (out of 5.0)",
  "profile.satLabel": "SAT (out of 1600)",
  "profile.satNone": "Haven't taken the SAT",
  "profile.actLabel": "ACT (out of 36)",
  "profile.actNone": "Haven't taken the ACT",
  "profile.languagesLabel": "Languages you're comfortable studying in",
  "profile.englishLevelLabel": "English level",
  "profile.constraintsLabel": "Important constraints (optional)",
  "profile.prioritiesLabel": "What matters most when choosing? (up to 3)",

  "explore.eyebrow": "programs · {c} countries",
  "explore.title": "University Catalog",
  "explore.subtitlePre": "The whole demo database is open to browse without the questionnaire. For a personal score, a \"why it fits\" explanation and a roadmap —",
  "explore.subtitleLink": "take the questionnaire",
  "explore.searchPlaceholder": "Search: university, program, city...",
  "explore.allCountries": "All countries",
  "explore.allDirections": "All majors",
  "explore.sortDefault": "Default",
  "explore.sortCostAsc": "Cheapest first",
  "explore.sortCostDesc": "Most expensive first",
  "explore.sortAcceptanceAsc": "Lowest acceptance rate first",
  "explore.sortAcceptanceDesc": "Highest acceptance rate first",
  "explore.found": "Programs found: {n}",
  "explore.perYear": "/yr",
  "explore.competition": "~{n}% acceptance",
  "explore.empty": "Nothing found — try adjusting the filters.",

  "university.notFound": "Program not found in the demo database",
  "university.backToCatalog": "← To catalog",
  "university.competitionDemo": "acceptance rate (demo)",
  "university.perYear": "per year",
  "university.students": "students",
  "university.campusFormat": "campus setting",
  "university.about": "About the program",
  "university.examsAndLanguage": "Exams and language requirements",
  "university.roundsPortal": "Application rounds · portal: {portal}",
  "university.scholarships": "Scholarships and grants",
  "university.relatedPrograms": "Related programs at this university",
  "university.essay": "Essay / personal statement",
  "university.essayPromptLabel": "Prompt reference:",
  "university.essayNoProfile": "Take the questionnaire to get personalized essay ideas for this program.",

  "diagnosis.eyebrow": "Profile diagnosis",
  "diagnosis.title": "Here's what your profile looks like",
  "diagnosis.error": "Couldn't generate a diagnosis. Please try again.",
  "diagnosis.strengths": "Strengths",
  "diagnosis.limitations": "Limitations",
  "diagnosis.goal": "Likely goal",
  "diagnosis.offline": "Generated by offline rules (no LLM call).",
  "diagnosis.next": "See recommendations →",

  "rec.eyebrow": "At least 3 options · rule-based matching across the whole database",
  "rec.title": "Matching programs",
  "rec.subtitlePre": "Selected and ranked by fit with your questionnaire: major, budget, admissions path (SAT/IB/A-Level/AP/ENT), language and country. Changed your budget or major?",
  "rec.subtitleLink": "Edit your questionnaire",
  "rec.subtitlePost": "— the list recalculates instantly.",
  "rec.balance": "List balance:",
  "rec.missingSafety": "There isn't a single safety option in this list yet — consider adding at least one reliable option.",
  "rec.selectedCount": "Selected for comparison:",
  "rec.compare": "Compare →",
  "rec.selectMore": "Select at least 2 options to move on to comparison.",
  "rec.whyFits": "Why this fits you",
  "rec.offlineExplanation": "(offline explanation)",
  "rec.tierTop": "Top pick",
  "rec.tierHigh": "High match",
  "rec.tierGood": "Good option",
  "rec.tierReview": "Worth considering",

  "compare.eyebrow": "Based on your priorities",
  "compare.title": "Compare options",
  "compare.emptyTitle": "Not enough options to compare",
  "compare.emptyHint": "Go back to recommendations and pick at least 2.",
  "compare.pickRoadmap": "Which option should we build a roadmap for?",
  "compare.roadmapBtn": "Roadmap →",
  "compare.param": "Parameter",
  "compare.source": "Source",
  "compare.priorityNote": "★ Highlighted parameters are the ones you marked as priorities:",
  "compare.rowCost": "Cost / year",
  "compare.rowAcceptance": "Acceptance rate (demo)",
  "compare.rowGrant": "Grant",
  "compare.rowLanguage": "Language of instruction",
  "compare.rowCountry": "Country / city",
  "compare.rowDuration": "Duration",
  "compare.rowExam": "Accepted admissions paths",
  "compare.rowTestPolicy": "SAT/ACT policy",
  "compare.rowEnglish": "English requirement",
  "compare.rowRounds": "Application rounds",
  "compare.rowDeadline": "Application deadline",
  "compare.grantAvailable": "Available",
  "compare.grantUnlikely": "Unlikely",
  "compare.examTba": "Check with admissions office",
  "compare.englishTba": "Not listed in the dataset",

  "roadmap.emptyTitle": "First pick an option for the roadmap",
  "roadmap.emptyHint": "Go back to comparison and click \"Roadmap →\" on one of the options.",
  "roadmap.personalPlan": "Personal plan",
  "roadmap.fullCard": "Full university profile →",
  "roadmap.done": "done",
  "roadmap.fullPlan": "Full plan",
  "roadmap.essayHelp": "Essay help",
  "roadmap.categoryExam": "Exam",
  "roadmap.categoryDocument": "Document",
  "roadmap.categoryAcademic": "Academic step",
  "roadmap.categoryActivity": "Activity",
  "roadmap.categoryDeadline": "Application deadline",
  "roadmap.noHardDate": "No fixed date",
  "roadmap.done_banner_title": "Roadmap complete",
  "roadmap.done_banner_h2": "All steps checked off ✓",
  "roadmap.done_banner_text": "Come back to the roadmap if new deadlines appear, or revisit your questionnaire if your plans changed.",
  "roadmap.nextStep": "Next step",
  "roadmap.until": "by",
  "roadmap.markDone": "Mark as done →",

  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Your profile, favorite universities, and tasks in one place",
  "dashboard.profile": "Applicant profile",
  "dashboard.edit": "Edit questionnaire",
  "dashboard.favorites": "Favorite universities",
  "dashboard.favorites.empty": "No favorites yet — add universities from the recommendations page or catalog.",
  "dashboard.tasks": "Tasks & deadlines",
  "dashboard.tasks.empty": "Add a university to favorites to see its prep plan.",
  "dashboard.emptyTitle": "Questionnaire not completed yet",
  "dashboard.emptyHint": "Take the questionnaire so your dashboard fills up with your data, recommendations and prep plan.",
  "dashboard.fieldGrade": "Stage",
  "dashboard.fieldSystem": "Grading system",
  "dashboard.fieldEnglish": "English",
  "dashboard.fieldLanguages": "Languages of instruction",
  "dashboard.fieldCountries": "Target countries",
  "dashboard.fieldBudget": "Budget",
  "dashboard.fieldTimeline": "Timeline",
  "dashboard.fieldCampus": "Campus preference",
  "dashboard.fieldActivities": "Activities",
  "dashboard.toRecommendations": "To recommendations",
  "dashboard.toCatalog": "To catalog",
  "dashboard.removeFavorite": "Remove from favorites",
  "dashboard.upcomingDeadlines": "Upcoming deadlines",
  "dashboard.noDeadlines": "No upcoming application deadlines yet.",

  "essay.cta": "Essay / personal statement ideas",
  "essay.offline": "(offline brainstorm, no LLM)",

  // --- v6: local account (login/signup) -----------------------------------
  "auth.loginTitle": "Log in",
  "auth.signupTitle": "Sign up",
  "auth.localNotice": "Local demo account: your email and password are saved only in this browser, with no authentication server. See the Privacy Policy for details.",
  "auth.name": "Name",
  "auth.namePlaceholder": "What should we call you",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.loginCta": "Log in",
  "auth.signupCta": "Sign up",
  "auth.hasAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account yet?",
  "auth.errorInvalid": "Check your email and password (at least 4 characters).",
  "auth.errorExists": "An account with this email is already registered in this browser.",
  "auth.errorNotFound": "No account with this email was found in this browser.",
  "auth.errorWrongPassword": "Incorrect password.",
  "auth.accountTitle": "Account",
  "auth.logout": "Log out",
  "auth.deleteAccount": "Delete account",
  "auth.confirmDelete": "Delete the local account and log out? This can't be undone.",

  // --- v6: university reviews ---------------------------------------------
  "reviews.title": "Reviews",
  "reviews.empty": "No reviews yet — be the first to share your experience with this program.",
  "reviews.loginToWrite": "Log in to leave a review →",
  "reviews.placeholder": "What should future applicants know about this program?",
  "reviews.submit": "Post review",
  "reviews.thanks": "Thanks! Your review is saved in this browser.",

  // --- v6: smart workload calendar (key differentiating feature) ---------
  "calendar.title": "Workload Calendar",
  "calendar.subtitle": "Every favorited university's deadlines on one timeline — with a warning when several deadlines pile up in the same week.",
  "calendar.emptyTitle": "No favorited universities yet",
  "calendar.emptyHint": "Add universities to your favorites from Recommendations or the catalog — the calendar will pull in their deadlines automatically.",
  "calendar.noDeadlines": "Your favorited universities don't have dated deadlines yet.",
  "calendar.statUniversities": "universities tracked",
  "calendar.statWeeks": "weeks with tasks",
  "calendar.statCollisions": "overloaded weeks",
  "calendar.collisionBadge": "⚠ {n} universities this week",
  "calendar.prevMonth": "Previous month",
  "calendar.nextMonth": "Next month",
  "calendar.selectDayHint": "Click a day with dots to see its tasks",
  "calendar.backToDashboard": "← Back to dashboard",

  // --- v6: local-storage notice --------------------------------------------
  "cookieNotice.text": "FomoUni stores your questionnaire, account, and reviews locally in your browser (not in tracking cookies).",
  "cookieNotice.linkCookies": "Cookies Policy",
  "cookieNotice.linkPrivacy": "Privacy Policy",
  "cookieNotice.dismiss": "Got it",
};

export const DICTS: Record<Locale, Dict> = { ru, en };

export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  let text = DICTS[locale][key] ?? DICTS.ru[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

// ---------------------------------------------------------------------------
// Опции анкеты (GRADE_OPTIONS, DIRECTION_OPTIONS, ...) хранятся в
// store/profileStore.ts как { value, label, hint? } с русским label/hint "по
// умолчанию" (это и есть источник правды формы). Для английской локали здесь
// лежит плоский словарь EN-переводов по value — так не пришлось дублировать
// все опционные массивы целиком. localizeOption() — единая точка вызова.
// ---------------------------------------------------------------------------

const OPTION_TRANSLATIONS: Record<string, { label: string; hint?: string }> = {
  // GRADE_OPTIONS
  "grade-9-10": { label: "9th–10th grade" },
  "grade-11": { label: "11th–12th grade, final exams still ahead" },
  "graduate-no-exam": { label: "Graduate, final scores not ready yet" },
  "graduate-has-exam": { label: "Graduate, final scores already in hand" },

  // DIRECTION_OPTIONS
  programming: { label: "Programming / Computer Science", hint: "Software development, algorithms" },
  "data-science": { label: "Data Science", hint: "Data, statistics, analytics" },
  "ai-ml": { label: "AI / Machine Learning", hint: "Neural networks, ML engineering" },
  "robotics-engineering": { label: "Robotics / Engineering", hint: "Mechanics, automation" },
  "electrical-hardware": { label: "Electrical / Hardware", hint: "Power engineering, electronics, chips" },
  "telecom-networks": { label: "Telecom / Networks", hint: "Communications, infrastructure" },
  cybersecurity: { label: "Cybersecurity", hint: "Protecting systems and data" },
  "game-dev": { label: "Game Development", hint: "Game programming, game design" },
  "product-hci": { label: "Product / UX / HCI", hint: "Interface design, product development" },
  "business-management": { label: "Business / Management", hint: "Entrepreneurship, strategy, operations" },
  economics: { label: "Economics", hint: "Markets, policy, quantitative analysis" },
  finance: { label: "Finance", hint: "Banking, investing, corporate finance" },

  // EDUCATION_SYSTEM_OPTIONS
  "kz-ent": { label: "Kazakhstani program (ENT)", hint: "School certificate + Unified National Testing" },
  ib: { label: "IB Diploma Programme", hint: "International Baccalaureate, 0–45 points" },
  "a-level": { label: "A-Levels / Cambridge", hint: "British system, 2–4 subjects" },
  "ap-us": { label: "US program (AP / US High School)", hint: "AP exams + 4.0 GPA scale" },
  other: { label: "Another national program", hint: "e.g. Abitur, Baccalauréat, etc." },

  // ALEVEL_BAND_OPTIONS
  "a-star-aa": { label: "A*AA and above" },
  "aab-abb": { label: "AAB – ABB" },
  "bbc-bcc": { label: "BBC – BCC" },
  "below-bcc": { label: "Below BCC" },

  // ENGLISH_LEVEL_OPTIONS
  none: { label: "Barely speak it" },
  basic: { label: "Basic (A2–B1)" },
  "ielts-5": { label: "Intermediate (roughly IELTS 5.0–5.5)" },
  "ielts-6": { label: "Confident (roughly IELTS 6.0)" },
  "ielts-7plus": { label: "Advanced (IELTS 7.0+)" },

  // LANGUAGE_OPTIONS
  kazakh: { label: "Kazakh" },
  russian: { label: "Russian" },
  english: { label: "English" },
  german: { label: "German" },
  french: { label: "French" },
  chinese: { label: "Chinese" },
  spanish: { label: "Spanish" },

  // BUDGET_OPTIONS
  "under-15k": { label: "Under $15,000/yr — need a grant or scholarship" },
  "15k-30k": { label: "$15,000–30,000/yr" },
  "30k-55k": { label: "$30,000–55,000/yr" },
  "55k-plus": { label: "$55,000+/yr — ready for top US/UK universities" },

  // TIMELINE_OPTIONS
  "next-year": { label: "In a year or two — plenty of time to prepare" },
  "this-year": { label: "This school year" },
  urgent: { label: "Final scores already in — choosing a university right now" },

  // CONSTRAINT_OPTIONS
  "needs-dorm": { label: "Need housing/dorm" },
  "stay-in-region": { label: "Want to stay close to home (CIS / neighboring countries)" },
  "work-while-study": { label: "Need to be able to work part-time" },
  "grant-required": { label: "Can't afford it without a grant/scholarship" },
  "visa-support": { label: "Need help with visa/immigration" },

  // PRIORITY_OPTIONS
  cost: { label: "Cost of tuition" },
  "grant-chance": { label: "Chance of a grant/scholarship" },
  language: { label: "Language of instruction" },
  country: { label: "Country / location" },
  duration: { label: "Format and duration" },
  career: { label: "Career prospects" },
  ranking: { label: "Reputation / ranking" },

  // ACTIVITY_OPTIONS
  olympiads: { label: "Olympiads", hint: "Subject, international (IOI, IMO, etc.)" },
  "research-projects": { label: "Research projects", hint: "Research work, publications, conferences" },
  hackathons: { label: "Hackathons", hint: "Team projects under time pressure" },
  "open-source": { label: "Open source / side projects", hint: "GitHub, personal and team projects" },
  "internships-work": { label: "Internships / work", hint: "Experience at IT companies or projects" },
  "leadership-volunteering": { label: "Leadership / volunteering", hint: "Organizing events, community projects" },
  sports: { label: "Sports", hint: "Competitions, athletic achievements" },
  "arts-creative": { label: "Creative arts", hint: "Music, design, art" },

  // CAMPUS_PREFERENCE_OPTIONS
  urban: { label: "Big city", hint: "Metropolis, lots to do outside class" },
  suburban: { label: "Suburb", hint: "Quieter, but close to a major city" },
  "campus-town": { label: "College town", hint: "Compact campus, student atmosphere" },
  rural: { label: "Rural", hint: "Quiet, nature, minimal city bustle" },
  "no-preference": { label: "No preference", hint: "Open to any format" },
};

export function localizeOption(
  locale: Locale,
  value: string,
  ruLabel: string,
  ruHint?: string
): { label: string; hint?: string } {
  if (locale === "ru") return { label: ruLabel, hint: ruHint };
  const found = OPTION_TRANSLATIONS[value];
  return { label: found?.label ?? ruLabel, hint: found?.hint ?? ruHint };
}

// Целевые страны (TARGET_COUNTRY_OPTIONS) хранятся как голые строки на
// русском — они же используются как значение для сопоставления с
// program.country в датасете. Переводим ТОЛЬКО отображение, не сам value.
const COUNTRY_EN: Record<string, string> = {
  "Казахстан": "Kazakhstan",
  "США": "USA",
  "Великобритания": "United Kingdom",
  "Канада": "Canada",
  "Германия": "Germany",
  "Нидерланды": "Netherlands",
  "Сингапур": "Singapore",
  "Южная Корея": "South Korea",
  "Япония": "Japan",
  "Австралия": "Australia",
  "ОАЭ": "UAE",
  "Турция": "Turkey",
  "Франция": "France",
  "Швейцария": "Switzerland",
  "Гонконг": "Hong Kong",
  "Китай": "China",
  "Малайзия": "Malaysia",
  "Швеция": "Sweden",
  "Италия": "Italy",
  "Чехия": "Czechia",
};

export function countryLabel(locale: Locale, ruCountry: string): string {
  if (locale === "ru") return ruCountry;
  return COUNTRY_EN[ruCountry] ?? ruCountry;
}

// ---------------------------------------------------------------------------
// Локализованные варианты небольших справочных карт из lib/types.ts
// (EXAM_TYPE_LABEL и т.п.) — сами карты в types.ts остаются русскими
// (используются в rule-based текстах/логике), а UI берёт перевод отсюда.
// ---------------------------------------------------------------------------

const EXAM_TYPE_LABEL_EN: Record<string, string> = {
  ENT: "ENT (Kazakhstan)",
  SAT: "SAT",
  ACT: "ACT",
  IB: "IB Diploma",
  "A-LEVEL": "A-Level",
  AP: "AP (average across exams)",
};

const CAMPUS_SETTING_LABEL_EN: Record<string, string> = {
  urban: "Big city",
  suburban: "Suburb",
  "campus-town": "Compact college town",
  rural: "Rural",
};

const TEST_POLICY_LABEL_EN: Record<string, string> = {
  required: "SAT/ACT required",
  optional: "SAT/ACT optional (one of several paths)",
  "not-considered": "SAT/ACT not considered by this university",
};

const ROUND_TYPE_LABEL_EN: Record<string, string> = {
  EA: "Early Action (early, non-binding)",
  ED: "Early Decision (early, binding)",
  REA: "Restrictive Early Action",
  RD: "Regular Decision (main round)",
  UCAS: "UCAS (UK unified application)",
  Rolling: "Rolling (admits until spots fill)",
};

const MATCH_TIER_LABEL_EN: Record<string, string> = {
  reach: "Reach (ambitious)",
  target: "Target (realistic)",
  safety: "Safety (reliable)",
};

const FIT_LABEL_EN: Record<string, string> = {
  within: "Within budget",
  tight: "Slightly above budget",
  over: "More than your budget",
  meets: "Exam: threshold met",
  close: "Exam: close to threshold",
  below: "Exam: below threshold for now",
  unknown: "Score not entered yet",
};

function localizeMap(locale: Locale, ruMap: Record<string, string>, enMap: Record<string, string>, key: string): string {
  if (locale === "ru") return ruMap[key] ?? key;
  return enMap[key] ?? ruMap[key] ?? key;
}

import {
  CAMPUS_SETTING_LABEL,
  EXAM_TYPE_LABEL,
  MATCH_TIER_LABEL,
  ROUND_TYPE_LABEL,
  TEST_POLICY_LABEL,
} from "./types";

export function examTypeLabel(locale: Locale, type: string): string {
  return localizeMap(locale, EXAM_TYPE_LABEL, EXAM_TYPE_LABEL_EN, type);
}
export function campusSettingLabel(locale: Locale, setting: string): string {
  return localizeMap(locale, CAMPUS_SETTING_LABEL, CAMPUS_SETTING_LABEL_EN, setting);
}
export function testPolicyLabel(locale: Locale, policy: string): string {
  return localizeMap(locale, TEST_POLICY_LABEL, TEST_POLICY_LABEL_EN, policy);
}
export function roundTypeLabel(locale: Locale, type: string): string {
  return localizeMap(locale, ROUND_TYPE_LABEL, ROUND_TYPE_LABEL_EN, type);
}
export function matchTierLabel(locale: Locale, tier: string): string {
  return localizeMap(locale, MATCH_TIER_LABEL, MATCH_TIER_LABEL_EN, tier);
}
export function fitLabel(locale: Locale, key: string, ruLabel: string): string {
  if (locale === "ru") return ruLabel;
  return FIT_LABEL_EN[key] ?? ruLabel;
}
