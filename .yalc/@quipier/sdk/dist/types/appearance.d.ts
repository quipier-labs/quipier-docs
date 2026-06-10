import type { Appearance } from "./customize.js";
/** Map the friendly `appearance` object to the `--quipier-*` custom properties
 *  that styles.ts reads. Returned as a style object suitable for the root
 *  element's inline `style`. Unset keys are omitted entirely so the CSS
 *  defaults win — an empty/undefined appearance yields `{}` (stock look). */
export declare function mapAppearance(appearance: Appearance | undefined): Record<string, string>;
//# sourceMappingURL=appearance.d.ts.map