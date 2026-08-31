import type { Education } from '@/types';
import { formatMonth, formatRange as formatDateRange } from '@/lib/dates';

/** Education entries shown on the homepage before linking through to /education. */
export const ACADEMIA_SHOWN = 3;

/**
 * Newest first. `startDate` is a sortable "YYYY-MM" in the migrated data; the
 * manual `order` field is the tie-breaker for anything missing one.
 */
export function sortEducation(items: Education[]): Education[] {
  return [...items].sort((a, b) => {
    if (a.startDate && b.startDate) return b.startDate.localeCompare(a.startDate);
    if (a.startDate) return -1;
    if (b.startDate) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

/** The date range for a timeline entry, falling back to the raw period string. */
export function formatRange(item: Education): string {
  return formatDateRange(item.startDate, item.endDate, item.period || item.year);
}

export { formatMonth };
