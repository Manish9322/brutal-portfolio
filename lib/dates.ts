const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "2023-08" -> "AUG 2023"; passes anything unparseable straight through. */
export function formatMonth(value: string): string {
  if (!value) return '';
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value.toUpperCase();
  return `${MONTHS[Number(match[2]) - 1] ?? match[2]} ${match[1]}`;
}

/** A date range, falling back to a raw period string when dates are missing. */
export function formatRange(startDate: string, endDate: string, fallback = ''): string {
  const start = formatMonth(startDate);
  const end = formatMonth(endDate);
  if (start && end) return `${start} — ${end}`;
  if (start) return start;
  return (fallback || '').toUpperCase();
}
