/**
 * A person's face — square, hairline border, 2px radius, to sit in the same
 * rhythm as WhoChip and the swatches. Falls back to mono initials from `name`
 * when there is no avatar key.
 */
export interface AvatarProps {
  /** avatar key like "av-07"; served from /avatars/<key>.svg */
  avatar?: string | null;
  /** used for the alt text, the title, and the initials fallback */
  name?: string | null;
  /** pixel size of the square (default 19) */
  size?: number;
  title?: string;
  /** dim the initials fallback one step (for secondary placements) */
  dim?: boolean;
}
export function Avatar(props: AvatarProps): JSX.Element;

/** The grid a person picks their face from — profile page, New Venture modal. */
export interface AvatarPickerProps {
  /** ordered avatar keys, from src/lib/avatars */
  keys?: string[];
  value?: string | null;
  onChange?: (key: string) => void;
  size?: number;
  label?: string;
  note?: string;
}
export function AvatarPicker(props: AvatarPickerProps): JSX.Element;
