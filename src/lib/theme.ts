/**
 * Theme is a per-browser preference, not per-user — Bench has four partners and
 * no user-settings table (ADR-0001 keeps sessions stateless). The choice lives in
 * a plain cookie the client writes and the root layout reads on the next request,
 * so the first paint is already the right theme (no flash).
 *
 * Light is the default: two of the four partners asked for it, and the notes
 * editor reads far better on cream.
 */
export type Theme = "light" | "dark";

export const THEME_COOKIE = "bench-theme";
export const DEFAULT_THEME: Theme = "light";

export function isTheme(value: string | undefined | null): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(cookieValue: string | undefined | null): Theme {
  return isTheme(cookieValue) ? cookieValue : DEFAULT_THEME;
}
