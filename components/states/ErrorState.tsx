"use client";

import { useT } from "@/components/LocaleProvider";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-col items-start gap-2.5 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3.5">
      <p className="text-sm font-medium text-coral-800">{message ?? t("common.errorDefault")}</p>
      <button type="button" onClick={onRetry} className="fu-btn-secondary !py-2 !px-4 text-sm">
        {t("common.retry")}
      </button>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="fu-card flex flex-col items-center gap-1.5 py-10 text-center">
      <p className="text-[15px] font-semibold text-ink-900">{title}</p>
      {hint && <p className="max-w-sm text-sm text-ink600text">{hint}</p>}
    </div>
  );
}
