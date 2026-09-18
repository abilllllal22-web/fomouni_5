"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// v6 — отзывы на вузы: честная функция "просмотра отзывов", без единой
// вымышленной "демо"-записи — список пуст по умолчанию и заполняется только
// реальными отзывами, которые оставляет пользователь в своём браузере
// (localStorage, тот же принцип хранения, что и у остального прогресса).
// Автор — предупреждается прямо в форме, что отзыв виден только в этом
// браузере (демо без общего backend), чтобы не создавать ложное впечатление
// публичной базы отзывов.
// ---------------------------------------------------------------------------

export interface UniversityReview {
  id: string;
  universityId: string;
  authorName: string;
  rating: number; // 1..5
  text: string;
  createdAt: string; // ISO
}

interface ReviewState {
  reviews: UniversityReview[];
  hasHydrated: boolean;
  addReview: (input: { universityId: string; authorName: string; rating: number; text: string }) => void;
  removeReview: (id: string) => void;
  setHasHydrated: (v: boolean) => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: [],
      hasHydrated: false,

      addReview: ({ universityId, authorName, rating, text }) =>
        set((state) => ({
          reviews: [
            {
              id: `${universityId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              universityId,
              authorName: authorName.trim() || "Аноним",
              rating: Math.min(5, Math.max(1, Math.round(rating))),
              text: text.trim(),
              createdAt: new Date().toISOString(),
            },
            ...state.reviews,
          ],
        })),

      removeReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "fomouni-reviews-store",
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function reviewsForUniversity(reviews: UniversityReview[], universityId: string): UniversityReview[] {
  return reviews.filter((r) => r.universityId === universityId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function averageRating(reviews: UniversityReview[]): number | null {
  if (reviews.length === 0) return null;
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
}
