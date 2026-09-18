// ---------------------------------------------------------------------------
// v5 — лёгкий декоративный слой на задний фон секций: конспективные иконки
// на тему образования (шапка выпускника, книга, глобус, диплом) в виде
// повторяющегося SVG-паттерна очень низкой прозрачности. Чисто
// декоративный, aria-hidden, не влияет на интерактивность — по запросу
// пользователя "добавь больше деталей связанных с тематикой сайта на
// задний фон страниц".
// ---------------------------------------------------------------------------

export function BgPattern({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const stroke = variant === "dark" ? "white" : "currentColor";
  const opacity = variant === "dark" ? 0.06 : 0.05;
  const patternId = `fu-bg-pattern-${variant}`;

  return (
    <svg
      className={`fu-bg-pattern text-brand-600 ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <pattern id={patternId} width="180" height="180" patternUnits="userSpaceOnUse">
          {/* Шапка выпускника (graduation cap) */}
          <g transform="translate(10,10)" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 8 L20 0 L40 8 L20 16 Z" />
            <path d="M8 11.5 V20 C8 23 32 23 32 20 V11.5" />
            <path d="M40 8 V18" />
          </g>
          {/* Открытая книга */}
          <g transform="translate(100,20)" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 2 C6 -1 14 -1 18 2 V20 C14 17 6 17 0 20 Z" />
            <path d="M36 2 C30 -1 22 -1 18 2 V20 C22 17 30 17 36 20 Z" />
          </g>
          {/* Глобус */}
          <g transform="translate(30,90)" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="14" r="14" />
            <ellipse cx="14" cy="14" rx="6" ry="14" />
            <path d="M0 14 H28" />
          </g>
          {/* Диплом / свиток */}
          <g transform="translate(120,110)" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="0" width="30" height="20" rx="3" />
            <path d="M6 7 H24 M6 12 H20" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
