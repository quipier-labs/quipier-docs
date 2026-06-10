// Public customization contract for the Quipier widget.
//
// These types are part of the SDK's published API surface. They are kept
// deliberately decoupled from the internal wire-format `Comment` (see
// QuipierCommentView) so the slot API stays stable even if the server shape
// changes.
import type { VNode } from "preact";
import type { Comment, ReportReason } from "./types.js";

/** Friendly theme knobs. Each maps to a `--quipier-*` CSS custom property and
 *  is applied as an inline style on the widget root. Anything left unset falls
 *  back to the built-in default (so an empty object = the stock look). */
export interface Appearance {
  // colors
  accent?: string;
  accentText?: string;
  text?: string;
  muted?: string;
  surface?: string;
  border?: string;
  link?: string;
  like?: string;
  danger?: string;
  // typography
  font?: string;
  fontSize?: number | string;
  // shape / spacing
  radius?: number | string; // menus, inputs, cards
  pillRadius?: number | string; // buttons
  avatarShape?: "circle" | "square" | "rounded";
  gap?: number | string; // spacing between top-level comments
}

/** Toggle whole UI features on/off. All default to `true` (current behavior).
 *  `replies: false` is equivalent to `maxDepth: 1`. */
export interface Features {
  sort?: boolean;
  composer?: boolean;
  likes?: boolean;
  replies?: boolean;
  report?: boolean;
  menu?: boolean;
  badge?: boolean;
  avatars?: boolean;
}

/** What a slot function may return. `null`/`undefined` ⇒ render the default.
 *  - `string` is inserted as HTML (trusted: it's the host app's own markup).
 *  - `HTMLElement` is mounted into the slot host (framework-agnostic).
 *  - `VNode` (preact `h(...)`) is rendered inline. */
export type SlotResult = HTMLElement | string | VNode | null | undefined;

/** Stable, public projection of a comment passed to slot functions. */
export interface QuipierCommentView {
  id: string;
  author: {
    id: string;
    nickname: string | null;
    isOwn: boolean;
    blocked: boolean;
  };
  content: string;
  createdAt: string; // ISO 8601
  likes: { count: number; likedByMe: boolean };
  isDeleted: boolean;
  isHidden: boolean;
  parentId: string | null;
  replyCount: number;
  /** Escape hatch to the raw wire object. Avoid depending on this. */
  raw: Comment;
}

/** Behaviour bound to a single comment — lets a fully custom row drive the
 *  same actions the default UI exposes. */
export interface CommentActions {
  like(): void;
  unlike(): void;
  reply(content: string): Promise<void>;
  edit(content: string): Promise<void>;
  remove(): void;
  report(reason: ReportReason): void;
}

export interface SlotHelpers {
  formatTime(iso: string, format?: "relative" | "absolute"): string;
  avatarColor(seed: string): string;
}

/** Context for non-comment slots (header / composer / empty). */
export interface BaseCtx {
  /** Render the default output for this slot as a detached DOM node, so you can
   *  wrap / decorate it. NOTE: the returned node is a one-shot snapshot — its
   *  internal interactive state does not stay in sync with the live widget.
   *  Use it for decoration; for full behavioral control render from scratch. */
  defaultNode(): HTMLElement;
  /** Resolved `--quipier-*` token values read from the widget root. */
  theme: Record<string, string>;
  helpers: SlotHelpers;
}

/** Context for per-comment slots. */
export interface CommentCtx extends BaseCtx {
  actions: CommentActions;
  isOwn: boolean;
}

/** Per-part render overrides. Omit a slot to keep the default rendering. */
export interface Slots {
  header?: (ctx: BaseCtx) => SlotResult;
  composer?: (ctx: BaseCtx) => SlotResult;
  empty?: (ctx: BaseCtx) => SlotResult;
  /** Replace an entire comment row. */
  comment?: (view: QuipierCommentView, ctx: CommentCtx) => SlotResult;
  // partial overrides inside the default row
  avatar?: (view: QuipierCommentView, ctx: CommentCtx) => SlotResult;
  authorLabel?: (view: QuipierCommentView, ctx: CommentCtx) => SlotResult;
  content?: (view: QuipierCommentView, ctx: CommentCtx) => SlotResult;
  actions?: (view: QuipierCommentView, ctx: CommentCtx) => SlotResult;
}

/** Build the stable public view from an internal comment row. */
export function toCommentView(
  c: Comment,
  ownAuthorId: string | null,
  replyCount: number,
): QuipierCommentView {
  return {
    id: c.id,
    author: {
      id: c.author_id,
      nickname: c.nickname,
      isOwn: !!ownAuthorId && c.author_id === ownAuthorId,
      blocked: !!c.author_blocked,
    },
    content: c.content,
    createdAt: c.created_at,
    likes: { count: c.likes_count, likedByMe: c.liked_by_me },
    isDeleted: c.is_deleted,
    isHidden: !!c.is_hidden,
    parentId: c.parent_id,
    replyCount,
    raw: c,
  };
}
