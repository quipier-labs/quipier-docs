import type { Appearance, Features, Slots } from "./customize.js";
import type { Post } from "./types.js";
export type { Appearance, Features, Slots, SlotResult, QuipierCommentView, CommentCtx, BaseCtx, CommentActions, SlotHelpers, } from "./customize.js";
export interface InitOptions {
    container: string | HTMLElement;
    apiKey?: string;
    projectId?: string;
    pageId?: string;
    apiBase?: string;
    /** Origin of the Quipier passport popup. New name. */
    passportAppOrigin?: string;
    /** @deprecated Use `passportAppOrigin`. Old name, still accepted. */
    walletAppOrigin?: string;
    onComment?: (comment: unknown) => void;
    /** Color theme. Default "light" — embed widgets usually sit on light pages.
     *  "auto" follows the OS (prefers-color-scheme); "dark" forces dark. Colors
     *  can be overridden via CSS custom properties on the container
     *  (e.g. `--quipier-accent`). */
    theme?: "light" | "dark" | "auto";
    /** Timestamp style. Default "relative" ("3분 전"); "absolute" shows a date. */
    dateFormat?: "relative" | "absolute";
    /** Reply nesting: 2 = threaded (default), 1 = flat (no replies shown). */
    maxDepth?: 1 | 2;
    /** Default sort. Default "top". */
    sort?: "top" | "newest";
    /** Theme tokens (colors, font, radius, spacing, avatar shape). Anything unset
     *  keeps the default look. See the customization guide. */
    appearance?: Appearance;
    /** Turn whole UI features on/off (sort, composer, likes, replies, report,
     *  menu, badge, avatars). All default to on. */
    features?: Features;
    /** Per-part render overrides (comment row, avatar, header, composer, …).
     *  Each returns custom DOM / a string / a Preact node, or nothing for the
     *  default. */
    slots?: Slots;
}
export declare function init(options: InitOptions): void;
export declare function destroy(target: string | HTMLElement): void;
export interface FeedInitOptions {
    container: string | HTMLElement;
    apiKey?: string;
    projectId?: string;
    apiBase?: string;
    passportAppOrigin?: string;
    /** @deprecated Use `passportAppOrigin`. */
    walletAppOrigin?: string;
    theme?: "light" | "dark" | "auto";
    dateFormat?: "relative" | "absolute";
    onPost?: (post: unknown) => void;
    /** Reflect the open post in the URL (query param only — never the host path),
     *  so a shared link opens directly to that post. Default true. */
    urlSync?: boolean;
    /** Query param name for `urlSync`. Default "qp_post". */
    urlParam?: string;
    /** Share-button link target. A base URL → `${base}?<urlParam>=<id>`, or a
     *  function for full control. Omit → current page URL with the post param. */
    shareUrl?: string | ((post: Post) => string);
    /** Theme tokens — same model as init() `appearance`. */
    appearance?: Appearance;
}
/** Mount a project-global feed (Feed module): users write posts + reply/like.
 *  Separate from `init()` (page-anchored comments). */
export declare function initFeed(options: FeedInitOptions): void;
//# sourceMappingURL=index.d.ts.map