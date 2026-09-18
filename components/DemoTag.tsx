"use client";

import { useT } from "./LocaleProvider";

// Единая пометка демонстрационных данных / кликабельного источника.
// Используется везде, где показаны цифры стоимости, баллы или дедлайны —
// того требуют правила кейса ("демо-данные" либо ссылка на источник).
export function DemoTag({ sourceUrl }: { sourceUrl?: string }) {
  const t = useT();
  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="fu-tag-demo hover:border-brand-300 hover:text-brand-700"
        title={t("common.demoSourceTitle")}
      >
        {t("common.demoSource")}
      </a>
    );
  }
  return <span className="fu-tag-demo">{t("common.demoData")}</span>;
}
