import type { Appearance } from "./customize.js";

/** A length-ish value: number → px, string → as-is. */
function len(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

const AVATAR_RADIUS: Record<NonNullable<Appearance["avatarShape"]>, string> = {
  circle: "50%",
  rounded: "12px",
  square: "8px",
};

/** Map the friendly `appearance` object to the `--quipier-*` custom properties
 *  that styles.ts reads. Returned as a style object suitable for the root
 *  element's inline `style`. Unset keys are omitted entirely so the CSS
 *  defaults win — an empty/undefined appearance yields `{}` (stock look). */
export function mapAppearance(
  appearance: Appearance | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!appearance) return out;
  const set = (varName: string, value: string | undefined) => {
    if (value !== undefined && value !== "") out[varName] = value;
  };

  set("--quipier-accent", appearance.accent);
  set("--quipier-accent-fg", appearance.accentText);
  set("--quipier-fg", appearance.text);
  set("--quipier-muted", appearance.muted);
  set("--quipier-surface", appearance.surface);
  set("--quipier-border", appearance.border);
  set("--quipier-link", appearance.link);
  set("--quipier-like", appearance.like);
  set("--quipier-danger", appearance.danger);

  set("--quipier-font", appearance.font);
  set("--quipier-font-size", len(appearance.fontSize));
  set("--quipier-radius", len(appearance.radius));
  set("--quipier-radius-pill", len(appearance.pillRadius));
  set("--quipier-gap", len(appearance.gap));
  if (appearance.avatarShape) {
    set("--quipier-avatar-radius", AVATAR_RADIUS[appearance.avatarShape]);
  }
  return out;
}
