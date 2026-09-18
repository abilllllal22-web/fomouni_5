import { RoadmapTask } from "./types";

// ---------------------------------------------------------------------------
// lib/deadlineCalendar.ts — "Smart Workload Calendar", ключевая отличительная
// функция FomoUni (v6). Идея: у абитуриента, который ведёт несколько вузов
// одновременно, самая частая практическая проблема — не "не знать дедлайн",
// а не увидеть ЗАРАНЕЕ, что несколько дедлайнов из РАЗНЫХ вузов приходятся
// на одну и ту же неделю (эссе одного вуза + документы другого + результаты
// экзамена третьего). Ни один каталог/список рекомендаций сам по себе этого
// не показывает — а именно это и есть разница между "ещё одним списком
// вузов" и настоящим маршрутом (см. формулировку кейса).
//
// Строится ЧИСТО из данных, которые уже существуют в приложении
// (generateRoadmap() по избранным вузам) — без новых источников данных,
// без LLM и без дополнительной нагрузки на бюджет: это делает фичу дешёвой
// в реализации, но реально полезной.
// ---------------------------------------------------------------------------

export interface WeekBucket {
  weekKey: string; // "2026-W07"
  weekStartISO: string; // понедельник, YYYY-MM-DD
  weekEndISO: string; // воскресенье, YYYY-MM-DD
  tasks: RoadmapTask[];
  deadlineTasks: RoadmapTask[];
  universityCount: number; // сколько разных вузов имеют дедлайн/задачу на этой неделе
  isCollision: boolean; // перегруженная неделя
}

export function isoWeekBounds(date: Date): { key: string; monday: Date; sunday: Date } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // 1..7, Пн=1
  d.setUTCDate(d.getUTCDate() + 4 - dayNum); // четверг этой недели (ISO-стандарт)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - 3);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { key: `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`, monday, sunday };
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Группирует задачи roadmap (уже объединённые по всем избранным вузам) по
 * неделям и помечает недели-"коллизии" — когда на одной неделе одновременно
 * несколько дедлайнов/крупных задач, особенно из разных вузов.
 */
export function buildWorkloadCalendar(tasks: RoadmapTask[]): WeekBucket[] {
  const dated = tasks.filter((t) => !!t.date);
  const buckets = new Map<string, WeekBucket>();

  for (const task of dated) {
    const d = new Date(task.date as string);
    if (Number.isNaN(d.getTime())) continue;
    const { key, monday, sunday } = isoWeekBounds(d);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        weekKey: key,
        weekStartISO: toISODate(monday),
        weekEndISO: toISODate(sunday),
        tasks: [],
        deadlineTasks: [],
        universityCount: 0,
        isCollision: false,
      };
      buckets.set(key, bucket);
    }
    bucket.tasks.push(task);
    if (task.category === "deadline") bucket.deadlineTasks.push(task);
  }

  const result = Array.from(buckets.values()).sort((a, b) => a.weekStartISO.localeCompare(b.weekStartISO));
  for (const bucket of result) {
    const universities = new Set(bucket.tasks.map((t) => t.universityId).filter(Boolean));
    bucket.universityCount = universities.size;
    // Коллизия: дедлайны у 2+ разных вузов на одной неделе, ИЛИ 3+
    // дедлайна одновременно (даже если формально это один вуз с несколькими
    // раундами/документами) — обе ситуации реально перегружают неделю.
    const deadlineUniversities = new Set(bucket.deadlineTasks.map((t) => t.universityId).filter(Boolean));
    bucket.isCollision = deadlineUniversities.size >= 2 || bucket.deadlineTasks.length >= 3;
  }
  return result;
}

export function collisionWeeks(buckets: WeekBucket[]): WeekBucket[] {
  return buckets.filter((b) => b.isCollision);
}
