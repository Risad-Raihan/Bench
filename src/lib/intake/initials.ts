/** First letter of the first two words of a name, uppercased. "Jane" -> "J",
    "Jane Q. Public" -> "JQ". Falls back to "?" for an empty name. */
export function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
