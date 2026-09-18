// Skeleton-состояния — показывают СТРУКТУРУ карточки с pulse-анимацией,
// а не просто спиннер (требование дизайн-системы).

export function ExplanationSkeleton() {
  return (
    <div className="space-y-2 py-1">
      <div className="fu-skeleton-line w-full" />
      <div className="fu-skeleton-line w-11/12" />
      <div className="fu-skeleton-line w-2/3" />
    </div>
  );
}

export function DiagnosisSkeleton() {
  return (
    <div className="fu-card space-y-5">
      <div className="fu-skeleton-line w-1/3" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="fu-skeleton-line w-1/4" />
          <div className="fu-skeleton-line w-full" />
          <div className="fu-skeleton-line w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function RecommendationCardSkeleton() {
  return (
    <div className="fu-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="fu-skeleton-line w-40" />
          <div className="fu-skeleton-line w-56" />
        </div>
        <div className="fu-skeleton-line h-8 w-16 rounded-full" />
      </div>
      <ExplanationSkeleton />
      <div className="flex gap-2">
        <div className="fu-skeleton-line h-6 w-20 rounded-full" />
        <div className="fu-skeleton-line h-6 w-24 rounded-full" />
        <div className="fu-skeleton-line h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
