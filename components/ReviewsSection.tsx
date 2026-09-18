"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { averageRating, reviewsForUniversity, useReviewStore } from "@/store/reviewStore";
import { useCurrentAccount } from "@/store/authStore";
import { useT, useLocale } from "./LocaleProvider";

// ---------------------------------------------------------------------------
// v6 — честная функция просмотра отзывов на вузе (не выдуманные тестимониалы:
// список пуст, пока реальный пользователь не оставит отзыв в своём браузере
// — см. store/reviewStore.ts). Оставить отзыв можно только вошедшим в
// локальный аккаунт пользователям — так функция логина/регистрации получает
// реальное применение, а не остаётся декоративной.
// ---------------------------------------------------------------------------

function Stars({ value, size = "text-sm" }: { value: number; size?: string }) {
  return (
    <span className={clsx("text-brand-600", size)} aria-hidden>
      {"★".repeat(Math.round(value))}
      <span className="text-line-strong">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export function ReviewsSection({ universityId }: { universityId: string }) {
  const t = useT();
  const { locale } = useLocale();
  const allReviews = useReviewStore((s) => s.reviews);
  const addReview = useReviewStore((s) => s.addReview);
  const account = useCurrentAccount();

  const reviews = useMemo(() => reviewsForUniversity(allReviews, universityId), [allReviews, universityId]);
  const avg = useMemo(() => averageRating(reviews), [reviews]);

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!account || !text.trim()) return;
    addReview({ universityId, authorName: account.name, rating, text });
    setText("");
    setSubmitted(true);
  }

  return (
    <section className="fu-card mb-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink600text">{t("reviews.title")}</p>
        {avg !== null && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
            <Stars value={avg} />
            {avg.toFixed(1)} · {reviews.length}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mb-4 text-sm text-ink600text">{t("reviews.empty")}</p>
      ) : (
        <ul className="mb-4 space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl bg-canvas-muted px-3.5 py-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink-900">{r.authorName}</span>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-ink600text">{r.text}</p>
              <p className="mt-1 text-xs text-ink600text">
                {new Date(r.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!account ? (
        <p className="text-sm text-ink600text">
          <Link href="/login" className="font-semibold text-brand-700 underline underline-offset-2">
            {t("reviews.loginToWrite")}
          </Link>
        </p>
      ) : submitted ? (
        <p className="text-sm font-medium text-brand-700">{t("reviews.thanks")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5 border-t border-line pt-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n}`}
                className={clsx("fu-focus-ring text-lg", n <= rating ? "text-brand-600" : "text-line-strong")}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            minLength={5}
            rows={3}
            placeholder={t("reviews.placeholder")}
            className="fu-focus-ring w-full rounded-xl border border-line bg-canvas-card px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink600text"
          />
          <button type="submit" className="fu-btn-secondary !py-2 !px-4 text-sm">
            {t("reviews.submit")}
          </button>
        </form>
      )}
    </section>
  );
}
