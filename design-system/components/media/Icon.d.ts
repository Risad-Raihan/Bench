import type { ComponentType } from "react";

/** A Lucide icon component, e.g. the `Plus` export from "lucide-react". */
export type Glyph = ComponentType<{
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  style?: React.CSSProperties;
}>;

export interface IconProps {
  glyph: Glyph | null | undefined;
  /** pixel size of the square (default 14) */
  size?: number;
  /** stroke width (default 1.75) */
  stroke?: number;
  /** default "currentColor" */
  color?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element | null;
