import React from "react";

/**
 * The one way icons enter Bench. Pass a Lucide glyph component as `glyph`
 * (import it where you use it, so the bundle only carries what it needs):
 *
 *   import { Plus } from "lucide-react";
 *   <Icon glyph={Plus} />
 *
 * Defaults match the chrome: 14px, 1.75 stroke, currentColor, and it never
 * grows or shrinks a flex row. Lucide's 24px grid + thin stroke is already
 * the hairline language — do not restyle per call beyond size and colour.
 */
export function Icon({ glyph: Glyph, size = 14, stroke = 1.75, color = "currentColor", style }) {
  if (!Glyph) return null;
  return (
    <Glyph
      size={size}
      strokeWidth={stroke}
      color={color}
      style={{ flex: "none", display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
