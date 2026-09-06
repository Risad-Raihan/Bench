/**
 * Mono date formatting shared across venture screens. Day-month, no year,
 * no ordinal, per design-system/readme.md content rules — and uppercase
 * because it always renders inside a mono label ("24 AUG", "Cleared 11 Aug"
 * is the one exception, spelled out by the gate rail copy itself).
 */
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function formatDayMonth(date: Date): string {
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
}

export function formatDueDate(date: Date): string {
  return formatDayMonth(date).toUpperCase();
}

/** Mono uppercase relative time for the note byline ("JUST NOW", "2H AGO"). */
export function formatEditedAgo(date: Date, now: Date): string {
  const ms = Math.max(0, now.getTime() - date.getTime());
  if (ms < 60_000) return "JUST NOW";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}M AGO`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}H AGO`;
  return formatDueDate(date);
}
