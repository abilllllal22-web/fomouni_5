// Общая утилита монограммы вуза — переиспользуется в карточках рекомендаций,
// таблице сравнения и на странице университета.
export function monogram(university: string): string {
  const words = university.replace(/[«»()]/g, "").split(/\s+/).filter((w) => w.length > 1);
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "");
  return letters.join("") || university.slice(0, 2).toUpperCase();
}
