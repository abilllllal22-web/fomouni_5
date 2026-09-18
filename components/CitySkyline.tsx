// Инлайновый SVG-силуэт города — иллюстрирует "глобальный масштаб" на входном
// экране без внешних изображений (ноль сетевых запросов, self-contained).
// Высоты/окна сгенерированы детерминированно — не декоративная случайность
// при каждом рендере, а стабильная картинка.
const BUILDINGS = [
  { x: 0, w: 34, h: 90 },
  { x: 36, w: 22, h: 130 },
  { x: 60, w: 30, h: 70 },
  { x: 92, w: 26, h: 160 },
  { x: 120, w: 18, h: 100 },
  { x: 140, w: 34, h: 190 },
  { x: 176, w: 24, h: 120 },
  { x: 202, w: 30, h: 150 },
  { x: 234, w: 20, h: 85 },
  { x: 256, w: 34, h: 170 },
  { x: 292, w: 22, h: 110 },
  { x: 316, w: 28, h: 145 },
  { x: 346, w: 18, h: 75 },
  { x: 366, w: 32, h: 200 },
  { x: 400, w: 24, h: 120 },
  { x: 426, w: 30, h: 95 },
  { x: 458, w: 22, h: 155 },
  { x: 482, w: 18, h: 80 },
];

export function CitySkyline({ className }: { className?: string }) {
  const maxH = Math.max(...BUILDINGS.map((b) => b.h));
  const viewH = maxH + 20;
  return (
    <svg
      viewBox={`0 0 500 ${viewH}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {BUILDINGS.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={viewH - b.h} width={b.w} height={b.h} className="fill-white/[0.07]" />
          {Array.from({ length: Math.max(1, Math.floor(b.h / 16)) }).map((_, r) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 10)) }).map((_, c) =>
              (r + c + i) % 3 !== 0 ? (
                <rect
                  key={`${r}-${c}`}
                  x={b.x + 4 + c * 10}
                  y={viewH - b.h + 6 + r * 16}
                  width={3}
                  height={5}
                  className="fill-brand-200/25"
                />
              ) : null
            )
          )}
        </g>
      ))}
    </svg>
  );
}
