import type { Experience } from '@/types';
import { formatRange } from '@/lib/dates';

/** Experience entries shown on the homepage before linking through to /experience. */
export const HISTORY_SHOWN = 3;

/** Most recent first; `order` is the tie-breaker when dates are missing. */
export function sortExperience(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => {
    if (a.startDate && b.startDate) return b.startDate.localeCompare(a.startDate);
    if (a.startDate) return -1;
    if (b.startDate) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

/** True while the role has no end date (or it reads "present"). */
export function isCurrent(item: Experience): boolean {
  return !item.endDate || /present/i.test(item.endDate);
}

export function experienceRange(item: Experience): string {
  return formatRange(item.startDate, item.endDate, item.period);
}
