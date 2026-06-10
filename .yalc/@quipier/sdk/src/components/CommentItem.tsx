import type { VNode } from "preact";
import { useContext, useState } from "preact/hooks";
import type { Comment, ReportReason } from "../types.js";
import type { CommentActions, CommentCtx } from "../customize.js";
import { toCommentView } from "../customize.js";
import { FeaturesContext, SlotsContext } from "../context.js";
import { formatTime } from "../util.js";
import { Avatar } from "./Avatar.js";
import { CommentForm } from "./CommentForm.js";
import { CommentMenu } from "./CommentMenu.js";
import { SlotHost, renderToDetached } from "./SlotHost.js";

export interface CommentNode {
  comment: Comment;
  children: CommentNode[];
}

interface Props {
  node: CommentNode;
  ownAuthorId: string | null;
  onToggleLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => Promise<void>;
  onReply: (parentId: string, content: string) => Promise<void>;
  onReport: (id: string, reason: ReportReason) => void;
  canReply: boolean;
  dateFormat?: "relative" | "absolute";
  /** Reply nesting: >=2 shows/allows replies, 1 = flat. */
  maxDepth?: number;
  depth?: number;
  /** Id of the root-of-thread ancestor. All replies attach here so threads stay 2 levels deep. */
  rootId?: string;
}

const REPLY_BATCH = 10;

