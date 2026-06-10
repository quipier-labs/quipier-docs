import { h, render } from "preact";
import { Widget } from "./widget.js";
import { FeedWidget } from "./feed/FeedWidget.js";
import { injectStyles } from "./styles.js";
import type { Appearance, Features, Slots } from "./customize.js";
import type { Post } from "./types.js";

export type {
  Appearance,
  Features,
  Slots,
  SlotResult,
  QuipierCommentView,
  CommentCtx,
  BaseCtx,
  CommentActions,
  SlotHelpers,
} from "./customize.js";

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

const DEFAULT_API_BASE = "https://api.quipier.com";
const DEFAULT_PASSPORT_APP_ORIGIN = "https://passport.quipier.com";

function resolveContainer(target: string | HTMLElement): HTMLElement | null {
  return typeof target === "string"
    ? document.querySelector<HTMLElement>(target)
    : target;
}

export function init(options: InitOptions): void {
  const container = resolveContainer(options.container);
  if (!container) {
    throw new Error(`Quipier: container not found: ${String(options.container)}`);
  }

  const apiKey = options.apiKey ?? container.dataset.quipierApiKey;
  const projectId = options.projectId ?? container.dataset.quipierProjectId;
  if (!apiKey) {
    throw new Error("Quipier: apiKey is required (or data-quipier-api-key)");
  }
  if (!projectId) {
    throw new Error("Quipier: projectId is required (or data-quipier-project-id)");
  }

  const pageId =
    options.pageId ?? container.dataset.quipierPageId ?? window.location.pathname;
  const apiBase = options.apiBase ?? DEFAULT_API_BASE;
  // Accept both `passportAppOrigin` (new) and `walletAppOrigin` (legacy alias)
  // plus the corresponding data-* attributes. Internally we standardize on the
  // passport-* name when handing the resolved value down to the widget.
  const passportAppOrigin =
    options.passportAppOrigin ??
    options.walletAppOrigin ??
    container.dataset.quipierPassportApp ??
    container.dataset.quipierWalletApp ??
    DEFAULT_PASSPORT_APP_ORIGIN;

  const theme =
    options.theme ?? (container.dataset.quipierTheme as InitOptions["theme"]) ?? "light";
  const dateFormat = options.dateFormat ?? "relative";
  const maxDepth = options.maxDepth ?? 2;
  const sort = options.sort ?? "top";

  injectStyles();
  // Tear down any previous Preact mount on this container so that
  // re-running init (e.g. React StrictMode double-effect) starts clean.
  render(null, container);
  render(
    h(Widget, {
      apiBase,
      apiKey,
      projectId,
      pageId,
      passportAppOrigin,
      onComment: options.onComment as never,
      theme,
      dateFormat,
      maxDepth,
      sort,
      appearance: options.appearance,
      features: options.features,
      slots: options.slots,
    }),
    container,
  );
}

export function destroy(target: string | HTMLElement): void {
  const container = resolveContainer(target);
  if (!container) return;
  render(null, container);
}

// ── Feed module (posts) ──

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
}

/** Mount a project-global feed (Feed module): users write posts + reply/like.
 *  Separate from `init()` (page-anchored comments). */
export function initFeed(options: FeedInitOptions): void {
  const container = resolveContainer(options.container);
  if (!container) {
    throw new Error(`Quipier: container not found: ${String(options.container)}`);
  }
  const apiKey = options.apiKey ?? container.dataset.quipierApiKey;
  const projectId = options.projectId ?? container.dataset.quipierProjectId;
  if (!apiKey) throw new Error("Quipier: apiKey is required (or data-quipier-api-key)");
  if (!projectId) {
    throw new Error("Quipier: projectId is required (or data-quipier-project-id)");
  }
  const apiBase = options.apiBase ?? DEFAULT_API_BASE;
  const passportAppOrigin =
    options.passportAppOrigin ??
    options.walletAppOrigin ??
    container.dataset.quipierPassportApp ??
    container.dataset.quipierWalletApp ??
    DEFAULT_PASSPORT_APP_ORIGIN;
  const theme =
    options.theme ?? (container.dataset.quipierTheme as InitOptions["theme"]) ?? "light";

  injectStyles();
  render(null, container);
  render(
    h(FeedWidget, {
      apiBase,
      apiKey,
      projectId,
      passportAppOrigin,
      theme,
      dateFormat: options.dateFormat ?? "relative",
      onPost: options.onPost as never,
      urlSync: options.urlSync,
      urlParam: options.urlParam,
      shareUrl: options.shareUrl,
    }),
    container,
  );
}
