/**
 * A venture's identity colour lives on `ventures.color` (chosen once, at
 * onboarding — see design-system/readme.md). This file only holds the fixed
 * twelve-token palette a new-venture flow offers, ordered warm to cool, and
 * the pick for whichever one isn't in use yet. It is not a per-venture
 * lookup — that would break the moment someone renames or adds a venture
 * from the UI.
 */
export const VENTURE_COLOR_PALETTE = [
  "var(--copper)",
  "var(--venture-ember)",
  "var(--venture-clay)",
  "var(--amber)",
  "var(--venture-moss)",
  "var(--venture-fern)",
  "var(--teal)",
  "var(--venture-steel)",
  "var(--venture-indigo)",
  "var(--violet)",
  "var(--venture-plum)",
  "var(--magenta)",
] as const;

export const DEFAULT_VENTURE_COLOR: string = VENTURE_COLOR_PALETTE[0];

/** Reads a venture's stored colour, falling back for legacy/unset rows. */
export function ventureColor(color: string | null | undefined): string {
  return color ?? DEFAULT_VENTURE_COLOR;
}

/**
 * Picks the first palette colour not already carried by an active venture.
 * Once every colour is in use it cycles back to the top of the palette —
 * two ventures sharing a colour is allowed, per the design system.
 */
export function nextAvailableVentureColor(
  usedColors: readonly (string | null | undefined)[],
): string {
  const used = new Set(usedColors.filter((c): c is string => Boolean(c)));
  return VENTURE_COLOR_PALETTE.find((c) => !used.has(c)) ?? VENTURE_COLOR_PALETTE[0];
}
