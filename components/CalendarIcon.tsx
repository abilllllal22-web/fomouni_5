// Собственная иконка календаря (вместо эмодзи 📅), нарисованная в виде SVG —
// чтобы она всегда выглядела одинаково на всех устройствах и ОС, в отличие
// от эмодзи, которое каждая платформа рисует по-своему.
export function CalendarIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* корпус календаря */}
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {/* верхняя полоса-заголовок */}
      <path d="M3 9.5H21" stroke="currentColor" strokeWidth="1.7" />
      {/* колечки крепления */}
      <path d="M7.5 3V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.5 3V6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* отмеченный день — акцент */}
      <rect x="10.4" y="12.3" width="4.2" height="4.2" rx="1.1" fill="currentColor" />
      {/* соседние дни — точки-плейсхолдеры */}
      <circle cx="7.3" cy="14.4" r="1" fill="currentColor" opacity="0.45" />
      <circle cx="16.7" cy="14.4" r="1" fill="currentColor" opacity="0.45" />
    </svg>
  );
}
