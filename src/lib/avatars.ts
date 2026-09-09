/**
 * The fixed avatar set. SVGs live in /public/avatars (CC0 "Lorelei" style,
 * see /public/avatars/LICENSE.txt). We store only the key ("av-07") — on
 * `users.avatar_url` for a person, on `ventures.founder_avatar` /
 * `applications.founder_avatar` for a founder who has no account yet.
 *
 * A founder who came in through the aponvlab.io pipeline gets DEFAULT_AVATAR;
 * a partner adding a venture by hand picks one in the New Venture modal.
 */
export const AVATAR_KEYS: string[] = Array.from(
  { length: 24 },
  (_, i) => `av-${String(i + 1).padStart(2, "0")}`,
);

export const DEFAULT_AVATAR = "av-default";

const KNOWN = new Set([...AVATAR_KEYS, DEFAULT_AVATAR]);

/** True when `value` is one of our known avatar keys. */
export function isAvatarKey(value: string | null | undefined): value is string {
  return typeof value === "string" && KNOWN.has(value);
}

/** A key we can trust to render, falling back to the default. */
export function resolveAvatar(value: string | null | undefined): string {
  return isAvatarKey(value) ? value : DEFAULT_AVATAR;
}

/** Public path for an avatar key. */
export function avatarSrc(value: string | null | undefined): string {
  return `/avatars/${resolveAvatar(value)}.svg`;
}
