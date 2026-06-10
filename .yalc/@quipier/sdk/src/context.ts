import { createContext } from "preact";
import type { Features, SlotHelpers, Slots } from "./customize.js";
import { avatarColor, formatTime } from "./util.js";

/** All features default to enabled — the stock widget shows everything. */
export const DEFAULT_FEATURES: Required<Features> = {
  sort: true,
  composer: true,
  likes: true,
  replies: true,
  report: true,
  menu: true,
  badge: true,
  avatars: true,
};

export const FeaturesContext =
  createContext<Required<Features>>(DEFAULT_FEATURES);

export const DEFAULT_HELPERS: SlotHelpers = { formatTime, avatarColor };

/** Everything a slot function needs that isn't per-comment: the override map,
 *  shared helpers, and resolved theme tokens. Provided once at the widget root. */
export interface SlotEnv {
  slots: Slots;
  helpers: SlotHelpers;
  theme: Record<string, string>;
}

export const SlotsContext = createContext<SlotEnv>({
  slots: {},
  helpers: DEFAULT_HELPERS,
  theme: {},
});