export function CommentItem({
  node,
  ownAuthorId,
  onToggleLike,
  onDelete,
  onEdit,
  onReply,
  onReport,
  canReply,
  dateFormat = "relative",
  maxDepth = 2,
  depth = 0,
  rootId,
}: Props) {
  const { slots, helpers, theme } = useContext(SlotsContext);
  const features = useContext(FeaturesContext);
  const { comment, children } = node;
  const repliesEnabled = maxDepth >= 2;
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealHidden, setRevealHidden] = useState(false);
  const [shownCount, setShownCount] = useState(REPLY_BATCH);
  const isOwn = !!ownAuthorId && comment.author_id === ownAuthorId;
  const display = comment.nickname || comment.author_id.slice(0, 8);
  const liked = comment.liked_by_me;
  const likesCount = comment.likes_count;
  const avatarSize = depth === 0 ? 32 : 24;
  const effectiveRootId = rootId ?? comment.id;

  const deletedNotice =
    comment.deleted_by_type === "operator"
      ? "운영자가 삭제한 댓글입니다"
      : comment.deleted_by_type === "passport"
        ? "사용자가 삭제한 댓글입니다"
        : "삭제된 댓글입니다";
  const isHidden = !!comment.is_hidden;

  async function submitReply(content: string) {
    // Threads are 2-level: every reply attaches to the root, so replying from a
    // reply still adds a sibling instead of nesting deeper.
    await onReply(effectiveRootId, content);
    setReplying(false);
    setExpanded(true);
    setShownCount(Math.max(REPLY_BATCH, children.length + 1));
  }

  async function submitEdit(content: string) {
    await onEdit(comment.id, content);
    setEditing(false);
  }

  // ── customization plumbing ──
  const view = toCommentView(comment, ownAuthorId, children.length);
  const actions: CommentActions = {
    like: () => {
      if (!comment.liked_by_me) onToggleLike(comment.id);
    },
    unlike: () => {
      if (comment.liked_by_me) onToggleLike(comment.id);
    },
    reply: (content: string) => onReply(effectiveRootId, content),
    edit: (content: string) => onEdit(comment.id, content),
    remove: () => onDelete(comment.id),
    report: (reason: ReportReason) => onReport(comment.id, reason),
  };
  const ctx: CommentCtx = {
    defaultNode: () => renderToDetached(buildItem()),
    theme,
    helpers,
    actions,
    isOwn,
  };

  const showMenu =
    features.menu && !comment.is_deleted && !isHidden && (isOwn || features.report);

  /** The default single-comment row (avatar + body). Partial slots wrap pieces
   *  inside it; the `comment` slot can replace the whole thing. */
  function buildItem(): VNode {
    return (
      <div class="quipier-item" data-quipier-part="item">
        {features.avatars ? (
          <SlotHost name="avatar" result={slots.avatar?.(view, ctx)}>
            <Avatar seed={comment.author_id} label={comment.nickname} size={avatarSize} />
          </SlotHost>
        ) : null}
        <div class="quipier-item-body" data-quipier-part="body">
          <div class="quipier-item-head" data-quipier-part="head">
            <SlotHost name="authorLabel" result={slots.authorLabel?.(view, ctx)}>
              <span class="quipier-item-author" data-quipier-part="author">
                {display}
              </span>
            </SlotHost>
            {comment.author_blocked ? (
              <span class="quipier-author-badge quipier-author-blocked">차단</span>
            ) : null}
            <span class="quipier-item-dot">·</span>
            <span>{formatTime(comment.created_at, dateFormat)}</span>
            {showMenu ? (
              <CommentMenu
                isOwn={isOwn}
                canReport={features.report}
                onEdit={() => setEditing(true)}
                onDelete={() => onDelete(comment.id)}
                onReport={(reason) => onReport(comment.id, reason)}
              />
            ) : null}
          </div>
          {editing && !comment.is_deleted && !isHidden ? (
            <div class="quipier-edit-form">
              <CommentForm
                placeholder="댓글을 수정하세요"
                submitLabel="저장"
                initialValue={comment.content}
                onCancel={() => setEditing(false)}
                onSubmit={submitEdit}
              />
            </div>
          ) : comment.is_deleted ? (
            <div class="quipier-item-content is-deleted" data-quipier-part="content">
              {deletedNotice}
            </div>
          ) : isHidden ? (
            revealHidden ? (
              <>
                <div class="quipier-hidden-banner">
                  <span>운영자에 의해 숨겨진 댓글입니다.</span>
                  <button
                    type="button"
                    class="quipier-hidden-toggle"
                    onClick={() => setRevealHidden(false)}
                  >
                    다시 숨기기
                  </button>
                </div>
                <div class="quipier-item-content" data-quipier-part="content">
                  {comment.content}
                </div>
              </>
            ) : (
              <div class="quipier-item-content is-hidden" data-quipier-part="content">
                <em>이 댓글은 운영자에 의해 숨겨졌습니다.</em>
                <button
                  type="button"
                  class="quipier-hidden-toggle"
                  onClick={() => setRevealHidden(true)}
                >
                  확인하기
                </button>
              </div>
            )
          ) : (
            <SlotHost name="content" result={slots.content?.(view, ctx)}>
              <div class="quipier-item-content" data-quipier-part="content">
                {comment.content}
              </div>
            </SlotHost>
          )}
          {!comment.is_deleted && !isHidden && !editing ? (
            <SlotHost name="actions" result={slots.actions?.(view, ctx)}>
              <div class="quipier-actions" data-quipier-part="actions">
                {features.likes ? (
                  <button
                    class={`quipier-action${liked ? " is-active" : ""}`}
                    data-quipier-part="like"
                    onClick={() => onToggleLike(comment.id)}
                    aria-pressed={liked}
                    aria-label={liked ? "Unlike" : "Like"}
                  >
                    <HeartIcon filled={liked} />
                    <span>{likesCount}</span>
                  </button>
                ) : null}
                {canReply && repliesEnabled ? (
                  <button
                    class="quipier-action"
                    data-quipier-part="reply"
                    onClick={() => setReplying((v) => !v)}
                  >
                    <ReplyIcon />
                    <span>답글</span>
                  </button>
                ) : null}
              </div>
            </SlotHost>
          ) : null}
          {replying ? (
            <div class="quipier-reply-form">
              <CommentForm
                placeholder={`@${display}에게 답글…`}
                submitLabel="답글"
                initialValue={depth >= 1 ? `@${display} ` : ""}
                onCancel={() => setReplying(false)}
                onSubmit={submitReply}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const visibleChildren = expanded ? children.slice(0, shownCount) : [];
  const remaining = children.length - shownCount;
  const hasMore = expanded && remaining > 0;

  return (
    <div class="quipier-thread" data-quipier-part="thread">
      <SlotHost name="comment" result={slots.comment?.(view, ctx)}>
        {buildItem()}
      </SlotHost>
      {repliesEnabled && children.length > 0 ? (
        <div class="quipier-thread-children" data-quipier-part="replies">
          {!expanded ? (
            <button
              class="quipier-thread-toggle"
              type="button"
              onClick={() => setExpanded(true)}
            >
              <ChevronIcon dir="down" />
              <span>답글 {children.length}개</span>
            </button>
          ) : (
            <>
              {visibleChildren.map((child) => (
                <CommentItem
                  key={child.comment.id}
                  node={child}
                  ownAuthorId={ownAuthorId}
                  onToggleLike={onToggleLike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReply={onReply}
                  onReport={onReport}
                  canReply={canReply}
                  dateFormat={dateFormat}
                  maxDepth={maxDepth}
                  depth={depth + 1}
                  rootId={effectiveRootId}
                />
              ))}
              {hasMore ? (
                <button
                  class="quipier-thread-more"
                  type="button"
                  onClick={() => setShownCount((c) => c + REPLY_BATCH)}
                >
                  답글 {Math.min(REPLY_BATCH, remaining)}개 더 보기
                </button>
              ) : null}
              <button
                class="quipier-thread-toggle"
                type="button"
                onClick={() => setExpanded(false)}
              >
                <ChevronIcon dir="up" />
                <span>답글 숨기기</span>
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "up" | "down" }) {
  const d = dir === "down" ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6";
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} />
    </svg>
  );
}
