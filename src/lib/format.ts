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

function elapsedMs(date: Date, now: Date): number {
  return Math.max(0, now.getTime() - date.getTime());
}

/** Mono uppercase relative time for the note byline ("JUST NOW", "2H AGO"). */
export function formatEditedAgo(date: Date, now: Date): string {
  const ms = elapsedMs(date, now);
  if (ms < 60_000) return "JUST NOW";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}M AGO`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}H AGO`;
  return formatDueDate(date);
}

/** Compact relative time for an activity row's 44px `when` column ("2H", "5D"). */
export function formatFeedWhen(date: Date, now: Date): string {
  const ms = elapsedMs(date, now);
  if (ms < 60_000) return "NOW";
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}M`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}H`;
  const days = Math.floor(ms / 86_400_000);
  if (days < 14) return `${days}D`;
  return formatDueDate(date);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) {
    const kb = n / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const MIME_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/gif": "GIF",
  "image/webp": "WEBP",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "PPTX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/msword": "DOC",
  "application/vnd.ms-excel": "XLS",
  "text/plain": "TXT",
  "text/csv": "CSV",
};

export function typeGlyph(mimeType: string, name?: string): string {
  if (MIME_TYPES[mimeType]) return MIME_TYPES[mimeType];
  const ext = name?.split(".").pop()?.toUpperCase();
  if (ext && ext.length <= 5) return ext;
  return "FILE";
}
