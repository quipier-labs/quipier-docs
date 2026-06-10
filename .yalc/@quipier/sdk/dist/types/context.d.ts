import type { Features, SlotHelpers, Slots } from "./customize.js";
/** All features default to enabled — the stock widget shows everything. */
export declare const DEFAULT_FEATURES: Required<Features>;
export declare const FeaturesContext: import("preact").Context<Required<Features>>;
export declare const DEFAULT_HELPERS: SlotHelpers;
/** Everything a slot function needs that isn't per-comment: the override map,
 *  shared helpers, and resolved theme tokens. Provided once at the widget root. */
export interface SlotEnv {
    slots: Slots;
    helpers: SlotHelpers;
    theme: Record<string, string>;
}
export declare const SlotsContext: import("preact").Context<SlotEnv>;
//# sourceMappingURL=context.d.ts.map