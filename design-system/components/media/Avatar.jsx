import React from "react";

/**
 * A person's face on a card, a row, the app bar. Square with a hairline and a
 * 2px radius so it sits in the same rhythm as WhoChip and the swatches — this
 * is a dense operator tool, not a social app. Falls back to mono initials when
 * there is no avatar key yet.
 *
 * `avatar` is a key like "av-07"; the SVG is served from /avatars/<key>.svg.
 */
export function Avatar({ avatar, name, size = 19, title, dim = false }) {
  const initials = toInitials(name);
  const box = {
    width: size,
    height: size,
    borderRadius: 2,
    border: "1px solid var(--line2)",
    flex: "none",
    display: "block",
    objectFit: "cover",
    background: "var(--panel2)",
  };

  if (!avatar) {
    return (
      <span
        title={title || name || undefined}
        style={{
          ...box,
          display: "grid",
          placeItems: "center",
          fontSize: Math.max(9, Math.round(size * 0.52)),
          fontFamily: "var(--font-mono)",
          color: dim ? "var(--faint)" : "var(--dim)",
        }}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={`/avatars/${avatar}.svg`}
      alt={name ? `${name}` : ""}
      title={title || name || undefined}
      width={size}
      height={size}
      style={box}
    />
  );
}

function toInitials(name) {
  if (!name) return "—";
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * The grid a person picks their face from — profile page and the founder
 * field in the New Venture modal. `keys` is the ordered list of avatar keys
 * (from src/lib/avatars); `value` is the current pick.
 */
export function AvatarPicker({
  keys = [],
  value,
  onChange,
  size = 34,
  label = "Avatar",
  note,
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label ? (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--faint)",
            }}
          >
            {label}
          </span>
          {note ? (
            <span style={{ fontSize: 11.5, color: "var(--ink-ghost3)" }}>
              {note}
            </span>
          ) : null}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {keys.map((key) => {
          const on = key === value;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange && onChange(key)}
              aria-pressed={on}
              style={{
                width: size,
                height: size,
                padding: 0,
                borderRadius: 3,
                cursor: "pointer",
                background: "var(--panel)",
                border:
                  "1px solid " + (on ? "var(--copper)" : "var(--line)"),
                boxShadow: on ? "0 0 0 2px var(--copper-wash)" : "none",
                transition:
                  "border-color var(--dur-fast), box-shadow var(--dur-fast)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Avatar avatar={key} size={size - 8} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
